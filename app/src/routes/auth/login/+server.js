import { sql_con } from "$lib/server/db";
import { error, json } from '@sveltejs/kit';
import { getQueryStr } from "$lib/server/lib";
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '$env/static/private';
import bcrypt from 'bcrypt';
/*
>> 프론트에서 가져온 추가 정보들로 DB 입력 / JWT토큰 생성해서 아이디 값 저장 / 다시 DB에 토큰 값 저장하기!
>> 이후 리턴 한 다음에 프론트에서 메인페이지로 refresh 하기!!
*/
export async function POST({ request, cookies }) {

    const { id, password } = await request.json();
    try {
        const getUserInfoQuery = "SELECT * FROM users WHERE id = ?";
        const [getUserInfo] = await sql_con.promise().query(getUserInfoQuery, [id]);
        if (getUserInfo.length === 0) {
            return json({ message: '아이디가 존재하지 않습니다.' }, { status: 400 })
        }
        const isMatch = await bcrypt.compare(password, getUserInfo[0].password);
        if (isMatch) {
            const payload = {
                userId: getUserInfo[0].idx
            }

            const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '14d' });

            const refreshTokenUpdateQuery = `UPDATE users SET refresh_token = ? WHERE idx = ?`;
            await sql_con.promise().query(refreshTokenUpdateQuery, [refreshToken, getUserInfo[0].idx]);

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

        } else {
            return json({ message: '비밀번호가 일치하지 않습니다.' }, { status: 400 })
        }
    } catch (error) {
        console.error(error.message);

    }
    return json({})
}


/* 
1. 아이디 비번 체크 후 액세스토큰 / 리프레쉬토큰 생성
2. 다 같이 idx값 저장후 액세스토큰은 쿠키에 / 리프레쉬토큰은 DB에 저장
3. payload 에서는 userId 값이 들어감 (DB의 idx 값임)
*/