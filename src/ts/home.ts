import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { button, h1 } from './common-styles';
import { accountManager, accountManagerPopup } from './constant-refs';
import './device-item';

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

@customElement('home-page')
export class HomePage extends LitElement {
    static styles = css`
        ${button}
        ${h1}
        .profile {
            margin-left: 20px;
            margin-right: 20px;
            border-radius: 50%;
            height: 50px;
            width: 50px;
        }
        @keyframes slide-from-top {
            from {
                transform: translateY(-100%);
            }
            to {
                transform: translateY(0);
            }
        }
        .top-bar {
            display: grid;
            background-color: var(--light-green);
            width: 100vw;
            justify-content: center;
            grid-template-columns: 1fr auto;
            align-items: center;
            animation: slide-from-top 0.5s ease-in-out;
        }
        .bottom-container {
            margin-top: 20px;
            display: flex;
            width: 100vw;
            justify-content: center;
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('menu-close', this.enableButtons);
        window.addEventListener('menu-open', this.disableButtons);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('menu-close', this.enableButtons);
        window.removeEventListener('menu-open', this.disableButtons);
    }

    @property({ type: String, reflect: true, attribute: 'data-name' })
    name = 'Generic';

    @property({ type: String, reflect: true, attribute: 'data-photo' })
    photo = '';

    @property({ type: String, reflect: true, attribute: 'data-uid' })
    uid = '';

    @property({ type: Object, reflect: false })
    deviceList: { [key: string]: device } = {};

    @state()
    private areButtonsDisabled = false;

    private enableButtons = () => {
        this.areButtonsDisabled = false;
    };

    private disableButtons = () => {
        this.areButtonsDisabled = true;
    };

    accountManager() {
        this.areButtonsDisabled = true;
        accountManagerPopup.open();
        accountManagerPopup.dataset.photo = this.photo;
        accountManager.dataset.name = this.name;
        accountManager.dataset.uid = this.uid;
    }

    render() {
        return html`
            <div class="top-bar">
                <h1>Welcome, ${this.name}</h1>
                <button class="button profile" @click="${this.accountManager}" ?disabled=${this.areButtonsDisabled}>
                    <img src="${this.photo}" alt="Profile Picture" width="30" height="30" referrerpolicy="no-referrer" />
                </button>
            </div>
            <div class="bottom-container">
                ${Object.entries(this.deviceList ?? {}).map(([key, value], index) => html`<device-item data-device-order="${index}" data-device-name="${value.name}" data-arduino-id="${key}" ?data-display-item=${true}></device-item>`)}
                <device-item></device-item>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'home-page': HomePage;
    }
}
