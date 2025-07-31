import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import { main_location } from "$lib/stores/stores.js";
import axios from "axios";
import { browser } from "$app/environment";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {
    // user_info 전역 store 에 정보 설정

    try {
        if (data.user) {
            user_info.set({ idx: data.user.idx, rate: data.user.rate })
        } else {
            user_info.set({ idx: undefined, rate: 0 })
        }
    } catch (error) {

    }

    return {}
}