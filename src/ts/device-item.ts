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
            min-width: 200px;
            margin-top: 20px;
            margin-bottom: 20px;
            margin-left: 20px;
            margin-right: 20px;
        }
        .icon {
            font-size: 150px;
            line-height: 150px;
        }
        .pop-in {
            animation: pop-in 0.3s ease-in-out;
        }
        @keyframes pop-in {
            0% {
                transform: scale(0);
            }
            75% {
                transform: scale(1.3);
            }
            100% {
                transform: scale(1);
            }
        }
        [hidden] {
            display: none;
        }
    `;

    @state()
    areButtonsDisabled = false;

    @property({ type: Boolean, reflect: true, attribute: 'data-display-item' })
    displayItem = false;

    @property({ type: String, reflect: true, attribute: 'data-device-name' })
    deviceName = '';

    @property({ type: Number, reflect: true, attribute: 'data-device-order' })
    deviceOrder = 0;

    @property({ type: String, reflect: true, attribute: 'data-arduinoID' })
    arduinoID = '';

    private menuClose = () => {
        this.areButtonsDisabled = false;
    };

    private menuOpen = () => {
        this.areButtonsDisabled = true;
    };

    private iconList = ['potted_plant', 'sprinkler', 'grass', 'psychiatry', 'eco'];

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
        return html`<button class="button add-button pop-in" ?disabled=${this.areButtonsDisabled} ?hidden=${this.displayItem} @click=${this.addDevice}>
                <div class="material-symbols-outlined icon">add</div>
                Add Device
            </button>
            <button ?hidden=${!this.displayItem} class="button add-button pop-in" ?disabled=${this.areButtonsDisabled}>
                <div class="material-symbols-outlined icon">${this.iconList[this.deviceOrder]}</div>
                ${this.deviceName}
            </button>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'device-item': DeviceItem;
    }
}
