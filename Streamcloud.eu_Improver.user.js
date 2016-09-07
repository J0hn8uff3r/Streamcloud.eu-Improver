// ==UserScript==
// @name        Streamcloud.eu Improver
// @author		J0hn8uff3r
// @namespace   https://github.com/J0hn8uff3r
// @license		GNU General Public License v3.0
// @description Large amount of improvements for Streamcloud.eu
// @include     http://*streamcloud.eu/*
// @released	07/09/2016
// @version     1.0
// @grant       none
// ==/UserScript==
// https://developer.jwplayer.com/jw-player/docs/developer-guide/api/javascript_api_reference/#volume

/*TODO
Bypass wait time
Hide playbar if cursor is out the video frame document.getElementById("mediaplayer_controlbar").style.opacity = 1;
*/

/*
1-Play/Stop video using spacebar even if you clicked outside the video frame
2-Avoid default scroll down default action when spacebar is pressed
3-Clean unnecessary elements
4-Control volume using mouse wheel
5-Hide mouse cursor on idle even if you'r not using fullscreen option

************Options************
6-Control volume gain %
7-Choose your desired default volume % 
8-Skip video to desired position at start, so you can skip a tv show intro setting start_minute and start_second
9-Choose desired lights level, within a range from 0 to 1 increasing 0.1
10-You can choose if you want to start video normal or in fullscreen: [0]{Default} & [1]{Fullscreen}
************Options************
*/

var vol_gain = 10;		//Option 6
var start_vol = 20;		//Option 7
var start_minute = 0;	//Option 8
var start_second = 0;	//Option 8
var lights_level = 0;	//Option 9
var video_size = 0;		//Option 10
var vol = 0;
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor); //Check web browser


// document.getElementById("mediaplayer_controlbar").style.bottom = "200px";
// document.getElementById("mediaplayer_controlbar").style.display = "inline-block";

function volControl(control, volume) {
	jwplayer().setVolume(vol);
	
    if (control == "up") {
        vol += vol_gain;
        jwplayer().setVolume(vol);
		// document.cookie = "jwplayer.volume=vol; path=/";
        document.getElementById("mediaplayer_display").innerHTML = "<h2 style='color:yellow;'>" + vol + "% Vol Up</h2>";
        setTimeout(function() {
            document.getElementById("mediaplayer_display").innerHTML = "";
        }, 4000);
    } else if (control == "down") {
        vol -= vol_gain;
        jwplayer().setVolume(vol);
		// document.cookie = "jwplayer.volume=vol; path=/";
        document.getElementById("mediaplayer_display").innerHTML = "<h2 style='color:yellow;'>" + vol + "% Vol Down</h2>";
        setTimeout(function() {
            document.getElementById("mediaplayer_display").innerHTML = "";
        }, 4000);
    }

}

//Hide mouse cursor on idle
var timeout;
document.onmousemove = function(){
  clearTimeout(timeout);
  document.body.style.cursor = "";
  timeout = setTimeout(function(){document.body.style.cursor = "none";}, 5000);
}

setTimeout(function() {
    // document.getElementById("btn_download").click();
	document.getElementsByClassName('proform')[0].submit();
}, 11000);
document.getElementById("header").remove();
document.getElementById("footer").remove();

setTimeout(function() {
if (start_minute > 0 || start_second > 0) {
	start_minute=start_minute*60;
	jwplayer().seek((start_minute+start_second));
} else{
	document.getElementById("mediaplayer_display_button").remove();
	jwplayer().play();
}
}, 1000);

if (video_size == 1){jwplayer().setFullscreen(true);}


document.getElementById("the_lights").style.height = window.innerHeight-20+"px";
document.getElementById("the_lights").style.display = "block";
document.getElementById("the_lights").style.opacity = lights_level;
document.getElementById("vmenubar").remove();


jwplayer().setVolume(start_vol);
// document.cookie = "jwplayer.volume=start_vol; path=/";
document.getElementsByClassName("header page")[0].getElementsByTagName('h1')[0].style.fontSize = "23px";

window.onkeydown = function(e) {
    if (e.keyCode == 32 && e.target == document.body) {
		var state = document.getElementById("mediaplayer").className;
		var state = state.split("  ").pop();
		if (state == "jw-user-inactive") {//Check if mouse cursor is placed outside video div to hide
			document.getElementById("mediaplayer_controlbar").style.opacity = 0;
		}
        jwplayer().play();
        e.preventDefault();
        return false;
    }
};

if (isChrome == true) { //Is Chrome
    $('body').on('mousewheel', function(e) {
        if (e.originalEvent.wheelDelta > 0 && vol < 100) { // Vol Up
            volControl("up");
        } else if (e.originalEvent.wheelDelta < 0 && vol > 0) { // Vol Down
            volControl("down");
        }
    });
} else { //Not Chrome
    $('body').on('mousewheel DOMMouseScroll', function(e) {
        if (e.originalEvent.detail == -3 && vol < 100) { // Vol Up
            volControl("up");
        } else if (e.originalEvent.detail == 3 && vol > 0) { // Vol Down
            volControl("down");
        }
    });
}
