//import { html } from '../../node_modules/lit-html/lit-html.js';
import { html } from './lib.js';
import { collectionCount, getRecipes } from '../api/data.js';
import { recipeTemplate } from './common/recipe.js';

const dashboardTemplate = (recipes, page, pagesCount) => html`
 <section id="home" class="container">
 <div id="welcomeMessage" class="hero">
                <h1>Добре дошли в моята готварска книга, 
                    изберете рецепта от каталога и се насладете...</h1>
                <p>Здравейте приятели, направих тази книга за да разменяме, споделяме и коментираме любими рецепти. 
                    Ще се радвам ако ви харесва и я използвате с желание и с нейна помощ творите за себе си и семейството здравословни вкусотийки.
                </p>
</div>

<h3>Последно добавени рецепти:<h3>
<div class="pagination">
            Стр. ${page}/${pagesCount}

            ${page > 1 ? html `<a href="/?page=${page -1}" class="btn-primary">&lt; Предишна</a>` : ''}
            ${page < pagesCount ? html `<a href="/?page=${page +1}" class="btn-primary">&gt; Следваща</a>` : ''}
        </div>
</header>
    <div class="recent-recipes">

        ${recipes.length ===0 
        ? html`<p>Все още няма рецепти</p>`
        : recipes.map(r=>recipeTemplate(r))
        }
    </div>
    <footer id="footer">
        <p>Разгледайте всички рецепти <a id="catalogLink" href="/" class="active">Каталог</a></p>
    </footer>
</section>`;

export async function dashboardPage(ctx) {
    const page = Number(ctx.querystring.split('=')[1]) || 1;
    const recipesCount = await collectionCount();
    const pagesCount = Math.ceil(recipesCount/3);

    const recipes = await getRecipes(page);
    ctx.render(dashboardTemplate(recipes, page, pagesCount));
}