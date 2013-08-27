//test.js. We do stuff external, to keep it tidy.

//this function will be called every time a new slide is called
function newSlideHdl(index, backwards){
	console.log("newSlideHdl called " + index + " backwards: " + backwards);	
}

//this function will be called every time a new slide has stopped moving and is now standing in it's new position
function newSlideStopHdl(index, backwards){
	console.log("newSlideStopHdlcalled " + index + " backwards: " + backwards);
	
	if(index==0){ //are we at the first slide?
	}
}
		
//this function will be called once the module is fully realy and all libraries and assets are loaded and available
function onLoad(){	
	console.log("------------onLoad------------");
	$(function() {
    	//initiate stuff here
    });
}