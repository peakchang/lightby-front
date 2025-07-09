import { writable } from 'svelte/store';

export const user_info = writable({ idx: undefined });


// 메인 페이지 검색 및 지역
export const main_location = writable("");
export const search_val = writable("");

export const all_data = writable({});

export const toastStore = writable({ show: false, message: '', color: 'red' });
export const loadingStore = writable(false);


export const paymentActRegistered = writable(false);


export const paymentKey = writable("")