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
	var uniqueId = dwscripts.getUniqueId("nm_Input");
	var selectionType = nm.getSelectionType();
	var errMsg = "Please click inside the slide.";

	if(selectionType == 1) {
		errMsg = "";
		dom.insertHTML('<input class="nm_Input" id="' + uniqueId + '" style="position: absolute; left: 350px; top:50px; width: 50px; height: 20px;" />', false);
	} else if (selectionType == 2) {
		errMsg = "";
		dom.insertHTML('<input class="nm_Input" id="' + uniqueId + '" style="position: relative; width: 50px; height: 20px;" />', false);
	} else {
		errMsg = "";
		var activeSlide = nm.getActiveSlideNode();
		var inner = activeSlide.innerHTML;
		inner += '<input class="nm_Input" id="' + uniqueId + '" style="position: absolute; left: 350px; top:50px; width: 50px; height: 20px;" />';
		activeSlide.innerHTML = inner;
	}

	return errMsg;
}