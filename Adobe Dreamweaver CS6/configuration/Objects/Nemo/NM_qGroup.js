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
	var uniqueId = dwscripts.getUniqueId("nemoquiz");
	return '<div class="nm_qGroup" id="' + uniqueId +'" type="closed"><label class="nm_qItem" id="' + uniqueId +'A"><input type="radio" id="input_' + uniqueId + 'A" />Label A</label><label class="nm_qItem" id="' + uniqueId +'B"><input type="radio" id="input_' + uniqueId + 'B" />Label B</label><label class="nm_qItem" id="' + uniqueId +'C"><input type="radio" id="input_' + uniqueId + 'C" />Label C</label></div>';
}

