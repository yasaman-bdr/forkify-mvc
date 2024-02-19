import view from './view'
import previewView from './previewView';

class bookmarksView extends view{
    _parentElement = document.querySelector('.bookmarks__list')
    _errMessage = 'No bookmarks yet.Find a nice recipe and bookmark it 😀' ;
    _message = '';

    addHandlerRender(handler){
       window.addEventListener('load' , handler) 
    }

    _generateMarkup(){
        console.log("data",this._data)
       return this._data.map(bookmark => 
                 previewView.render(bookmark , false)).join('')        
    }

}

export default new bookmarksView();