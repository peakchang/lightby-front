import { sql_con } from "$lib/server/db";
import { error, json } from '@sveltejs/kit';
import { getQueryStr } from "$lib/server/lib";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import bcrypt from 'bcrypt';
/*
>> 프론트에서 가져온 추가 정보들로 DB 입력 / JWT토큰 생성해서 아이디 값 저장 / 다시 DB에 토큰 값 저장하기!
>> 이후 리턴 한 다음에 프론트에서 메인페이지로 refresh 하기!!
*/
export async function POST({ request, cookies }) {

    const body = await request.json();
    const secretKey = JWT_SECRET;
    try {
        const getUserInfoQuery = "SELECT * FROM users WHERE id = ?";
        const [getUserInfo] = await sql_con.promise().query(getUserInfoQuery, [body.id]);
        if (getUserInfo.length === 0) {
            return json({ error: '아이디가 존재하지 않습니다.' }, { status: 400 })
        }
        const isMatch = await bcrypt.compare(body.password, getUserInfo[0].password);
        if (isMatch) {
            const payload = {
                userId: getUserInfo[0].idx
            }
            const options = {
                expiresIn: '7d',
            }
            const token = jwt.sign(payload, secretKey, options);
            const tokenUpdateQuery = `UPDATE users SET refresh_token = ? WHERE idx = ?`;
            await sql_con.promise().query(tokenUpdateQuery, [token, getUserInfo[0].idx]);
            cookies.set('tk', token, { path: '/' })
        } else {
            return json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 400 })
        }
    } catch (error) {
        console.error(error.message);

    }
    return json({})
}

