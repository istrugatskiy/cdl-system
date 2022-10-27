import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { login } from './index';
import { button } from './common-styles';

@customElement('main-auth')
export class Auth extends LitElement {
    static styles = css`
        ${button}
        @keyframes pop-in {
            from {
                transform: scale(0);
            }
            to {
                transform: scale(1);
            }
        }
        .login {
            background-color: white;
            border-radius: 20px;
            margin: 10px;
            padding: 10px;
            max-width: 800px;
            border-width: 6px;
            border-style: solid;
            /*make top right border different color*/
            border-image: linear-gradient(to bottom right, var(--dark-blue), var(--light-green)) 1;
            animation: 0.3s cubic-bezier(0.42, 0, 0, 1.92) 0s 1 normal none running pop-in;
        }
        h1 {
            margin-top: 0;
            color: var(--dark-blue);
            font-size: 64px;
            font-family: var(--large-font);
            text-align: center;
        }
        p {
            color: var(--dark-blue);
            font-size: 24px;
            font-family: var(--non-large-font);
            text-align: justify;
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
            <p>By using System, you agree that you are over the age of thirteen and that your data may be shared with third party service providers.</p>
        </div>`;
    }
}
