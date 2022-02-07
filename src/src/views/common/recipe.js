import { html } from '../../../node_modules/lit-html/lit-html.js';

export const recipeTemplate = (recipe) => html`
<a class="card" href=${`/details/${recipe._id}`} >
    <article class="recent">
        <div class="recent-preview"><img src=${recipe.img}>
        <label class="form-control-label">Кратко описание:</label>
        <p>${recipe.sumary}</p>
        </div>

        <div class="recent-title">${recipe.name}</div>
    </article>
</a>`;