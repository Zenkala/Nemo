/*

	Nemo class

*/

function nm() {}

nm.getSelectionType = nemo_getSelectionType;
nm.getActiveSlideNode = nemo_getActiveSlideNode;
nm.getOutsideBoxNode = nemo_getOutsideBoxNode;


// Returns the nemo type of the selection
// return 0; component can not be imported here
// return 1; selection is inside a slide
// return 2; selection is inside a experimentpane
function nemo_getSelectionType() {
	// Set default type to zero
	var type = 0;
	var dom = dw.getDocumentDOM();
	var curSel = dom.getSelection();
	var curSelNode = dom.getSelectedNode();
	var isCursor = (curSel[0] == curSel[1]) ? true : false;

	var pattSlide = new RegExp("slide");
	var pattExperiment = new RegExp("nm_Experiment");


	while (curSelNode) {
		if(curSelNode.class) {
			if(pattSlide.test(curSelNode.class)) {
				type = 1;
				break;
			} else if(pattExperiment.test(curSelNode.class)) {
				type = 2;
				break;
			}
		}

		if(curSelNode.id) {
			if(curSelNode.id == "contentDiv") break;
		}

		curSelNode = curSelNode.parentNode;
	}

	return type;
	
}

function nemo_getActiveSlideNode() {
	var dom = dw.getDocumentDOM();
	var i = 0; // Counter to loop thtrouhg slides
	var slide = dom.getElementById("slide"+i); // Get first slide
	var patt = new RegExp("activeSlide"); // Regex to find the active slide
	
	// Continue until we could find a new slide
	while(slide) {
		if(slide.class) {
			// Has class? This element is nemo proof
			if(patt.test(slide.class)) {
				// Does it contain the text activeSlide? 
				// This is the slide where we looking for!
				return slide;
				break;
			}

		} else {
			break;
		}

		// Nothing found, so increase i with one. Check if we could find this slide. 
		i++;
		slide = dom.getElementById("slide"+i);
	}

	return false;
}

function nemo_getOutsideBoxNode() {
	var dom = dw.getDocumentDOM();
	var curSelNode = dom.getSelectedNode();
	var patt = new RegExp("nm_Text|nm_Box|nm_Exclamation|paragraph");
	var rtn = false;
	
	while (curSelNode) {
	  if(curSelNode.class) {
	    if(patt.test(curSelNode.class)) {
	      rtn = curSelNode;
	      break;
	    } 
	  }
	  
	  if(curSelNode.id) {
	    if(curSelNode.id == "contentDiv") break;
	  }

	  curSelNode = curSelNode.parentNode;
	}
	
	return rtn;
}