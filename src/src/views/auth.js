//import { html } from '../../node_modules/lit-html/lit-html.js';

import { html } from './lib.js';

import { login, register } from '../api/data.js';

const loginTemplate = (onSubmit, errorMsg, isInvalidUsername, isInvalidEmail, isInvalidPass) => html`
 <div class="container">
    <div class="row space-top">
        <div class="col-md-12">
            <h1>Влезте в профила си</h1>
            <p>Моля попълнете всики полета.</p>
        </div>
    </div>
    <form @submit=${onSubmit} id="login">
        <div class="row space-top">
            <div class="col-md-4">

                ${errorMsg
                ? html `<div class="form-group">
                    <p>${errorMsg}</p>
                </div>`
                : ''
                }

                <div class="form-group">
                    <label class="form-control-label" for="email">Потребителско име</label>
                    <input class=${'form-control' + (isInvalidUsername ? ' is-invalid' : '')} id="username" type="text" placeholder="username..."name="username">
                </div>
                <div class="form-group">
                        <label class="form-control-label" for="email">Имейл</label>
                        <input class=${'form-control' + (isInvalidEmail ? ' is-invalid' : '')} id="email" type="email"  placeholder="user@abv.bg" name="email">
                </div>
                <div class="form-group">
                    <label class="form-control-label" for="password">Парола</label>
                    <input class=${'form-control' + (isInvalidPass ? ' is-invalid' : '')} id="password" type="password" placeholder="********" name="password">
                </div>
                <input type="submit" class="btn btn-primary" value="Влезте в профила си" />
            </div>
        </div>
    </form>
</div>`;

export async function loginPage(ctx) {
    ctx.render(loginTemplate(onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username').trim();
        const username = formData.get('email').trim();
        const password = formData.get('password').trim();

        if ( username=='' || username==''  || password=='') {
            return ctx.render(loginTemplate(onSubmit, 'Необходимо е попълването на всички полета!', username=='', username=='', password==''))
        }

        await login(username, username, password);
        event.target.reset();
        ctx.setUserNav();
        ctx.page.redirect('/');
    }
}

const registerTemplate = (onSubmit, errorMsg, isInvalidUsername, isInvalidEmail, isInvalidPass, isInvalidRePass) => html`
 <div class="container">
        <div class="row space-top">
            <div class="col-md-12">
                <h1>Регистрирайте се</h1>
                <p>Моля попълнете всики полета.</p>
            </div>
        </div>
        <form @submit=${onSubmit} id="register">
            <div class="row space-top">
                <div class="col-md-4">

                    ${errorMsg
                    ? html`<div class="form-group">
                        <p>${errorMsg}</p>
                    </div>`
                    : ''
                    }

                    <div class="form-group">
                    <label class="form-control-label" for="email">Потребителско име</label>
                    <input class=${'form-control' + (isInvalidUsername ? ' is-invalid' : '')} id="username" type="text" placeholder="username..."name="username">
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="email">Имейл</label>
                        <input class=${'form-control' + (isInvalidEmail ? ' is-invalid' : '')} id="email" type="email"  placeholder="user@abv.bg" name="email">
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="password">Парола</label>
                        <input class=${'form-control' + (isInvalidPass ? ' is-invalid' : '')} id="password" type="password" placeholder="********" name="password" placeholder="Password must be al least 4 symbols .......">
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="rePass">Повторете паролата</label>
                        <input class=${'form-control' + (isInvalidRePass ? ' is-invalid' : '')} id="rePass" type="password" placeholder="********" name="rePass">
                    </div>
                    <input type="submit" class="btn btn-primary" value="Регистрирайте" />
                </div>
            </div>
        </form>
    </div>`;

export async function registerPage(ctx) {
    ctx.render(registerTemplate(onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username').trim();
        const email = formData.get('email').trim();
        const password = formData.get('password').trim();
        const repeatPass = formData.get('rePass').trim();

        if (username=='' ||email=='' || password=='' || repeatPass=='') {
            return ctx.render(registerTemplate(onSubmit, 'Необходимо е попълването на всички полета!',username=='', email=='', password=='', repeatPass==''))

        }

        if (password.length < 4) {
            return ctx.render(registerTemplate(onSubmit, 'Паролата трабва да е поне 4 символа', false, false, true, false))
        }
        
        if (password !== repeatPass) {
            return ctx.render(registerTemplate(onSubmit, 'Паролите не съвпадат', false, false, true, true))

        }

        await register(username, email, password);
        event.target.reset();
        ctx.setUserNav();
        ctx.page.redirect('/');
    }
}