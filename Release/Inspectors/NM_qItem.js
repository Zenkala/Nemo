// Copyright 2000, 2001, 2002, 2003 Macromedia, Inc. All rights reserved.
// ******************** GLOBALS ****************************

var HE_ID;
var HE_TYPE;
var HE_ANSWER;
var HE_CORRECTEXP;
var HE_WRONGEXP;

var ID;
var TYPE;
var ANSWER;
var CORRECTEXP;
var WRONGEXP;
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

	// Initialize Type object in in inspector
	HE_TYPE = dwscripts.findDOMObject("theType");

	// If Answer object isn't initialized, initialize with default options
	if(!HE_ANSWER) {
    	HE_ANSWER = new ListControl("theAnswer");
    	HE_ANSWER.setAll([], []);
 	}

	// If Explanation object isn't initialized, initialize with default options
 	if(!HE_CORRECTEXP) {
 		HE_CORRECTEXP = new ListControl("theCorrectExp");
 		HE_CORRECTEXP.setAll([], []);
 	}

 	// If Explanation object isn't initialized, initialize with default options
 	if(!HE_WRONGEXP) {
 		HE_WRONGEXP = new ListControl("theWrongExp");
 		HE_WRONGEXP.setAll([], []);
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
	  
	// Get type of selected item (is defined in nm_qGroup element)
	if(theObj.parentNode.getAttribute("type")) {
		var type = theObj.parentNode.getAttribute("type");
		if(type == "closed") { 
			TYPE = type; 
			
			// Set Type object of inspector, default to false
			HE_TYPE.selectedIndex = 0; 
			HE_ANSWER.setAll(["False", "True"], [0, 1]);
		} else if(type == "open") { 
			TYPE = type; 
			
			// If the quiz consists of open questions, there are no suggestions for possible answers
			HE_ANSWER.setAll([], []);

			// Fill the Answer object with options, if the nm_qGroup contains items with answers
			for(var i = 0; i < theObj.parentNode.childNodes.length; i++) {
				if(theObj.parentNode.childNodes[i].getAttribute("answer")) {
					HE_ANSWER.add(theObj.parentNode.childNodes[i].getAttribute("answer"));
				}
			}
		} else {
			// Is the type of the question is not set? Set to closed
			HE_TYPE.selectedIndex = 0; TYPE = "closed"; 

			// TODO: Maybe you should set the nm_qGroup element as well
		}
	}

	// If code above is executed, the inspector can now pick the value in the Answer selectbox
	if(theObj.getAttribute("answer")) {
		var answer = theObj.getAttribute("answer");	
		ANSWER = answer;
		HE_ANSWER.pick(answer);
	} else {
		HE_ANSWER.set("");
	}


	// Get all TextBubbles on current slide. These could be set as explanation for quiz item
	// Remove the current object from the list
	var allTextBubbles = new Array();
	if(dom.getElementById("contentDiv")) {
		var allNodes = dom.getElementById("contentDiv").childNodes;
		if(allNodes) {
	        for(i=0; i < allNodes.length; i++) {
	            if(allNodes[i].class == "slide activeSlide") {
	        		for(var j = 0; j < allNodes[i].childNodes.length; j++) {
	        			if((allNodes[i].childNodes[j].getAttribute("class")) && (allNodes[i].childNodes[j].getAttribute("id"))) {
	        				var classList = allNodes[i].childNodes[j].getAttribute("class").split(" "); 
							if((contains(classList, "nm_TextBubble")) && (allNodes[i]).childNodes[j] != theObj.parentNode.parentNode) {
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
	var currValues = HE_CORRECTEXP.getValue('all');
	var needUpdate = false;
	if(allTextBubbles.length != currValues.length) { needUpdate = true; }
	for(var i=0; i<allTextBubbles.length; i++) {
	    if (!currValues || (typeof(currValues[i]) != "string") || (allTextBubbles[i] != currValues[i])) {
	      needUpdate = true;
	      break;
	    }
	}
	if(needUpdate) {
		HE_CORRECTEXP.setAll(allTextBubbles, allTextBubbles);
		HE_WRONGEXP.setAll(allTextBubbles, allTextBubbles);
	}
	
	
	if(theObj.parentNode.getAttribute("correctexp")) {
		var correctexp = theObj.parentNode.getAttribute("correctexp");	
		CORRECTEXP = correctexp;
		HE_CORRECTEXP.set(correctexp);
	}
	
	if(theObj.parentNode.getAttribute("wrongexp")) {
		var wrongexp = theObj.parentNode.getAttribute("wrongexp");	
		WRONGEXP = wrongexp;
		HE_WRONGEXP.set(wrongexp);
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

			case "type":
				TYPE = HE_TYPE.options[HE_TYPE.selectedIndex].value;
				if(theObj.parentNode.getAttribute("type") != TYPE) {
					
					// Change the type of the question group
					if(TYPE == "open") { 
						inputType = "text"; 
						defaultAnswer = ""; 
						HE_ANSWER.set("");
					} else { 
						inputType = "radio"; 
						defaultAnswer = "false"; 
					}

					// Does the question group contain more than one element? Ask if you want to change all the items (answer data will be lost) 
					if(theObj.parentNode.childNodes.length > 1) {
						result = window.confirm("Would you like to change all items to an " + TYPE + " question? All answer data will be lost.");
						if(result) {
							theObj.parentNode.setAttribute("type", TYPE);
							
							for(var i = 0; i < theObj.parentNode.childNodes.length; i++) {
								var classList = theObj.parentNode.childNodes[i].getAttribute("class").split(" ");
								if(contains(classList, "nm_qItem")) {
									theObj.parentNode.childNodes[i].childNodes[0].setAttribute("type", inputType);
									theObj.parentNode.childNodes[i].setAttribute("answer", defaultAnswer);

								} else {
									alert("Type of question is not set to " + TYPE + ". The items of the question could not be found. Check if the class of the items contains nm_qItem.");
								}
							}
						} else {
							// User prevent change items. So, do nothing. 
						}

					}
				}
				break;

			case "answer":
				if(HE_ANSWER.get() != theObj.getAttribute("answer")) {
					
					ANSWER = HE_ANSWER.get();
					if(ANSWER == "True") { ANSWER = "true"; } 
					if(ANSWER == "False") { ANSWER = "false"; }
					if((HE_TYPE.selectedIndex == 0) && ((ANSWER != "true") && (ANSWER != "false") && (ANSWER != ""))) {
						alert("This answer is not allowed for an closed quiz.");
						HE_ANSWER.set("");
					} else {
						theObj.setAttribute("answer", ANSWER);
					}
				}
				break;

			case "correctexp":
				CORRECTEXP = HE_CORRECTEXP.get();

				if ((theObj.parentNode.getAttribute("correctexp") != CORRECTEXP)) {
					if(!(dom.getElementById(CORRECTEXP))) { 
						if(CORRECTEXP != "") {
							result = window.confirm("The explanation " + CORRECTEXP + " does not exist. Are you sure you would set this explanation?");
							if(result) {
								theObj.parentNode.setAttribute("correctexp", CORRECTEXP);
							}
						} else {
							theObj.parentNode.setAttribute("correctexp", CORRECTEXP);
						}
					} else {
						theObj.parentNode.setAttribute("correctexp", CORRECTEXP);
					}
				} 
				break;

			case "wrongexp":
				WRONGEXP = HE_WRONGEXP.get();

				if ((theObj.parentNode.getAttribute("wrongexp") != WRONGEXP)) {
					if(!(dom.getElementById(WRONGEXP))) { 
						if(WRONGEXP != "") {
							result = window.confirm("The explanation " + WRONGEXP + " does not exist. Are you sure you would set this explanation?");
							if(result) {
								theObj.parentNode.setAttribute("wrongexp", WRONGEXP);
							}
						} else {
							theObj.parentNode.setAttribute("wrongexp", WRONGEXP);
						}
					} else {
						theObj.parentNode.setAttribute("wrongexp", WRONGEXP);
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