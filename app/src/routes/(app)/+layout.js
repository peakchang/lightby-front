import { userInfo } from "$lib/stores/stores.js";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {
    userInfo.set(data.user)
}