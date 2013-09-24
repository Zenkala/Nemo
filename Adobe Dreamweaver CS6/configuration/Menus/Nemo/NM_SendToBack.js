// Copyright 2005 Macromedia, Inc. All rights reserved.

function isDOMRequired()
{
  return false;
}

function receiveArguments()
{
	var theDOM = dw.getDocumentDOM();
  var selNode = theDOM.getSelectedNode();
  var parentNode = selNode.parentNode;
  
  if(parentNode.class == "slide activeSlide") {
    var parentChildNodes = parentNode.childNodes;
    if(((parentChildNodes.length > 2) && (parentChildNodes[0].class=="comment slideNumber")) || (parentChildNodes.length > 1)) {
      var contentOfSelectedNode = selNode.outerHTML;
      for(var i = 0; i < parentChildNodes.length; i++) {
        if(parentChildNodes[i] == selNode) {
          parentChildNodes[i].outerHTML = ""; 
        }
      }
      parentNode.innerHTML = contentOfSelectedNode + parentNode.innerHTML;
    }
  } 
}


function canAcceptCommand()
{
  var theDOM = dw.getDocumentDOM();
  var selNode = theDOM.getSelectedNode();
  var parentNode = selNode.parentNode;
  
  if(parentNode.class == "slide activeSlide") {
    var parentChildNodes = parentNode.childNodes;
    if(parentChildNodes[0].class == "comment slideNumber" && parentChildNodes.length > 2) {
      if(selNode == parentChildNodes[1]) {
        return false;
      } else {
        return true;
      }
    } else if(parentChildNodes.length > 1) {
      if(selNode == parentChildNodes[0]) {
        return false;
      } else {
        return true;
      }
    }
  } else {
    return false;
  }
}

function setMenuText() 
{
	return "Send to Back";
}


