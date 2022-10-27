import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { button } from './common-styles';

@customElement('main-auth')
export class Auth extends LitElement {
    static styles = css`
        ${button}
        .login {
            background-color: white;
            border-radius: 5px;
            margin: 10px;
            padding: 10px;
        }
        h1 {
            color: var(--dark-blue);
            font-size: 64px;
            font-family: var(--large-font);
            text-align: center;
        }
        .login-parent {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;

    render() {
        const imageUrl = new URL('../res/Google__G__Logo.svg', import.meta.url);
        return html`<div class="login">
            <h1>Login</h1>
            <div class="login-parent">
                <button class="button">
                    <img src="${imageUrl}" alt="Google Logo" width="30" height="30" />
                    Sign in with Google
                </button>
            </div>
        </div>`;
    }
}
