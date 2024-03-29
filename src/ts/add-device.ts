import { html, css, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { delay, handleError } from './';
import { button, h1, p, transitionablePopupChild } from './common-styles';
import { addDevicePopup, passwordRegex, SSIDRegex } from './constant-refs';
import { Popup } from './popup';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Fixes customElementRegistry being written to twice.
if (module.hot) {
    module.hot.dispose(() => {
        window.location.reload();
    });
}

@customElement('add-device')
export class AddDevice extends LitElement {
    static styles = css`
        ${button}
        ${h1}
        ${p}
        ${transitionablePopupChild}
    `;

    @state()
    areButtonsDisabled = true;

    @state()
    currentStep = 1;

    @state()
    isInTransition = false;

    @query('#username')
    private SSIDInput?: HTMLInputElement;

    @query('#password')
    private passwordInput?: HTMLInputElement;

    @query('#device-name')
    private deviceNameInput?: HTMLInputElement;

    @query('#moisture-level')
    private moistureLevelInput?: HTMLInputElement;

    @property({ type: String, reflect: true, attribute: 'data-override' })
    override = '';

    private arduinoUUID = '';

    private previousInput: string = '';

    private validate = (event: InputEvent) => {
        const input = event.target as HTMLInputElement;
        const toNumber = parseInt(input.value);
        if (Number.isNaN(toNumber) && input.value !== '') {
            input.value = this.previousInput;
            return;
        }
        if (toNumber > 100) input.value = this.previousInput;
        if (toNumber < 0) input.value = this.previousInput;
        this.previousInput = input.value;
    };

    private async step1(event: KeyboardEvent | MouseEvent, step = 2, beforeContinue?: () => Promise<void>) {
        if (event instanceof KeyboardEvent && event.key !== 'Enter') return;
        this.areButtonsDisabled = true;
        (this.parentElement as Popup).disableXButton();
        if (beforeContinue) await beforeContinue();
        this.isInTransition = true;
        await delay(410);
        this.currentStep = step;
        await delay(410);
        this.isInTransition = false;
        this.areButtonsDisabled = false;
        (this.parentElement as Popup).enableXButton();
    }

    private async step2(event: KeyboardEvent | MouseEvent) {
        if ((event instanceof KeyboardEvent && event.key !== 'Enter') || !SSIDRegex.test(this.SSIDInput!.value) || !passwordRegex.test(this.passwordInput!.value)) return;
        try {
            await this.step1(event, 3, async () => {
                if (this.arduinoUUID.length > 0) return;
                const deviceConfig: deviceConfig = {
                    name: this.deviceNameInput!.value,
                    optimalMoisture: parseInt(this.moistureLevelInput!.value),
                };
                deviceConfig.name ??= 'Unnamed Device';
                deviceConfig.optimalMoisture ??= 50;
                if (Number.isNaN(deviceConfig.optimalMoisture)) deviceConfig.optimalMoisture = 50;
                deviceConfig.optimalMoisture /= 100;
                const functions = getFunctions();
                const addDevice = httpsCallable(functions, 'addDevice');
                const result = await addDevice(deviceConfig);
                const data = result.data as addDeviceResponse;
                this.arduinoUUID = data.deviceId;
            });
        } catch (e) {
            const error = e as Error;
            console.error(error);
            handleError(error);
        }
    }

    private async step3(event: KeyboardEvent | MouseEvent) {
        if (event instanceof KeyboardEvent && event.key !== 'Enter') return;
        this.areButtonsDisabled = true;
        const availability = await window.navigator.bluetooth.getAvailability();
        if (!availability) {
            this.currentStep = 0;
            (this.parentElement as Popup).enableXButton();
            (this.parentElement as Popup).photo = 'icon://bluetooth_disabled';
        }
        const encoder = new TextEncoder();
        const device = await window.navigator.bluetooth.requestDevice({
            filters: [{ services: ['bb6e107f-a364-45cc-90ad-b02df8261caf'] }],
        });
        const server = await device.gatt?.connect();
        const service = await server?.getPrimaryService('bb6e107f-a364-45cc-90ad-b02df8261caf');
        const ssid = await service?.getCharacteristic('bb6e107f-a364-45cc-90ad-b02df8261caf');
        const password = await service?.getCharacteristic('c347d530-854b-42a9-a5be-7bcd8c5bd432');
        const uuid = await service?.getCharacteristic('9ee24231-0201-4fa1-96b1-d05690f65a84');
        await ssid?.writeValue(encoder.encode(this.SSIDInput!.value));
        await password?.writeValue(encoder.encode(this.passwordInput!.value));
        await uuid?.writeValue(encoder.encode(this.arduinoUUID));
        server?.disconnect();
        this.step1(event, 4, async () => {
            await delay(410);
            (this.parentElement as Popup).photo = 'icon://done';
        });
    }

    private menuClose = async () => {
        this.areButtonsDisabled = true;
        if (!window.navigator.bluetooth) return;
        await delay(410);
        this.currentStep = 1;
        this.SSIDInput!.value = '';
        this.passwordInput!.value = '';
        this.deviceNameInput!.value = '';
        this.moistureLevelInput!.value = '';
        (this.parentElement as Popup).photo = 'icon://wifi_password';
        this.arduinoUUID = '';
    };

    private menuOpen = () => {
        this.areButtonsDisabled = false;
        if (this.override.length === 0) return;
        const override = this.override;
        this.override = '';
        this.arduinoUUID = override;
        this.currentStep = 2;
    };

    connectedCallback() {
        super.connectedCallback();
        addDevicePopup.addEventListener('menu-close', this.menuClose);
        addDevicePopup.addEventListener('menu-open', this.menuOpen);
        if (!window.navigator.bluetooth) {
            this.currentStep = 0;
            (this.parentElement as Popup).photo = 'icon://bluetooth_disabled';
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        addDevicePopup.removeEventListener('menu-close', this.menuClose);
        addDevicePopup.removeEventListener('menu-open', this.menuOpen);
    }

    checkInput = () => {
        this.requestUpdate();
    };

    render() {
        return html`
            <div class="${this.isInTransition ? 'transition-animation' : ''}">
                <h1 ?hidden=${this.currentStep == 0 || this.currentStep == 4}>Connect (step ${this.currentStep} of 3):</h1>
                <h1 ?hidden=${this.currentStep != 4}>Success!</h1>
                <h1 ?hidden=${this.currentStep != 0}>No Bluetooth Support!</h1>
                <!-- Bluetooth not supported -->
                <div ?hidden=${this.currentStep != 0}>
                    <p>
                        Bluetooth is not supported (or enabled) on this device. Although you can monitor your devices you cannot add them using this browser. The bluetooth API is only supported on Chrome and Edge on Windows, Android, and Chrome OS.
                        Linux users need to manually enable the flag <code>chrome://flags/#enable-experimental-web-platform-features</code>. If you are using Chrome on a supported platform make sure that bluetooth is enabled in settings.
                    </p>
                </div>
                <!-- Step 1 -->
                <div class="flex" ?hidden=${this.currentStep !== 1} @keydown=${this.step1}>
                    <p>
                        First, lets name your device and select the optimal moisture level it should try to keep the plant at. The moisture level is a percentage value between 0 and 100. It is read using a moisture sensor placed in your plant's soil.
                    </p>
                    <h1>Device Name (required):</h1>
                    <input type="text" class="button" placeholder="Device Name" ?disabled=${this.areButtonsDisabled} id="device-name" maxlength="20" @input=${this.checkInput} autocomplete="off" />
                    <h1>Moisture Level (required):</h1>
                    <input type="number" class="button" placeholder="50%" ?disabled=${this.areButtonsDisabled} id="moisture-level" min="0" max="100" @input=${this.validate} autocomplete="off" />
                    <button class="button" ?disabled=${this.areButtonsDisabled || !this.deviceNameInput?.value} @click=${this.step1}>Continue</button>
                </div>
                <!-- Step 2 -->
                <div class="flex" ?hidden=${this.currentStep !== 2} @keydown=${this.step2}>
                    <p>
                        To proceed your system plant watering device needs <i>continuous</i> access to a Wi-Fi network. For this step we recommend using your home's Wi-Fi network. Please note: Your network credentials are not shared with our servers
                        and are securely transferred by bluetooth to your device.
                    </p>
                    <h1>Username (required):</h1>
                    <input type="text" class="button" placeholder="Your Wi-Fi's username" ?disabled=${this.areButtonsDisabled} id="username" maxlength="32" @input=${this.checkInput} autocomplete="username" />
                    <h1>Password (optional):</h1>
                    <p>Leave this blank if your network has no password.</p>
                    <input type="password" class="button" placeholder="Wi-fi password" ?disabled=${this.areButtonsDisabled} id="password" maxlength="64" @input=${this.checkInput} autocomplete="current-password" />
                    <button class="button" ?disabled=${this.areButtonsDisabled || !SSIDRegex.test(this.SSIDInput!.value) || !passwordRegex.test(this.passwordInput!.value)} @click=${this.step2}>Connect</button>
                </div>
                <!-- Step 3 -->
                <div class="flex" ?hidden=${this.currentStep !== 3} @keydown=${this.step3}>
                    <p>
                        To proceed you'll need to connect to your system device via bluetooth from your browser. From the popup that will appear select the device named in the format <i>"system-plant-waterer-[device-id]"</i>. Make sure that it is
                        your device!
                    </p>
                    <button class="button" @click=${this.step3}>Upload Wi-Fi Credentials</button>
                </div>
                <!-- Success -->
                <div class="flex" ?hidden=${this.currentStep !== 4}>
                    <p>Your device has been successfully added! You can now monitor it from your dashboard. Make sure that your device has a good internet connection for the best experience. You can now close this popup.</p>
                    <button class="button" @click=${(this.parentElement as Popup).close}>Close</button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'add-device': AddDevice;
    }
}
