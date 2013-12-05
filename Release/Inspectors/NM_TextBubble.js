// Copyright 2000, 2001, 2002, 2003 Macromedia, Inc. All rights reserved.
// ******************** GLOBALS ****************************

var helpDoc = MM.HELP_inspDate;

var HE_ID;
var HE_POINTER;
var HE_TARGET;
var HE_COLOR;

var ID;
var POINTER;
var TARGET;
var COLOR;
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
	HE_COLOR = dwscripts.findDOMObject("theColor");
}


function inspectSelection() {
	initializeUI();
	setGUI();
}

function setPointer(){
	var dom = dw.getDocumentDOM();
	var theObj = dom.getSelectedNode(); 		
	if(theObj.getAttribute("class")) {
		var classList = theObj.getAttribute("class").split(" ");
		if(contains(classList, "top-left"))    {	POINTER = "top-left";		HE_POINTER.selectedIndex = 1; return; }
		if(contains(classList, "top-middle"))  {	POINTER = "top-middle"; 	HE_POINTER.selectedIndex = 2; return; }
		if(contains(classList, "top-right"))   {	POINTER = "top-right"; 		HE_POINTER.selectedIndex = 3; return; }
		if(contains(classList, "middle-left")) { 	POINTER = "middle-left"; 	HE_POINTER.selectedIndex = 4; return; }
		if(contains(classList, "middle-right")){ 	POINTER = "middle-right"; 	HE_POINTER.selectedIndex = 5; return; }
		if(contains(classList, "bottom-left")) { 	POINTER = "bottom-left"; 	HE_POINTER.selectedIndex = 6; return; }
		if(contains(classList, "bottom-middle")){ 	POINTER = "bottom-middle"; 	HE_POINTER.selectedIndex = 7; return; }
		if(contains(classList, "bottom-right")){ 	POINTER = "bottom-right"; 	HE_POINTER.selectedIndex = 8; return; }
		HE_POINTER.selectedIndex = 0; POINTER = "None";
	} else {
		HE_POINTER.selectedIndex = 0; POINTER = "None";
	}
}

function setGUI(){	
	var dom = dw.getDocumentDOM();
	var theObj = dom.getSelectedNode(); 	

	if (theObj.getAttribute("id")) {
		ID = theObj.getAttribute("id");
		HE_ID.value = ID;
	}

	setPointer();

	if(theObj.getAttribute("target")) {
		TARGET = theObj.getAttribute("target");
		HE_TARGET.value = TARGET;
	} else {
		HE_TARGET.value = "";
	}

	if(theObj.getAttribute("class")) {
		var classList = theObj.getAttribute("class").split(" ");		
		if(contains(classList, "blue")){ 	COLOR = "blue";		HE_COLOR.selectedIndex = 1;	return;}
		if(contains(classList, "green")){ 	COLOR = "green"; 	HE_COLOR.selectedIndex = 2;	return;}
		if(contains(classList, "red")){ 	COLOR = "red"; 		HE_COLOR.selectedIndex = 3;	return;}
		HE_COLOR.selectedIndex = 0; COLOR = "white";
	} else {
		HE_COLOR.selectedIndex = 0; COLOR = "white"; 
	}
}

function updateTag(attrib) {	
	var dom = dw.getDocumentDOM();
	var theObj = dom.getSelectedNode(); //new TagEdit(dom.getSelectedNode().outerHTML);
	
	if (attrib) {
		switch (attrib) {
			case "pointer":
				POINTER = HE_POINTER.options[HE_POINTER.selectedIndex].value;
				if(POINTER != "none") {
					if(COLOR == "white") {
						if (theObj.getAttribute("class") != ("nm_TextBubble " + POINTER) && POINTER != "") {						
							theObj.setAttribute("class", "nm_TextBubble " + POINTER);
						} 
					} else {
						if (theObj.getAttribute("class") != ("nm_TextBubble " + POINTER + " " + COLOR) && POINTER != "") {						
							theObj.setAttribute("class", "nm_TextBubble " + POINTER + " " + COLOR);
						} 
					}
				} else {
					if(COLOR == "white") {
						theObj.setAttribute("class", "nm_TextBubble");
					} else {
						theObj.setAttribute("class", "nm_TextBubble " + COLOR);
					}
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
				if (theObj.getAttribute("target") != TARGET) {
					theObj.setAttribute("target", TARGET);
				} 
				break;
			case "color":
				COLOR = HE_COLOR.options[HE_COLOR.selectedIndex].value;
				if(COLOR == "white") {
					if (theObj.getAttribute("class") != ("nm_TextBubble " + POINTER) && COLOR != "") {						
						theObj.setAttribute("class", "nm_TextBubble " + POINTER);
					} 
				} else {
					if (theObj.getAttribute("class") != ("nm_TextBubble " + POINTER + " " + COLOR) && COLOR != "") {						
						theObj.setAttribute("class", "nm_TextBubble " + POINTER + " " + COLOR);
					} 
				}
				break;
		}
	}	
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}