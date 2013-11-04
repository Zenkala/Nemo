// Copyright 2000, 2001, 2002, 2003, 2004, 2005 Macromedia, Inc. All rights reserved.

//---------------     API FUNCTIONS    ---------------

function isDOMRequired() {
	// Return false, indicating that this object is available in code view.
	return true;
}

function isAsset() {
	return true;
}

function objectTag(assetArgs) {
	var theDOM = dw.getDocumentDOM();
	var uniqueId = dwscripts.getUniqueId("info");
	return '<div class="nm_InfoBlock" id="' + uniqueId + '" style="position: absolute; left: 100px; top:300px;"><div class="circle"><div class="content">?</div></div><div class="title">Title<div class="opencloseLid">&gt;</div></div><div class="paragraph">Content</div></div>';
}

