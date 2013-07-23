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

﻿function jsxFunction()
{
	var appName;
	if(app.name == undefined)
	{
		// JavaScript only apps
		appName = app.appName;
	}
	else
	{	
		// ExtendScript enabled apps
		appName = app.name;
	}
	
	//your JSX code here

    alert("test3 " + dw.getConfigurationPath());
  var path = dw.getConfigurationPath();
 	return toXML([{'name':'path', 'val':path}]);
}

// Give the user an alert message. Data in this function comes from the swf panel, via the csxs library.
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