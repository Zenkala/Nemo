﻿//test.js. We do stuff external, to keep it tidy.
var context;
var canvas;


//this function will be called every time a new slide is called
function newSlideHdl(index, backwards){
	console.log("newSlideHdl called " + index + " backwards: " + backwards);	
	
	//if(index==0){ AdobeEdge.getComposition( "edge_walking_test" ).getStage().stop(0); }
	//if(index==1){ AdobeEdge.getComposition( "starcrafts" ).getStage().stop(0); }
	//if(index==2){ AdobeEdge.getComposition( "basic" ).getStage().stop(0); }
}

//this function will be called every time a new slide has stopped moving and is now standing in it's new position
function newSlideStopHdl(index, backwards){
	console.log("newSlideStopHdlcalled " + index + " backwards: " + backwards);
	
	//if(index==0){ console.log("play"); AdobeEdge.getComposition( "edge_walking_test" ).getStage().play(0); }
	//if(index==1){ AdobeEdge.getComposition( "starcrafts" ).getStage().play(0); }
	//if(index==2){ AdobeEdge.getComposition( "basic" ).getStage().play(0); }
}
		
function onLoad(){	
	console.log("------------onLoad------------");
	$(function() {
    	
    	//console.log(AdobeEdge.getComposition( "edge_walking_test" ).getStage());
    });
}