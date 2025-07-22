import { back_api } from '$lib/const.js';
import axios from 'axios';

// hooks.server.js 에서 받아온 유저 정보 +layout.js 로 넘기기 위한 중간 단계
export const load = async ({ locals }) => {


    console.log('최초에만 나오지?!?!');

    try {
        const res = await axios.get(`${back_api}/today_update`)
    } catch (error) {
        
    }


    return {
        user: locals.userInfo
    }
}