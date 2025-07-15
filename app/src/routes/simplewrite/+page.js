import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import axios from "axios";
import { browser } from "$app/environment";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    let userIdx = undefined;
    let modifyContent = {}
    let modifyIdx = undefined
    console.log(url.searchParams.get('modifyidx'));
    if (url.searchParams.get('modifyidx')) {

        try {

            user_info.subscribe((v) => {
                userIdx = v.idx
            })
            modifyIdx = url.searchParams.get('modifyidx')
            const res = await axios.post(`${back_api}/board/load_modify_content`,
                { userIdx, itemIdx: modifyIdx }
            )
            modifyContent = res.data.modifyContent
        } catch (error) {
            console.error(error.message);
        }
    }


    return { modifyIdx, modifyContent }
}