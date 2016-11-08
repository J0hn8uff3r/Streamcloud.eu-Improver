// ==UserScript==
// @name        Streamcloud.eu Improver
// @author		J0hn 8uff3r 0v3rf10w
// @namespace   https://github.com/J0hn8uff3r
// @license		GNU General Public License v3.0
// @description Large amount of improvements for Streamcloud.eu
// @include     http://*streamcloud.eu/*
// @released	08/11/2016
// @version     1.2.0
// @downloadURL https://github.com/J0hn8uff3r/Streamcloud.eu-Improver/raw/master/Streamcloud.eu_Improver.user.js
// @updateURL   https://github.com/J0hn8uff3r/Streamcloud.eu-Improver/raw/master/Streamcloud.eu_Improver.user.js
// @grant       none
// ==/UserScript==
/*TODO
Bypass wait time
Hide playbar if cursor is out the video frame document.getElementById("mediaplayer_controlbar").style.opacity = 1;
Add video download link
Adapt mediaplayer_display to browser window
*/
/*Improvements
A-Play/Stop video using spacebar even if you clicked outside the video frame
B-Avoid default scroll down default action when spacebar is pressed
C-Clean unnecessary elements
D-Control volume using mouse wheel
E-Hide mouse cursor on idle even if you'r not using fullscreen option
F-Set video controlbar below videoplayer

************Options************
1-Control volume gain %
2-Choose your desired default start volume % 
3-Skip video to desired position at start, so you can skip a tv show intro setting start_minute and start_second (Editable from site on version 1.2.0)
4-Choose desired lights level, within a range from 0 to 1 increasing 0.1
5-You can choose if you want to start video normal or in fullscreen: [0]{Default} & [1]{Fullscreen}
************Options************
*/
var vol_gain = 10; //Option 1
var volume = 20; //Option 2
var lights_level = 0; //Option 4
var video_size = 0; //Option 5
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor); //Check web browser

//(Feature disabled until proper fix)
//setInterval(function() { //Move controlbar below videoplayer
//    document.getElementById("mediaplayer_controlbar").style.bottom = "-30px";
//    document.getElementById("mediaplayer_controlbar").style.display = "inline-block";
//}, 1);

(function () {
var scriptElement = document.createElement('script');
scriptElement.innerHTML = 'function skipSet() {var start_minute = parseInt(document.getElementById("minutes").value);var start_second = parseInt(document.getElementById("seconds").value);document.cookie = "start_minute="+start_minute+"; path=/";document.cookie = "start_second="+start_second+"; path=/";start_minute = start_minute * 60;jwplayer().seek((start_minute + start_second));}';
document.body.appendChild( scriptElement );
})();

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function volControl(control) {
    if (control == "up") {
        if (volume <= 100) {
            volume += vol_gain;
            jwplayer().setVolume(volume);
            // document.cookie = "jwplayer.volume=volume; path=/";
            if (volume < 100) { //Check volume again to avoid print Volume 100%
                document.getElementById("mediaplayer_display").innerHTML = "<h2 style='color:yellow;'>" + volume + "% Vol Up</h2>";
                setTimeout(function() {
                    document.getElementById("mediaplayer_display").innerHTML = "";
                }, 4000);
            } else { //Vol max
                volume = 100;
                jwplayer().setVolume(volume);
                // document.cookie = "jwplayer.volume=volume; path=/";
                document.getElementById("mediaplayer_display").innerHTML = "<h2 style='color:red;'>Vol Max</h2>";
                setTimeout(function() {
                    document.getElementById("mediaplayer_display").innerHTML = "";
                }, 4000);
            }
        }
    } else if (control == "down") {
        if (volume >= 0) {
            volume -= vol_gain;
            jwplayer().setVolume(volume);
            // document.cookie = "jwplayer.volume=volume; path=/";
            if (volume > 0) { //Check volume again to avoid print Volume 0%
                document.getElementById("mediaplayer_display").innerHTML = "<h2 style='color:yellow;'>" + volume + "% Vol Down</h2>";
                setTimeout(function() {
                    document.getElementById("mediaplayer_display").innerHTML = "";
                }, 4000);
            } else { //Sound muted
                volume = 0;
                jwplayer().setVolume(volume);
                // document.cookie = "jwplayer.volume=volume; path=/";
                document.getElementById("mediaplayer_display").innerHTML = "<h2 style='color:white;'>Muted</h2>";
                setTimeout(function() {
                    document.getElementById("mediaplayer_display").innerHTML = "";
                }, 4000);
            }
        }
    }
}

//Hide mouse cursor on idle
var timeout;
document.onmousemove = function() {
    clearTimeout(timeout);
    document.body.style.cursor = "";
    timeout = setTimeout(function() {
        document.body.style.cursor = "none";
    }, 5000);
}

setTimeout(function() {
    document.getElementsByClassName('proform')[0].submit();
}, 11000);
document.getElementById("header").remove();
document.getElementById("footer").remove();

setTimeout(function() {
    var start_minute = parseInt(readCookie("start_minute"));
	var start_second = parseInt(readCookie("start_second"));
	
	if (isNaN(start_minute) && isNaN(start_second)){
		document.getElementById("minutes").value=0;
		document.getElementById("seconds").value=0;
	} else {
		document.getElementById("minutes").value=start_minute;
		document.getElementById("seconds").value=start_second;
	}
	
	start_minute = start_minute * 60;
	jwplayer().seek((start_minute + start_second));
	document.getElementById("mediaplayer_display_button").remove();
}, 1000);

document.getElementById("vmenubar").innerHTML = "<table align='center' style='margin: 0px auto;'><tr><td>Init Mins</td><td>Init Secs</td></tr><tr><td><input id='minutes' type='number' value='0' min='0' max='9999' onKeyUp='if(this.value>9999){this.value=9999;}else if(this.value<0){this.value=0;}else {skipSet();}'></td><td><input id='seconds' type='number' value='0' min='0' max='59' onKeyUp='if(this.value>59){this.value=59;}else if(this.value<0){this.value=0;}else {skipSet();}'></td></tr></table>";

if (video_size == 1) jwplayer().setFullscreen(true);


document.getElementById("the_lights").style.height = window.innerHeight - 20 + "px";
document.getElementById("the_lights").style.display = "block";
document.getElementById("the_lights").style.opacity = lights_level;
//document.getElementById("vmenubar").remove();


jwplayer().setVolume(volume);
// document.cookie = "jwplayer.volume=volume; path=/";
document.getElementsByClassName("header page")[0].getElementsByTagName('h1')[0].style.fontSize = "23px";

window.onkeydown = function(e) {
    if (e.keyCode == 32 && e.target == document.body) {
        var state = document.getElementById("mediaplayer").className;
        var state = state.split("  ").pop();
        if (state == "jw-user-inactive") { //Check if mouse cursor is placed outside video div to hide
            document.getElementById("mediaplayer_controlbar").style.opacity = 0;
        }
        jwplayer().play();
        e.preventDefault();
        return false;
    }
};

if (isChrome) { //It's Chrome
    $('body').on('mousewheel', function(e) {
        if (e.originalEvent.wheelDelta == 120) { // Vol Up
            volControl("up");
        } else if (e.originalEvent.wheelDelta == -120) { // Vol Down
            volControl("down");
        }
    });
} else { //It's Firefox
    $('body').on('mousewheel DOMMouseScroll', function(e) {
        if (e.originalEvent.detail == -3) { // Vol Up
            volControl("up");
        } else if (e.originalEvent.detail == 3) { // Vol Down
            volControl("down");
        }
    });
}
