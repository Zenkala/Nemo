//this function is never called. But this file is loaded at the very end of nemoInit.
//When parsed yepnope fires the complete event, and then we know all previous javascript files are ready to be used.
//This is needed since apparantly, yepnope isn't perfect with it's complete callbacks.
function nemoInitDone () {
	console.log("FINISHED.JS!");
}