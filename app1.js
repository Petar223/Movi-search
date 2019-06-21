//======================= Ajax data controller.===================================
//================================================================================

var dataController = (function () {

    var ajaxUrl = {
        ajaxUrlMovie: 'https://api.themoviedb.org/3/search/',
        ApiKey: '56e2f6793ab55d60b3deda6f7abd4ff7',
        image_Path: 'http://image.tmdb.org/t/p/w300',
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

        deleteBtn: function () {
            span.textContent = '';
        },
        //===============================
        createMovies: function (obj, imgUrl) {

            for (let i = 0; i < obj.results.length; i++) {
                var box = document.createElement('div');
                box.className = 'box';
                var imgBox = document.createElement('div');
                imgBox.className = 'imgBox';
                var img = document.createElement('img');
                img.className = 'img';
                var details = document.createElement('div');
                details.className = 'details';
                var content = document.createElement('div');
                content.className = 'content';
                var h4 = document.createElement('h4');
                h4.className = 'h4';
                var p = document.createElement('p');
                p.className = 'p';
                var p1 = document.createElement('p');
                p1.className = 'p';
                var h3 = document.createElement('h3');
                h3.className = 'h1';
                var h31 = document.createElement('h3');
                h31.className = 'h1';
                var btn = document.createElement('button');
                btn.className = 'btn';

                var poster = imgUrl + obj.results[i].poster_path;

                var title = obj.results[i].original_title;
                var vote = obj.results[i].vote_average;
                var release = obj.results[i].release_date;


                img.src = !obj.results[i].poster_path ? 'no-image.jpeg' : poster;

                h4.textContent = title;
                p.textContent = 'Release:';
                h3.textContent = release;
                p1.textContent = 'Rating:';
                h31.textContent = vote + ' / 10';
                btn.textContent = "D E T A I L S"

                container.append(box);
                box.append(imgBox, details);
                imgBox.appendChild(img);

                details.appendChild(content);
                content.append(h4, p, h3, p1, h31, btn)
            };
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
        var imagePtah = dataCtrl.getAjaxUrl().image_Path;
        if (event.key === "Enter") {
            if (dataAjaxUrl.pageCount === 1 && inputData.description) {
                var data = new XMLHttpRequest();
                var ajaxUrl = dataCtrl.getAjaxUrl().ajaxUrlMovie + UICtrl.getInput().value + dataCtrl.getDataStr().apiKeyStr + dataCtrl.getAjaxUrl().ApiKey + dataCtrl.getDataStr().query + inputData.description + dataCtrl.getDataStr().page + dataCtrl.getAjaxUrl().pageCount;
                data.open('get', ajaxUrl);
                data.send();
                data.onreadystatechange = function () {
                    if (data.readyState == 4 && this.status == 200) {
                        var objData = JSON.parse(data.responseText);
                        UICtrl.resetSearch();
                        UICtrl.createMovies(objData, imagePtah);
                        if (objData.total_pages > dataCtrl.getAjaxUrl().pageCount)
                            UICtrl.loadBtn();
                        else if (objData.total_pages = 1)
                            UICtrl.deleteBtn();
                    }
                };
            } else if (inputData.description === '')
                UICtrl.resetSearch();
        }
    });


})(UIController, dataController);