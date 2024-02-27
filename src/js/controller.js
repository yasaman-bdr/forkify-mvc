import * as model from './model.js'
import recipeView from './views/recipeView.js';
import {MODAL_CLOSE_SEC} from './config'
import SearchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { HMREventHandler } from './HotModuleReloadSetup.js';


if (import.meta.hot) {
  import.meta.hot.accept(HMREventHandler)
}


const recipeContainer = document.querySelector('.recipe');


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////



const controlRecipes = async function() {
  try{

    const id = window.location.hash.slice(1)
    

    if(!id) return;

    recipeView.renderSpiner()

    // 0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())

    //1) updating bookmarks view
    bookmarksView.update(model.state.bookmarks)
   
    //2)load the recipe

    await model.loadRecipe(id)    
  
    //3)rendering the recipe
    recipeView.render(model.state.recipe)
    
  }catch (err) {
    recipeView.renderError(`${err}💥💥💥`)
    console.log(error)
  }

}

const controlSearchResults = async function (){
  try{
    resultsView.renderSpiner();
     

    //1) get search query
    const query = SearchView.getQuery()
    if(!query) return;

    //2)load search results
    await model.loadSearchResults(query)

    //3)render results
    resultsView.render(model.getSearchResultsPage())

    //4) render initial pagination buttons 
    paginationView.render(model.state.search)
  }catch(err){
    console.log(err)
  }
}

const controlPagination = function(goToPage){
  //1)render new results
  resultsView.render(model.getSearchResultsPage(goToPage))

  //2) render new pagination buttons 
  paginationView.render(model.state.search)
}

const controlServings = function(newServings){
  //update the recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe view
  recipeView.render(model.state.recipe)
}

const controlAddBookmark = function () {
  // 1)add/remove bookmark
 if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
 else model.deleteBookmark(model.state.recipe.id)

 // 2)update recipe view
 recipeView.update(model.state.recipe)

 // 3)render bookmarks
 bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try{
    //Show loading spinner
    addRecipeView.renderSpiner()

    //upload the new recipe data
    await model.uploadRecipe(newRecipe)

    // Render recipe
    recipeView.render(model.state.recipe)

    //Success message
    addRecipeView.renderMessage()

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks)

    //Change ID in URL
    window.history.pushState(null , '' , `#${model.state.recipe.id}`)

    //close form window
    setTimeout(function() {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);
  }catch(err){
    console.error("💥" , err)
    addRecipeView.renderError(err.message)
  }  
}

const init = function (){
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  SearchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()