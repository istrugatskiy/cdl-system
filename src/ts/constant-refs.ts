import { AccountManager } from './account-manage';
import { Popup } from './popup';

export const accountManagerPopup = document.querySelector('popup-template#account-manager') as Popup;
export const accountManager = accountManagerPopup.querySelector('account-manager') as AccountManager;
