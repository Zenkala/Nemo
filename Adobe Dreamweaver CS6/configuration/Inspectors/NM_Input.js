// Copyright 2000, 2001, 2002, 2003 Macromedia, Inc. All rights reserved.
// ******************** GLOBALS ****************************

var helpDoc = MM.HELP_inspDate;

var HE_NAME;
var HE_TYPE;
var HE_ID;
var HE_CLASS;
var HE_VISIBLE;
var HE_TEXT;
var HE_CHECKBOX;
var HE_RADIO;
var HE_RANGE;
var HE_SELECTED;
var HE_VALUE;


var NAME;
var ID;
var TYPE;
var CLASS;
var VISIBLE;
var SELECTED;
var VALUE;

// ******************** API ****************************

function canInspectSelection() {
  /*var dom = dw.getDocumentDOM();
  var lockObj = dom.getSelectedNode();
  if (lockObj.type && lockObj.type == "input" && lockObj.class="PH_Input")
     return true;
    return false;
  */
	return true;
} 

function initializeUI() {
	if (typeof HE_NAME != 'undefined') {
		return;
	}
	HE_NAME = dwscripts.findDOMObject("theName");
	HE_TYPE = dwscripts.findDOMObject("theType");
	HE_ID = dwscripts.findDOMObject("theID");
	HE_CLASS = dwscripts.findDOMObject("theClass");
	HE_VISIBLE = dwscripts.findDOMObject("theVisible");
	HE_TEXT = dwscripts.findDOMObject("theText");
	HE_CHECKBOX = dwscripts.findDOMObject("theCheckbox");
	HE_RADIO = dwscripts.findDOMObject("theRadio");
	HE_RANGE = dwscripts.findDOMObject("theRange");
	HE_SELECTED = dwscripts.findDOMObject("theSelected");
	HE_VALUE = dwscripts.findDOMObject("theValue");
}


function inspectSelection() {
	initializeUI();
	setGUI();
}

function setGUI(){
	
	var dom = dw.getDocumentDOM();

	var theObj = dom.getSelectedNode(); //new TagEdit(dom.getSelectedNode().outerHTML);
	
	var divType = theObj.getAttribute("type") ? theObj.getAttribute("type").toLowerCase() : "text";
	//showDiv(divType);
	
	if (theObj.getAttribute("name")) {
		NAME = theObj.getAttribute("name");
		HE_NAME.value = NAME;
	}

	if (theObj.getAttribute("id")) {
		ID = theObj.getAttribute("id");
		HE_ID.value = ID;
	}

	if (theObj.getAttribute("class")) {
		CLASS = theObj.getAttribute("class");
		HE_CLASS.value = CLASS;
	}

	if (theObj.getAttribute("value")) {
		VALUE = theObj.getAttribute("value");
		HE_VALUE.value = VALUE;
	}

	if (theObj.getAttribute("checked")) {
		SELECTED = theObj.getAttribute("checked");
		if(SELECTED == "checked") {
			HE_SELECTED.setAttribute("checked", "checked");
		} else {
			HE_SELECTED.removeAttribute("checked");
		}
	} else {
		SELECTED = "";
		HE_SELECTED.removeAttribute("checked");
	}

/*
	if (theObj.getAttribute("class")) {
		VISIBLE = theObj.getAttribute("class");
		HE_VISIBLE.value = VISIBLE;
	}*/

	if (theObj.getAttribute("type")) {
		TYPE = theObj.getAttribute("type");
		if(TYPE=="text")HE_TEXT.selected = true;
		if(TYPE=="checkbox")HE_CHECKBOX.selected = true;
		if(TYPE=="radio")HE_RADIO.selected = true;
		if(TYPE=="range")HE_RANGE.selected = true;
	}else{
		HE_TEXT.selected = true;
	}

}

function updateTag(attrib) {	
	var dom = dw.getDocumentDOM();
	var theObj = dom.getSelectedNode(); //new TagEdit(dom.getSelectedNode().outerHTML);
	var editOccurred = false;
	
	if (attrib) {
		switch (attrib) {
			case "type":
				TYPE = HE_TYPE.options[HE_TYPE.selectedIndex].value;
				if (theObj.getAttribute("type") != TYPE && TYPE != "") {
					theObj.setAttribute("type", TYPE);
				} 
				CLASS = "nm_Input_" + TYPE;
				if (theObj.getAttribute("class") != CLASS && CLASS != "") {
					theObj.setAttribute("class", CLASS);
				} 
				break;
			case "name":
				NAME = HE_NAME.value;
				if (theObj.getAttribute("name") != NAME && NAME != "") {
					theObj.setAttribute("name", NAME);
				} 
				break;
			case "id":
				ID = HE_ID.value;
				if (theObj.getAttribute("id") != ID && ID != "") {
					theObj.setAttribute("id", ID);
				} 
				break;
			case "class":
				CLASS = HE_CLASS.value;
				if (theObj.getAttribute("class") != CLASS && CLASS != "") {
					theObj.setAttribute("class", CLASS);
				} 
				break;	
			case "selected":
				if (HE_SELECTED.getAttribute("checked")) {
					SELECTED = "checked";
				} else {
					SELECTED = "none";
				}
				if (SELECTED == "checked"){
					if (!theObj.getAttribute("checked")) theObj.setAttribute("checked", "checked");
				} else {
					if (theObj.getAttribute("checked")) theObj.removeAttribute("checked");
				}
				break;		
			case "value":
				VALUE = HE_VALUE.value;
				if (theObj.getAttribute("value") != VALUE && VALUE != "") {
					theObj.setAttribute("value", VALUE);
				} 
				break;
		}
	}	
}