import { AccountManager } from './account-manage';
import { AddDevice } from './add-device';
import { ManageDevice } from './manage-device';
import { Popup } from './popup';

export const accountManagerPopup = document.querySelector('popup-template#account-manager') as Popup;
export const accountManager = accountManagerPopup.querySelector('account-manager') as AccountManager;
export const addDevicePopup = document.querySelector('popup-template#add-device') as Popup;
export const manageDevicePopup = document.querySelector('popup-template#manage-device') as Popup;
export const manageDevice = document.querySelector('manage-device') as ManageDevice;
export const addDevice = addDevicePopup.querySelector('add-device') as AddDevice;
export const iconList = ['potted_plant', 'sprinkler', 'grass', 'psychiatry', 'eco'];
export const SSIDRegex = /^[^!#;+\]\/"\t][^+\]\/"\t]{0,30}[^ +\]\/"\t]$|^[^ !#;+\]\/"\t]$[ \t]+$/;
export const passwordRegex = /^[\u0020-\u007e\u00a0-\u00ff]*$/;
