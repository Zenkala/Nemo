// Copyright 2000, 2001, 2002, 2003 Macromedia, Inc. All rights reserved.
// ******************** GLOBALS ****************************

var helpDoc = MM.HELP_inspDate;

var HE_ID;
var HE_AG;
var HE_HANDLER;

var ID;
var AG;
var HANDLER;
// ******************** API ****************************

function canInspectSelection() {
	var dom = dw.getDocumentDOM();
	var theObj = dom.getSelectedNode();
	var r = /\bnm_Button\b/;
	if(r.test(theObj.class)) {
		return true;
	} else {
		return false;
	}
} 

function initializeUI() {
	HE_ID = dwscripts.findDOMObject("theID");
	HE_AG = dwscripts.findDOMObject("theAG");
	if(!HE_HANDLER) {
 		HE_HANDLER = new ListControl("theHandler");
 		HE_HANDLER.setAll(["None"], []);
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
			}
			HE_HANDLER.setAll(theFunctions, theFunctions);
			HE_HANDLER.prepend("None", "None");
			HE_HANDLER.pickValue("None");
		}
	}
	
	if(theObj.getAttribute("handler")) {
		var handler = theObj.getAttribute("handler");
		HANDLER = handler;
		HE_HANDLER.pickValue(handler);
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
					HE_HANDLER.enable();
					theObj.setAttribute("class", "nm_Button autoGenerate");
				} else {
					theObj.setAttribute("class", "nm_Button");
					HE_HANDLER.disable();	
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