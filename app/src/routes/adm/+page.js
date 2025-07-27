import { back_api } from "$lib/const.js";
import { user_info, main_location } from "$lib/stores/stores.js";
import { getPageList } from "$lib/lib.js";
import axios from "axios";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {



    const nowPage = url.searchParams.get('page');
    console.log(nowPage);


    let userList = []
    let allCount = 0
    let pageList = [];
    try {
        const res = await axios.post(`${back_api}/adm_users/get_users`, { page: 1 })
        userList = res.data.userList
        allCount = res.data.allCount
        pageList = getPageList(nowPage, 30)
        console.log(pageList);

    } catch (err) {
        console.error(err.message);
    }
    return { userList, allCount, pageList }
}