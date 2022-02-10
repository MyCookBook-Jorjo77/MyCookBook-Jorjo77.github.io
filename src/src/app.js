/*
create universal request module (api.js) - UNIVERSAL(reusable) - make abstraction of http requests
create application-specific requests - specific (data.js)
setup routing using (page)
create context decorator middleware (utility functions)

decorator middleware - има 3 роли:
 1. да вземе рендера (който е функция приемаща 2 параметъра - съдържанието и каде да го изобрази),
 2. да го прекара през паршъл апликейшън и в контекста да сложим функция, която приема само един параметър, 
който е съдържанието, тъй като мястото в което трябва да го отпечатим винаги е едно и също
(правим си тук декорирана функция рендер, така че тя да си носи със себе си мястото кадето ще отпечатва).
3. Да закача юзър записа от нашия сторидж.
implement views
*/

// import { render } from '../node_modules/lit-html/lit-html.js';
// import page from '../node_modules/page/page.mjs';

import { render, page } from './lib.js';

import {logout as apiLogout } from './api/data.js';
//import * as api from './api/data.js';
import { getUserData } from './utility.js';
import { loginPage, registerPage } from './views/auth.js';
import { createPage } from './views/create.js';
import { dashboardPage } from './views/dashboard.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { notify } from './views/notify.js';
import { profilePage } from './views/profile.js';
import { searchPage } from './views/search.js';


//window.api = api;//това закачане на api за прозореца ни дава възможността да си тестваме как работи в браузъра!

const main = document.getElementById('main-content');

document.getElementById('logoutBtn').addEventListener('click', logout);

setUserNav();//за да виждаме правилния хедър!

//така както използваме page само тук, за по-малко от 10 мин. можем да сменим page библиотеката при нужда
page('/', decorateContext, dashboardPage);
page('/login', decorateContext, loginPage);
page('/register', decorateContext, registerPage);
page('/details/:id', decorateContext, detailsPage);
page('/create', decorateContext, createPage);
page('/edit/:id', decorateContext, editPage);
page('/my-recipes', decorateContext, profilePage);
page('/search', decorateContext, searchPage);


page.start();

function decorateContext(ctx, next) {//за да стигне този декориран контекст при модулите, които ще имат нужда от него, трвбва да го вкараме в page м/у адреса и хендлъра (по средата - затова се казва midleware)
    ctx.render = (content) => render(content, main);
    ctx.setUserNav = setUserNav;//вкарваме го в контекста за да могат другите модули да го използват!
    ctx.user = getUserData();
    next();
}

function setUserNav() {
    const user = getUserData();
    if (user) {
        document.getElementById('user').style.display = '';
        document.getElementById('user-greeting').textContent = `Добре дошъл ${user.username}`;
        document.getElementById('guest').style.display = 'none';
        page.redirect('/');
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = '';
        page.redirect('/');
    }
}

function logout() {
    apiLogout();
    setUserNav();
    page.redirect('/');
}

