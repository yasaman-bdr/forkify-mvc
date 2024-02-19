import view from "./view";

class paginationView extends view {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler){
      this._parentElement.addEventListener('click' , function(e){
          const btn = e.target.closest('.btn--inline')
          if(!btn) return;

            const goToPage = +btn.dataset.goto

          handler(goToPage)  
      })  
    }

    _generateMarkup(){
        const curPage = this._data.page
        const numPages = Math.ceil(
          this._data.results.length / this._data.resultsPerPage
        )
      //page 1 ,and there are other pages
      if(curPage === 1 && numPages > 1){
          return `
            <button data-goto=${curPage + 1} class="btn--inline pagination__btn--next">
                <span>page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="src/img/icons.svg#icon-arrow-right"></use>
                </svg>
            </button>
          `;
      }   
      
      //other pages
      if(curPage < numPages){
          return `
            <button data-goto=${curPage - 1} class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="src/img/icons.svg#icon-arrow-left"></use>
                </svg>
                <span>page ${curPage - 1}</span>
            </button>
            <button data-goto=${curPage + 1} class="btn--inline pagination__btn--next">
                <span>page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="src/img/icons.svg#icon-arrow-right"></use>
                </svg>
            </button>
          `
      }

      //last page
      if(curPage === numPages && numPages > 1){
        return `
            <button data-goto=${curPage - 1} class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="src/img/icons.svg#icon-arrow-left"></use>
                </svg>
                <span>page ${curPage - 1}</span>
            </button>
        `;
      }

      //page 1 ,and there aren't other pages
      return ''

    }
    
}

export default new paginationView