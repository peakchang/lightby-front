import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import axios from "axios";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {



    let jobOfferList = []
    try {
        const res = await axios.post(`${back_api}/adm_manage/load_joboffer_list`, { page: 1 })
        console.log(res.data);
        jobOfferList = res.data.jobOfferList
    } catch (err) {
        console.error(err.message);
    }

    console.log(jobOfferList);
    
    return { jobOfferList }
}