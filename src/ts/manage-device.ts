import { html, css, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { delay, handleError } from './';
import { button, h1, p } from './common-styles';
import { addDevicePopup, passwordRegex, SSIDRegex } from './constant-refs';
import { Popup } from './popup';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Fixes customElementRegistry being written to twice.
if (module.hot) {
    module.hot.dispose(() => {
        window.location.reload();
    });
}

type deviceConfig = {
    name: string;
    optimalMoisture: number;
};

type addDeviceResponse = {
    deviceId: string;
};

@customElement('add-device')
export class AddDevice extends LitElement {
    static styles = css`
        ${button}
        ${h1}
        ${p}
        .flex {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        @keyframes slide-out {
            0% {
                transform: scale(1);
            }
            25% {
                transform: translateX(0) scale(0.8);
                opacity: 1;
            }
            50% {
                transform: translateX(-50%) scale(0.7);
                opacity: 0;
            }
            70% {
                opacity: 0;
                transform: translateX(50%);
            }
            100% {
                transform: scale(1) translateX(0);
                opacity: 1;
            }
        }
        .transition-animation {
            animation: slide-out 0.82s;
            animation-timing-function: cubic-bezier(0.29, 0.09, 0.07, 1.2);
        }
        input {
            cursor: text !important;
            margin: 10px;
        }
        input::placeholder {
            color: var(--light-green);
            font-family: var(--non-large-font);
        }
        input:disabled {
            background-color: white !important;
        }
        h1 {
            margin-top: 10px;
            margin-bottom: 10px;
        }
        p {
            margin-top: 10px;
            margin-bottom: 10px;
        }
        *[hidden] {
            display: none !important;
        }
    `;

    @state()
    areButtonsDisabled = true;

    @state()
    currentStep = 1;

    @state()
    isInTransition = false;

    private arduinoUUID = '';

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
    };

    private menuOpen = () => {
        this.areButtonsDisabled = false;
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
                    <input type="number" class="button" placeholder="50%" ?disabled=${this.areButtonsDisabled} id="moisture-level" min="0" max="100" @input=${this.checkInput} autocomplete="off" />
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
