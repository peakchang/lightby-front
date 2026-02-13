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

    const startNum = 1;

    let applicantList = [];

    try {
        const res = await axios.post(`${back_api}/detail/load_user_apply_list`, { startNum, user_idx });
        applicantList = res.data.applyList;
        console.log(applicantList);

    } catch (error) {
        console.error(error.message);
    }
    return { applicantList, startNum }
}