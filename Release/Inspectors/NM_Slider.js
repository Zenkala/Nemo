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
var HE_HANDLER;
var HE_EVENT;

var ID;
var AG;
var RANGE;
var MIN;
var MAX;
var STEPPING;
var VALUE1;
var VALUE2;
var TITLE;
var HANDLER;
var EVENT;
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
	if(!HE_HANDLER) {
 		HE_HANDLER = new ListControl("theHandler");
 		HE_HANDLER.setAll(["None"], []);
 	}
 	if(!HE_EVENT) {
 		HE_EVENT = new ListControl("theEvent");
 		HE_EVENT.setAll(["change", "create", "slide", "start", "stop"], ["change", "create", "slide", "start", "stop"]);
 	}
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

	if(typeof theObj.getAttribute("range") == 'undefined'){
		RANGE = false;
		HE_RANGE.checked = false;
	} else {
		RANGE = true;
		HE_RANGE.checked = true;
	}

	if(typeof theObj.getAttribute("min") == 'undefined'){
		MIN = '';
		HE_MIN.value = MIN;
	} else {
		MIN = theObj.getAttribute("min");
		HE_MIN.value = MIN;
	}

	if(typeof theObj.getAttribute("max") == 'undefined'){
		MAX = '';
		HE_MAX.value = MAX;
	} else {
		MAX = theObj.getAttribute("max");
		HE_MAX.value = MAX;
	}

	if(typeof theObj.getAttribute("stepping") == 'undefined'){
		STEPPING = '';
		HE_STEPPING.value = STEPPING;
	} else {
		STEPPING = theObj.getAttribute("stepping");
		HE_STEPPING.value = STEPPING;
	}	

	if(typeof theObj.getAttribute("value1") == 'undefined'){
		VALUE1 = '';
		HE_VALUE1.value = VALUE1;
	} else {
		VALUE1 = theObj.getAttribute("value1");
		HE_VALUE1.value = VALUE1;
	}	

	if(typeof theObj.getAttribute("value2") == 'undefined'){
		VALUE2 = '';
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

	
	var functionList = new Array();
	functionList.push("None");
	var input = dom.URL;
	var jsURL = (input.substr(0, input.lastIndexOf('.')) || input) + ".js";
	if(DWfile.exists(jsURL)) {
		var theJS = DWfile.read(jsURL);
		if(theJS) {
			var patt = /(function\s+)(.*?)(?=\()/g;
			var theFunctions = theJS.match(patt);
			for(i=0; i < theFunctions.length; i++) {

				// Why? Because the appropriate regex patt doesn't work in Dreamweaver
				theFunctions[i] = theFunctions[i].replace("function", "");
				theFunctions[i] = theFunctions[i].replace(/\s+/g, "");
				functionList.push(theFunctions[i]);
			}
		} else {
			// Error occured while reading file
		}
	}
	HE_HANDLER.setAll(functionList, functionList);

	if(theObj.getAttribute("handler")) {
		var handler = theObj.getAttribute("handler");
		HANDLER = handler;
		HE_HANDLER.pickValue(handler);
	} else {
		// Select nothing. I don't no how to do that
		HE_HANDLER.pickValue("None");
	}

	if(theObj.getAttribute("event")) {
		var getevent = theObj.getAttribute("event");
		EVENT = getevent;
		HE_EVENT.pickValue(getevent);
	} else {
		HE_EVENT.pickValue("stop");
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
				MIN = parseFloat(HE_MIN.value);
				if(typeof MIN != 'undefined'){
					theObj.setAttribute("min", MIN);
				} else {
					theObj.removeAttribute("min");					
				}
				break;	
			case "max":
				MAX = parseFloat(HE_MAX.value);
				if(typeof MAX != 'undefined'){
					theObj.setAttribute("max", MAX);
				} else {
					theObj.removeAttribute("max");					
				}
				break;	
			case "stepping":
				STEPPING = parseFloat(HE_STEPPING.value);
				if(typeof STEPPING != 'undefined'){
					theObj.setAttribute("stepping", STEPPING);
				} else {
					theObj.removeAttribute("stepping");					
				}
				break;	
			case "value1":
				VALUE1 = parseFloat(HE_VALUE1.value);
				if(typeof VALUE1 != 'undefined'){
					theObj.setAttribute("value1", VALUE1);
				} else {
					theObj.removeAttribute("value1");					
				}
				break;				
			case "value2":
				VALUE2 = parseFloat(HE_VALUE2.value);
				if(typeof VALUE2 != 'undefined'){
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
			case "handler":
				HANDLER = HE_HANDLER.get();

				if ((theObj.getAttribute("handler") != HANDLER)) {
					if(HANDLER == "None") {
						theObj.removeAttribute("handler");
					} else {
						theObj.setAttribute("handler", HANDLER);
					}
				}
				break;		
			case "event":
				EVENT = HE_EVENT.get();
				if(EVENT){
					if (theObj.getAttribute("event") != EVENT) {
						theObj.setAttribute("event", EVENT);
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