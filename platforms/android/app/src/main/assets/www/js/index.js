const apiLink = "http://192.168.254.101/onlinepublishing-v2/api/";
//const apiLink = "http://127.0.0.1/onlinepublishing-v2/api/";

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    //navigator.splashscreen.show();
}

var content = document.getElementById('content');
var storage = window.localStorage;

window.load = function(){
    content.replacePage('splashcreen.html');
}

// console.log(storage.getItem("access_token"));

if (storage.getItem("access_token")!=null) {
    setTimeout(function () {
        content.replacePage('home.html');
        var menu = document.getElementById('menu');
        menu.setAttribute('swipeable');
        menu.load('menu.html');
    },3000);
}
else {
    setTimeout(function () {
        content.replacePage('login.html');
    },3000);
}


// DARK MODE SWITCH
function darkModeSwitch(){
    var sw = document.getElementById('dark_mode');
    if (sw.checked) {
        var cssStyle=document.getElementById('css_style');
        cssStyle.setAttribute("href","onsenui/css/dark-onsen-css-components.min.css");
        console.log('DARK');
    }
    else {
        var cssStyle=document.getElementById('css_style');
        cssStyle.setAttribute("href","onsenui/css/onsen-css-components.min.css");
        console.log('LIGHT');
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
        menu.removeAttribute('swipeable');
        menu.close();
        content.pushPage(page);
    }
    else if (page == "all-news.html") {
        menu.removeAttribute('swipeable');
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
                        menu.setAttribute('swipeable');
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
                        storage.removeItem("access_token");
                        // console.log(storage.getItem("access_token"));
                    }
                },
                complete: function() {
                    if (readyOnNext){
                        setTimeout(function(){
                            document.getElementById('logout-process-dialog').hide();
                            menu.removeAttribute('swipeable');
                            content.replacePage('login.html').then(menu.close.bind(menu));
                            menu.innerHTML = "";
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
    $.ajax({
        url: apiLink+"article.php",
        type: "get",
        data: {
            start: endArticleTimestamp-1, limit: "10"
        },
        success: function(r) {
            var str = JSON.stringify(r);
            var obj = JSON.parse(str);
            var loopTotal = obj.length;

            if (typeof obj.message === 'undefined'){
                var loop = 0
                while (loop < loopTotal){
                    displayNews = "";
                    displayNews += "<ons-card onclick=\"article();\">";
                    displayNews += "<div class=\"title\">"+obj[loop].title+"</div>";
                    displayNews += "<div class=\"content\"><p><strong>"+obj[loop].user_details.fname+" "+obj[loop].user_details.lname+"</strong><br/>"+obj[loop].date_time+"</p></div>";
                    displayNews += "</ons-card>";
                    loop++;
                    totalArticleCount++;
                    $("#"+target_id+"-content").append(displayNews);
                }
                endArticleTimestamp = obj[loop-1].up_timestamp;
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
                data: {
                    count: "only_count"
                },
                success: function(r) {
                    var str = JSON.stringify(r);
                    var obj = JSON.parse(str);
                    ServerArticlesCount = parseInt(obj.article_count);
                    // console.log(ServerArticlesCount);
                }, 
                complete: function(){
                    if (ServerArticlesCount > totalArticleCount) {
                        setTimeout(function(){
                            document.getElementById(target_id+"-load").innerHTML = "<ons-button modifier=\"large--quiet\" onclick=\"load_more('all-news');\">Load More</ons-button>";
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
var totalArticleCount = 0;
var latestNewsError, latestNewsContent;
document.addEventListener('init', function(event) {
var page = event.target;
console.log(page.id);
if (event.target.matches('#latest-news')) {
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
                start: currentTimestamp, limit: "20"
            },
            success: function(r) {
                var str = JSON.stringify(r);
                var obj = JSON.parse(str);
                var loopTotal = obj.length;
    
                if (typeof obj.message === 'undefined'){
                    showNews = true;
                    var loop = 0
                    while (loop < loopTotal){
                        displayNews += "<ons-card onclick=\"article();\">";
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
            message = '<ons-progress-circular indeterminate></ons-progress-circular>';
            break;
        }
    
        pullHook.innerHTML = message;
    });
    
    pullHook.onAction = function(done) {
        setTimeout(done, 1000);
    };
}
else if (event.target.matches('#all-news')) {
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

    document.addEventListener("backbutton", function(){
        menu.setAttribute('swipeable');
    }, false);
    document.getElementById('backButton').addEventListener('click',function(){
        menu.setAttribute('swipeable');
    });
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
                start: currentTimestamp, limit: "20", count: "true"
            },
            success: function(r) {
                var str = JSON.stringify(r);
                var obj = JSON.parse(str);
                var loopTotal = obj.length-1;
    
                if (typeof obj.message === 'undefined'){
                    showNews = true;
                    var loop = 0
                    while (loop < loopTotal){
                        displayNews += "<ons-card onclick=\"article();\">";
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
                                    AllNewsContent.innerHTML = displayNews;
                                    AllNewsLoad.innerHTML = "<ons-button modifier=\"large--quiet\" onclick=\"load_more('all-news');\">Load More</ons-button>";
                                    pullHook.removeAttribute('disabled');
                                },2000);   
                            }
                            else {
                                setTimeout(function(){
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
    document.addEventListener("backbutton", function(){
        menu.setAttribute('swipeable');
    }, false);
    document.getElementById('backButton').addEventListener('click',function(){
        menu.setAttribute('swipeable');
    });
}
}, false);

function article(){
    content.pushPage("article.html");
}
