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
	var uniqueId = dwscripts.getUniqueId("nm_Slider");
  return '<div class="nm_Slider autoGenerate" id="' + uniqueId + '" style="position: absolute; width: 200px; height: 100px; top: 200px; left: 50px;"></div>';
}

