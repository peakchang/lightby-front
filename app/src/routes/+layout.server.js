import { back_api, back_api_origin } from '$lib/const.js';
import moment from 'moment-timezone';
import { sql_con } from "$lib/server/db";

import axios from 'axios';





// hooks.server.js 에서 받아온 유저 정보 +layout.js 로 넘기기 위한 중간 단계
export const load = async ({ locals, request, cookies, fetch, url }) => {

    const visitCookie = cookies.get('visit');
    console.log(visitCookie);

    // 1. 브라우저가 보낸 원래 User-Agent 가져오기
    const userAgent = request.headers.get('user-agent') || '';
    console.log(userAgent);
    

    // 2. 사용자의 원래 IP 가져오기 (SvelteKit 환경)
    // Cloudflare나 프록시 환경에 따라 다를 수 있으나 보통 아래와 같습니다.
    const clientIp = request.headers.get('x-forwarded-for') || '0.0.0.0';
    console.log(request.headers);
    
    console.log(clientIp);
    

    if (!visitCookie) {

        const referer = request.headers.get('referer') || 'direct';

        try {
            // 백엔드 API 호출 (POST 방식)
            await fetch(`${back_api}/record_visit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: url.pathname,
                    referer: referer // 유입경로 추가
                })
            });

            // 자정까지만 유지되는 쿠키 설정
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);

            cookies.set('visit', 'true', {
                expires: midnight,
                httpOnly: true,
                secure: true,
                path: '/',
            });
        } catch (error) {
            console.error('Visit Record Error:', error);
        }
    }


    return {
        // 이건 회원 정보 넘겨주기!!
        user: locals.userInfo
    }
}