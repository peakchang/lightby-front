import { back_api, back_api_origin } from '$lib/const.js';
import moment from 'moment-timezone';
import { sql_con } from "$lib/server/db";
import { getRandomBetween } from '$lib/lib.js';





// hooks.server.js 에서 받아온 유저 정보 +layout.js 로 넘기기 위한 중간 단계
export const load = async ({ locals, request, cookies }) => {

    const today = moment().format('YYYY-MM-DD')
    const visitCookie = cookies.get('visit', { path: '/' })


    const random = getRandomBetween(5, 8)


    // 쿠키 설정이 안되어 있으면 작업 GO!!
    if (!visitCookie || visitCookie != 'true') {

        // 기존 DB 없으면 insert! 있으면 update! 가짜 카운트랑 진짜 카운트!
        try {
            const chkTodayCountQuery = "SELECT * FROM today_count WHERE date = ?"
            const [chkTodayCount] = await sql_con.promise().query(chkTodayCountQuery, [today]);

            if (chkTodayCount.length == 0) {
                const insertTodayCountQuery = "INSERT INTO today_count (date, fake_count, real_count) VALUES (?,?,?)";
                await sql_con.promise().query(insertTodayCountQuery, [today, random, 1]);
            } else {
                const updateTodayCountQuery = "UPDATE today_count SET fake_count = ?, real_count = ? WHERE date = ?";
                await sql_con.promise().query(updateTodayCountQuery, [chkTodayCount[0]['fake_count'] + random, chkTodayCount[0]['real_count'] + 1, today]);
            }
        } catch (err) {
            console.error(err.message);
        }

        // 작업 후에는 쿠키 설정 해주기!
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0); // 자정 = 오늘 24:00:00.000
        cookies.set('visit', 'true', {
            expires: midnight,
            httpOnly: true,
            secure: true,
            path: '/',
        });
    } else {

        // 쿠키 설정 되어 있으면 fake_count 만 업데이트!!
        try {
            const chkTodayCountQuery = "SELECT * FROM today_count WHERE date = ?"
            const [chkTodayCount] = await sql_con.promise().query(chkTodayCountQuery, [today]);

            if (chkTodayCount.length > 0) {
                const updateTodayCountQuery = "UPDATE today_count SET fake_count = ? WHERE date = ?";
                await sql_con.promise().query(updateTodayCountQuery, [chkTodayCount[0]['fake_count'] + random, today]);
            }

        } catch (err) {
            console.error(err.message);
        }

    }

    return {
        // 이건 회원 정보 넘겨주기!!
        user: locals.userInfo
    }
}