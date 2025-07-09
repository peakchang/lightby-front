import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import axios from "axios";
import { browser } from "$app/environment";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    let userId = ''
    let postNum = 0
    user_info.subscribe((v) => {
        userId = v.idx
    })

    if (userId) {
        const res = await axios.post(`${back_api}/regist/get_post_count`, { userId })
        postNum = res.data.postNum
    }


    return { postNum }
}