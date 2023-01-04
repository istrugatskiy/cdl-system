type deviceConfig = {
    name: string;
    optimalMoisture: number;
};

type addDeviceResponse = {
    deviceId: string;
};

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
