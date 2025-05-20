import { sql_con } from "$lib/server/db";
import { json } from '@sveltejs/kit';
import { getQueryStr } from "$lib/server/lib";

export async function POST({ request, cookies }) {
    console.log('아이디 중복 들어옴?!?!?!');
    const body = await request.json();
    console.log(body);
    let status = true;

    try {
        const idCheckQuery = `SELECT * FROM users WHERE ${body.type} = ?`;
        const [idCheckRows] = await sql_con.promise().query(idCheckQuery, [body.value]);
        if (idCheckRows.length > 0) {
            status = false;
        }

    } catch (error) {

    }

    return json({ status })
}
