import * as api from './api.js';

const host = 'https://parseapi.back4app.com';
api.settings.host = host;

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

//Application specific requests

//get all Recipes
export async function getRecipes(page) {

    return await api.get(host + `/classes/Recipe?offset=${(page - 1) * 3}&pageSize=3`);
}

//get my Recipes 
export async function getMyRecipes(userId) {
    return await api.get(host + `/classes/Recipe?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`);
}

//surch
export async function search(query) {
    if (query) {
        return await api.get(host + `/classes/Recipe?where=` + encodeURIComponent(`name LIKE "${query}"`));
    } 
}

//get collectionCount
export async function collectionCount() {
    return await api.get(host + '/classes/Recipe?count');
}

//get Recipes by id - Details
export async function getRecipeById(id) {
    return await api.get(host + '/classes/Recipe/' + id + '?include=owner');
}

function createPointer(name, userId) {
    return {  __type: 'Pointer',
    className: name,
    objectId: userId
    }
}

function addOwner(object){
    const userId = sessionStorage.getItem('userId');
    const result = Object.assign({}, object);
    result.owner = createPointer('_User', userId);
    return result;
} 

//create Recipe
export async function createRecipe(recipe) {
    const body = addOwner(recipe);
    return await api.post(host + '/classes/Recipe', body);
}

//edit Recipe by id
export async function updateRecipe(id, recipe) {
    return await api.put(host + '/classes/Recipe/' + id, recipe);
}

//delete Recipe by id
export async function deleteRecipe(recipeId) {
    return await api.del(host + '/classes/Recipe/' + recipeId);
}


//load all comments for Recipes
export async function getAllCommentsByRecipe(recipeId) {
    return await api.get(host + `/classes/Recipe/comments?where=furnitureId%3D%22${recipeId}%22`);
}

export async function createNewComment(comment) {
    return await api.post(host + '/classes/Recipe/comments', comment);
}

//add a like 
export async function addLike(recipeId) {
    return await api.post(host + '/classes/Recipe/likes', {recipeId});
}

//total likes count for a Recipe
export async function getAllLikes(recipeId) {
    return await api.get(host + `/classes/Recipe/likes?where=furnitureId%3D%22${recipeId}%22&distinct=_ownerId&count`);
}

//get like for an Recipe from a specific user
export async function getLikeForRecipeFromSpecUser(recipeId, userId) {
    return await api.get(host + `/classes/Recipe/likes?where=furnitureId%3D%22${recipeId}%22%20and%20_ownerId%3D%22${userId}%22&count`);
}