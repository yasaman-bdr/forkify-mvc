import { API_URL , RES_PER_PAGE } from "./config"
import { getJSON } from './helper'

export const state = {
    recipe: {},
    search: {
      query:'',
      page: 1,
      results:[],
      resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: []
}


export const loadRecipe = async function (id) {
    try{

      const data = await getJSON(`${API_URL}${id}`)
        console.log('DATA',data)
      const {recipe} = data.data
  
      state.recipe = {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
      }

      if (state.bookmarks.some( bookmark => bookmark.id === id))
        state.recipe.bookmarked = true;
      else
      state.recipe.bookmarked = false;  

    }catch(err){
        console.error(`${err}💥💥💥`)
        throw(err)
    }
}

export const loadSearchResults = async function (query) {
  try{
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`)
   

    state.search.results = data.data.recipes.map(rec =>{
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      }
    })
    state.search.page = 1

    console.log(state.search.results)
  }catch(err){
    console.error(`${err}💥💥💥`)
    throw(err)
  }
}

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page

  const start = (page - 1) * state.search.resultsPerPage 
  const end = page * state.search.resultsPerPage

  return state.search.results.slice(start , end)
}

export const updateServings = function(newServings){
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings
    //newQuantity = oldQuantity * newServings / oldServings
  });

  state.recipe.servings = newServings
}

const persistBookmarks = function (){
  localStorage.setItem('bookmarks' , JSON.stringify(state.bookmarks))
}

export const addBookmark = function(recipe) {
  //add bookmark
  state.bookmarks.push(recipe)

  //mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true

  persistBookmarks()
};

export const deleteBookmark = function(id){
  //delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id)
  state.bookmarks.splice(index , 1)

  //mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks()
};

const init = function (){
  const storage = localStorage.getItem('bookmarks')
  if (storage) state.bookmarks = JSON.parse(storage)
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks')
}

// clearBookmarks();