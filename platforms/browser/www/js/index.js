//const apiLink = " https://4f074f65.ngrok.io/onlinepublishing-v2/api/";
const apiLink = "http://127.0.0.1/onlinepublishing-v2/api/";

document.addEventListener("deviceready", onDeviceReady, false);

var sw,cssStyle;
var content = document.getElementById('content');
var storage = window.localStorage;

function onDeviceReady() {
    console.log(device.model);
    cssStyle=document.getElementById('css_style');
    if ((storage.getItem("dark_mode")=="on")||(storage.getItem("dark_mode")==null)) {
        cssStyle.setAttribute("href","onsenui/css/dark-onsen-css-components.min.css");
    }
    else {
        cssStyle.setAttribute("href","onsenui/css/onsen-css-components.min.css");
    }
    // navigator.splashscreen.show();
}

window.load = function(){
    content.replacePage('splashcreen.html');
}

// console.log(storage.getItem("access_token"));

if (storage.getItem("access_token")!=null) {
    console.log(storage.getItem("access_token"));
    var inNext = false;
    $.ajax({
        url: apiLink+"auth.php",
        type: "get",
        data: {
            access_token: storage.getItem("access_token")
        },
        success: function(r){
            var str = JSON.stringify(r);
            var obj = JSON.parse(str);
            //console.log(r);
            if (typeof obj.id !== "undefined") {
                inNext = true
            }
        }, 
        complete: function(){
            if (inNext) {
                setTimeout(function () {
                    var menu = document.getElementById('menu');
                    //menu.setAttribute('swipeable');
                    menu.load('menu.html');
                    content.replacePage('home.html');
                },3000);
            }
            else {
                setTimeout(function () {
                    storage.removeItem("access_token");
                    storage.removeItem("dark_mode");
                    cssStyle.setAttribute("href","onsenui/css/dark-onsen-css-components.min.css");
                    content.replacePage('login.html');
                },3000);
            }
        }
    });
}
else {
    setTimeout(function () {
        content.replacePage('login.html');
    },3000);
}


// DARK MODE SWITCH
function darkModeSwitch(){
    console.log(sw.checked);
    if (sw.checked) {
        cssStyle.setAttribute("href","onsenui/css/dark-onsen-css-components.min.css");
        storage.setItem("dark_mode", "on");
    }
    else {
        cssStyle.setAttribute("href","onsenui/css/onsen-css-components.min.css");
        storage.setItem("dark_mode", "off");
    }
}

// Side Nav
window.fn = {};

window.fn.open = function() {
    var menu = document.getElementById('menu');
    menu.open();
};

window.fn.load = function(page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    if (page == "home.html") {
        menu.close();
    }
    else if (page == "about.html") {
        //menu.removeAttribute('swipeable');
        menu.close();
        content.pushPage(page);
    }
    else if (page == "all-news.html") {
        //menu.removeAttribute('swipeable');
        menu.close();
        content.pushPage(page);
    }
    else if (page == "sports-news.html") {
        //menu.removeAttribute('swipeable');
        menu.close();
        content.pushPage(page);
    }
    else if (page == "entertainment-news.html") {
        //menu.removeAttribute('swipeable');
        menu.close();
        content.pushPage(page);
    }
    else if (page == "news-news.html") {
        //menu.removeAttribute('swipeable');
        menu.close();
        content.pushPage(page);
    }
    else if (page == "devcomm-news.html") {
        //menu.removeAttribute('swipeable');
        menu.close();
        content.pushPage(page);
    }
    else if (page == "feature-news.html") {
        //menu.removeAttribute('swipeable');
        menu.close();
        content.pushPage(page);
    }
    else if (page == "editorial-news.html") {
        //menu.removeAttribute('swipeable');
        menu.close();
        content.pushPage(page);
    }
    else if (page == "opinion-news.html") {
        //menu.removeAttribute('swipeable');
        menu.close();
        content.pushPage(page);
    }
    else if (page == "literary-news.html") {
        //menu.removeAttribute('swipeable');
        menu.close();
        content.pushPage(page);
    }
};

// window.fn.pop = function() {
//   var content = document.getElementById('content');
//   content.popPage();
// };

// Switching Home Tab
document.addEventListener('prechange', function(event) {
    document.querySelector('ons-toolbar .center').innerHTML = event.tabItem.getAttribute('label');
});

function signIn(){
    //console.log(storage.getItem("access_token"));
    var target = document.getElementById('signIn');
    var pw = document.getElementById('password').value;
    var studentId = document.getElementById('studentId').value;
    if ((studentId=="")&&(pw=="")) {
        ons.notification.alert("Please Fill up the Required Fields.",{
            title: "Uh oh!"
        });
    }
    else {
        var readyOnNext = false;
        var message = "";
        $.ajax({
            url: apiLink+"auth.php",
            type: "post",
            data: {
                studentId: studentId, pw: pw
            },
            beforeSend: function() {
                target.innerHTML = '<ons-progress-circular indeterminate></ons-progress-circular>';
            },
            success: function(r){
                var str = JSON.stringify(r);
                var obj = JSON.parse(str);
                //console.log(r);
                if (obj[0].status == "success_login") {
                    //console.log("Continue");
                    //console.log(obj[0].access_token);
                    readyOnNext = true;
                    var storage = window.localStorage;
                    storage.setItem("access_token", obj[0].access_token);
                }
                else {
                    message = obj[0].message;
                }
            },
            complete: function() {
                if (readyOnNext) {
                    setTimeout(function(){
                        target.innerHTML = '<ons-button style="width: 80%;" onclick="signIn()" id="signIdButton">Sign in</ons-button>';
                    },2000);
                    setTimeout(function(){
                        var menu = document.getElementById('menu');
                        //menu.setAttribute('swipeable');
                        content.replacePage('home.html');
                        menu.load('menu.html');
                    },2000);
                }
                else {
                    setTimeout(function(){
                        target.innerHTML = '<ons-button style="width: 80%;" onclick="signIn()" id="signIdButton">Sign in</ons-button>';
                    },2000);
                    ons.notification.alert(message,{
                        title: "Uh oh!"
                    });
                }
            }
        });
    }
    // console.log(pw);
    // console.log(studentId);
    // var menu = document.getElementById('menu');
    // menu.setAttribute('swipeable');
    // content.replacePage('home.html');
    // menu.load('menu.html');
}

