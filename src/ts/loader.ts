import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { button } from './common-styles';

@customElement('main-auth')
export class Auth extends LitElement {
    static styles = css`
        ${button}
    `;

    render() {
        const googleLogo = new URL('../res/Google__G__Logo.svg', import.meta.url);
        return html`<div class="loader"></div>`;
    }
}
