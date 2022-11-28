import { AccountManager } from './account-manage';
import { AddDevice } from './add-device';
import { Popup } from './popup';

export const accountManagerPopup = document.querySelector('popup-template#account-manager') as Popup;
export const accountManager = accountManagerPopup.querySelector('account-manager') as AccountManager;
export const addDevicePopup = document.querySelector('popup-template#add-device') as Popup;
export const addDevice = addDevicePopup.querySelector('add-device') as AddDevice;
