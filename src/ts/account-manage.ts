import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { logout } from '.';
import { button, h1, p } from './common-styles';
import { accountManagerPopup } from './constant-refs';

@customElement('account-manager')
export class AccountManager extends LitElement {
    static styles = css`
        ${button}
        ${h1}
        ${p}
        h1 {
            margin-top: 0;
            margin-bottom: 0;
        }
        .parent {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    `;

    @property({ type: String, reflect: true, attribute: 'data-name' })
    name = '';

    @property({ type: String, reflect: true, attribute: 'data-uid' })
    uid = '';

    @state()
    private areButtonsDisabled = true;

    private menuClose = () => {
        this.areButtonsDisabled = true;
    };

    private menuOpen = () => {
        this.areButtonsDisabled = false;
    };

    connectedCallback() {
        super.connectedCallback();
        accountManagerPopup.addEventListener('menu-close', this.menuClose);
        accountManagerPopup.addEventListener('menu-open', this.menuOpen);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        accountManagerPopup.removeEventListener('menu-close', this.menuClose);
        accountManagerPopup.removeEventListener('menu-open', this.menuOpen);
    }

    logout() {
        logout();
        accountManagerPopup.close();
    }

    render() {
        return html` <div class="parent">
            <h1>${this.name}</h1>
            <p>UID: ${this.uid}</p>
            <button class="button" ?disabled=${this.areButtonsDisabled}><span class="material-symbols-outlined">file_download</span>Export Data</button>
            <button class="button" @click="${this.logout}" ?disabled=${this.areButtonsDisabled}><span class="material-symbols-outlined">logout</span>Sign Out</button>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'account-manager': AccountManager;
    }
}