function logOut(){
    ons.notification.confirm("Are you sure?",{
        buttonLabels: ["No","Yes"],
        title: "Logout?"
    }).then((response) => {
        if (response) {
            var menu = document.getElementById('menu');
            var readyOnNext = false;
            var token = storage.getItem("access_token");
            $.ajax({
                url: apiLink+"auth.php",
                type: "post",
                data: {
                    access_token: token
                },
                beforeSend: function() {
                    var dialog = document.getElementById('logout-process-dialog');
                    if (dialog) {
                        dialog.show();
                    } 
                    else {
                        ons.createElement('logout-process-dialog.html', { append: true })
                        .then(function(dialog) {
                            dialog.show();
                        });
                    }
                },
                success: function(r) {
                    var str = JSON.stringify(r);
                    var obj = JSON.parse(str);
                    // console.log(r);
                    if (obj.status == "success_logout"){
                        readyOnNext = true;
                        // console.log(storage.getItem("access_token"));
                    }
                },
                complete: function() {
                    if (readyOnNext){
                        setTimeout(function(){
                            document.getElementById('logout-process-dialog').hide();
                            //menu.removeAttribute('swipeable');
                            content.replacePage('login.html').then(menu.close.bind(menu));
                            menu.innerHTML = "";
                            storage.removeItem("access_token");
                            storage.removeItem("dark_mode");
                            cssStyle.setAttribute("href","onsenui/css/dark-onsen-css-components.min.css");
                        },2000);
                    }
                    else {
                        setTimeout(function(){
                            document.getElementById('logout-process-dialog').hide();
                            ons.notification.alert("Please try again.",{
                                title: "Failed to Logout"
                            });
                        },2000);
                    }
                }
            });
        }
    });
}

// Loading Another News
function load_more(target_id){
    document.getElementById(target_id+"-load").innerHTML = "<ons-progress-circular indeterminate></ons-progress-circular>";
    if (target_id == "all-news") {
        var data = {
            start: endArticleTimestamp-1, limit: "20", params: "id,user_id,title,up_timestamp"
        };
        var countDate = {
            count: "only_count"
        }
    }
    else if (target_id == "sports-news"){
        var data = {
            start: endArticleTimestamp-1, limit: "20", params: "id,user_id,title,up_timestamp", category: "sports"
        };
        var countDate = {
            count: "only_count", category: "sports"
        }
    }
    else if (target_id == "entertainment-news"){
        var data = {
            start: endArticleTimestamp_2-1, limit: "20", params: "id,user_id,title,up_timestamp", category: "entertainment"
        };
        var countDate = {
            count: "only_count", category: "entertainment"
        }
    }
    $.ajax({
        url: apiLink+"article.php",
        type: "get",
        data: data,
        success: function(r) {
            var str = JSON.stringify(r);
            var obj = JSON.parse(str);
            var loopTotal = obj.length;
            console.log(obj);
            if (typeof obj.message === 'undefined'){
                var loop = 0
                while (loop < loopTotal){
                    displayNews = "";
                    displayNews += "<ons-card onclick=\"article("+obj[loop].id+");\">";
                    displayNews += "<div class=\"title\">"+obj[loop].title+"</div>";
                    displayNews += "<div class=\"content\"><p><strong>"+obj[loop].user_details.fname+" "+obj[loop].user_details.lname+"</strong><br/>"+obj[loop].date_time+"</p></div>";
                    displayNews += "</ons-card>";
                    loop++;
                    totalArticleCount++;
                    $("#"+target_id+"-content").append(displayNews);
                }
                if (target_id == "sports-news"){
                    endArticleTimestamp = obj[loop-1].up_timestamp;
                }
                else if (target_id == "sports-news"){
                    endArticleTimestamp_2 = obj[loop-1].up_timestamp;
                }
            }
            else {
                setTimeout(function(){
                    document.getElementById(target_id+"-load").innerHTML = "<ons-button modifier=\"large--quiet\" disabled>End of All Articles</ons-button>";
                },2000);
            }
        },
        complete: function() {
            $.ajax({
                url: apiLink+"article.php",
                type: "get",
                data: countDate,
                success: function(r) {
                    var str = JSON.stringify(r);
                    var obj = JSON.parse(str);
                    ServerArticlesCount = parseInt(obj.article_count);
                    // console.log(ServerArticlesCount);
                }, 
                complete: function(){
                    if (ServerArticlesCount > totalArticleCount) {
                        setTimeout(function(){
                            document.getElementById(target_id+"-load").innerHTML = "<ons-button modifier=\"large--quiet\" onclick=\"load_more('"+target_id+"');\">Load More</ons-button>";
                        },2000);   
                    }
                    else {
                        setTimeout(function(){
                            document.getElementById(target_id+"-load").innerHTML = "<ons-button modifier=\"large--quiet\" disabled>End of All Articles</ons-button>";
                        },2000);
                    }
                }
            });
        }
    });
    //var target = document.getElementById('load_more');
    //target.innerHTML = '<ons-progress-circular indeterminate></ons-progress-circular>';
}

