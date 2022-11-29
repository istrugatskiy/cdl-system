import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { delay } from '.';
import { button, h1, p } from './common-styles';
import { addDevicePopup } from './constant-refs';
import { Popup } from './popup';

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

    private async step2(event: KeyboardEvent | MouseEvent) {
        if (event instanceof KeyboardEvent && event.key !== 'Enter') return;
        this.areButtonsDisabled = true;
        addDevicePopup.disableXButton();
        this.isInTransition = true;
        await delay(410);
        this.currentStep = 2;
        await delay(410);
        this.isInTransition = false;
        this.areButtonsDisabled = false;
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
        window.navigator.bluetooth
            .requestDevice({
                filters: [{ services: ['bb6e107f-a364-45cc-90ad-b02df8261caf'] }],
            })
            .then((device) => device.gatt?.connect())
            .then((server) => server?.getPrimaryService('bb6e107f-a364-45cc-90ad-b02df8261caf'));
    }

    private menuClose = () => {
        this.areButtonsDisabled = true;
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

    render() {
        return html`
            <div class="${this.isInTransition ? 'transition-animation' : ''}">
                <h1 ?hidden=${this.currentStep == 0}>Connect (step ${this.currentStep} of 3):</h1>
                <h1 ?hidden=${this.currentStep != 0}>No Bluetooth Support!</h1>
                <!-- Bluetooth not supported -->
                <div ?hidden=${this.currentStep != 0}>
                    <p>
                        Bluetooth is not supported (or enabled) on this device. Although you can monitor your devices you cannot add them using this browser. The bluetooth API is only supported on Chrome and Edge on Windows, Android, and Chrome OS.
                        Linux users need to manually enable the flag <code>chrome://flags/#enable-experimental-web-platform-features</code>. If you are using Chrome on a supported platform make sure that bluetooth is enabled in settings.
                    </p>
                </div>
                <!-- Step 1 -->
                <div class="flex" ?hidden=${this.currentStep !== 1} @keydown=${this.step2}>
                    <p>
                        To proceed your system plant watering device needs <i>continuous</i> access to a Wi-Fi network. For this step we recommend using your home's Wi-Fi network. Please note: Your network credentials are not shared with our servers
                        and are securely transferred by bluetooth to your device.
                    </p>
                    <h1>Username:</h1>
                    <input type="text" class="button" placeholder="Your Wi-Fi's username" ?disabled=${this.areButtonsDisabled} />
                    <h1>Password:</h1>
                    <p>Leave this blank if your network has no password.</p>
                    <input type="password" class="button" placeholder="Wi-fi password" ?disabled=${this.areButtonsDisabled} />
                    <button class="button" ?disabled=${this.areButtonsDisabled} @click=${this.step2}>Connect</button>
                </div>
                <!-- Step 2 -->
                <div class="flex" ?hidden=${this.currentStep !== 2} @keydown=${this.step3}>
                    <p>
                        To proceed you'll need to connect to your system device via bluetooth from your browser. From the popup that will appear select the device named in the format <i>"system-plant-waterer-[device-id]"</i>. Make sure that it is
                        your device!
                    </p>
                    <button class="button" @click=${this.step3}>Upload Wi-Fi Credentials</button>
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
