const apiLink = "http://192.168.254.138/onlinepublishing-v2/api/";
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

console.log(storage.getItem("access_token"));

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
    console.log(page);
    content.pushPage(page)
        .then(menu.close.bind(menu));
};

// window.fn.pop = function() {
//   var content = document.getElementById('content');
//   content.popPage();
// };

// Switching Home Tab
document.addEventListener('prechange', function(event) {
    document.querySelector('ons-toolbar .center').innerHTML = event.tabItem.getAttribute('label');
});

// Loading Another News
function load_more(){
    var target = document.getElementById('load_more');
    target.innerHTML = '<ons-progress-circular indeterminate></ons-progress-circular>';
}

function signIn(){
    console.log(storage.getItem("access_token"));
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
                console.log(r);
                if (obj[0].status == "success_login") {
                    console.log("Continue");
                    console.log(obj[0].access_token);
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
    console.log(pw);
    console.log(studentId);
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
                    console.log(r);
                    if (obj.status == "success_logout"){
                        readyOnNext = true;
                        storage.removeItem("access_token");
                        console.log(storage.getItem("access_token"));
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

// ons.ready(function() {
//     var pullHook = document.getElementById('pull-hook');
//     console.log(pullHook);
//     pullHook.addEventListener('changestate', function(event) {
//       var message = '';
  
//       switch (event.state) {
//         case 'initial':
//           message = 'Pull to refresh';
//           break;
//         case 'preaction':
//           message = 'Release';
//           break;
//         case 'action':
//           message = 'Loading...';
//           break;
//       }
  
//       pullHook.innerHTML = message;
//     });
  
//     pullHook.onAction = function(done) {
//       setTimeout(done, 1000);
//     };
//   });

  document.addEventListener('init', function(event) {
    if (event.target.matches('#latest-news')) {
        var pullHook = document.getElementById('pull-hook');
        console.log(pullHook);
        pullHook.addEventListener('changestate', function(event) {
            var message = '';
        
            switch (event.state) {
            case 'initial':
                message = 'Pull to refresh';
                break;
            case 'preaction':
                message = 'Release';
                break;
            case 'action':
                message = 'Loading...';
                break;
            }
        
            pullHook.innerHTML = message;
        });
        
        pullHook.onAction = function(done) {
            setTimeout(done, 1000);
        };
    }
  }, false);
