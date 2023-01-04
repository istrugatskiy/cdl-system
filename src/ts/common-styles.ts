import { css } from 'lit';

export const h1 = css`
    h1 {
        color: var(--dark-blue);
        font-size: 36px;
        font-family: var(--large-font);
        text-align: center;
        background-color: var(--light-green);
    }
    @media screen and (max-width: 450px) {
        h1 {
            font-size: 24px;
        }
    }
`;

export const button = css`
    .material-symbols-outlined {
        font-family: 'Material Symbols Outlined';
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
        -webkit-user-select: none;
        user-select: none;
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
        font-size: 24px;
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
    .button:disabled {
        box-shadow: none;
        background-color: var(--light-green);
        border-color: var(--light-green);
        cursor: not-allowed;
    }
`;

export const p = css`
    p {
        color: var(--dark-blue);
        font-family: var(--non-large-font);
        text-align: justify;
        font-size: 16px;
    }
`;

export const transitionablePopupChild = css`
    .flex {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    @keyframes slide-out {
        0% {
            transform: scale(1);
        }
        25% {
            transform: translateX(0) scale(0.8);
            opacity: 1;
        }
        50% {
            transform: translateX(-50%) scale(0.7);
            opacity: 0;
        }
        70% {
            opacity: 0;
            transform: translateX(50%);
        }
        100% {
            transform: scale(1) translateX(0);
            opacity: 1;
        }
    }
    .transition-animation {
        animation: slide-out 0.82s;
        animation-timing-function: cubic-bezier(0.29, 0.09, 0.07, 1.2);
    }
    input {
        cursor: text !important;
        margin: 10px;
    }
    input::placeholder {
        color: var(--light-green);
        font-family: var(--non-large-font);
    }
    input:disabled {
        background-color: white !important;
    }
    h1 {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    p {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    *[hidden] {
        display: none !important;
    }
`;
