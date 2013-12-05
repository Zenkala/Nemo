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
	var uniqueId = dwscripts.getUniqueId("nm_Comment");

	var activeSlide = nm.getActiveSlideNode();
	var inner = activeSlide.innerHTML;
	inner += '<div class="comment" style="position: absolute; left: 350px; top:300px;">Comment</div>';
	activeSlide.innerHTML = inner;

	return;
}