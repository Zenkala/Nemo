//test.js. We do stuff external, to keep it tidy.
var context;
var canvas;


//this function will be called every time a new slide is called
function newSlideHdl(index, backwards){
	console.log("newSlideHdl called " + index + " backwards: " + backwards);	
	if(index==1){
		//jQuery.Edge.getComposition( "starcrafts" ).getStage().stop(0);
	}
}

//this function will be called every time a new slide has stopped moving and is now standing in it's new position
function newSlideStopHdl(index, backwards){
	console.log("newSlideStopHdlcalled " + index + " backwards: " + backwards);
	if(index==1){
		//jQuery.Edge.getComposition( "starcrafts" ).getStage().play(0);
	}
}
		
function onLoad(){	
	console.log("------------onLoad------------");
	$(function() {
    	$(".ph_Hatching_red").draggable();
    	$(".ph_Hatching_green").draggable();
    	$(".ph_Hatching_blue").draggable();
    	console.log("made draggable");
    });
}