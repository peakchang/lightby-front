import { sql_con } from "$lib/server/db";
import { json } from '@sveltejs/kit';
import { getQueryStr } from "$lib/server/lib";

export async function POST({ request, cookies }) {
    const body = await request.json();
    
    try {
        const idCheckQuery = `SELECT * FROM users WHERE ${body.type} = ?`;
        const [idCheckRows] = await sql_con.promise().query(idCheckQuery, [body.value]);
        console.log(idCheckRows);

        if (idCheckRows.length > 0) {
            return json({ message: '중복된 값이 있습니다.' }, { status: 400 })
        }

    } catch (error) {

    }

    return json({})
}
