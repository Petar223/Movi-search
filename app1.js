//======================= Ajax data controller.===================================
//================================================================================

var dataController = (function () {

    var ajaxUrl = {
        ajaxUrlMovie: 'https://api.themoviedb.org/3/search/',
        ApiKey: '56e2f6793ab55d60b3deda6f7abd4ff7',
        imagePath: 'http://image.tmdb.org/t/p/w300',
        pageCount: 1
    }
    var dataStr = {
        apiKeyStr: '?api_key=',
        query: '&query=',
        page: '&page='
    };

    return {

        getAjaxUrl: function () {
            return ajaxUrl;
        },
        getDataStr: function () {
            return dataStr;
        }
    };
})();

//======================== User interface view controller.===================================
//===========================================================================================


var UIController = (function () {

    //Object with names of classes and id-s.
    var DOMStrings = {
        inputValue: '#select',
        inputID: '#search',
        inputContainer: '.container',
        boxClass: 'box',
        imgBoxClass: 'imgBox',
        detailsClass: 'details',
        contentClass: 'content',
        h4Class: 'h4',
        pClass: 'p',
        h3Class: 'h1',
        imgClass: 'img',
        spanID: '#span'
    };


    var container = document.querySelector('.container');
    var span = document.querySelector('#span');
    var description = document.querySelector('#search');
    var optionValue = document.querySelector('#select');

    return {

        createMovies: function (obj) {
            console.log(obj)

        },
        //===============
        loadBtn: function () {
            span.textContent = '';
            var loadSpan = document.createElement('div');
            loadSpan.id = 'loaSpan';
            span.append(loadSpan);
            var btn = document.createElement('button');
            btn.className = 'btn';
            loadSpan.append(btn);
            btn.textContent = "LOAD MORE...";
        },
        //===================
        resetSearch: function () {
            pageCount = 1;
            container.innerHTML = '';
            span.textContent = '';
        },
        //================
        getInput: function () {
            return {
                description: description.value,
                value: optionValue.value,
            }
        },
        //=====================
        getDOMStrings: function () {
            return DOMStrings;
        },
        //==================
        getDOMTags: function () {
            return {
                container: container,
                span: span,
                description: description,
            }
        }
    }
})();


//===============================Global app controller.====================================
//=========================================================================================

var controller = (function (UICtrl, dataCtrl) {

    UICtrl.getDOMTags().description.addEventListener('keypress', function () {
        var dataAjaxUrl = dataCtrl.getAjaxUrl();
        var inputData = UICtrl.getInput();

        if (event.key === "Enter") {
            if (dataAjaxUrl.pageCount === 1 && inputData.description) {
                var data = new XMLHttpRequest();
                var ajaxUrl = dataCtrl.getAjaxUrl().ajaxUrlMovie + UICtrl.getInput().value + dataCtrl.getDataStr().apiKeyStr + dataCtrl.getAjaxUrl().ApiKey + dataCtrl.getDataStr().query + inputData.description + dataCtrl.getDataStr().page + dataCtrl.getAjaxUrl().pageCount;
                data.open('get', ajaxUrl);
                data.send();
                data.onreadystatechange = function () {
                    if (data.readyState == 4 && this.status == 200) {
                        var objData = JSON.parse(data.responseText);
                        UICtrl.createMovies(objData);
                        if (objData.total_pages > dataCtrl.getAjaxUrl().pageCount) {
                            UICtrl.loadBtn();
                        } else if (objData.total_pages = 1)
                            UICtrl.getDOMTags().span.textContent = '';
                    }
                };
            } else if (inputData.description === '') {
                UICtrl.resetSearch();
            }
        }
    });

})(UIController, dataController);