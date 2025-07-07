import { writable } from 'svelte/store';

export const user_info = writable({ idx: undefined });

export const main_location = writable("");

export const all_data = writable({});

export const toastStore = writable({ show: false, message: '', color: 'red' });
export const loadingStore = writable(false);


export const paymentActRegistered = writable(false);