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
    if(parentChildNodes[0].class == "comment slideNumber" && parentChildNodes.length > 2) {
      if(selNode != parentChildNodes[1]) {
        // swap met parentChildNodes[1]
        var contentA = selNode.outerHTML;
        var contentB = parentChildNodes[1].outerHTML;
        selNode.outerHTML = contentB;
        parentChildNodes[1].outerHTML = contentA;
      }
    } else if(parentChildNodes.length > 1) {
      if(selNode != parentChildNodes[0]) {
        // swap met parentChildNodes[1]
        var contentA = selNode.outerHTML;
        var contentB = parentChildNodes[0].outerHTML;
        selNode.outerHTML = contentB;
        parentChildNodes[0].outerHTML = contentA;
      }
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


