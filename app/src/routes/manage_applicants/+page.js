import { back_api } from "$lib/const.js";
import { user_info, manageBoardTabNum } from "$lib/stores/stores.js";
import axios from "axios";
import { isWithin10Days } from "$lib/lib.js"


// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {
    let user_idx = "";
    user_info.subscribe((v) => {
        user_idx = v.idx
    })

    console.log(user_idx);


    const startNum = 1;

    let applyList = []
    let statusCount = {}

    try {
        const res = await axios.post(`${back_api}/detail/load_apply_status`, { startNum, user_idx })
        applyList = res.data.applyList
        statusCount = res.data.statusCount
    } catch (error) {
        console.error(error.message);
    }
    return { applyList, statusCount, startNum }
}