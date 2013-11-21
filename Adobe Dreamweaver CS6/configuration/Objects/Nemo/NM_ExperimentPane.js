// Copyright 2000, 2001, 2002, 2003, 2004, 2005 Macromedia, Inc. All rights reserved.

//---------------     API FUNCTIONS    ---------------

function isDOMRequired() {
	// Return false, indicating that this object is available in code view.
	return false;
}

function canInsertObject() {
	return true;
}

function insertObject() {
	var dom = dw.getDocumentDOM();
	if(dom) {
		var el = "";

		// 	Something selected? Maybe this element is not on the current slide, 
		//	so the experimentpane will be placed on another slide.
		var sel = dom.getSelectedNode();
		if(sel) {
			var patt = /slide/g;
			while (sel) {
			    if(sel.id) {
			    	if(patt.test(sel.id)) {
			    		el = sel;
			    		break;
			    	} 
			    }
			    sel = sel.parentNode;
			}
		}

		// 	Nothing selected? Assume that the user will place the experimentpane
		//	onto the activeSlide (the slide that is currently visible)
		else {
			var s = 0;
			var patt = /activeSlide/g;
			while(true) {
				el = getElementById("slide" + s);
				var str = el.getAttribute("class");
				if(patt.test(str)) break;
				s++;
				if(s > 100) {
					el = "";
					break; 
				}
			}
		}
		if(el) {
			dom.setSelectedNode(el, true, false);
			var id = getUniqueId();
			dom.insertHTML(returnPane(id), false);

			if(el.type) {
				if(el.type != "experiment") setAsExperiment(el);
			} else {
				setAsExperiment(el);
			}
		} else {
			alert("Failed to insert experiment pane. Could not find a slide.");
		}
		
	}

}

function returnPane(id) {
	return '<div class="nm_ExperimentPane" id="' + id + '"></div>';
}

function getUniqueId() {
	return uniqueId = dwscripts.getUniqueId("experimentPane");
}

function setAsExperiment(element) {
	var r = confirm("Would you like to convert the slide into an experiment slide?");
	if(r) element.setAttribute("type", "experiment");
}