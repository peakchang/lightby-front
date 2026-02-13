import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import axios from "axios";
import { browser } from "$app/environment";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    let userIdx = undefined;
    let startNum = 1;
    user_info.subscribe((v) => {
        userIdx = v.idx;
    });

    let applyList = [];

    try {
        const res = await axios.post(`${back_api}/detail/load_user_apply_list`, { user_idx: userIdx, startNum })
        applyList = res.data.applyList;
    } catch (error) {
        console.error(error.message);
    }

    console.log(applyList);


    return { applyList, startNum }
}