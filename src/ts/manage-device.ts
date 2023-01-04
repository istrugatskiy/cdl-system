import { getFunctions, httpsCallable } from 'firebase/functions';
import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { delay, handleError } from './';
import { button, h1, p, transitionablePopupChild } from './common-styles';
import { addDevice, addDevicePopup, iconList, manageDevicePopup } from './constant-refs';
import { Popup } from './popup';

// Fixes customElementRegistry being written to twice.
if (module.hot) {
    module.hot.dispose(() => {
        window.location.reload();
    });
}

@customElement('manage-device')
export class ManageDevice extends LitElement {
    static styles = css`
        ${button}
        ${h1}
        ${p}
        ${transitionablePopupChild}
    `;

    @state()
    areButtonsDisabled = true;

    @state()
    currentView = 1;

    @state()
    isInTransition = false;

    @property({ type: String, reflect: true, attribute: 'data-arduino-uuid' })
    arduinoUUID = '';

    @property({ type: Object })
    device?: device;

    @property({ type: Number, reflect: true, attribute: 'data-device-order' })
    deviceOrder = 0;

    private parentRef = this.parentElement as Popup;

    private async setView(view: number, beforeContinue?: () => Promise<void>) {
        this.areButtonsDisabled = true;
        (this.parentElement as Popup).disableXButton();
        if (beforeContinue) await beforeContinue();
        this.isInTransition = true;
        await delay(410);
        this.currentView = view;
        await delay(410);
        this.isInTransition = false;
        this.areButtonsDisabled = false;
        (this.parentElement as Popup).enableXButton();
    }

    private menuClose = async () => {
        this.areButtonsDisabled = true;
        if (!window.navigator.bluetooth) return;
        await delay(410);
        this.currentView = 1;
    };

    private menuOpen = () => {
        this.areButtonsDisabled = false;
        this.parentRef.photo = `icon://${iconList[this.deviceOrder]}`;
    };

    private deleteDevice = async () => {
        if (!this.device) return;
        await this.setView(0);
    };

    connectedCallback() {
        super.connectedCallback();
        manageDevicePopup.addEventListener('menu-close', this.menuClose);
        manageDevicePopup.addEventListener('menu-open', this.menuOpen);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        manageDevicePopup.removeEventListener('menu-close', this.menuClose);
        manageDevicePopup.removeEventListener('menu-open', this.menuOpen);
    }

    checkInput = () => {
        this.requestUpdate();
    };

    private hasData = () => {
        if (!this.device) return false;
        return Object.keys(this.device.moistureData).length > 0 && this.device.waterTimes.length > 0;
    };

    private finalizeDelete = async () => {
        try {
            if (!this.device) return;
            const shouldDelete = confirm('Are you sure you want to remove this device? This action cannot be undone.');
            if (!shouldDelete) return;
            const functions = getFunctions();
            const deleteDevice = httpsCallable(functions, 'deleteDevice');
            await deleteDevice({ deviceId: this.arduinoUUID });
            this.parentRef.close();
        } catch (e) {
            const error = e as Error;
            handleError(error);
        }
    };

    private retrySetup = async () => {
        if (!this.device) return;
        this.parentRef.close();
        await delay(410);
        addDevice.override = this.arduinoUUID;
        addDevicePopup.open();
    };

    render() {
        return html`
            <div class="${this.isInTransition ? 'transition-animation' : ''}">
                <h1 ?hidden=${this.currentView !== 1}>"${this.device?.name}"</h1>
                <h1 ?hidden=${this.currentView !== 0}>Delete "${this.device?.name}"?</h1>
                <div class="flex" ?hidden=${this.currentView !== 1}>
                    <p ?hidden=${this.hasData()}>
                        No data has been received from this device yet. Please make sure the device is connected to the internet and that the device is turned on. It is possible that the device did not fully complete the setup process. If this is the
                        case, please press the button below to restart the setup process. If you do not intend on using this device, you can press the button below to remove it from the list.
                    </p>
                    <button class="button" ?disabled=${this.areButtonsDisabled} ?hidden=${this.hasData()} @click=${this.retrySetup}>Retry Setup</button>
                    <button class="button" ?disabled=${this.areButtonsDisabled} @click=${this.deleteDevice}>Remove Device</button>
                </div>
                <div class="flex" ?hidden=${this.currentView !== 0}>
                    <p>Are you sure you want to remove this device? This action cannot be undone. If you want to add this device back to the list, you will have to go through the setup process again.</p>
                    <button class="button" ?disabled=${this.areButtonsDisabled} @click=${this.finalizeDelete}>Remove</button>
                    <button class="button" ?disabled=${this.areButtonsDisabled} @click=${this.setView.bind(this, 1)}>Cancel</button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'manage-device': ManageDevice;
    }
}
