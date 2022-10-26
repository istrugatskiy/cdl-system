import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('main-auth')
export class SimpleGreeting extends LitElement {
    static styles = css`
        .login {
        }
    `;

    render() {
        return html`<div class="login"><h1>Login</h1></div>`;
    }
}
