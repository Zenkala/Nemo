// Copyright 2000, 2001, 2002, 2003 Macromedia, Inc. All rights reserved.
// ******************** GLOBALS ****************************

var HE_ID;
var HE_ANSWER;
var HE_TIP;

var ID;
var ANSWER;
var TIP;
// ******************** API ****************************

function canInspectSelection() {
	var dom = dw.getDocumentDOM();
	var theObj = dom.getSelectedNode();

	// Does the label element has the class nm_qItem? If true, show this inspector
	// TODO: Does the nm_qItem is surrounded by a nm_qGroup? If not, do so
	var r = /\bnm_qItem\b/;
	if(r.test(theObj.class)) {
		return true;
	} else {
		return false;
	}
} 


function initializeUI() {
	
	// Initialize ID object in the inspector
	HE_ID = dwscripts.findDOMObject("theID");

	// If Answer object isn't initialized, initialize with default options
	if(!HE_ANSWER) {
    	HE_ANSWER = new RadioGroup("theAnswerGroup"); 	
    }

	// If Explanation object isn't initialized, initialize with default options
 	if(!HE_TIP) {
 		HE_TIP = new ListControl("theTip");
 		HE_TIP.setAll(["None"], []);
 	}
 	
}


function inspectSelection() {
	initializeUI();
	setGUI();
}


// This function will execute when a nm_qItem is selected
function setGUI(){	
	
	var dom = dw.getDocumentDOM();
	var theObj = dom.getSelectedNode(); 	

	// Get ID of selected item and store in ID object of inspector
	
	if (theObj.getAttribute("id")) {
		ID = theObj.getAttribute("id");
		HE_ID.value = ID;
	}
	  
	// If code above is executed, the inspector can now pick the value in the Answer selectbox
	if(theObj.getAttribute("answer")) {
		var answer = theObj.getAttribute("answer");	
		ANSWER = answer;
		HE_ANSWER.setSelectedValue(answer);
	} 


	// Get all TextBubbles on current slide. These could be set as explanation for quiz item
	// Remove the current object from the list
	var allTextBubbles = new Array();
	allTextBubbles.push("None");
	if(dom.getElementById("contentDiv")) {
		var allNodes = dom.getElementById("contentDiv").childNodes;
		if(allNodes) {
	        for(i=0; i < allNodes.length; i++) {
	            if(allNodes[i].class == "slide activeSlide") {
	        		for(var j = 0; j < allNodes[i].childNodes.length; j++) {
	        			if((allNodes[i].childNodes[j].getAttribute("class")) && (allNodes[i].childNodes[j].getAttribute("id"))) {
	        				var classList = allNodes[i].childNodes[j].getAttribute("class").split(" "); 
							if((contains(classList, "nm_TextBubble")) && (allNodes[i].childNodes[j] != theObj.parentNode.parentNode)) {
								allTextBubbles.push(allNodes[i].childNodes[j].getAttribute("id"));
							}
	        			} // else, there is an element without a class. Its not a valid element, so ignore 
					}

	            }
	        }
    	} else {
    		// There is no textbubble on any slide
    	}
	} else {
		// This is not a correct template 
	}

	// Fill the Explanation object with possible TextBubbles (allTextBubbles)
	var currValues = HE_TIP.getValue('all');
	var needUpdate = false;
	//if(allTextBubbles.length != currValues.length) { needUpdate = true; }
	for(var i=0; i<allTextBubbles.length; i++) {
	    if (!currValues || (typeof(currValues[i]) != "string") || (allTextBubbles[i] != currValues[i])) {
	      needUpdate = true;
	      break;
	    }
	}
	if(needUpdate) {
		HE_TIP.setAll(allTextBubbles, allTextBubbles);
	}

	if(theObj.getAttribute("tip")) {
		var tip = theObj.getAttribute("tip");
		TIP = tip;
		HE_TIP.pickValue(tip);
	} else {
		// Select nothing. I don't no how to do that
		HE_TIP.pickValue("None");
		//HE_TIP.set("None");
	}
}


function updateTag(attrib) {	
	var dom = dw.getDocumentDOM();
	var theObj = dom.getSelectedNode(); 
	
	if (attrib) {
		switch (attrib) {

			case "id":
				ID = HE_ID.value;
				if (theObj.getAttribute("id") != ID && ID != "") {
					theObj.setAttribute("id", ID);
				} 
				break;

			case "answer":
				ANSWER = HE_ANSWER.getSelectedValue();
				if(ANSWER != theObj.getAttribute("answer")) {
					theObj.setAttribute("answer", ANSWER);
				}
				break;

			case "tip":
				TIP = HE_TIP.get();

				if ((theObj.getAttribute("tip") != TIP)) {
					if(!(dom.getElementById(TIP))) { 
						if(TIP == "None") {
							theObj.setAttribute("tip", "");
						} else if((TIP != "")) {
							result = window.confirm("The element " + TIP + " does not exist. Are you sure you would set this as a tip?");
							if(result) {
								theObj.setAttribute("tip", TIP);
							}
						} else {
							theObj.setAttribute("tip", TIP);
						}
					} else {
							theObj.setAttribute("tip", TIP);
					}
				} 
				break;
		}
	}
}

	
// Contains function checks if a string contains another string
function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}