import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { button, h1 } from './common-styles';
import { addDevicePopup } from './constant-refs';
import './add-device';

// Fixes customElementRegistry being written to twice.
if (module.hot) {
    module.hot.dispose(() => {
        window.location.reload();
    });
}

@customElement('device-item')
export class DeviceItem extends LitElement {
    static styles = css`
        ${button}
        ${h1}
        .add-button {
            flex-direction: column;
        }
        .icon {
            font-size: 150px;
            line-height: 150px;
        }
    `;

    @state()
    areButtonsDisabled = false;

    @property({ type: String, reflect: true, attribute: 'data-display-item' })
    displayItem = false;

    @property({ type: String, reflect: true, attribute: 'data-arduinoID' })
    arduinoID = '';

    @property({ type: String, reflect: true, attribute: 'data-photo' })
    photo = '';

    private menuClose = () => {
        this.areButtonsDisabled = false;
    };

    private menuOpen = () => {
        this.areButtonsDisabled = true;
    };

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('menu-close', this.menuClose);
        window.addEventListener('menu-open', this.menuOpen);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('menu-close', this.menuClose);
        window.removeEventListener('menu-open', this.menuOpen);
    }

    addDevice() {
        addDevicePopup.open();
    }

    render() {
        return html`<button class="button add-button" ?disabled=${this.areButtonsDisabled} @click=${this.addDevice}>
            <div class="material-symbols-outlined icon">add</div>
            Add Device
        </button>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'device-item': DeviceItem;
    }
}
