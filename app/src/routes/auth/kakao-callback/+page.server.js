// // src/routes/auth/kakao/callback/+server.js
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { sql_con } from "$lib/server/db";
import { KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI, JWT_SECRET } from '$env/static/private';


// KAKAO 콜백 처리될때 아이디 있으면 쿠키에 JWT 인증 넣고 리턴~ (JWT 값에는 DB ID 값만 넣기)

/*
카카오 로그인 프로세스!!
>> 카카오 로그인을 하면 (1)코드를 가져와서 / (2)토큰을 받고 / (3) 해당 토큰으로 재요청, 유저 정보를 가져옴
>> 카카오 로그인을 하면 아이디 값이 부여됨 (불변) 해당 아이디를 조회해서 DB에 있으면
(1) DB에서 idx 값 가져오기 (2) JWT 토큰 생성, 토큰에 아이디값 저장 및 DB에 토큰 값 저장 (3) 값 리턴 프론트에서 메인페이지로 refresh

>> DB에 없으면 카카오에서 가져온 정보 프론트로 리턴해서 추가 정보 얻기!!!

메인 페이지 들어갈때 refresh로 하면서 hooks.server.js 에서 정보 가져와서 store에 로그인 정보 저장!!
*/
export async function load({ params, url, cookies }) {

    const code = url.searchParams.get('code');

    let data = {
        loginStatus: undefined,
        userInfo: {},
    }

    if (!code) {
        // 여기 에러 처리는 어떻게 할지 물어보기!
        return Error
    }
    try {
        const tokenResponse = await axios.post(
            'https://kauth.kakao.com/oauth/token',
            null,
            {
                params: {
                    grant_type: 'authorization_code',
                    client_id: KAKAO_CLIENT_ID,
                    redirect_uri: KAKAO_REDIRECT_URI,
                    code,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
            }
        );
        const { access_token } = tokenResponse.data;
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const kakaoUserInfo = userResponse.data;
        const getUserInfoQuery = "SELECT * FROM users WHERE sns_id = ?";
        const [getUserInfo] = await sql_con.promise().query(getUserInfoQuery, [kakaoUserInfo.id]);

        if (getUserInfo.length > 0) {
            const secretKey = JWT_SECRET;

            const userInfo = getUserInfo[0];

            data.loginStatus = true;

            const payload = {
                userId: userInfo.idx
            }
            const options = {
                expiresIn: '7d',
            }
            const token = jwt.sign(payload, secretKey, options);
            const tokenUpdateQuery = `UPDATE users SET refresh_token = ? WHERE idx = ?`;
            await sql_con.promise().query(tokenUpdateQuery, [token, userInfo.idx]);
            cookies.set('tk', token, { path: '/' })
        } else {

            
            data.loginStatus = false;
            data.userInfo.sns_id = kakaoUserInfo.id;
            data.userInfo.profile_image = kakaoUserInfo.properties.profile_image
            data.userInfo.profile_thumbnail = kakaoUserInfo.properties.thumbnail_image
            data.userInfo.name = kakaoUserInfo.properties.name
            // data.userInfo.name = '야무무'
            data.userInfo.phone = kakaoUserInfo.properties.phone
            // data.userInfo.phone =  '01021902197'

            // 정보들 다 있으면 여기서 insert 시키고 loginStatus true로 만들어서 보내기!!!
        }

    } catch (error) {
        console.error(error.message);
    }


    return data
}