
import { user_info } from "$lib/stores/stores.js";


// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {
    // hook 사용해서 유저 셋팅!
    if (data) {
        user_info.set(data.user)
    }
}