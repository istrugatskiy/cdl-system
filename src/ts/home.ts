import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { logout } from '.';
import { button } from './common-styles';

@customElement('home-page')
export class HomePage extends LitElement {
    static styles = css`
        ${button}
        h1 {
            color: var(--dark-blue);
            font-size: 64px;
            font-family: var(--large-font);
            text-align: center;
            background-color: var(--light-green);
        }
        .top-bar {
            display: flex;
            align-items: center;
            background-color: var(--light-green);
            width: 100vw;
            justify-content: center;
        }
        .logout {
            margin-left: 20px;
            margin-right: 20px;
        }
    `;

    @property({ type: String, reflect: true, attribute: 'data-name' })
    name = 'Generic';

    render() {
        return html`
            <span class="top-bar">
                <h1>Welcome, ${this.name}</h1>
                <button class="button logout" @click="${logout}">
                    <span class="material-symbols-outlined">logout</span>
                </button>
            </span>
        `;
    }
}
