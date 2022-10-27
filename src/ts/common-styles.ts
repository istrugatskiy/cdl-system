import { css } from 'lit';

export const button = css`
    .material-symbols-outlined {
        font-family: 'Material Symbols Outlined';
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
    }
    button {
        appearance: button;
        -webkit-writing-mode: horizontal-tb !important;
        writing-mode: horizontal-tb !important;
        text-rendering: auto;
        color: -internal-light-dark(black, white);
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;
        display: inline-block;
        text-align: center;
        align-items: flex-start;
        cursor: default;
        background-color: -internal-light-dark(rgb(239, 239, 239), rgb(59, 59, 59));
        box-sizing: border-box;
        margin: 0em;
        font: 400 13.3333px Arial;
        padding: 1px 6px;
        border-width: 2px;
        border-style: outset;
        border-image: initial;
    }
    .button {
        display: flex;
        text-align: center;
        align-items: center;
        font-family: var(--non-large-font);
        font-weight: normal;
        font-size: 32px;
        border-radius: 7px;
        border-style: solid;
        border-color: var(--light-green);
        transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        margin-top: 10px;
        margin-bottom: 10px;
        border-width: 3px;
        outline: none;
        color: var(--dark-blue);
        box-shadow: 0px 0px 12px #000000;
        background-color: white;
        height: 50px;
    }
    .button:hover {
        cursor: pointer;
        border-color: var(--medium-green);
    }
    .button:active,
    .button:focus {
        cursor: pointer;
        border-color: var(--dark-blue);
        box-shadow: none;
    }
`;
