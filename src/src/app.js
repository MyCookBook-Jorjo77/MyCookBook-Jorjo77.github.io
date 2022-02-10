
import { render, page } from './lib.js';

import {logout as apiLogout } from './api/data.js';
//import * as api from './api/data.js';
import { getUserData } from './utility.js';
import { loginPage, registerPage } from './views/auth.js';
import { createPage } from './views/create.js';
import { dashboardPage } from './views/dashboard.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
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

