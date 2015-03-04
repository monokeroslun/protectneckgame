//这是一个逗逼的游戏
var getWidth = function() {
    return parseFloat(document.documentElement.clientWidth);
}
var getHeight = function() {
    return parseFloat(document.documentElement.clientHeight);
}
function Game(){
	var dropBox = null;
    //进度条
    var processBar = null;
    //计分板
    var scoreBord = null;
    //玩家
    var player = null;
    //降落区
    var playYard = null;
    var box1 = null;
    var box2 = null;
    var width = 0;
    var height = 0;
    //摄像头
    var video = null;
    var canvas = null;

     function init(loginSrc) {
        background = document.createElement("div");
        var main = document.getElementById("main");
        width = getWidth();
        height = getHeight();
        main.style.width = width + "px";
        main.style.height = height +"px";
        main.appendChild(background);
        background.id = "background";
        processBar = ProcessBar();
        scoreBord = ScoreBord();
        box1 = faceBox();
        box2 = Box("box2");
        box2.setLogin(loginSrc);
        player = Player();
        dropBox = DropBox();
        processBar.init(30);
        background.appendChild(processBar);
        background.appendChild(scoreBord);
        background.appendChild(dropBox);
        background.appendChild(player);
        background.appendChild(box1);
        background.appendChild(box2);
        video = document.createElement("video");
        video.autoplay="true";
        video.id = "video";
        box1.appendChild(video);
        canvas = document.createElement("canvas");
        canvas.id = "faceCanvas";
        box2.appendChild(canvas);
        $(canvas).hide();
        navigator.webkitGetUserMedia({video:true},
                                     function(stream) {
                                         video.src = window.URL.createObjectURL(stream);
                                         setTimeout(function(){
                                             canvas.width = video.videoWidth;
                                             canvas.height = video.videoHeight;
                                         },100);
                                     },
                                     function(stream){
                                         alert("sb");
                                     });
    }
    this.start = function() {
        processBar.start();
                var l = [5000,6000,7000,9000];
        function action(x,y,cell) {
            console.log(x,y);
            if ( x !== y ) {
                player.miss();
                $(cell).hide();
                return;
            }
            if ( x === -1 ) {
                player.turnRight();
                return;
            }
            if ( x === 1 ) {
                player.turnLeft();
                return;
            }
            player.miss();
        }
        for ( var i in l ) {
            if ( i%2 == 0 ) {
                dropBox.cell(-1,l[i],action);
            } else {
                dropBox.cell(1,l[i],action);
            }
        }
    }
    this.setInstrument = function(str) {
        box2.setInstrument(str);
    }
    this.init = init;
    return this;
}
function ProcessBar() {
    var music = document.createElement("audio");
    music.src = "/music/apple.mp3";
    var processBar = document.createElement("div");
    processBar.id = "processBar";
    var cl1 = "#bce35d";
    var head = document.createElement("div");
    head.id = "head";
    var processBack = document.createElement("div");
    processBack.id = "processBack";
    var processBarInner = document.createElement("div");
    processBarInner.id = "processBarInner";
    processBarInner.style.background = cl1;
    processBar.appendChild(head);
    processBar.appendChild(processBack);
    processBack.appendChild(processBarInner);
    var time = 0;
    function init( t ) {
        time = t;
        processBarInner.width = 0;
    }
    function start(callback) {
        music.play();
        $(processBarInner).animate({
            width : "360px"
        },time,"linear",function() {
                    if (callback) {
                        callback();
                    }
        });
    }
    processBar.init = init;
    processBar.start = start;
    return processBar;
}

function ScoreBord() {
    var scoreBordDiv = document.createElement("div");
    var score = 0;
    function showScore( x ) {
        if ( x ) {
            score = x;
        }
        var str = ""+score;
        var t = 6-str.length;
        for ( var i = 0; i < t; i++ ) {
            str = "0"+str;
        }
        // $(scoreBordDiv).animate({
        //     innerHTML : str
        // },100);
        scoreBordDiv.innerHTML = str;
    }
    scoreBordDiv.id = "scoreBord";
    scoreBordDiv.incScore = function ( x ) {
        score += x;
        showScore();
    };
    scoreBordDiv.getScore = function () {
        return score;
    }
    scoreBordDiv.incScore(999);
    scoreBordDiv.incScore(1000);
    return scoreBordDiv;
}

