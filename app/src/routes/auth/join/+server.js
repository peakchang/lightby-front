import { sql_con } from "$lib/server/db";
import { json } from '@sveltejs/kit';
import { getQueryStr } from "$lib/server/lib";
import bcrypt from 'bcrypt';

export async function POST({ request, cookies }) {
    console.log('들어옴?!?!?!');
    console.log(request);
    const body = await request.json();
    console.log(body);

    const saltRounds = 10; // 솔트 라운드 수 (높을수록 보안은 좋지만 속도가 느려짐)
    body.password = await bcrypt.hash(body.password, saltRounds);
    const queryStr = getQueryStr(body, 'insert');
    console.log(queryStr);

    


    try {
        const testQuery = `INSERT INTO users (${queryStr.str}) VALUES (${queryStr.question})`;
        const [testData] = await sql_con.promise().query(testQuery, queryStr.values);
    } catch (error) {
        console.error(error.message);
    }

    return json({ testData: 'testData', gogoData: 'gogoData' })
}
