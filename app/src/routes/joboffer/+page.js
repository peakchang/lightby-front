import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import axios from "axios";
import { browser } from "$app/environment";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    let userId = ''
    let postNum = 0
    let modifyIdx = undefined
    let modifyContent = {}



    if (url.searchParams.get('manage')) {
        userId = "on"
    } else {
        user_info.subscribe((v) => {
            userId = v.idx
        })
    }

    console.log(url);
    if (url.searchParams.get('modifyidx')) {
        modifyIdx = url.searchParams.get('modifyidx')

        try {
            const res = await axios.post(`${back_api}/regist/load_modify_content`, { userId, modifyIdx })

            modifyContent = res.data.modifyContent
        } catch (error) {

        }
    }

    console.log(modifyIdx);




    if (userId) {
        const res = await axios.post(`${back_api}/regist/get_post_count`, { userId })
        postNum = res.data.postNum
    }


    return { postNum, modifyContent, modifyIdx }
}