function DropBox() {
    var dropBox = document.createElement("div");
    dropBox.id = "dropBox";
    var scoreBox = document.createElement("div");
    scoreBox.id = "scoreBox";
    dropBox.appendChild(scoreBox);
    var dropTime = 4000;
    var testTime = 2000;
    var kinds = 4;
    var name = "img/fruit";
    function cell(direction,time,callback) {
        var pic = document.createElement("div");
        pic.className = "dropBoxCell";
        var num = Math.random()*kinds;
        var num = Math.ceil(num);
        var src = name+num+".png";
        pic.style.backgroundImage = "url('"+src+"')";
        if ( direction === -1 ) {
            pic.style.left = 0;
        }
        if ( direction === 1 ) {
            pic.style.right = 0;
        }
        dropBox.appendChild(pic);
        $(pic).hide();
        setTimeout(function() {
            $(pic).show();
            var now = 90;
            pic.style.top = 0;
            $(pic).animate({
                top : "100%",
            },dropTime,function(){
            });
            setTimeout(function() {
                leftOrRight(document.getElementById("faceCanvas"),callback,direction);
            },dropTime-testTime);
        },time);
    }
    dropBox.cell = cell;
    return dropBox;
}

function Player() {
    var pre = 0.8;
    var dur = 500;
    var set = 0;
    var playerDiv = document.createElement("div");
    var l = 0;
    var delta = 40;
    playerDiv.id = "player";
    var img = document.createElement("img");
    img.src = "img/playerStand.png";
    img.onload = function() {
        if ( set === 1 ) {
            return;
        }
        set = 1;
        img.style.width = $(img).width()*pre;
        img.style.height = $(img).height()*pre;
        playerDiv.style.width = $(img).width();
        l = (getWidth()/2-$(img).width()/2);
        playerDiv.style.left = l+"px";
    }
    function turnLeft() {
        img.src = "img/playerLeft.png";
        playerDiv.style.left = l-delta+"px";
        setTimeout(function(){
            img.src = "img/playerStand.png";
            playerDiv.style.left = l+"px";
        },dur);
    }
    function turnRight() {
        img.src = "img/playerRight.png";
        playerDiv.style.left = l+delta+"px";
        setTimeout(function(){
            img.src = "img/playerStand.png";
            playerDiv.style.left = l+"px";
        },dur);
    }
    function miss() {
        img.src = "img/playerSad.png";
        playerDiv.style.left = l+"px";
        setTimeout(function(){
            img.src = "img/playerStand.png";
            playerDiv.style.left = l+"px";
        },dur);
    }
    $(playerDiv).on("click",function(){
        miss();
    });
    img.style.height = "40%";
    playerDiv.appendChild(img);
    playerDiv.turnLeft = turnLeft;
    playerDiv.turnRight = turnRight;
    playerDiv.miss = miss;
    return playerDiv;
}


function faceBox() {
    var faceBox = document.createElement("div");
    faceBox.id = "faceBox";
    var frontDiv = document.createElement("div");
    frontDiv.id = "frontDiv";
    faceBox.appendChild(frontDiv);
    return faceBox;
}


function Box(id) {
    var boxDiv = document.createElement("div");
    boxDiv.id = id;
    var login = document.createElement("div");
    login.id = "login";
    boxDiv.appendChild(login);
    var p = 0.08;
    login.style.width = getWidth()*p+"px";
    login.style.height = getWidth()*p+"px";
    boxDiv.setLogin = function(src) {
        login.style.backgroundImage = "url('"+src+"')";
    }
    var instrument = document.createElement("div");
    instrument.id = "instrument";
    instrument.style.left = 40+getWidth()*p+"px";
    instrument.style.top = "35px";
    instrument.style.width = getWidth()*p+"px";
    instrument.style.height = getWidth()*p+"px";
    boxDiv.appendChild(instrument);
    boxDiv.setInstrument = function (str) {
        instrument.innerHTML = str;
    }
    return boxDiv;
}

function main(){
	var game = Game();
	 game.init("img/fruit1.png");
	   game.setInstrument("haha");
    game.start();
}

function leftOrRight(canvas,callback,direction) {
    var api_key = "e2120ceb156841b3faf183b2772d2e07";
    var api_secret = "ETlUVLLzCUmZNwMSdeS6jMb4fOynm_2h";
    var context = canvas.getContext("2d");
    var ac = callback;
    context.drawImage(video,0,0);
    canvas.toBlob(function(blob) {
        var api = new FacePP(api_key,api_secret);
        api.request('detection/detect', {
            attribute: "pose",
            img: blob
        }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                // TODO use result
                var posea = result['face'][0].attribute.pose.roll_angle.value;
                var posenumber = parseFloat(posea);
                if (posenumber > 20) {
                    callback(1,direction);
                    return;
                } else if (posenumber < (-20)) {
                    callback(-1,direction);
                    return;
                }

            }
        });
    }, 'image/jpeg');
}

window.onload = function () {
    main();
}