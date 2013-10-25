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

	return '<div class="nm_qGroup" id="' + uniqueId +'" type="closed"><div class="nm_qItem" id="' + uniqueId +'A" answer="false"><input type="radio" id="input_' + uniqueId + 'A" /><label for="input_' + uniqueId + '"><span><span></span></span>Label A</label></div><div class="nm_qItem" id="' + uniqueId +'B" answer="false"><input type="radio" id="input_' + uniqueId + 'B" /><label for="input_' + uniqueId + '"><span><span></span></span>Label B</label></div><div class="nm_qItem" id="' + uniqueId +'C" answer="false"><input type="radio" id="input_' + uniqueId + 'C" /><label for="input_' + uniqueId + '"><span><span></span></span>Label C</label></div></div>';
}

