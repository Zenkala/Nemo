// Copyright 2000, 2001, 2002, 2003 Macromedia, Inc. All rights reserved.
// ******************** GLOBALS ****************************

var helpDoc = MM.HELP_inspDate;

var HE_ID;
var HE_POINTER;
var HE_TARGET;

var ID;
var POINTER;
var TARGET;
// ******************** API ****************************

function canInspectSelection() {
	var dom = dw.getDocumentDOM();
	var theObj = dom.getSelectedNode();
	var r = /\bnm_TextBubble\b/;
	if(r.test(theObj.class)) {
		return true;
	} else {
		return false;
	}
} 

function initializeUI() {
	HE_ID = dwscripts.findDOMObject("theID");
	HE_POINTER = dwscripts.findDOMObject("thePointer");
	HE_TARGET = dwscripts.findDOMObject("theTarget");
}


function inspectSelection() {
	initializeUI();
	setGUI();
}

function setGUI(){
	
	var dom = dw.getDocumentDOM();

	var theObj = dom.getSelectedNode(); 
	
	

	if (theObj.getAttribute("id")) {
		ID = theObj.getAttribute("id");
		HE_ID.value = ID;
	}

	if(theObj.getAttribute("class")) {
		POINTER = theObj.getAttribute("class");
		if(POINTER == "nm_TextBubble top-left")HE_POINTER.selectedIndex = 0;
		if(POINTER == "nm_TextBubble top-middle")HE_POINTER.selectedIndex = 1;
		if(POINTER == "nm_TextBubble top-right")HE_POINTER.selectedIndex = 2;
		if(POINTER == "nm_TextBubble middle-left")HE_POINTER.selectedIndex = 3;
		if(POINTER == "nm_TextBubble middle-right")HE_POINTER.selectedIndex = 4;
		if(POINTER == "nm_TextBubble bottom-left")HE_POINTER.selectedIndex = 5;
		if(POINTER == "nm_TextBubble bottom-middle")HE_POINTER.selectedIndex = 6;
		if(POINTER == "nm_TextBubble bottom-right")HE_POINTER.selectedIndex = 7;
	} else {
		HE_POINTER.selectedIndex = 7;
	}

	if(theObj.getAttribute("target")) {
		TARGET = theObj.getAttribute("target");
		HE_TARGET = TARGET;
	}

}

function updateTag(attrib) {	
	var dom = dw.getDocumentDOM();
	var theObj = dom.getSelectedNode(); //new TagEdit(dom.getSelectedNode().outerHTML);
	
	if (attrib) {
		switch (attrib) {
			case "pointer":
				POINTER = "nm_TextBubble " + HE_POINTER.options[HE_POINTER.selectedIndex].value;
				if (theObj.getAttribute("class") != POINTER && POINTER != "nm_TextBubble") {
					
					theObj.setAttribute("class", POINTER);

				} 
				break;
			case "id":
				ID = HE_ID.value;
				if (theObj.getAttribute("id") != ID && ID != "") {
					theObj.setAttribute("id", ID);
				} 
				break;
			case "target":
				TARGET = HE_TARGET.value;
				if (theObj.getAttribute("target") != TARGET && TARGET != "") {
					theObj.setAttribute("target", TARGET);
				} 
				break;
		}
	}	
}