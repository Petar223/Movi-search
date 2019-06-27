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
        spanID: '#span',
        btnClassName: 'btn',

    };

    //HTML input tags 
    var container = document.querySelector('.container');
    var span = document.querySelector('#span');
    var description = document.querySelector('#search');
    var optionValue = document.querySelector('#select');

    return {

        //=============================== function for creating posters
        createPosters: function (obj, imgUrl, gander) {

            for (let i = 0; i < obj.results.length; i++) {

                var box = document.createElement('div');
                box.className = DOMStrings.boxClass;
                var imgBox = document.createElement('div');
                imgBox.className = DOMStrings.imgBoxClass;
                var img = document.createElement('img');
                img.className = DOMStrings.imgClass;
                var details = document.createElement('div');
                details.className = DOMStrings.detailsClass;
                var content = document.createElement('div');
                content.className = DOMStrings.contentClass;
                var h4 = document.createElement('h4');
                h4.className = DOMStrings.h4Class;
                var p = document.createElement('p');
                p.className = DOMStrings.pClass;
                var p1 = document.createElement('p');
                p1.className = DOMStrings.pClass;
                var h3 = document.createElement('h3');
                h3.className = DOMStrings.h3Class;
                var h31 = document.createElement('h3');
                h31.className = DOMStrings.h3Class;
                var btn = document.createElement('button');
                btn.className = DOMStrings.btnClassName;

                if (gander === "movie") {
                    var poster = imgUrl + obj.results[i].poster_path;
                    var title = obj.results[i].original_title;
                    var vote = obj.results[i].vote_average;
                    var release = obj.results[i].release_date;
                } else if (gander === "tv") {
                    var poster = imgUrl + obj.results[i].poster_path;
                    var title = obj.results[i].name;
                    var vote = obj.results[i].vote_average;
                    var release = obj.results[i].first_air_date;
                }

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
        //=============== function for show a "load more" button if total pages greater than 1
        loadBtn: function () {
            span.textContent = '';
            var loadSpan = document.createElement('div');
            loadSpan.id = 'loaSpan';
            span.append(loadSpan);
            var btn = document.createElement('button');
            btn.className = DOMStrings.btnClassName;
            loadSpan.append(btn);
            btn.textContent = "LOAD MORE...";
        },
        //======================== function for deleting "load more" button if total pages equal to 1
        deleteBtn: function () {
            span.textContent = '';
        },
        //=================== Function for restarting a search
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


        var imagePtah = dataCtrl.getAjaxUrl().image_Path;
        if (event.key === "Enter") {
            if (dataCtrl.getAjaxUrl().pageCount === 1 && UICtrl.getInput().description) {
                var data = new XMLHttpRequest();
                var ajaxUrl = dataCtrl.getAjaxUrl().ajaxUrlMovie + UICtrl.getInput().value + dataCtrl.getDataStr().apiKeyStr + dataCtrl.getAjaxUrl().ApiKey + dataCtrl.getDataStr().query + UICtrl.getInput().description + dataCtrl.getDataStr().page + dataCtrl.getAjaxUrl().pageCount;
                data.open('get', ajaxUrl);
                data.send();
                data.onreadystatechange = function () {
                    if (data.readyState == 4 && this.status == 200) {
                        var objData = JSON.parse(data.responseText);

                        if (UICtrl.getInput().value == "movie") {
                            UICtrl.resetSearch();
                            UICtrl.createPosters(objData, imagePtah, "movie");
                        } else if (UICtrl.getInput().value == "tv") {
                            UICtrl.resetSearch();
                            UICtrl.createPosters(objData, imagePtah, "tv");
                        }

                        if (objData.total_pages > dataCtrl.getAjaxUrl().pageCount)
                            UICtrl.loadBtn();
                        else if (objData.total_pages = 1)
                            UICtrl.deleteBtn();
                    }
                };
            } else if (UICtrl.getInput().description === '')
                UICtrl.resetSearch();
        }
    });


})(UIController, dataController);