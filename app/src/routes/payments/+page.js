import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import axios from "axios";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {
    // 커스토머 키 체크!! 있으면 불러오고, 없으면 백엔드에서 생성해서 DB 저장 후 가져오기!
    const userId = url.searchParams.get('user_id')
    let customer_key = ""
    let user_name = ""
    try {
        const res = await axios.post(`${back_api}/payment_customerkey_chk`, { userId })

        customer_key = res.data.customer_key
        user_name = res.data.user_name

    } catch (err) {
        console.error(err.message);
    }

    return { customer_key, user_name }

}