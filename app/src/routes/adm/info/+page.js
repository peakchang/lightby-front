import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import { main_location } from "$lib/stores/stores.js";
import axios from "axios";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    let visit_list = []
    try {
        const res = await axios.post(`${back_api}/adm_etc/load_visit_list`);
        visit_list = res.data.visit_list

        console.log(visit_list);
        
    } catch (error) {

    }
    return { visit_list }
}