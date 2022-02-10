//import { html } from '../../node_modules/lit-html/lit-html.js';

import { html } from '../lib.js';
import { search } from '../api/data.js';

const allRecipesTemplate = (recipe) => html `
<div class="col-md-4">
    <div class="card text-white bg-primary">
        <div class="card-body">
                <img src=${recipe.img}>
                <p>${recipe.ingredients}</p>
                <footer>
                    <p>Price: <span>${furniture.steps}</span></p>
                </footer>
                <div>
                    <a href="/details/${recipe._id}" class="btn btn-info">Детайли</a>
                </div>
        </div>
    </div>
</div>`;
    

const catalogTemplate = (name, recipes, onSurch) => html `
        
        <div class="search">
                    <input id="search-input" class="form-control" type="text" placeholder="Въведете критерий за търсене" name="surch" .value=${name || ''}>
                    <button id="search-button" class="btn btn-primary" @click=${onSurch} >Търси</button> 
        </div>
            <h2 class="no-articles">Резултати:</h2>

            ${recipes.length ===0 
				    //<!-- Display paragraph: If there is no games  -->
				? html`<h3 class="no-articles">Все още няма намерени резултати</h3>`
                    //<!-- Display div: with information about every game (if any) -->
                : recipes.map(r => allRecipesTemplate(r))}

        `;

export async function searchPage(ctx) {

    const name = ctx.querystring.split('=')[1];
    let recipes =  [];   

    if (name) {
        recipes = await search(name);
    } 

    ctx.render(catalogTemplate(name, recipes, onSearch));

    function onSearch() {

        const query = document.getElementById('search-input').value;

        if (query) {
            ctx.page.redirect('/search?query=' + query);
        } else {
            alert('Търсения параметър не може да е празен символ')
        }
    }
}