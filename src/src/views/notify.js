import { html, render } from '../../node_modules/lit-html/lit-html.js';

const notifyTemplate = (message, clear) => html`
<section id="notification" @click=${clear}>
    ${message}
    <span style="margin-left: 32px;">\u2716</span>
</section>`;

const container = document.getElementById('notify-conteiner');

export function notify(message) {

    render(notifyTemplate(message, clear), container);
    //setTimeout(clear(), 5000);

     function clear() {
        render('', container);
    }
}

