import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import axios from "axios";
import { browser } from "$app/environment";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    let boardList = [];
    try {
        const res = await axios.post(`${back_api}/board/load_list`, { startNum: 0 })
        boardList = res.data.board_list;
    } catch (error) {

    }

    console.log(boardList);
    
    return { boardList }
}