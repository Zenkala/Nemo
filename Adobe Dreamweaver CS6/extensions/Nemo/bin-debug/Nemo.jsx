﻿function getCurrentStay() {
    var theDOM = dw.getDocumentDOM();
    if (theDOM != null) {
        var theNode = theDOM.getSelectedNode();
        //theNode.stay = document.getElementById("stayInput").value;
        if(theNode != null && theNode.stay != null) {
            return toXML([{'name':'stay', 'val':theNode.stay}]);
        } else {
            return toXML([{'name':'stay', 'val':0}]);
        }
    }
}

function setStay(givenStay) {
 var theDOM = dw.getDocumentDOM();
    if (theDOM != null) {
        var theNode = theDOM.getSelectedNode();
        if(theNode != null) theNode.stay = givenStay;
    }
}

function getCurrentSlide() {
    var theDOM = dw.getDocumentDOM();
    if(theDOM != null) {
        var allNodes = theDOM.getElementById("contentDiv").childNodes;
        if(allNodes != null) {
            for(i=0; i< allNodes.length; i++) {
                if(allNodes[i].class == "slide activeSlide") {
                    //found!
                    return toXML([{'name':'currentSlide', 'val':i}]);
                }
            }
        }
    }
}

function gotoSlide(newSlide, oldSlide) {
	var theDOM = dw.getDocumentDOM();
    if (theDOM != null) {
    	var slideCount = getTotalSlides(true);    	
    	if (slideCount > 0) {
    		if(newSlide >= 0 && newSlide < slideCount) {
    			if(oldSlide >= 0) {
    				theDOM.getElementById("slide" + oldSlide).className = "slide";
    				theDOM.getElementById("slide" + newSlide).className = "slide activeSlide";
    			} else {
    				theDOM.getElementById("commentslide").className = "slide";
    				theDOM.getElementById("slide" + newSlide).className = "slide activeSlide";
    			}
    		} else {
    			if(oldSlide >= 0) {
    				theDOM.getElementById("slide" + oldSlide).className = "slide";
    				theDOM.getElementById("commentslide").className = "slide activeSlide";
    			}
    		}
    	}	
    }
}

function forceGotoSlide(newSlide) {
var theDOM = dw.getDocumentDOM();
    if (theDOM != null) {
        var nodes = getSlideNodes(true);
        if(nodes != null) {
            for(i=0; i< nodes.length; i++) {
                if(nodes[i].class == "slide activeSlide") {
                    nodes[i].class = "slide";
                }
                if(i-1 == newSlide) { //this index is shifted by 1 becouse of commentslide
                    nodes[i].class = "slide activeSlide";
                }
            }
        }
    }
}

function getTotalSlides(internal) {
	var r = 0;
	var nodes = getSlideNodes(false);
	for ( i = 0; i < nodes.length; i++) {
		if (nodes[i].class == "slide" || nodes[i].class == "slide activeSlide")
		r++;
	}
	if(internal == true){
		return r;
	} else {
		return toXML([{'name':'totalSlides', 'val':r}]);
	}
}

// return all valid slides insides contentDiv 
function getSlideNodes(withComment){
    var theDOM = dw.getDocumentDOM();
    if(theDOM != null) {
		var allNodes = theDOM.getElementById("contentDiv").childNodes;
		var slideNodes = new Array();
		if(withComment){
			for(i=0; i< allNodes.length; i++) {
				if(allNodes[i].class == "slide" || allNodes[i].class == "slide activeSlide") {
					slideNodes.push(allNodes[i]);
				}
			}
		}else{
			for(i=0; i< allNodes.length; i++) {
				if((allNodes[i].class == "slide" || allNodes[i].class == "slide activeSlide") && allNodes[i].id != "commentslide") {
					slideNodes.push(allNodes[i]);
				}
			}
		}
		return slideNodes;
	} else {
		return -1;
	}
}

function moveSlide(fromPos, toPos) {
    var theDOM = dw.getDocumentDOM();
    if(theDOM != null) {    
        // Store the two object slides that will be swapped
        var fromSlide = theDOM.getElementById("slide" + fromPos);
        var toSlide = theDOM.getElementById("slide" + toPos);

        // Store content of slides that will be swapped
        var contentOfFromSlide = theDOM.getElementById("slide" + fromPos).innerHTML;
        var contentOfToSlide = theDOM.getElementById("slide" + toPos).innerHTML;

        // Swap content of the two selected slides
        toSlide.innerHTML = contentOfFromSlide;
        fromSlide.innerHTML = contentOfToSlide;
        
        // Total reset of all comments inside all slides
        // The ContentDiv should only contain slide-divs 
        var nodes = getSlideNodes(false);
        var j = 0;
        for(i = 0; i < nodes.length; i++) {
            var childrenOfNode = nodes[i].childNodes;
            for(k = 0; k < childrenOfNode.length; k++) {
                if(childrenOfNode[k].class == "comment slideNumber") childrenOfNode[k].innerHTML = i+1;
            }
        }
    }
}

function addASlide(givenCurrentSlide) {
    var theDOM = dw.getDocumentDOM();
    if(theDOM != null) {
        var j = getTotalSlides(true);
        var c = parseInt(givenCurrentSlide);
        theDOM.getElementById("contentDiv").innerHTML += ('<div class="slide" id="slide' + j + '"><div class="comment slideNumber">'+(j+1)+ '</div></div>');
        if(j>0 && (c+1)<(j+1))moveSlide(j, (c+1));
    }
}

