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
	var uniqueId = dwscripts.getUniqueId("nm_Highlight");
	var selType = nm.getSelectionType();
	var errMsg = "Please click inside the slide.";

	if(selType == 2) {
		errMsg = "It is not possible to add a highlight to an experiment pane. Please add this component to the slide.";
	} else if (selType == 1) {
		errMsg = "";
		dom.insertHTML('<span class="nm_Highlight_blue" id="' + uniqueId + '" style="position: absolute; left: 350px; top: 300px; width: 200px; height: 130px;"></span>', false);
	} else {
		errMsg = "";
		var activeSlide = nm.getActiveSlideNode();
		var inner = activeSlide.innerHTML;
		inner += '<span class="nm_Highlight_blue" id="' + uniqueId + '" style="position: absolute; left: 350px; top: 300px; width: 200px; height: 130px;"></span>';
		activeSlide.innerHTML = inner;
	}
	return errMsg;	
}