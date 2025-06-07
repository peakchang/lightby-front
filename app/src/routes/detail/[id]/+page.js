import { back_api } from "$lib/const";
import { user_info } from "$lib/stores/stores.js";
import axios from "axios";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {
    console.log(params);
    let detail = {}
    try {
        const res = await axios.post(`${back_api}/detail`, { idx: params.id })
        detail = res.data.detail
    } catch (error) {

    }

    console.log(detail);
    

    return { detail }

}