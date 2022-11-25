import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { button, h1 } from './common-styles';

@customElement('device-item')
export class DeviceItem extends LitElement {
    static styles = css`
        ${button}
        ${h1}
    `;

    @property({ type: Boolean, reflect: true, attribute: 'data-active' })
    active = true;

    @property({ type: String, reflect: true, attribute: 'data-display-item' })
    displayItem = false;

    @property({ type: String, reflect: true, attribute: 'data-arduinoID' })
    arduinoID = '';

    @property({ type: String, reflect: true, attribute: 'data-photo' })
    photo = '';

    render() {
        return html`<button class="button">Add Device</button>`;
    }
}
