import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { delay } from '.';
import { button, h1 } from './common-styles';

@customElement('popup-template')
export class Popup extends LitElement {
    static styles = css`
        ${button}
        ${h1}
        h1 {
            margin-top: 0;
            margin-bottom: 0;
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
        @keyframes pop-in {
            from {
                transform: scale(0.5);
            }
            to {
                transform: scale(1);
            }
        }
        .main-popup {
            background-color: white;
            margin: 10px;
            max-width: 800px;
            min-width: 300px;
            border-width: 6px;
            border-style: solid;
            border-image: linear-gradient(to bottom right, var(--dark-blue), var(--light-green)) 1;
            animation: 0.3s cubic-bezier(0.42, 0, 0, 1.92) 0s 1 normal none running pop-in;
            background-color: var(--light-green);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden visible;
            max-height: 90vh;
        }
        .overlay {
            position: fixed;
            height: 100vh;
            width: 100vw;
            background-color: rgba(0, 0, 0, 0.5);
            animation: fade-in 0.3s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
            align-content: center;
        }
        .disappear {
            animation: 0.5s cubic-bezier(0.42, 0, 0, 1.92) 0s 1 normal none running fade-out;
        }
        p {
            color: var(--dark-blue);
            font-family: var(--non-large-font);
            text-align: justify;
            font-size: 16px;
        }
        .grid-top {
            width: 100%;
            display: grid;
            justify-items: center;
            grid-template-columns: 50px 1fr 50px;
            align-items: center;
        }
        .x-button {
            align-self: flex-start;
        }
        .large-icon {
            font-size: 150px;
            color: var(--dark-blue);
        }
        .max-height {
            height: 100%;
            overflow-y: auto;
            padding: 10px;
        }
    `;

    @property({ type: String, reflect: true, attribute: 'data-photo' })
    photo = '';

    @property({ type: String, reflect: true, attribute: 'data-photo-name' })
    photoName = 'Image';

    @state()
    private areButtonsDisabled = true;

    @state()
    private closing = false;

    private isInStateTransition = false;

    private menuOpen = new CustomEvent('menu-open', { bubbles: true, composed: true });

    private menuClose = new CustomEvent('menu-close', { bubbles: true, composed: true });

    connectedCallback() {
        super.connectedCallback();
        this.style.display = 'none';
    }

    async open() {
        if (this.isInStateTransition) return;
        this.dispatchEvent(this.menuOpen);
        this.isInStateTransition = true;
        this.areButtonsDisabled = true;
        this.style.display = 'flex';
        await delay(500);
        this.isInStateTransition = false;
        this.areButtonsDisabled = false;
    }

    async close() {
        if (this.isInStateTransition) return;
        this.dispatchEvent(this.menuClose);
        this.areButtonsDisabled = true;
        this.isInStateTransition = true;
        this.closing = true;
        await delay(300);
        this.isInStateTransition = false;
        this.style.display = 'none';
        this.closing = false;
    }

    disableXButton = () => {
        this.areButtonsDisabled = true;
    };

    enableXButton = () => {
        this.areButtonsDisabled = false;
    };

    render() {
        return html`<div class="overlay ${this.closing ? 'disappear' : ''}">
            <div class="main-popup">
                <div class="max-height">
                    <div class="grid-top">
                        <!--Scuffed hack.-->
                        <div></div>
                        <!--Allow icon support.-->
                        <img src="${this.photo.startsWith('icon://') ? 'data:,' : this.photo}" ?hidden=${this.photo.startsWith('icon://')} class="photo" alt="${this.photoName}" height="150" width="150" referrerpolicy="no-referrer" />
                        <span aria-label="${this.photoName}" role="img" class="material-symbols-outlined large-icon" ?hidden=${!this.photo.startsWith('icon://')}>${this.photo.replace('icon://', '')}</span>
                        <button class="button x-button" @click=${this.close} ?disabled=${this.areButtonsDisabled}><span class="material-symbols-outlined">close</span></button>
                    </div>
                    <slot></slot>
                </div>
            </div>
        </div>`;
    }
}