function updateSlides(givenAmount, moanAboutContent) {
    var theDOM = dw.getDocumentDOM();
    if(theDOM != null) {    
        var currentSlides = getTotalSlides(true);
        var targetAmount = givenAmount;

        if (targetAmount > currentSlides) {
            //Add slides
            for (var i = currentSlides; i < targetAmount; i++) {
                addASlide(i-1);
            }
        } else { //remove slides. Do targetAmount+1 because of the commentSlide
            //check if content
            var hasContent = false;
            for (var i = currentSlides; i > targetAmount; i--) {
                //if (dw.getDocumentDOM().getElementById("contentDiv").childNodes[(i - 1)].innerHTML.length > 36) {
                if (theDOM.getElementById("contentDiv").childNodes[(i-1)].childNodes.length > 1) {
                    hasContent = true;
                    break;
                }
            }

            //confirm
            if (hasContent && moanAboutContent) {
                if (!confirm("Some of the slides have content. Are you sure you wish to remove the " + (currentSlides-targetAmount) + " slides?")) {
                    return;
                }
            }

            //rem
            for (var i = currentSlides; i > targetAmount; i--) {
                theDOM.getElementById("contentDiv").innerHTML = theDOM.getElementById("contentDiv").innerHTML.substring(0, theDOM.getElementById("contentDiv").innerHTML.lastIndexOf('<div class="slide'));

            }
        }
    }
    
}

function remSlide(givenIndex){
    var index = parseInt(givenIndex);
    var theDOM = dw.getDocumentDOM();
    if(theDOM != null) { 
        //move the selected slide to the end
        var slideToBeRemoved = theDOM.getElementById("slide" + index).innerHTML;
        var lastSlide = getTotalSlides(true)-1;

        //confirm
        if((getSlideNodes(false)[index].childNodes.length > 1) && !confirm("The slide has content. Are you sure you wish to remove it?")) {
            return; //do nothing.
        }

        //swap to bottom
        for(var i=index; i<lastSlide; i++){
            theDOM.getElementById("slide" + i).innerHTML = theDOM.getElementById("slide" + (i+1)).innerHTML;
            //fix comment slide number
            var nodes = theDOM.getElementById("slide" + (i)).childNodes;
            for (var j = 0; j < nodes.length; j++) {
                if (nodes[j].class == "comment slidenumber")
                    nodes[j].innerHTML = (i);
            }
        }
        //then do the usual removing thing.
        updateSlides(lastSlide, false);
    }
}

﻿// Give the user an alert message. Data in this function comes from the swf panel, via the csxs library.
//
// Returns void
function fnAlert(p) {
  var params = objectify(p),
      str    = params.title
  if(params.message != ''){
    str += '\n'
    str += params.message
  }
  alert(str)
} // end fnAlert()
 
 
// Convert a json string to an Object
//
// Returns an Object
function objectify(s) {
  var obj = new Object(),
      params
      s = s.replace(/(\{|\})/g,"")
      params = s.split(',')
  for(var i=0;i<params.length;i++) {
    var param = params[i].split(':')
    if(param[0].indexOf('"') >= 0){
      if(param[1].indexOf('"') >= 0){
        param[0] = param[0].replace(/("|\s)/g, '')
        param[1] = param[1].replace(/"/g, '')
        obj[param[0]] = String(param[1])
      } else {
        param[0] = param[0].replace(/"/g, '')
        obj[param[0]] = parseInt(param[1])
      }
    } else {
      alert("Improperly formatted params")
    }
  }
  return obj
} // end objectify()
 
 
// Get the current version of Photoshop. This is called from the panel.
// The data is sent back to the panel as xml.
//
//   version - version of Photoshop
//
// Returns an xml formatted string
function checkVersion() {

  var version = parseInt(12)
  return toXML([{'name':'version','val':version}])
} // end checkVersion()
 
 
// Create an XML object from a series of inputs
//
//   _a - an array of values to be parsed into XML
//
// Returns an string formatted as xml
function toXML(_a){
  var xml = '<object>'
  for(var i=0;i<_a.length;i++){
    xml    += convertToXML(_a[i].val.toString(), _a[i].name.toString())
  }
  xml    += '</object>'
  return xml;
} // end toXML()
 
 
// Format input as xml tags
//
//   property - value of identifier
//   identifier - lable for the value
//
// Returns an xml formatted string
function convertToXML(property, identifier){
  var type = typeof property;
  var xml = '<property id = "' + identifier + '" >';
 
  switch(type){
    case "number":
      xml += "<number>";
      xml += property.toString();
      xml += "</number>";
      break;
    case "boolean":
      xml += "<" + property.toString() + "/>";
      break;
    case "string":
      xml += "<string>";
      xml += property.toString();
      xml += "</string>";
      break;
    case "object":
      // Object case is currently not supported
      alert("Object case is currently not supported");
      //xml += "<object>";
      //for(var i in property)
      //   xml += convertToXML(property[i], 
      //xml += "</object>";
      break;
    case "undefined":
      xml += "<string>undefined</string>";
      break;
    default:
      alert("Type " + type + " is unknown.");
      return "";
  }
  xml += '</property>';
  return xml;
} // end convertToXML()