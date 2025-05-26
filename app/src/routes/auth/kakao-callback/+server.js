import { sql_con } from "$lib/server/db";
import { json } from '@sveltejs/kit';
import { getQueryStr } from "$lib/server/lib";
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '$env/static/private';

/*
>> 프론트에서 가져온 추가 정보들로 DB 입력 / JWT토큰 생성해서 아이디 값 저장 / 다시 DB에 토큰 값 저장하기!
>> 이후 리턴 한 다음에 프론트에서 메인페이지로 refresh 하기!!
*/
export async function POST({ request, cookies }) {
    const body = await request.json();
    const userInfo = body.userInfo;
    const queryStr = getQueryStr(userInfo, 'insert');

    try {

        const insertSnsUserQuery = `INSERT INTO users (${queryStr.str}) VALUES (${queryStr.question})`;
        const [result] = await sql_con.promise().query(insertSnsUserQuery, queryStr.values);
        console.log(result);

        const payload = {
            userId: result.insertId
        }

        // 토큰 생성!
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '14d' });
        const tokenUpdateQuery = `UPDATE users SET refresh_token = ? WHERE idx = ?`;
        await sql_con.promise().query(tokenUpdateQuery, [refreshToken, result.insertId]);
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

    }
    return json({})
}
