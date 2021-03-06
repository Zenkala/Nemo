// Copyright 2000, 2001, 2002, 2003 Macromedia, Inc. All rights reserved.
// ******************** GLOBALS ****************************

var helpDoc = MM.HELP_inspDate;

var HE_ID;
var HE_AG;
var HE_RANGE;
var HE_MIN;
var HE_MAX;
var HE_STEPPING;
var HE_VALUE1;
var HE_VALUE2;
var HE_TITLE;

var ID;
var AG;
var RANGE;
var MIN;
var MAX;
var STEPPING;
var VALUE1;
var VALUE2;
var TITLE;
// ******************** API ****************************

function canInspectSelection() {
	var dom = dw.getDocumentDOM();
	var theObj = dom.getSelectedNode();
	var r = /\bnm_Slider\b/;
	if(r.test(theObj.class)) {
		return true;
	} else {
		return false;
	}
} 

function initializeUI() {
	HE_ID = dwscripts.findDOMObject("theID");
	HE_AG = dwscripts.findDOMObject("theAG");
	HE_RANGE = dwscripts.findDOMObject("theRange");
	HE_MIN = dwscripts.findDOMObject("theMin");
	HE_MAX = dwscripts.findDOMObject("theMax");
	HE_STEPPING = dwscripts.findDOMObject("theStepping");
	HE_VALUE1 = dwscripts.findDOMObject("theValue1");
	HE_VALUE2 = dwscripts.findDOMObject("theValue2");
	HE_TITLE = dwscripts.findDOMObject("theTitle");
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

	if (theObj.getAttribute("class")) {
		if(contains(theObj.getAttribute("class").split(" "), "autoGenerate")){
			AG = true;
			HE_AG.checked = true;
		} else {
			AG = false;
			HE_AG.checked = false;
		}
	}

	//hasAttribute is not supported. sigh.
	if(typeof theObj.getAttribute("range") == 'undefined'){
		RANGE = false;
		HE_RANGE.checked = false;
	} else {
		RANGE = true;
		HE_RANGE.checked = true;
	}

	if(typeof theObj.getAttribute("min") == 'undefined'){
		MIN = 0;
		HE_MIN.value = MIN;
	} else {
		MIN = theObj.getAttribute("min");
		HE_MIN.value = MIN;
	}

	if(typeof theObj.getAttribute("max") == 'undefined'){
		MAX = 0;
		HE_MAX.value = MAX;
	} else {
		MAX = theObj.getAttribute("max");
		HE_MAX.value = MAX;
	}

	if(typeof theObj.getAttribute("stepping") == 'undefined'){
		STEPPING = 0;
		HE_STEPPING.value = STEPPING;
	} else {
		STEPPING = theObj.getAttribute("stepping");
		HE_STEPPING.value = STEPPING;
	}	

	if(typeof theObj.getAttribute("value1") == 'undefined'){
		VALUE1 = 10;
		HE_VALUE1.value = VALUE1;
	} else {
		VALUE1 = theObj.getAttribute("value1");
		HE_VALUE1.value = VALUE1;
	}	

	if(typeof theObj.getAttribute("value2") == 'undefined'){
		VALUE2 = 0;
		HE_VALUE2.value = VALUE2;
	} else {
		VALUE2 = theObj.getAttribute("value2");
		HE_VALUE2.value = VALUE2;
	}	

	if(typeof theObj.getAttribute("title") == 'undefined'){
		TITLE = "Een Slider";
		HE_TITLE.value = TITLE;
	} else {
		TITLE = theObj.getAttribute("title");
		HE_TITLE.value = TITLE;
	}	
}

function updateTag(attrib) {	
	var dom = dw.getDocumentDOM();
	var theObj = dom.getSelectedNode(); //new TagEdit(dom.getSelectedNode().outerHTML);
	
	if (attrib) {
		switch (attrib) {
			case "id":
				ID = HE_ID.value;
				if (theObj.getAttribute("id") != ID && ID != "") {
					theObj.setAttribute("id", ID);
				} 
				break;
			case "ag":
				AG = HE_AG.checked;
				if(AG){
					theObj.setAttribute("class", "nm_Slider autoGenerate");
				} else {
					theObj.setAttribute("class", "nm_Slider");					
				}
				break;
			case "range":
				RANGE = HE_RANGE.checked;
				if(RANGE){
					theObj.setAttribute("range", "true");
				} else {
					theObj.removeAttribute("range");					
				}
				break;		

			case "min":
				MIN = parseInt(HE_MIN.value);
				if(MIN){
					theObj.setAttribute("min", MIN);
				} else {
					theObj.removeAttribute("min");					
				}
				break;	
			case "max":
				MAX = parseInt(HE_MAX.value);
				if(MAX){
					theObj.setAttribute("max", MAX);
				} else {
					theObj.removeAttribute("max");					
				}
				break;	
			case "stepping":
				STEPPING = parseInt(HE_STEPPING.value);
				if(STEPPING){
					theObj.setAttribute("stepping", STEPPING);
				} else {
					theObj.removeAttribute("stepping");					
				}
				break;	
			case "value1":
				VALUE1 = parseInt(HE_VALUE1.value);
				if(VALUE1){
					theObj.setAttribute("value1", VALUE1);
				} else {
					theObj.removeAttribute("value1");					
				}
				break;				
			case "value2":
				VALUE2 = parseInt(HE_VALUE2.value);
				if(VALUE2){
					theObj.setAttribute("value2", VALUE2);
				} else {
					theObj.removeAttribute("value2");					
				}
				break;		
			case "title":
				TITLE = HE_TITLE.value;
				if(TITLE){
					if (theObj.getAttribute("title") != TITLE && TITLE != "") {
						theObj.setAttribute("title", TITLE);
					} 					
				} else {
					theObj.removeAttribute("title");					
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