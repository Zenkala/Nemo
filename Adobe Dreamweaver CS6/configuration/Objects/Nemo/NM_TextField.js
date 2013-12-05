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
	var uniqueId = dwscripts.getUniqueId("nm_TextField");
	var selType = nm.getSelectionType();
	var errMsg = "Please click inside the slide.";

	if(selType == 1) {
		errMsg = "";
		dom.insertHTML('<div class="nm_TextField" id="' + uniqueId + '" style="position: absolute; left: 350px; top:300px;"><p>Lorem ipsum</p></div>', false);
	} else if (selType == 2) {
		errMsg = "";
		dom.insertHTML('<div class="nm_TextField" id="' + uniqueId + '" style="position: relative; width: 100px;"><p>Lorem ipsum</p></div>', false);
	} else {
		errMsg = "";
		var activeSlide = nm.getActiveSlideNode();
		var inner = activeSlide.innerHTML;
		inner += '<div class="nm_TextField" id="' + uniqueId + '" style="position: absolute; left: 350px; top:300px;"><p>Lorem ipsum</p></div>';
		activeSlide.innerHTML = inner;
	}

	return errMsg;
}