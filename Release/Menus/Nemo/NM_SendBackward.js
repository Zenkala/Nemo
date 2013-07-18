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
    var previousNode = selNode.previousSibling;
    if(previousNode && previousNode.class != "comment slideNumber") {
      // do the swap! magic
      var contentA = selNode.outerHTML;
      var contentB = previousNode.outerHTML;
      selNode.outerHTML = contentB;
      previousNode.outerHTML = contentA;
    }
  }
}


function canAcceptCommand()
{
  var theDOM = dw.getDocumentDOM();
  var selNode = theDOM.getSelectedNode();
  var parentNode = selNode.parentNode;
  
  if(parentNode.class == "slide activeSlide") {
    var previousNode = selNode.previousSibling;
    if(previousNode && previousNode.class != "comment slideNumber") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function setMenuText() 
{
	return "Send Backward";
}


