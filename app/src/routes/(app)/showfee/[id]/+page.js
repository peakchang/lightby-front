import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import axios from "axios";
import { browser } from "$app/environment";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    let postItem = {};
    let replyList = [];
    let likeCount = 0

    try {
        const res = await axios.post(`${back_api}/board/load_item`, { postIdx: params })
        postItem = res.data.postItem;
        replyList = res.data.replyList;
        likeCount = res.data.likeCount
    } catch (error) {

    }
    return { postItem, replyList, likeCount }
}