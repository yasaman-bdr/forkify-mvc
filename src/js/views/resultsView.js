import view from './view'
import previewView from './previewView';

class resultsView extends view{
    _parentElement = document.querySelector('.results')
    _errMessage = 'no recipes found for your query! please try again 😀' ;
    _message = '';

    _generateMarkup(){
       return this._data.map(result => previewView.render(result , false)).join('')
        
    }
}

export default new resultsView();