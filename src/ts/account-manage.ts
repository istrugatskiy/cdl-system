import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { delay, logout } from '.';
import { button, h1 } from './common-styles';

@customElement('account-manager')
export class HomePage extends LitElement {
    static styles = css`
        ${button}
        ${h1}
        h1 {
            margin-top: 0;
        }
        @keyframes fade-in {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        @keyframes fade-out {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
        .account-info {
            background-color: white;
            margin: 10px;
            padding: 10px;
            max-width: 800px;
            min-width: 300px;
            border-width: 6px;
            border-style: solid;
            border-radius: 20px;
            /*make top right border different color*/
            border-image: linear-gradient(to bottom right, var(--dark-blue), var(--light-green)) 1;
            animation: 0.3s cubic-bezier(0.42, 0, 0, 1.92) 0s 1 normal none running pop-in;
            background-color: var(--light-green);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .disappear {
            animation: 0.3s cubic-bezier(0.42, 0, 0, 1.92) 0s 1 normal none running fade-out;
        }
        .overlay {
            position: fixed;
            height: 100vh;
            width: 100vw;
            background-color: rgba(0, 0, 0, 0.5);
            animation: fade-in 0.5s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
            align-content: center;
        }
        p {
            color: var(--dark-blue);
            font-family: var(--non-large-font);
            text-align: justify;
            font-size: 24px;
        }
    `;

    @property({ type: String, reflect: true, attribute: 'data-name' })
    name = 'Ilya Strugatskiy';

    @property({ type: String, reflect: true, attribute: 'data-uid' })
    uid = '1234567890';

    @property({ type: String, reflect: true, attribute: 'data-photo' })
    photo = 'https://lh3.googleusercontent.com/a/ALm5wu2g724reHgr2YNcWuGcN-W0gTn3VEW6kcxSLTiFvQ=s96-c';

    @state()
    private areButtonsDisabled = true;

    private isInStateTransition = false;

    connectedCallback() {
        super.connectedCallback();
        this.open();
    }

    async open() {
        if (this.isInStateTransition) return;
        this.isInStateTransition = true;
        this.areButtonsDisabled = true;
        this.style.display = 'flex';
        await delay(500);
        this.isInStateTransition = false;
        this.areButtonsDisabled = false;
    }

    async close() {
        console.log('test');
        if (this.isInStateTransition) return;
        this.areButtonsDisabled = true;
        this.isInStateTransition = true;
        await delay(300);
        this.isInStateTransition = false;
        this.style.display = 'none';
    }

    render() {
        return html`<div class="overlay">
            <div class="account-info">
                <img src="${this.photo}" alt="User Photo" height="150" width="150" />
                <button class="button" @click=${this.close} disabled="${this.areButtonsDisabled}"><span class="material-symbols-outlined">close</span></button>
                <h1>${this.name}</h1>
                <p>UID: ${this.uid}</p>
                <button class="button" disabled="${this.areButtonsDisabled}"><span class="material-symbols-outlined">file_download</span>Export Data</button>
                <button class="button" @click="${logout}" disabled="${this.areButtonsDisabled}"><span class="material-symbols-outlined">logout</span>Sign Out</button>
            </div>
        </div>`;
    }
}
