 import { html } from '../../node_modules/lit-html/lit-html.js';

import { getMyRecipes } from '../api/data.js';
import { recipeTemplate } from './common/recipe.js';


const profileTemplate = (recipes) => html `
<!-- Profile Page ( Only for logged users ) -->
<div class="container">
        <div class="row space-top">
            <div class="col-md-12">
                <h1>Моите рецепти</h1>
                <p>Това са вашите рецепти:</p>
            </div>
        </div>
        <div class="row space-top">
        ${recipes.length === 0
        //<!-- Display : If user doesn't have own furnitures --> 
        ? html `<p>Все още нямате добавени рецепти.</p>`
        //<!-- Display : All created furnitures by this user (If any) --> 
        : recipes.map(recipeTemplate)}
        </div>`

export async function profilePage(ctx) {
    const user = ctx.user;
    const recipes = await getMyRecipes(user._id);

    ctx.render(profileTemplate(recipes));
}
