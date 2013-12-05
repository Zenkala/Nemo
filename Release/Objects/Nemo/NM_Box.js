// Copyright 2000, 2001, 2002, 2003, 2004, 2005 Macromedia, Inc. All rights reserved.

//---------------     API FUNCTIONS    ---------------

function isDOMRequired() {
	// Return false, indicating that this object is available in code view.
	return true;
}

function isAsset() {
	return true;
}

function insertObject() {
	var dom = dw.getDocumentDOM();
	var uniqueId = dwscripts.getUniqueId("nm_Box");
	var selType = nm.getSelectionType();
	var errMsg = "Please click inside the slide.";

	if(selType == 2) {
		errMsg = "It is not possible to add boxes to an experiment pane. Please add this component to the slide.";
	} else if (selType == 1) {
		errMsg = "";
		dom.insertHTML('<div class="nm_Box" id="' + uniqueId + '" style="position: absolute; left: 350px; top:300px; width: 100px; height: 100px;"></div>', false);
	} else {
		errMsg = "";
		var activeSlide = nm.getActiveSlideNode();
		var inner = activeSlide.innerHTML;
		inner += '<div class="nm_Box" id="' + uniqueId + '" style="position: absolute; left: 350px; top:300px; width: 100px; height: 100px;"></div>';
		activeSlide.innerHTML = inner;
	}
	return errMsg;	
}