import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import { main_location } from "$lib/stores/stores.js";
import axios from "axios";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    console.log('안들어왕?!');

    let userList = []
    let allCount = 0
    try {
        const res = await axios.post(`${back_api}/adm_users/get_users`, { page: 1 })
        console.log(res.data);
        userList = res.data.userList
        allCount = res.data.allCount
    } catch (err) {
        console.error(err.message);
    }
    return { userList, allCount }
}