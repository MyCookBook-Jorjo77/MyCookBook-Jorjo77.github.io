import {clearUserData, getUserData, setUserData} from '../utility.js';

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
        headers: {}
    };
    const user = getUserData();
    if (user) {
        options.headers['X-Authorization'] = user.accessToken;//server response with this name:accessToken
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
export async function login(email, password) {
    const result = await post(settings.host + '/users/login', {email, password});
    setUserData(result);//save user into sessionStorage!
    return result;//if someone upstears of chain need the result
}
export async function register(email, password) {
    const result = await post(settings.host + '/users/register', {email, password});
    setUserData(result);
    return result;
}
export function logout() {
    const result = get(settings.host + '/users/logout');
    clearUserData();
    return result;
}
