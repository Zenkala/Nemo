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
    var nextNode = selNode.nextSibling;
    if(nextNode) {
      // do the swap! magic
      var contentA = selNode.outerHTML;
      var contentB = nextNode.outerHTML;
      selNode.outerHTML = contentB;
      nextNode.outerHTML = contentA;
    }
  }
}


function canAcceptCommand()
{
  var theDOM = dw.getDocumentDOM();
  var selNode = theDOM.getSelectedNode();
  var parentNode = selNode.parentNode;
  
  if(parentNode.class == "slide activeSlide") {
    var nextNode = selNode.nextSibling;
    if(nextNode) {
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
	return "Bring Forward";
}


