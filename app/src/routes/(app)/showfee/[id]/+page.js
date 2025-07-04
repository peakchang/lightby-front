import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import axios from "axios";
import { browser } from "$app/environment";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    console.log(params);

    let boardItem = {};
    let replyList = [];

    try {
        const res = await axios.post(`${back_api}/board/load_item`, { boardIdx: params })
        boardItem = res.data.boardItem;
        replyList = res.data.replyList;
        console.log(replyList);
        
    } catch (error) {

    }
    return { boardItem, replyList }
}