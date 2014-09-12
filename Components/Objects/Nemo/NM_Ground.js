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
	var uniqueId = dwscripts.getUniqueId("nm_Ground");
	var selType = nm.getSelectionType();
	var activeSlide = nm.getActiveSlideNode();
	var errMsg = "";

	var elInnerHTML = dwscripts.getInnerHTML(activeSlide);
	var patt = new RegExp("nm_Ground");
	if(patt.test(elInnerHTML)) {
		errMsg = "The active slide has already a ground.";
	} else {

		if(selType == 2) {
		errMsg = "It is not possible to add a ground to an experiment pane. Please add this component to the slide.";
		} else if (selType == 1) {
			errMsg = "";
			dom.insertHTML('<div class="nm_Ground" id="' + uniqueId + '" style="position: absolute; left: 100px; top:571px;"></div>', false);
		} else {
			errMsg = "";
			var inner = activeSlide.innerHTML;
			inner += '<div class="nm_Ground" id="' + uniqueId + '" style="position: absolute; left: 100px; top:571px;"></div>';
			activeSlide.innerHTML = inner;
		}
	}
	
	return errMsg;	
}

