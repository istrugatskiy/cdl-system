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
            font-size: 120px;
            font-family: var(--large-font);
            text-align: center;
            background-color: var(--light-green);
        }
        .center {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            background-color: var(--light-green);
        }
    `;

    @property({ type: String, reflect: true, attribute: 'data-name' })
    name = 'Generic';

    render() {
        return html`<div class="center">
            <h1>Welcome, ${this.name}</h1>
            <button class="button" @click="${logout}">Sign Out</button>
        </div>`;
    }
}
