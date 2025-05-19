// ✅ 공통 에러 처리 함수
function handleError(err) {
    console.error(err);
    return {
        status: false,
        message: err?.message || "서버와의 통신에 실패했습니다. 다시 시도해주세요."
    };
}

// ✅ 공통 fetch 옵션 구성
function buildOptions(method, data = {}, headers = {}, useAuth = false) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(useAuth ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` } : {}),
        ...headers
    };

    const options = {
        method,
        headers: defaultHeaders
    };

    if (method !== 'GET' && method !== 'DELETE') {
        options.body = JSON.stringify(data);
    }

    return options;
}

// ✅ 공통 fetch 호출
async function request(url, method = 'GET', data = {}, headers = {}, useAuth = false) {
    const returnObj = { status: true };
    try {
        const res = await fetch(url, buildOptions(method, data, headers, useAuth));
        const json = await res.json();

        if (!res.ok) {
            return {
                status: false,
                message: json?.message || `요청 실패 (status: ${res.status})`
            };
        }

        returnObj.data = json;
        return returnObj;
    } catch (err) {
        return handleError(err);
    }
}


export const fetchPost = (url, data = {}, headers = {}, useAuth = false) =>
    request(url, 'POST', data, headers, useAuth);

export const fetchGet = (url, headers = {}, useAuth = false) =>
    request(url, 'GET', {}, headers, useAuth);

export const fetchPut = (url, data = {}, headers = {}, useAuth = false) =>
    request(url, 'PUT', data, headers, useAuth);

export const fetchDelete = (url, headers = {}, useAuth = false) =>
    request(url, 'DELETE', {}, headers, useAuth);