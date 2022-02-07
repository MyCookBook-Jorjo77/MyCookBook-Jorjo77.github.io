import { html } from '../../node_modules/lit-html/lit-html.js';

import { getRecipeById, updateRecipe } from '../api/data.js';

const editTemplate = (recipe, onSubmit, msg, invalidName, invalidSumary, invalidIngr, invalidSteps, invalidImg) => html`
<div class="container">
    <div class="row space-top">
        <div class="col-md-12">
            <h1>Променете рецептата</h1>
            <p>Моля, попълнете всички полета</p>
        </div>
    </div>

    <form @submit=${onSubmit}>
            <div>${msg}</div>
            <div class="row space-top">

                <div class="col-md-4">
                    <div class="form-group">
                        <label class="form-control-label">Наименование:</label>
                        <input class=${'form-control' + (invalidName ? ' is-invalid' : '' )} type="text"
                            name="name" placeholder="Символите трябва да бъдат поне 3......." .value=${recipe.name}>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label">Кратко описание:</label>
                        <input class=${'form-control' + (invalidSumary ? ' is-invalid' : '' )} type="text"
                            name="sumary" placeholder="Символите трябва да бъдат поне 3......." .value=${recipe.sumary}>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label">Съставки:</label>
                        <textarea class=${'form-control' + (invalidIngr ? ' is-invalid' : '' )} type="text"
                            name="ingredients" placeholder="Добавете всяка съставка на нов ред (съставките трябва да са поне 2)" .value=${recipe.ingredients.join('\n')}></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label">Стъпки на приготвяние:</label>
                        <textarea class=${'form-control' + (invalidSteps ? ' is-invalid' : '' )} 
                            type="text" name="steps" placeholder="Добавете всяка стъпка на нов ред (стъпките трябва да са поне 2)" .value=${recipe.steps.join('\n')}></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label">Снимка (можете да вземете линк от "изображения" при Гугъл търсене - "Copy image address" и да го поставите в полето):</label>
                        <input class=${'form-control' + (invalidImg ? ' is-invalid' : '' )} id="new-image" type="text"
                            name="img" placeholder="линк на снимката" .value=${recipe.name}>
                    </div>

                    <input type="submit" class="btn btn-primary" value="Промени" />
                </div>
            </div>
        </form>
</div>`;

export async function editPage(ctx) {

    const receipeId = ctx.params.id;
    const receipe = await getRecipeById(receipeId);
    ctx.render(editTemplate(receipe, onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const editedRecipe = {
            name: formData.get('name').trim(),
            sumary: formData.get('sumary').trim(),
            ingredients: formData.get('ingredients').split('\n').map(l => l.trim()).filter(l => l != ''),
            steps: formData.get('steps').split('\n').map(l => l.trim()).filter(l => l != ''),
            img: formData.get('img').trim(),
        };

        const name = editedRecipe.name;
        const sumary = editedRecipe.sumary;
        const ingredients = editedRecipe.ingredients;
        const steps = editedRecipe.steps;
        const img = editedRecipe.img;

            if (name == '' ||
            sumary == '' ||
            ingredients == '' ||
            steps == '' ||
            img == '' ) {
                return ctx.render(editTemplate(onSubmit,
                    'Всички полета са задължителни',
                    name == '',
                    sumary == '',
                    ingredients == '',
                    steps == '',
                    img == '',))
    
            }
    
            if (name.length < 3 && sumary.length < 3) {
    
                return ctx.render(editTemplate(onSubmit,
                    'Символите трябва да са поне 3',
                    true,
                    true,
                    false,
                    false,
                    false))
    
            }
    
            if (name.length < 3 ) {
    
                return ctx.render(editTemplate(onSubmit,
                    'Символите трябва да са поне 3',
                    true,
                    false,
                    false,
                    false,
                    false))
    
            }
    
            if (sumary.length < 3 ) {
    
                return ctx.render(editTemplate(onSubmit,
                    'Символите трябва да са поне 3',
                    false,
                    true,
                    false,
                    false,
                    false))
    
            }
    
            if (ingredients.length < 2 && steps.length < 2) {
                return ctx.render(editTemplate(onSubmit,
                    'Съставките и стъпките трябва да са поне 2',
                    false,
                    false,
                    true,
                    true,
                    false,))
            }
    
            if (ingredients.length < 2 ) {
                return ctx.render(editTemplate(onSubmit,
                    'Съставките трябва да са поне 2',
                    false,
                    false,
                    true,
                    false,
                    false,))
            }
    
            if (steps.length < 2 ) {
                return ctx.render(editTemplate(onSubmit,
                    'Стъпките трябва да са поне 2',
                    false,
                    false,
                    false,
                    true,
                    false,))
            }
    
            if (!img) {
                return ctx.render(editTemplate(onSubmit,
                    'Снимката е задължителна',
                    false,
                    false,
                    false,
                    false,
                    true))
            }

        await updateRecipe(receipeId, editedRecipe);
        event.target.reset();
        ctx.page.redirect('/details/' + receipeId);

    }
}