var endArticleTimestamp = "";
var endArticleTimestamp_2 = "";
var totalArticleCount = 0;
var totalArticleCount_2 = 0;
var latestNewsError, latestNewsContent;
document.addEventListener('init', function(event) {
var page = event.target;
if (event.target.matches('#latest-news')) {

    sw = document.getElementById('dark_mode');
    if ((storage.getItem("dark_mode")=="on")||(storage.getItem("dark_mode")==null)) {
        sw.setAttribute("checked");
    }
    else {
        sw.removeAttribute("checked");
    }


    latestNewsError = document.getElementById("latest-news-error");
    latestNewsContent = document.getElementById("latest-news-content");
    var pullHook = document.getElementById('pull-hook-latest');
    pullHook.addEventListener('changestate', function(event) {
        var message = '';
    
        switch (event.state) {
        case 'initial':
            message = 'Pull to refresh';
            break;
        case 'action':
            latestNews('refresh');
            message = '<ons-progress-circular indeterminate style="margin-top: 10px;"></ons-progress-circular>';
            break;
        }
    
        pullHook.innerHTML = message;
    });
    
    pullHook.onAction = function(done) {
        setTimeout(done, 3000);
    };

    latestNews('initial');

    function latestNews(status){
        var currentTimestamp = Math.floor(Date.now() / 1000);
        var showNews = false;
        var displayNews = "";

        $.ajax({
            url: apiLink+"article.php",
            type: "get",
            data: {
                start: currentTimestamp, limit: "20", params: "id,user_id,title,up_timestamp"
            },
            success: function(r) {
                var str = JSON.stringify(r);
                var obj = JSON.parse(str);
                console.log(r);
                var loopTotal = obj.length;
    
                if (typeof obj.message === 'undefined'){
                    showNews = true;
                    var loop = 0
                    while (loop < loopTotal){
                        displayNews += "<ons-card onclick=\"article("+obj[loop].id+");\">";
                        displayNews += "<div class=\"title\">"+obj[loop].title+"</div>";
                        displayNews += "<div class=\"content\"><p><strong>"+obj[loop].user_details.fname+" "+obj[loop].user_details.lname+"</strong><br/>"+obj[loop].date_time+"</p></div>";
                        displayNews += "</ons-card>";
                        loop++;
                    }
                    endArticleTimestamp = obj[loop-1].up_timestamp;
                }
            },
            complete: function() {
                if (showNews){
                    setTimeout(function(){
                        if (status == "initial"){
                            document.getElementById('latest-news-load').remove();
                        }
                        latestNewsContent.innerHTML = displayNews;
                        pullHook.removeAttribute('disabled');
                    },2000);
                }
                else {
                    setTimeout(function(){
                        if (status == "initial"){
                            document.getElementById('latest-news-load').remove();
                        }
                        latestNewsError.style.display = "initial";
                        pullHook.removeAttribute('disabled');
                    },2000);
                }
            }
        });
    }
}
else if (event.target.matches('#sports-news')) {
    var pullHook = document.getElementById('pull-hook-sports');
    pullHook.addEventListener('changestate', function(event) {
        var message = '';
    
        switch (event.state) {
        case 'initial':
            message = 'Pull to refresh';
            break;
        case 'action':
            SportsNews(true);
            message = '<ons-progress-circular indeterminate style="margin-top: 10px;"></ons-progress-circular>';
            break;
        }
    
        pullHook.innerHTML = message;
    });
    
    pullHook.onAction = function(done) {
        setTimeout(done, 1000);
    };

    var SportsNewsContent = document.getElementById('sports-news-content');
    var SportsNewsError = document.getElementById('sports-news-error');
    var SportsNewsLoad = document.getElementById('sports-news-load');

    SportsNews(true);

    function SportsNews(reset){
        if (reset) {
            totalArticleCount = 0;
        }
        var ServerArticlesCount = 0;
        var currentTimestamp = Math.floor(Date.now() / 1000);
        var showNews = false;
        var displayNews = "";
        $.ajax({
            url: apiLink+"article.php",
            type: "get",
            data: {
                start: currentTimestamp, limit: "20", count: "true", params: "id,user_id,title,up_timestamp,img", category: "sports"
            },
            success: function(r) {
                var str = JSON.stringify(r);
                var obj = JSON.parse(str);
                console.log(obj);
                var loopTotal = obj.length-1;
    
                if (typeof obj.message === 'undefined'){
                    showNews = true;

                    var loop = 0
                    while (loop < loopTotal){
                        displayNews += "<ons-card onclick=\"article("+obj[loop].id+");\">";
                        displayNews += "<div class=\"title\">"+obj[loop].title+"</div>";
                        displayNews += "<div class=\"content\"><p><strong>"+obj[loop].user_details.fname+" "+obj[loop].user_details.lname+"</strong><br/>"+obj[loop].date_time+"</p></div>";
                        displayNews += "</ons-card>";
                        loop++;
                        totalArticleCount++;
                    }
                    endArticleTimestamp = obj[loop-1].up_timestamp;
                }
            },
            complete: function() {
                $.ajax({
                    url: apiLink+"article.php",
                    type: "get",
                    data: {
                        count: "only_count", category: "sports"
                    },
                    success: function(r) {
                        var str = JSON.stringify(r);
                        var obj = JSON.parse(str);
                        ServerArticlesCount = parseInt(obj.article_count);
                    }, 
                    complete: function(){
                        console.log(ServerArticlesCount);
                        console.log("ARTICLE COUNT: "+totalArticleCount);
                        if (showNews){
                            if (ServerArticlesCount > totalArticleCount) {
                                setTimeout(function(){
                                    SportsNewsError.style.display = "none";
                                    SportsNewsContent.innerHTML = displayNews;
                                    SportsNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" onclick=\"load_more('sports-news');\">Load More</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);   
                            }
                            else {
                                setTimeout(function(){
                                    SportsNewsError.style.display = "none";
                                    SportsNewsContent.innerHTML = displayNews;
                                    SportsNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" disabled>End of All Articles</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);
                            }
                        }
                        else {
                            setTimeout(function(){
                                SportsNewsError.style.display = "initial";
                                SportsNewsLoad.style.display = "none";
                                pullHook.removeAttribute('disabled');
                            },2000);
                        }
                    }
                });
            }
        });
    }
}
else if (event.target.matches('#devcomm-news')) {
    var pullHook = document.getElementById('pull-hook-devcomm');
    pullHook.addEventListener('changestate', function(event) {
        var message = '';
    
        switch (event.state) {
        case 'initial':
            message = 'Pull to refresh';
            break;
        case 'action':
            DevcommNews(true);
            message = '<ons-progress-circular indeterminate style="margin-top: 10px;"></ons-progress-circular>';
            break;
        }
    
        pullHook.innerHTML = message;
    });
    
    pullHook.onAction = function(done) {
        setTimeout(done, 1000);
    };

    var DevcommNewsContent = document.getElementById('devcomm-news-content');
    var DevcommNewsError = document.getElementById('devcomm-news-error');
    var DevcommNewsLoad = document.getElementById('devcomm-news-load');

    DevcommNews(true);

    function DevcommNews(reset){
        if (reset) {
            totalArticleCount = 0;
        }
        var ServerArticlesCount = 0;
        var currentTimestamp = Math.floor(Date.now() / 1000);
        var showNews = false;
        var displayNews = "";
        $.ajax({
            url: apiLink+"article.php",
            type: "get",
            data: {
                start: currentTimestamp, limit: "20", count: "true", params: "id,user_id,title,up_timestamp", category: "devcomm"
            },
            success: function(r) {
                var str = JSON.stringify(r);
                var obj = JSON.parse(str);
                console.log(obj);
                var loopTotal = obj.length-1;
    
                if (typeof obj.message === 'undefined'){
                    showNews = true;

                    var loop = 0
                    while (loop < loopTotal){
                        displayNews += "<ons-card onclick=\"article("+obj[loop].id+");\">";
                        displayNews += "<div class=\"title\">"+obj[loop].title+"</div>";
                        displayNews += "<div class=\"content\"><p><strong>"+obj[loop].user_details.fname+" "+obj[loop].user_details.lname+"</strong><br/>"+obj[loop].date_time+"</p></div>";
                        displayNews += "</ons-card>";
                        loop++;
                        totalArticleCount++;
                    }
                    endArticleTimestamp = obj[loop-1].up_timestamp;
                }
            },
            complete: function() {
                $.ajax({
                    url: apiLink+"article.php",
                    type: "get",
                    data: {
                        count: "only_count", category: "devcomm"
                    },
                    success: function(r) {
                        var str = JSON.stringify(r);
                        var obj = JSON.parse(str);
                        ServerArticlesCount = parseInt(obj.article_count);
                    }, 
                    complete: function(){
                        console.log(ServerArticlesCount);
                        console.log("ARTICLE COUNT: "+totalArticleCount);
                        if (showNews){
                            if (ServerArticlesCount > totalArticleCount) {
                                setTimeout(function(){
                                    DevcommNewsError.style.display = "none";
                                    DevcommNewsContent.innerHTML = displayNews;
                                    DevcommNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" onclick=\"load_more('sports-news');\">Load More</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);   
                            }
                            else {
                                setTimeout(function(){
                                    DevcommNewsError.style.display = "none";
                                    DevcommNewsContent.innerHTML = displayNews;
                                    DevcommNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" disabled>End of All Articles</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);
                            }
                        }
                        else {
                            setTimeout(function(){
                                DevcommNewsError.style.display = "initial";
                                DevcommNewsLoad.style.display = "none";
                                pullHook.removeAttribute('disabled');
                            },2000);
                        }
                    }
                });
            }
        });
    }
}
else if (event.target.matches('#feature-news')) {
    var pullHook = document.getElementById('pull-hook-feature');
    pullHook.addEventListener('changestate', function(event) {
        var message = '';
    
        switch (event.state) {
        case 'initial':
            message = 'Pull to refresh';
            break;
        case 'action':
            FeatureNews(true);
            message = '<ons-progress-circular indeterminate style="margin-top: 10px;"></ons-progress-circular>';
            break;
        }
    
        pullHook.innerHTML = message;
    });
    
    pullHook.onAction = function(done) {
        setTimeout(done, 1000);
    };

    var FeatureNewsContent = document.getElementById('feature-news-content');
    var FeatureNewsError = document.getElementById('feature-news-error');
    var FeatureNewsLoad = document.getElementById('feature-news-load');

    FeatureNews(true);

    function FeatureNews(reset){
        if (reset) {
            totalArticleCount = 0;
        }
        var ServerArticlesCount = 0;
        var currentTimestamp = Math.floor(Date.now() / 1000);
        var showNews = false;
        var displayNews = "";
        $.ajax({
            url: apiLink+"article.php",
            type: "get",
            data: {
                start: currentTimestamp, limit: "20", count: "true", params: "id,user_id,title,up_timestamp", category: "feature"
            },
            success: function(r) {
                var str = JSON.stringify(r);
                var obj = JSON.parse(str);
                console.log(obj);
                var loopTotal = obj.length-1;
    
                if (typeof obj.message === 'undefined'){
                    showNews = true;

                    var loop = 0
                    while (loop < loopTotal){
                        displayNews += "<ons-card onclick=\"article("+obj[loop].id+");\">";
                        displayNews += "<div class=\"title\">"+obj[loop].title+"</div>";
                        displayNews += "<div class=\"content\"><p><strong>"+obj[loop].user_details.fname+" "+obj[loop].user_details.lname+"</strong><br/>"+obj[loop].date_time+"</p></div>";
                        displayNews += "</ons-card>";
                        loop++;
                        totalArticleCount++;
                    }
                    endArticleTimestamp = obj[loop-1].up_timestamp;
                }
            },
            complete: function() {
                $.ajax({
                    url: apiLink+"article.php",
                    type: "get",
                    data: {
                        count: "only_count", category: "feature"
                    },
                    success: function(r) {
                        var str = JSON.stringify(r);
                        var obj = JSON.parse(str);
                        ServerArticlesCount = parseInt(obj.article_count);
                    }, 
                    complete: function(){
                        console.log(ServerArticlesCount);
                        console.log("ARTICLE COUNT: "+totalArticleCount);
                        if (showNews){
                            if (ServerArticlesCount > totalArticleCount) {
                                setTimeout(function(){
                                    FeatureNewsError.style.display = "none";
                                    FeatureNewsContent.innerHTML = displayNews;
                                    FeatureNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" onclick=\"load_more('sports-news');\">Load More</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);   
                            }
                            else {
                                setTimeout(function(){
                                    FeatureNewsError.style.display = "none";
                                    FeatureNewsContent.innerHTML = displayNews;
                                    FeatureNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" disabled>End of All Articles</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);
                            }
                        }
                        else {
                            setTimeout(function(){
                                FeatureNewsError.style.display = "initial";
                                FeatureNewsLoad.style.display = "none";
                                pullHook.removeAttribute('disabled');
                            },2000);
                        }
                    }
                });
            }
        });
    }
}
else if (event.target.matches('#editorial-news')) {
    var pullHook = document.getElementById('pull-hook-editorial');
    pullHook.addEventListener('changestate', function(event) {
        var message = '';
    
        switch (event.state) {
        case 'initial':
            message = 'Pull to refresh';
            break;
        case 'action':
            EditorialNews(true);
            message = '<ons-progress-circular indeterminate style="margin-top: 10px;"></ons-progress-circular>';
            break;
        }
    
        pullHook.innerHTML = message;
    });
    
    pullHook.onAction = function(done) {
        setTimeout(done, 1000);
    };

    var EditorialNewsContent = document.getElementById('editorial-news-content');
    var EditorialNewsError = document.getElementById('editorial-news-error');
    var EditorialNewsLoad = document.getElementById('editoral-news-load');

    EditorialNews(true);

    function EditorialNews(reset){
        if (reset) {
            totalArticleCount = 0;
        }
        var ServerArticlesCount = 0;
        var currentTimestamp = Math.floor(Date.now() / 1000);
        var showNews = false;
        var displayNews = "";
        $.ajax({
            url: apiLink+"article.php",
            type: "get",
            data: {
                start: currentTimestamp, limit: "20", count: "true", params: "id,user_id,title,up_timestamp", category: "editorial"
            },
            success: function(r) {
                var str = JSON.stringify(r);
                var obj = JSON.parse(str);
                console.log(obj);
                var loopTotal = obj.length-1;
    
                if (typeof obj.message === 'undefined'){
                    showNews = true;

                    var loop = 0
                    while (loop < loopTotal){
                        displayNews += "<ons-card onclick=\"article("+obj[loop].id+");\">";
                        displayNews += "<div class=\"title\">"+obj[loop].title+"</div>";
                        displayNews += "<div class=\"content\"><p><strong>"+obj[loop].user_details.fname+" "+obj[loop].user_details.lname+"</strong><br/>"+obj[loop].date_time+"</p></div>";
                        displayNews += "</ons-card>";
                        loop++;
                        totalArticleCount++;
                    }
                    endArticleTimestamp = obj[loop-1].up_timestamp;
                }
            },
            complete: function() {
                $.ajax({
                    url: apiLink+"article.php",
                    type: "get",
                    data: {
                        count: "only_count", category: "editorial"
                    },
                    success: function(r) {
                        var str = JSON.stringify(r);
                        var obj = JSON.parse(str);
                        ServerArticlesCount = parseInt(obj.article_count);
                    }, 
                    complete: function(){
                        console.log(ServerArticlesCount);
                        console.log("ARTICLE COUNT: "+totalArticleCount);
                        if (showNews){
                            if (ServerArticlesCount > totalArticleCount) {
                                setTimeout(function(){
                                    EditorialNewsError.style.display = "none";
                                    EditorialNewsContent.innerHTML = displayNews;
                                    EditorialNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" onclick=\"load_more('sports-news');\">Load More</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);   
                            }
                            else {
                                setTimeout(function(){
                                    EditorialNewsError.style.display = "none";
                                    EditorialNewsContent.innerHTML = displayNews;
                                    EditorialNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" disabled>End of All Articles</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);
                            }
                        }
                        else {
                            setTimeout(function(){
                                EditorialNewsError.style.display = "initial";
                                EditorialNewsLoad.style.display = "none";
                                pullHook.removeAttribute('disabled');
                            },2000);
                        }
                    }
                });
            }
        });
    }
}
else if (event.target.matches('#opinion-news')) {
    var pullHook = document.getElementById('pull-hook-opinion');
    pullHook.addEventListener('changestate', function(event) {
        var message = '';
    
        switch (event.state) {
        case 'initial':
            message = 'Pull to refresh';
            break;
        case 'action':
            OpinionNews(true);
            message = '<ons-progress-circular indeterminate style="margin-top: 10px;"></ons-progress-circular>';
            break;
        }
    
        pullHook.innerHTML = message;
    });
    
    pullHook.onAction = function(done) {
        setTimeout(done, 1000);
    };

    var OpinionNewsContent = document.getElementById('opinion-news-content');
    var OpinionNewsError = document.getElementById('opinion-news-error');
    var OpinionNewsLoad = document.getElementById('opinion-news-load');

    OpinionNews(true);

    function OpinionNews(reset){
        if (reset) {
            totalArticleCount = 0;
        }
        var ServerArticlesCount = 0;
        var currentTimestamp = Math.floor(Date.now() / 1000);
        var showNews = false;
        var displayNews = "";
        $.ajax({
            url: apiLink+"article.php",
            type: "get",
            data: {
                start: currentTimestamp, limit: "20", count: "true", params: "id,user_id,title,up_timestamp", category: "opinion"
            },
            success: function(r) {
                var str = JSON.stringify(r);
                var obj = JSON.parse(str);
                console.log(obj);
                var loopTotal = obj.length-1;
    
                if (typeof obj.message === 'undefined'){
                    showNews = true;

                    var loop = 0
                    while (loop < loopTotal){
                        displayNews += "<ons-card onclick=\"article("+obj[loop].id+");\">";
                        displayNews += "<div class=\"title\">"+obj[loop].title+"</div>";
                        displayNews += "<div class=\"content\"><p><strong>"+obj[loop].user_details.fname+" "+obj[loop].user_details.lname+"</strong><br/>"+obj[loop].date_time+"</p></div>";
                        displayNews += "</ons-card>";
                        loop++;
                        totalArticleCount++;
                    }
                    endArticleTimestamp = obj[loop-1].up_timestamp;
                }
            },
            complete: function() {
                $.ajax({
                    url: apiLink+"article.php",
                    type: "get",
                    data: {
                        count: "only_count", category: "opinion"
                    },
                    success: function(r) {
                        var str = JSON.stringify(r);
                        var obj = JSON.parse(str);
                        ServerArticlesCount = parseInt(obj.article_count);
                    }, 
                    complete: function(){
                        console.log(ServerArticlesCount);
                        console.log("ARTICLE COUNT: "+totalArticleCount);
                        if (showNews){
                            if (ServerArticlesCount > totalArticleCount) {
                                setTimeout(function(){
                                    OpinionNewsError.style.display = "none";
                                    OpinionNewsContent.innerHTML = displayNews;
                                    OpinionNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" onclick=\"load_more('sports-news');\">Load More</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);   
                            }
                            else {
                                setTimeout(function(){
                                    OpinionNewsError.style.display = "none";
                                    OpinionNewsContent.innerHTML = displayNews;
                                    OpinionNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" disabled>End of All Articles</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);
                            }
                        }
                        else {
                            setTimeout(function(){
                                OpinionNewsError.style.display = "initial";
                                OpinionNewsLoad.style.display = "none";
                                pullHook.removeAttribute('disabled');
                            },2000);
                        }
                    }
                });
            }
        });
    }
}
else if (event.target.matches('#literary-news')) {
    var pullHook = document.getElementById('pull-hook-literary');
    pullHook.addEventListener('changestate', function(event) {
        var message = '';
    
        switch (event.state) {
        case 'initial':
            message = 'Pull to refresh';
            break;
        case 'action':
            LiteraryNews(true);
            message = '<ons-progress-circular indeterminate style="margin-top: 10px;"></ons-progress-circular>';
            break;
        }
    
        pullHook.innerHTML = message;
    });
    
    pullHook.onAction = function(done) {
        setTimeout(done, 1000);
    };

    var LiteraryNewsContent = document.getElementById('literary-news-content');
    var LiteraryNewsError = document.getElementById('literary-news-error');
    var LiteraryNewsLoad = document.getElementById('literary-news-load');

    LiteraryNews(true);

    function LiteraryNews(reset){
        if (reset) {
            totalArticleCount = 0;
        }
        var ServerArticlesCount = 0;
        var currentTimestamp = Math.floor(Date.now() / 1000);
        var showNews = false;
        var displayNews = "";
        $.ajax({
            url: apiLink+"article.php",
            type: "get",
            data: {
                start: currentTimestamp, limit: "20", count: "true", params: "id,user_id,title,up_timestamp", category: "devcomm"
            },
            success: function(r) {
                var str = JSON.stringify(r);
                var obj = JSON.parse(str);
                console.log(obj);
                var loopTotal = obj.length-1;
    
                if (typeof obj.message === 'undefined'){
                    showNews = true;

                    var loop = 0
                    while (loop < loopTotal){
                        displayNews += "<ons-card onclick=\"article("+obj[loop].id+");\">";
                        displayNews += "<div class=\"title\">"+obj[loop].title+"</div>";
                        displayNews += "<div class=\"content\"><p><strong>"+obj[loop].user_details.fname+" "+obj[loop].user_details.lname+"</strong><br/>"+obj[loop].date_time+"</p></div>";
                        displayNews += "</ons-card>";
                        loop++;
                        totalArticleCount++;
                    }
                    endArticleTimestamp = obj[loop-1].up_timestamp;
                }
            },
            complete: function() {
                $.ajax({
                    url: apiLink+"article.php",
                    type: "get",
                    data: {
                        count: "only_count", category: "literary"
                    },
                    success: function(r) {
                        var str = JSON.stringify(r);
                        var obj = JSON.parse(str);
                        ServerArticlesCount = parseInt(obj.article_count);
                    }, 
                    complete: function(){
                        console.log(ServerArticlesCount);
                        console.log("ARTICLE COUNT: "+totalArticleCount);
                        if (showNews){
                            if (ServerArticlesCount > totalArticleCount) {
                                setTimeout(function(){
                                    LiteraryNewsError.style.display = "none";
                                    LiteraryNewsContent.innerHTML = displayNews;
                                    LiteraryNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" onclick=\"load_more('sports-news');\">Load More</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);   
                            }
                            else {
                                setTimeout(function(){
                                    LiteraryNewsError.style.display = "none";
                                    LiteraryNewsContent.innerHTML = displayNews;
                                    LiteraryNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" disabled>End of All Articles</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);
                            }
                        }
                        else {
                            setTimeout(function(){
                                LiteraryNewsError.style.display = "initial";
                                LiteraryNewsLoad.style.display = "none";
                                pullHook.removeAttribute('disabled');
                            },2000);
                        }
                    }
                });
            }
        });
    }
}
else if (event.target.matches('#entertainment-news')) {
    var pullHook = document.getElementById('pull-hook-entertainment');
    pullHook.addEventListener('changestate', function(event) {
        var message = '';
    
        switch (event.state) {
        case 'initial':
            message = 'Pull to refresh';
            break;
        case 'action':
            EntertainmentNews(true);
            message = '<ons-progress-circular indeterminate style="margin-top: 10px;"></ons-progress-circular>';
            break;
        }
    
        pullHook.innerHTML = message;
    });
    
    pullHook.onAction = function(done) {
        setTimeout(done, 1000);
    };

    var EntertainmentNewsContent = document.getElementById('entertainment-news-content');
    var EntertainmentNewsError = document.getElementById('entertainment-news-error');
    var EntertainmentNewsLoad = document.getElementById('entertainment-news-load');

    EntertainmentNews(true);

    function EntertainmentNews(reset){
        if (reset) {
            totalArticleCount_2 = 0;
        }
        var ServerArticlesCount = 0;
        var currentTimestamp = Math.floor(Date.now() / 1000);
        var showNews = false;
        var displayNews = "";
        $.ajax({
            url: apiLink+"article.php",
            type: "get",
            data: {
                start: currentTimestamp, limit: "20", count: "true", params: "id,user_id,title,up_timestamp,img", category: "entertainment"
            },
            success: function(r) {
                var str = JSON.stringify(r);
                var obj = JSON.parse(str);
                console.log(obj);
                var loopTotal = obj.length-1;
    
                if (typeof obj.message === 'undefined'){
                    showNews = true;

                    var loop = 0
                    while (loop < loopTotal){
                        displayNews += "<ons-card onclick=\"article("+obj[loop].id+");\">";
                        displayNews += "<div class=\"title\">"+obj[loop].title+"</div>";
                        displayNews += "<div class=\"content\"><p><strong>"+obj[loop].user_details.fname+" "+obj[loop].user_details.lname+"</strong><br/>"+obj[loop].date_time+"</p></div>";
                        displayNews += "</ons-card>";
                        loop++;
                        totalArticleCount_2++;
                    }
                    endArticleTimestamp_2 = obj[loop-1].up_timestamp;
                }
            },
            complete: function() {
                $.ajax({
                    url: apiLink+"article.php",
                    type: "get",
                    data: {
                        count: "only_count", category: "entertainment"
                    },
                    success: function(r) {
                        var str = JSON.stringify(r);
                        var obj = JSON.parse(str);
                        ServerArticlesCount = parseInt(obj.article_count);
                    }, 
                    complete: function(){
                        if (showNews){
                            if (ServerArticlesCount > totalArticleCount_2) {
                                setTimeout(function(){
                                    EntertainmentNewsError.style.display = "none";
                                    EntertainmentNewsContent.innerHTML = displayNews;
                                    EntertainmentNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" onclick=\"load_more('entertainment-news');\">Load More</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);   
                            }
                            else {
                                setTimeout(function(){
                                    EntertainmentNewsError.style.display = "none";
                                    EntertainmentNewsContent.innerHTML = displayNews;
                                    EntertainmentNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" disabled>End of All Articles</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);
                            }
                        }
                        else {
                            setTimeout(function(){
                                EntertainmentNewsError.style.display = "initial";
                                EntertainmentNewsLoad.style.display = "none";
                                pullHook.removeAttribute('disabled');
                            },2000);
                        }
                    }
                });
            }
        });
    }
}
else if (event.target.matches('#news-news')) {
    var pullHook = document.getElementById('pull-hook-news');
    pullHook.addEventListener('changestate', function(event) {
        var message = '';
    
        switch (event.state) {
        case 'initial':
            message = 'Pull to refresh';
            break;
        case 'action':
            NewsNews(true);
            message = '<ons-progress-circular indeterminate style="margin-top: 10px;"></ons-progress-circular>';
            break;
        }
    
        pullHook.innerHTML = message;
    });
    
    pullHook.onAction = function(done) {
        setTimeout(done, 1000);
    };

    var NewsNewsContent = document.getElementById('news-news-content');
    var NewsNewsError = document.getElementById('news-news-error');
    var NewsNewsLoad = document.getElementById('news-news-load');

    NewsNews(true);

    function NewsNews(reset){
        if (reset) {
            totalArticleCount_2 = 0;
        }
        var ServerArticlesCount = 0;
        var currentTimestamp = Math.floor(Date.now() / 1000);
        var showNews = false;
        var displayNews = "";
        $.ajax({
            url: apiLink+"article.php",
            type: "get",
            data: {
                start: currentTimestamp, limit: "20", count: "true", params: "id,user_id,title,up_timestamp,img", category: "news"
            },
            success: function(r) {
                var str = JSON.stringify(r);
                var obj = JSON.parse(str);
                console.log(obj);
                var loopTotal = obj.length-1;
    
                if (typeof obj.message === 'undefined'){
                    showNews = true;

                    var loop = 0
                    while (loop < loopTotal){
                        displayNews += "<ons-card onclick=\"article("+obj[loop].id+");\">";
                        displayNews += "<div class=\"title\">"+obj[loop].title+"</div>";
                        displayNews += "<div class=\"content\"><p><strong>"+obj[loop].user_details.fname+" "+obj[loop].user_details.lname+"</strong><br/>"+obj[loop].date_time+"</p></div>";
                        displayNews += "</ons-card>";
                        loop++;
                        totalArticleCount_2++;
                    }
                    endArticleTimestamp_2 = obj[loop-1].up_timestamp;
                }
            },
            complete: function() {
                $.ajax({
                    url: apiLink+"article.php",
                    type: "get",
                    data: {
                        count: "only_count", category: "news"
                    },
                    success: function(r) {
                        var str = JSON.stringify(r);
                        var obj = JSON.parse(str);
                        ServerArticlesCount = parseInt(obj.article_count);
                    }, 
                    complete: function(){
                        if (showNews){
                            if (ServerArticlesCount > totalArticleCount_2) {
                                setTimeout(function(){
                                    NewsNewsError.style.display = "none";
                                    NewsNewsContent.innerHTML = displayNews;
                                    NewsNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" onclick=\"load_more('entertainment-news');\">Load More</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);   
                            }
                            else {
                                setTimeout(function(){
                                    NewsNewsError.style.display = "none";
                                    NewsNewsContent.innerHTML = displayNews;
                                    NewsNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" disabled>End of All Articles</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);
                            }
                        }
                        else {
                            setTimeout(function(){
                                NewsNewsError.style.display = "initial";
                                NewsNewsLoad.style.display = "none";
                                pullHook.removeAttribute('disabled');
                            },2000);
                        }
                    }
                });
            }
        });
    }
}
else if (event.target.matches('#all-news')) {
    sw = document.getElementById('dark_mode');
    if ((storage.getItem("dark_mode")=="on")||(storage.getItem("dark_mode")==null)) {
        sw.setAttribute("checked");
    }
    else {
        sw.removeAttribute("checked");
    }
    var pullHook = document.getElementById('pull-hook');
    pullHook.addEventListener('changestate', function(event) {
        var message = '';
    
        switch (event.state) {
        case 'initial':
            message = 'Pull to refresh';
            break;
        case 'action':
            AllNews(true);
            message = '<ons-progress-circular indeterminate style="margin-top: 10px;"></ons-progress-circular>';
            break;
        }
    
        pullHook.innerHTML = message;
    });

    pullHook.onAction = function(done) {
        setTimeout(done, 1000);
    };

    // document.addEventListener("backbutton", function(){
    //     menu.setAttribute('swipeable');
    // }, false);
    // document.getElementById('backButton').addEventListener('click',function(){
    //     menu.setAttribute('swipeable');
    // });

    var AllNewsContent = document.getElementById('all-news-content');
    var AllNewsError = document.getElementById('all-news-error');
    var AllNewsLoad = document.getElementById('all-news-load');

    AllNews(true);

    function AllNews(reset){
        if (reset) {
            totalArticleCount = 0;
        }
        var ServerArticlesCount = 0;
        var currentTimestamp = Math.floor(Date.now() / 1000);
        var showNews = false;
        var displayNews = "";
        $.ajax({
            url: apiLink+"article.php",
            type: "get",
            data: {
                start: currentTimestamp, limit: "20", count: "true", params: "id,user_id,title,up_timestamp,img"
            },
            success: function(r) {
                var str = JSON.stringify(r);
                var obj = JSON.parse(str);
                console.log(obj);
                var loopTotal = obj.length-1;
    
                if (typeof obj.message === 'undefined'){
                    showNews = true;

                    var loop = 0
                    while (loop < loopTotal){
                        displayNews += "<ons-card onclick=\"article("+obj[loop].id+");\">";
                        displayNews += "<div class=\"title\">"+obj[loop].title+"</div>";
                        if (obj[loop].img != ""){
                            displayNews += "<img src=\""+obj[loop].img+"\" width=\"100%\">";
                        }
                        displayNews += "<div class=\"content\"><p><strong>"+obj[loop].user_details.fname+" "+obj[loop].user_details.lname+"</strong><br/>"+obj[loop].date_time+"</p></div>";
                        displayNews += "</ons-card>";
                        loop++;
                        totalArticleCount++;
                    }
                    endArticleTimestamp = obj[loop-1].up_timestamp;
                }
            },
            complete: function() {
                $.ajax({
                    url: apiLink+"article.php",
                    type: "get",
                    data: {
                        count: "only_count"
                    },
                    success: function(r) {
                        var str = JSON.stringify(r);
                        var obj = JSON.parse(str);
                        ServerArticlesCount = parseInt(obj.article_count);
                    }, 
                    complete: function(){
                        if (showNews){
                            if (ServerArticlesCount > totalArticleCount) {
                                setTimeout(function(){
                                    AllNewsError.style.display = "none";
                                    AllNewsContent.innerHTML = displayNews;
                                    AllNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" onclick=\"load_more('all-news');\">Load More</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);   
                            }
                            else {
                                setTimeout(function(){
                                    AllNewsError.style.display = "none";
                                    AllNewsContent.innerHTML = displayNews;
                                    AllNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" disabled>End of All Articles</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);
                            }
                        }
                        else {
                            setTimeout(function(){
                                AllNewsError.style.display = "initial";
                                AllNewsLoad.style.display = "none";
                                pullHook.removeAttribute('disabled');
                            },2000);
                        }
                    }
                });
            }
        });
    }
}
else if (event.target.matches('#about')){
    // document.addEventListener("backbutton", function(){
    //     menu.setAttribute('swipeable');
    // }, false);
    // document.getElementById('backButton').addEventListener('click',function(){
    //     menu.setAttribute('swipeable');
    // });
}
else if (event.target.matches('#article')){
    console.log(page.data.article_id);

    $.ajax({
        url: apiLink+"article.php",
        type: "get",
        data: {
            article_id: page.data.article_id
        },
        success: function(r) {
            var str = JSON.stringify(r);
            var obj = JSON.parse(str);
            console.log(obj);
            document.getElementById("article-title").innerHTML = "<strong>"+obj[0].title+"</strong>";
            document.getElementById("article-writer").innerHTML = "<i>"+obj[0].user_details.fname+" "+obj[0].user_details.lname+"</i>";
            document.getElementById("article-datetime").innerHTML = obj[0].date_time;
            document.getElementById("article-body").innerHTML = obj[0].body;
        }, 
        complete: function(){
            setTimeout(function(){
                document.getElementById("article-load").style.display = "none";
                document.getElementById("article-content").style.display = "initial";
            },3000);
        }
    });

    // document.addEventListener("backbutton", function(){
    //     menu.setAttribute('swipeable');
    // }, false);
    // document.getElementById('backButton').addEventListener('click',function(){
    //     menu.setAttribute('swipeable');
    // });
}
}, false);

function article(id){
    //menu.removeAttribute('swipeable');
    content.pushPage("article.html", {
        data: {
            article_id: id
        }
    });
}
