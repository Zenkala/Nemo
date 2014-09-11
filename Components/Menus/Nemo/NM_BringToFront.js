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
    var lastChild = parentChildNodes[parentChildNodes.length-1];
    if(((parentChildNodes.length > 2) && (parentChildNodes[0].class=="comment slideNumber")) || (parentChildNodes.length > 1)) {
      if(lastChild != selNode) {
        var contentOfSelectedNode = selNode.outerHTML;
        for(var i = 0; i < parentChildNodes.length; i++) {
          if(parentChildNodes[i] == selNode) {
            parentChildNodes[i].outerHTML = ""; 
          }
        }
        parentNode.innerHTML += contentOfSelectedNode;
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
    var lastChild = parentChildNodes[parentChildNodes.length-1];
    if(((parentChildNodes.length > 2) && (parentChildNodes[0].class=="comment slideNumber")) || (parentChildNodes.length > 1)) {
        if(lastChild != selNode) {
          return true;
        } else {
          return false;
        }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function setMenuText() 
{
	return "Bring to Front";
}


