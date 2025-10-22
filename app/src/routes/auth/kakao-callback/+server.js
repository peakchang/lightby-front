import { sql_con } from "$lib/server/db";
import { json } from '@sveltejs/kit';
import { getQueryStr } from "$lib/server/lib";
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '$env/static/private';
import moment from "moment-timezone";
import axios from "axios";
import { back_api } from "$lib/const.js";


/*
>> 프론트에서 가져온 추가 정보들로 DB 입력 / JWT토큰 생성해서 아이디 값 저장 / 다시 DB에 토큰 값 저장하기!
>> 이후 리턴 한 다음에 프론트에서 메인페이지로 refresh 하기!!
*/
export async function POST({ request, cookies }) {
    const body = await request.json();
    const userInfo = body.userInfo;
    const queryStr = getQueryStr(userInfo, 'insert');

    let userId = "";

    try {



        const res = await axios.post(`${back_api}/auth/kakao_join`, {
            query_str: queryStr.str,
            query_question: queryStr.question,
            query_values: queryStr.values
        })

        userId = res.data.insertId
        const payload = {
            userId,
            rate: 5
        }

        // 토큰 생성!
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '14d' });


        const resTokenUpdate = await axios.post(`${back_api}/auth/kakao_token_update`, {
            refreshToken,
            idx: userId
        })


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
    } catch (err) {
        console.error(err.message);
    }
    return json({ userId })
}