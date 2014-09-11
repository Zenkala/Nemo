// Copyright 2000, 2001, 2002, 2003, 2004, 2005 Macromedia, Inc. All rights reserved.

//---------------     API FUNCTIONS    ---------------

function isDOMRequired() {
	// Return false, indicating that this object is available in code view.
	return false;
}

function insertObject() {
	var dom = dw.getDocumentDOM();
	var errMsg = "";
	if(dom) {
		var el = "";
		var elFound = false;

		// 	Something selected? Maybe this element is not on the current slide, 
		//	so the experimentpane will be placed on another slide.
		var sel = dom.getSelectedNode();
		if(sel) {
			var patt = /slide/g;
			while (sel) {
			    if(sel.id) {
			    	if(patt.test(sel.id)) {
			    		el = sel;
			    		elFound = true;
			    		break;
			    	} 
			    }
			    sel = sel.parentNode;
			}
		}

		// 	Nothing found? Assume that the user will place the experimentpane
		//	onto the activeSlide (the slide that is currently visible)
		if(!elFound) {
			var s = 0;
			var patt = /activeSlide/g;
			while(true) {
				sel = dom.getElementById("slide" + s);
				if(!sel) break;
				var str = sel.class;
				if(str) {
					if(patt.test(str)) {
						el = sel;
						break;
					}
				}
				s++;
			}
		}

		if(el) {
			var elInnerHTML = dwscripts.getInnerHTML(el);
			var patt = new RegExp("nm_ExperimentPane");
			if(patt.test(elInnerHTML)) {
				errMsg = "This slide has already an experiment pane.";
			}
		} else {
			errMsg = "Failed to insert experiment pane. Could not find the slide.";
		}
		
	} else {
		errMsg = "Could not find the document DOM.";
	}

	if(!errMsg) {
		dom.setSelectedNode(el, true, false);
		var id = getUniqueId();
		dom.insertHTML(returnPane(id), false);

		if(el.type) {
			if(el.type != "experiment") setAsExperiment(el);
		} else {
			setAsExperiment(el);
		}
	}

	return errMsg;

}

function returnPane(id) {
	return '<div class="nm_ExperimentPane" id="' + id + '"></div>';
}

function getUniqueId() {
	return uniqueId = dwscripts.getUniqueId("experimentPane");
}

function setAsExperiment(element) {
	var r = dwscripts.askYesNo("Would you like to convert the slide into an experiment slide?");
	if(r) element.setAttribute("type", "experiment");
}