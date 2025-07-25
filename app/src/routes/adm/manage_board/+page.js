import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import axios from "axios";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {



    let postList = []
    try {
        const res = await axios.post(`${back_api}/adm_manage/load_post_list`, { page: 1 })
        console.log(res.data);
        postList = res.data.postList
    } catch (err) {
        console.error(err.message);
    }



    return { postList }
}