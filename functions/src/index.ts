import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
global.crypto = require('crypto');

admin.initializeApp();

const MAX_DEVICES = 5;
const MAX_FUNCTION_INSTANCES = 10;

type device = {
    createdAt: number;
    name: string;
    // Timestamp: moisture as proportion from 0 to 1.
    moistureData: { [key: number]: number };
    // Timestamp of last watered
    waterTimes: number[];
    // Proportion from 0 to 1.
    optimalMoisture: number;
};

type user = {
    notificationId?: string;
    devices?: { [key: string]: device };
};

type deviceData = {
    name: string;
    optimalMoisture: number;
};

type statusData = {
    arduinoID: string;
    moisture: number;
    hasWatered: boolean;
};

/**
 * Adds a device to the user's devices and returns a device ID.
 */
export const addDevice = functions.runWith({ maxInstances: MAX_FUNCTION_INSTANCES }).https.onCall(async (data, context) => {
    if (typeof data !== 'object' || data === null) {
        throw new functions.https.HttpsError('invalid-argument', 'Data must be provided');
    }
    if (typeof data.name !== 'string' || data.name.length === 0 || data.name.length > 20) {
        throw new functions.https.HttpsError('invalid-argument', 'Device name must be a string between 1 and 20 characters');
    }
    if (typeof data.optimalMoisture !== 'number' || data.optimalMoisture < 0 || data.optimalMoisture > 1) {
        throw new functions.https.HttpsError('invalid-argument', 'Optimal moisture must be a number between 0 and 1');
    }
    data = data as deviceData;
    const { auth } = context;
    if (!auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    // Get the user's profile from the users collection.
    const { uid } = auth;
    // Get firestore
    const db = admin.firestore();
    // Get the user's profile from the users collection.
    let user = (await db.collection('users').doc(uid).get()).data() as user | undefined;
    if (!user) {
        user = {
            devices: {},
        };
    }
    if (!user.devices) {
        user.devices = {};
    }
    if (Object.keys(user.devices).length >= MAX_DEVICES) {
        throw new functions.https.HttpsError('permission-denied', 'User has too many devices');
    }
    // May need to rework this to lock less data.
    const deviceId = await db.runTransaction(async (t) => {
        const devices = db.collection('devices');
        let deviceId = '';
        let iterations = 0;
        let doc: FirebaseFirestore.DocumentSnapshot;
        do {
            deviceId = crypto.randomUUID();
            iterations++;
            doc = await t.get(devices.doc(deviceId));
        } while (doc.exists && iterations < 100);
        if (iterations >= 100) {
            throw new functions.https.HttpsError('internal', 'Could not generate a unique device ID');
        }
        t.set(devices.doc(deviceId), { uid });
        return deviceId;
    });
    user.devices[deviceId] = {
        createdAt: Date.now(),
        name: data.name,
        moistureData: {},
        waterTimes: [],
        optimalMoisture: data.optimalMoisture,
    };
    await db
        .collection('users')
        .doc(uid)
        .update({
            [`devices.${deviceId}`]: user.devices[deviceId],
        });
    return { deviceId };
});

export const deleteDevice = functions.runWith({ maxInstances: MAX_FUNCTION_INSTANCES }).https.onCall(async (data, context) => {
    if (typeof data !== 'object' || data === null) {
        throw new functions.https.HttpsError('invalid-argument', 'Data must be provided');
    }
    if (typeof data.deviceId !== 'string' || data.deviceId.length !== 36) {
        throw new functions.https.HttpsError('invalid-argument', 'Device ID must be a string of length 36');
    }
    const { auth } = context;
    if (!auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    // Get the user's profile from the users collection.
    const { uid } = auth;
    // Get firestore
    const db = admin.firestore();
    // Get the user's profile from the users collection.
    const userRef = db.collection('users').doc(uid);
    const user = (await userRef.get()).data() as user | undefined;
    if (!user) {
        throw new functions.https.HttpsError('not-found', 'User not found');
    }
    if (!user.devices) {
        throw new functions.https.HttpsError('not-found', 'User has no devices');
    }
    if (!user.devices[data.deviceId]) {
        throw new functions.https.HttpsError('not-found', 'Device not found');
    }
    userRef.update({
        [`devices.${data.deviceId}`]: admin.firestore.FieldValue.delete(),
    });
    db.collection('devices').doc(data.deviceId).delete();
});

export const status = functions.runWith({ maxInstances: MAX_FUNCTION_INSTANCES }).https.onRequest(async (request, response) => {
    const data = request.body as statusData;
    if (!data) {
        functions.logger.log('Body must be valid JSON object!');
        response.status(400).send('Body must be valid JSON object!');
        return;
    }
    if (typeof data.arduinoID != 'string' || data.arduinoID.length != 36) {
        const error = 'A JSON property of type string and titled arduinoID must be present with length 36!';
        functions.logger.log(error);
        response.status(400).send(error);
        return;
    }
    if (typeof data.moisture != 'number' || data.moisture < 0 || data.moisture > 1) {
        const error = 'A JSON property of type number and titled moisture must be present and must be between 0 and 1!';
        functions.logger.log(error);
        response.status(400).send(error);
        return;
    }
    if (typeof data.hasWatered != 'boolean') {
        const error = 'A JSON property of type boolean and titled hasWatered must be present!';
        functions.logger.log(error);
        response.status(400).send(error);
        return;
    }
    const db = admin.firestore();
    const devices = db.collection('devices');
    const device = (await devices.doc(data.arduinoID).get()).data() as { uid: string } | undefined;
    if (!device) {
        const error = 'Device not found!';
        functions.logger.log(error);
        response.status(404).send(error);
        return;
    }
    const users = db.collection('users');
    await users.doc(device.uid).update({
        [`devices.${data.arduinoID}.moistureData.${Date.now()}`]: data.moisture,
    });
    if (data.hasWatered) {
        await users.doc(device.uid).update({
            [`devices.${data.arduinoID}.waterTimes`]: admin.firestore.FieldValue.arrayUnion(Date.now()),
        });
    }
    const optimalMoisture = ((await users.doc(device.uid).get()).data() as user)?.devices?.[data.arduinoID]?.optimalMoisture;
    response.status(200).send(optimalMoisture);
});
