import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { assert, logout } from '.';
import { button, h1 } from './common-styles';
import { Popup } from './popup';

@customElement('account-manager')
export class AccountManager extends LitElement {
    static styles = css`
        ${button}
        ${h1}
        h1 {
            margin-top: 0;
            margin-bottom: 0;
        }
        p {
            color: var(--dark-blue);
            font-family: var(--non-large-font);
            text-align: justify;
            font-size: 16px;
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
        assert(this.parentElement instanceof Popup, 'Parent element of account manager is not a popup.');
        (this.parentElement as Popup).addEventListener('menu-close', this.menuClose);
        (this.parentElement as Popup).addEventListener('menu-open', this.menuOpen);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        (this.parentElement as Popup).removeEventListener('menu-close', this.menuClose);
        (this.parentElement as Popup).removeEventListener('menu-open', this.menuOpen);
    }

    logout() {
        logout();
        assert(this.parentElement instanceof Popup, 'Parent element of account manager is not a popup.');
        (this.parentElement as Popup).close();
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
