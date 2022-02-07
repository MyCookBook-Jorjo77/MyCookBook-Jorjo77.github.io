import { html, render } from '../../node_modules/lit-html/lit-html.js';

import { addLike, createNewComment, deleteRecipe, getAllCommentsByRecipe, getAllLikes, getRecipeById, getLikeForRecipeFromSpecUser } from '../api/data.js';

const modalTemplate = (msg, onChoice) => html `
<div id="modal">
    <p>${msg}</p>
    <button @click=${() => onChoice(true)}>OK</button>
    <button @click=${() => onChoice(false)}>Cancel</button>
</div>`;

const overlay = document.createElement('div');
overlay.id = 'overlay';

export function createModal(msg, callback) {
    render(modalTemplate(msg, onChoice), overlay);
    document.body.appendChild(overlay);

    function onChoice(choice) {
        clearModal();
        callback(choice);
    }
}

function clearModal() {
    overlay.remove();
} 


const comentTemplate = (comment) => html `
<li class="comment">
    <p>${comment}</p>
</li>`

const detailsTemplate = (recipe, isOwner , onDelete, comments, isLogedIn, onSubmit, onLike, liked, totalLikes) => html `
    <div class="container">
        <div class="row space-top">
            <div class="col-md-12">
                <h1>Съставки и начин на приготвяне</h1>
            </div>
        </div>
        <div class="row space-top">
            <div class="col-md-4">
                <div class="card text-white bg-primary">
                    <div class="card-body">
                        <img src=${recipe.img} />
                    </div>
                </div>
            </div>
            <div class="col-md-4">
            <form>
            <div class="row space-top">
                <div class="col-md-4">
                    <div class="form-group">
                        <label class="form-control-label">Наименование:</label>
                        <p>${recipe.name}</p>
                    </div>
                    <div class="form-group">
                        <div>
                        <label class="form-control-label">Съставки:</label>                     
                        <ul>
                            ${recipe.ingredients.map(i => html`<li>${i}</li>`)}
                        </ul>
                        </div>
                    <div>
                    <label class="form-control-label">Приготовление:</label>                      
                            ${recipe.steps.map(s => html`<p>${s}</p>`)}
                    </div>
                    </div>
                </div>
            </div>
        </form>

            ${!isOwner&&isLogedIn&&liked===0
            ? html `<a @click=${onLike} class="btn btn-info" href="javascript:void(0)">Харесай</a>
            <p class="likes">Харесвания: ${totalLikes}</p>`
            : html `<p class="likes">Харесвания: ${totalLikes}</p>`
            }
            
                    <!-- Edit/Delete buttons ( Only for creator of this game )  -->
            ${isOwner
            ? html`<!-- Buttons Edit/Delete should be displayed only for creator of this meme  -->
                <div>
                    <a href="/edit/${recipe._id}" class="btn btn-info">Промени</a>
                    <a @click=${onDelete} href="javascript:void(0)" class="btn btn-red">Изтрий</a>
                </div>`
            :''}
            </div>

        </div>

                <!-- Bonus ( for Guests and Users ) -->
                <div class="details-comments">
                    <h2>Комрнтари:</h2>
                    <ul>
                    ${comments.length === 0
                    ? html `<!-- Display paragraph: If there are no games in the database -->
                    <p class="no-comment">Все още няма коментари.</p>`
                    : comments.map(c => comentTemplate(c.comment))
                    }
                    </ul>
                </div>

            <!-- Bonus -->
            <!-- Add Comment ( Only for logged-in users, which is not creators of the current game ) -->

            ${isLogedIn && isOwner == false
            ? html `            
            <article class="create-comment">
                <label class="form-control-label">Добавете коментар:</label>
                <form @submit=${onSubmit} class="form">
                    <textarea class="form-control" name="comment" placeholder="Коментар......"></textarea>
                    <input class="btn btn-primary" type="submit" value="Добавете коментар">
                </form>
            </article>`
            :''
            }  
            
        </section>`;

export async function detailsPage(ctx) {
    let liked = 0;
    let totalLikes = 0;
    const receipeId = ctx.params.id;
    const userId = ctx.user._id;
    totalLikes = await getAllLikes(receipeId);
    liked = await getLikeForRecipeFromSpecUser(receipeId, userId); 
    const recipe = await getRecipeById(receipeId);
    const isOwner = ctx.user && recipe._ownerId == ctx.user._id;
    const isLogedIn = ctx.user;
    const comments = await getAllCommentsByRecipe(receipeId);
    ctx.render(detailsTemplate(recipe, isOwner , onDelete, comments, isLogedIn, onSubmit, onLike, liked, totalLikes));

    async function onDelete() {

        createModal('Сигурен ли сте?', onChoise)

        async function onChoise(confirmed) {

            if (confirmed) {
                await deleteRecipe(receipeId);
                ctx.page.redirect('/');
            }
        }

    }

    async function onLike() {

        await addLike(receipeId);
        totalLikes = await getAllLikes(receipeId);
        liked = await getLikeForRecipeFromSpecUser(receipeId, userId); 
        ctx.render(detailsTemplate(recipe, isOwner , onDelete, comments, isLogedIn, onSubmit, onLike, liked, totalLikes));
    }

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const commentObj = {
            receipeId:ctx.params.id,
            comment:formData.get('comment').trim()
        }
        await createNewComment(commentObj);
        ctx.page.redirect(`/details/${receipeId}`);
        event.target.reset();
    }
}
