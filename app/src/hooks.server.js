import { sql_con } from '$lib/server/db'
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';

export async function handle({ event, resolve }) {

    if (event.url.pathname.startsWith('/.well-known/')) {
        return new Response('', { status: 204 });
    }


    const accessToken = event.cookies.get('access_token');
    const refreshToken = event.cookies.get('refresh_token');
    // 기본 초기화~
    let userInfo = {}
    try {
        if (accessToken) {
            const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET)
            userInfo = { idx: payload.userId };
            // 액세스 토큰 정상이면 바로 리턴 처리~
            event.locals.userInfo = userInfo;
            const res = await resolve(event); // 요청 처리
            return res;

        }
    } catch (error) {
    }

    // 액세스 토큰으로 처리 안되었다면 리프레쉬 토큰으로 액세스 토큰 재발급 하기~
    if (refreshToken) {

        try {
            const refreshPayload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
            const getUserInfoQuery = "SELECT * FROM users WHERE idx = ?";
            const [userInfoRow] = await sql_con.promise().query(getUserInfoQuery, [refreshPayload.userId]);

            // userInfoRow.length 가 0 이면 아이디가 없는것 / 토큰 불일치 하면 다시 로그인 하라고 리턴처리
            if (userInfoRow.length == 0 || userInfoRow[0].refresh_token != refreshToken) {

                event.cookies.delete('access_token', { path: '/' });
                event.cookies.delete('refresh_token', { path: '/' });

                event.locals.userInfo = {};
                return await resolve(event);
            }
            const newAccessToken = jwt.sign({ userId: userInfoRow[0].idx }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

            event.cookies.set('access_token', newAccessToken, {
                httpOnly: true,
                secure: true,
                path: '/',
                maxAge: 60 * 15
                // maxAge: 5
            });

            userInfo = { idx: userInfoRow[0].idx };
            event.locals.userInfo = userInfo;
        } catch (err) {
            console.error(err.message);
            // 와중에 에러나면 그냥 토큰 다 날리기~
            event.cookies.delete('access_token', { path: '/' });
            event.cookies.delete('refresh_token', { path: '/' });
        }
    }
    const res = await resolve(event); // 요청 처리

    return res;
}


/*
진입~
1. 먼저 액세스 토큰이 있는지 확인, 확인 후 액세스 토큰 있으면 바로 반환~ (페이로드의 userId > userInfo = {idx : 값})
2. 액세스 토큰이 없으면 refresh 토큰의 userId 값으로 DB 조회 / 결과 값으로 토큰 대조 후 정상이면 액세스토큰 재발급!
리턴~
*/