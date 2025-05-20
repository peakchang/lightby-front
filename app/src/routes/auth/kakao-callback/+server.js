import { sql_con } from "$lib/server/db";
import { json } from '@sveltejs/kit';
import { getQueryStr } from "$lib/server/lib";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

/*
>> 프론트에서 가져온 추가 정보들로 DB 입력 / JWT토큰 생성해서 아이디 값 저장 / 다시 DB에 토큰 값 저장하기!
>> 이후 리턴 한 다음에 프론트에서 메인페이지로 refresh 하기!!
*/
export async function POST({ request, cookies }) {
    const body = await request.json();
    const userInfo = body.userInfo;
    const queryStr = getQueryStr(userInfo, 'insert');
    const secretKey = JWT_SECRET;
    try {
        const insertSnsUserQuery = `INSERT INTO users (${queryStr.str}) VALUES (${queryStr.question})`;
        const [result] = await sql_con.promise().query(insertSnsUserQuery, queryStr.values);
        const payload = {
            userId: result.insertId
        }
        const options = {
            expiresIn: '7d',
        }
        const token = jwt.sign(payload, secretKey, options);
        console.log(token);


        const tokenUpdateQuery = `UPDATE users SET refresh_token = ? WHERE idx = ?`;
        await sql_con.promise().query(tokenUpdateQuery, [token, result.insertId]);
        cookies.set('tk', token, { path: '/' })
    } catch (error) {
        console.error(error.message);

    }
    return json({})
}
