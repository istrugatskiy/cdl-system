import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { login } from './index';
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
            max-width: 800px;
        }
        h1 {
            color: var(--dark-blue);
            font-size: 64px;
            font-family: var(--large-font);
            text-align: center;
        }
        img {
            max-width: 100%;
        }
        .login-parent {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;

    render() {
        const googleLogo = new URL('../res/Google__G__Logo.svg', import.meta.url);
        const systemLogo = new URL('../res/logo.svg', import.meta.url);
        return html`<div class="login">
            <img src="${systemLogo}" alt="System Logo" />
            <h1>Login</h1>
            <div class="login-parent">
                <button class="button" @click="${login}">
                    <img src="${googleLogo}" alt="Google Logo" width="30" height="30" />
                    Sign in with Google
                </button>
            </div>
        </div>`;
    }
}
