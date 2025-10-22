import { back_api } from "$lib/const.js";
import { user_info, main_location } from "$lib/stores/stores.js";
import { getPageList } from "$lib/lib.js";
import axios from "axios";
import moment from "moment-timezone";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    const today = moment().format("YYYY-MM-DD");
    let start = url.searchParams.get('start') ? url.searchParams.get('start') : today;
    let end = url.searchParams.get('end') ? url.searchParams.get('end') : today;

    let countList = [];

    try {
        const res = await axios.post(`${back_api}/adm_users/get_counter`, { start, end })
        countList = res.data.countList


    } catch (err) {

    }
    return { countList }
}