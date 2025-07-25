// // src/routes/auth/kakao/callback/+server.js
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { sql_con } from "$lib/server/db";
import { KAKAO_RESTAPI, KAKAO_REDIRECT_URI, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '$env/static/private';


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

        // 먼저 가져온 코드로 카톡 토큰 받으러 가기!!
        const tokenResponse = await axios.post(
            'https://kauth.kakao.com/oauth/token',
            null,
            {
                params: {
                    grant_type: 'authorization_code',
                    client_id: KAKAO_RESTAPI,
                    redirect_uri: KAKAO_REDIRECT_URI,
                    code,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
            }
        );

        // 토큰 받기 완료!
        const { access_token } = tokenResponse.data;

        // 토큰으로 유저 정보 얻으러 가기!
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        // 유저 정보 얻기 완료!
        const kakaoUserInfo = userResponse.data;

        console.log('kakaoUserInfo 여기~~~~~~~~~~~~');

        console.log(kakaoUserInfo);


        // 해당 유저 정보로 DB에 있는지 (기존 가입 유저인지) 체크
        const getUserInfoQuery = "SELECT * FROM users WHERE sns_id = ?";
        const [getUserInfo] = await sql_con.promise().query(getUserInfoQuery, [kakaoUserInfo.id]);

        if (getUserInfo.length > 0) {

            try {
                // 기존 가입 유저면 액세스 토큰 / 리프레쉬 토큰 설정 하고 메인으로!

                const userInfo = getUserInfo[0];
                const payload = {
                    userId: userInfo.idx
                }

                const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '14d' });

                

                data.loginStatus = true;

                const options = {
                    expiresIn: '7d',
                }

                const tokenUpdateQuery = `UPDATE users SET refresh_token = ? WHERE idx = ?`;
                await sql_con.promise().query(tokenUpdateQuery, [refreshToken, userInfo.idx]);

                cookies.set('access_token', accessToken, {
                    httpOnly: true,
                    secure: true,
                    path: '/',
                    maxAge: 60 * 15
                });

                cookies.set('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    path: '/',
                    maxAge: 60 * 60 * 24 * 14
                });
            } catch (error) {
                console.error(error.message);
                console.log('카카오 로그인 에러!!!');
            }

        } else {
            // 기존 유저 아니면 아래 데이터들 체크! 모두 충족하면 넘어가기~
            // 어쨌든 닉네임 때문에 다시 하긴 해야할거 같은데?
            data.loginStatus = false;
            data.userInfo.sns_id = kakaoUserInfo.id;
            data.userInfo.profile_image = kakaoUserInfo.kakao_account.profile.profile_image_url
            data.userInfo.profile_thumbnail = kakaoUserInfo.kakao_account.profile.thumbnail_image_url
            data.userInfo.name = kakaoUserInfo.kakao_account.profile.nickname
            data.userInfo.nickname = kakaoUserInfo.kakao_account.profile.nickname
            data.userInfo.phone = kakaoUserInfo.properties.phone // 휴대폰 부분은 넘어온게 없으니까 추후 확인

            // name / nickname / phone 다 있으면 insert 시키고 없으면 바로 loginStatus = false 하고 리턴 시키기!
            // 다 있어도 닉네임 / 휴대폰 번호 중복이 있을수 있으니까 에러나면 (unique) loginStatus = false 하고 리턴 시키기!



            console.log('userInfo 확인!!!!');
            console.log(data.userInfo);


            console.log('여기가 신규 가입!!');

        }

    } catch (error) {
        console.log('여기서 에러인거야?!?!');
        console.error(error.message);
    }


    return data
}