import moment from "moment-timezone";
moment.tz.setDefault("Asia/Seoul");

export const getQueryStr = (data, type, addTimeStr = '') => {
    let returnData = {
        str: '',
        question: '',
        values: []
    }
    if (type == 'insert') {

        for (const key in data) {
            returnData['str'] = returnData['str'] + `${key},`
            returnData['question'] = returnData['question'] + `?,`
            returnData['values'].push(data[key])
        }

        if (addTimeStr) {
            const now = moment().format('YYYY-MM-DD HH:mm:ss')

            console.log(returnData['str']);
            returnData['str'] = returnData['str'] + addTimeStr;
            console.log(returnData['str']);
            returnData['question'] = returnData['question'] + '?';
            returnData['values'].push(now)
        } else {
            returnData['str'] = returnData['str'].replace(/,$/, '');
            returnData['question'] = returnData['question'].replace(/,$/, '');
        }

    } else if (type == 'update') {
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        for (const key in data) {
            returnData['str'] = returnData['str'] + `${key}=?,`
            returnData['values'].push(data[key])
        }

        if (addTimeStr) {
            returnData['str'] = returnData['str'] + `${addTimeStr} = ?`;
            returnData['values'].push(now)
        } else {
            returnData['str'] = returnData['str'].replace(/,$/, '');
        }

    }

    return returnData;
}


export async function fetchRequest(method, url, data = {}, headers = {}) {
    const returnObj = { status: true };

    try {
        const isGet = method.toUpperCase() === 'GET';

        const options = {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        if (!isGet) {
            options.body = JSON.stringify(data);
        }

        const res = await fetch(url, options);

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || '서버 오류');
        }

        const result = await res.json();
        returnObj.data = result;
        return returnObj;

    } catch (err) {
        console.error(`Fetch ${method.toUpperCase()} Error:`, err);
        returnObj.status = false;
        returnObj.message = err.message || '서버와의 통신에 실패했습니다.';
        return returnObj;
    }
}

// status / message / data
