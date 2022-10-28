import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AccountManager } from './account-manage';
import { button, h1 } from './common-styles';

@customElement('home-page')
export class HomePage extends LitElement {
    static styles = css`
        ${button}
        ${h1}
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
        .profile {
            margin-left: 20px;
            margin-right: 20px;
            border-radius: 50%;
            height: 50px;
            width: 50px;
        }
    `;

    @property({ type: String, reflect: true, attribute: 'data-name' })
    name = 'Generic';

    @property({ type: String, reflect: true, attribute: 'data-photo' })
    photo = '';

    @property({ type: String, reflect: true, attribute: 'data-uid' })
    uid = '';

    @state()
    private areButtonsDisabled = false;

    accountManager() {
        const accountManager = document.querySelector('account-manager') as AccountManager;
        this.areButtonsDisabled = true;
        accountManager.open();
        accountManager.dataset.name = this.name;
        accountManager.dataset.photo = this.photo;
        accountManager.dataset.uid = this.uid;
    }

    render() {
        return html`
            <div class="top-bar">
                <h1>Welcome, ${this.name}</h1>
                <button class="button profile" @click="${this.accountManager}" ?disabled=${this.areButtonsDisabled}>
                    <img src="${this.photo}" alt="Profile Picture" width="30" height="30" />
                </button>
            </div>
        `;
    }
}
