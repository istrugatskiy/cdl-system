import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { button, h1 } from './common-styles';

// Fixes customElementRegistry being written to twice.
if (module.hot) {
    module.hot.dispose(() => {
        window.location.reload();
    });
}

@customElement('device-item')
export class DeviceItem extends LitElement {
    static styles = css`
        ${button}
        ${h1}
        .add-button {
            flex-direction: column;
        }
        .icon {
            font-size: 150px;
            line-height: 150px;
        }
    `;

    @property({ type: Boolean, reflect: true, attribute: 'data-active' })
    active = true;

    @property({ type: String, reflect: true, attribute: 'data-display-item' })
    displayItem = false;

    @property({ type: String, reflect: true, attribute: 'data-arduinoID' })
    arduinoID = '';

    @property({ type: String, reflect: true, attribute: 'data-photo' })
    photo = '';

    addDevice() {
        this.dispatchEvent(new CustomEvent('add-device', { detail: this.arduinoID }));
    }

    render() {
        return html`<button class="button add-button" ?disabled=${!this.active}>
            <div class="material-symbols-outlined icon">add</div>
            Add Device
        </button>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'device-item': DeviceItem;
    }
}
