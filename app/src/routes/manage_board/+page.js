import { back_api } from "$lib/const.js";
import { user_info, manageBoardTabNum } from "$lib/stores/stores.js";
import axios from "axios";
import { isWithin10Days } from "$lib/lib.js"


// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {
    let tabNum = 0
    let userId = ""

    manageBoardTabNum.subscribe((v) => {
        tabNum = v
    })

    user_info.subscribe((v) => {
        userId = v.idx
    })

    let post_list = []

    try {
        const res = await axios.post(`${back_api}/board/get_manage_board`, { tabNum, userId })

        post_list = res.data.postList
    } catch (error) {

    }

    // 구인글 구할 시 광고 상태 결정!
    if (tabNum == 0) {
        for (let i = 0; i < post_list.length; i++) {
            if (post_list[i]['product'] != 'free') {
                post_list[i]['ad_status'] = isWithin10Days(post_list[i]['created_at'])
            }
        }
    }



    return { post_list }

}