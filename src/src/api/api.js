
export const settings = {//data.js will set the host
    host:''
};

async function request(url, options) {

    try {
        //send request with appropriate method, heders and body (if any)
        const response = await fetch(url, options);

        //handle errors (response.ok is for errors from server - comming response)
        if (response.ok == false) {
            const error = await response.json();
            throw new Error(error.message);
        }

        //return result
        try {
            //parse response (if needed)
            const data = await response.json();
            return data;
        } catch (err) {// here handle response (trycatch is if response is not JSON)
           return response; 
        }

    } catch (err) {
        alert(err.message);
        throw err;//хвърляме я нагоре за да могат модулите извикали функцията да разберат за грешката и да спрат работата си! 
    }
}


//function that creates heders base on application state (autorized (with token) or no request (without token)) and body
function createOptions(method='get', body) {//ако няма подаден метод той винаги ще е 'get' 
    const options = {
        method,
        headers: {
         'X-Parse-Application-Id':'qeCjmTrUNQJQsnKTgpShLiYSTWWHtCw68bxlzekA',
         'X-Parse-REST-API-Key' : 'qhpjMtZdZIj2nVecN8HL3LNJ8ltmF3YQjHi3BNe5' 
        }
    };
    const token = sessionStorage.getItem('authToken');
    if (token) {
        options.headers['X-Parse-Session-Token'] = token;//server response with this name:accessToken
    }
    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    return options;
}

// decorator functions for all REST methods(CRUD actions, but REST methods)

export async function get(url) {
    return await request(url, createOptions());
}
export async function post(url, data) {
    return await request(url, createOptions('post', data));
}
export async function put(url, data) {
    return await request(url, createOptions('put', data));
}
export async function del(url) {
    return await request(url, createOptions('delete'));
}

//authentication functions (login, register, logout)
export async function login(username, password) {
    const result = await post(settings.host + '/login', {username, password});
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('authToken', result.accessToken);
    sessionStorage.setItem('userId', result._id);
    return result;//if someone upstears of chain need the result
}
export async function register(email, username, password) {
    const result = await post(settings.host + '/users', {username, email, password});
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('authToken', result.accessToken);
    sessionStorage.setItem('userId', result._id);
    return result;
}
export function logout() {
    const result = post(settings.host + '/logout', {});
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId', result._id);
    return result;
}
