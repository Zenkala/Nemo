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
	var uniqueId = dwscripts.getUniqueId("qItem");
	return '<div class="nm_qItem" id="' + uniqueId +'"><input type="radio" id="input_' + uniqueId + '" /><label for="input_' + uniqueId + '"><span><span></span></span>Label</label></div>';
}

