// Copyright 2000, 2001, 2002, 2003, 2004, 2005 Macromedia, Inc. All rights reserved.

//---------------     API FUNCTIONS    ---------------

function isDOMRequired() {
	// Return false, indicating that this object is available in code view.
	return true;
}

function isAsset() {
	return true;
}

function insertObject(assetArgs) {
  var dom = dw.getDocumentDOM();
  var uniqueId = dwscripts.getUniqueId("nm_Image");
  var selType = nm.getSelectionType();
  var boxNode = nm.getOutsideBoxNode();
  var errMsg = "";

  var bDialogState = dw.getShowDialogsOnInsert(); // Was dialog shown?
  var prefsAccessibilityOption = null;

  var imageURL;
  var documentURL = dw.getDocumentPath("document"); // Return path WITH! the name of the html page

  // This is standard Dreamweaver code. Why does they check if appname is contribute? I don't know, maybe remove the code
  if (dw.appName == "Contribute") {
    if (MM.insertImgType == "file")
      imageURL = dw.doURLEncoding(dw.browseForFileURL("select", "", true, "","","/", "", "desktop"));
    else if (MM.insertImgType == "website")
      imageURL = dw.doURLEncoding (dw.browseForImage ());
  } else {
    imageURL = dw.doURLEncoding(dw.browseForFileURL("select", "", false, "", "", documentURL + "/../../images_src/", true));
  }

  if (assetArgs) {
    imageURL = assetArgs;
  }

  

  if ((imageURL == '')  && bDialogState) {  
    errMsg = ""; 
    // No image selected. Break this if statement. 
  } else {
    // Image selected. 

    // PART COPY IMAGE
    //
    // Copy image to images folder inside the document directory
      // Some default variables that are useful
      // The magix REGEX!

      var pathpatt = /^(.*[\\\/])/;
      var filenamepatt = /[^\\/]+$/;
      var folderPath = pathpatt.exec(documentURL)[0]; 

      // Make the image url absolute
      if(imageURL[0] != "f"){
        imageURL = folderPath + imageURL;
      }
      var fileName = filenamepatt.exec(imageURL)[0];

      // Create the folder images, if not already done
      if (!DWfile.exists(folderPath + "images")) DWfile.createFolder(folderPath + "images");

      // Copy image !
      var dImageURLRelative =  "images/" + fileName;
      var dImageURLAbsolute = folderPath + "/" + dImageURLRelative;
      if(DWfile.copy(imageURL, dImageURLAbsolute)) {
        errMsg = ""; // Copy file succeeded
        imageURL = dImageURLRelative;
      } else {
        errMsg = "Dreamweaver could not copy the image to the image directory.";
      }
    // END OF PART COPY IMAGE
    //
    //

    if(!errMsg) {
      // TIP: IMAGE URL IS RELATIVE!

      // Retrieve size of image. SVG is not supported by dw &@@#!@! !
      var imgDim = dw.getNaturalSize(dImageURLAbsolute);
      var svgpatt = /\b[.svg]+$\b/; // compressed SVG files are not supported
      if(svgpatt.test(imageURL)) {
        var svgXML = MMXSLT.getXML(folderPath + "/" + imageURL);
        var svgW = svgXML.match(/<svg[^>]*width\s*=\s*["']?(\d+)["']?[^>]*>/)[1];
        var svgH = svgXML.match(/<svg[^>]*height\s*=\s*["']?(\d+)["']?[^>]*>/)[1];
        
        if(svgW && svgH) {
          imgDim = [];
          imgDim[0] = svgW;
          imgDim[1] = svgH;          
        }

      }
      
      
      // PART USER SELECTION
      //
      // These variables are default. If the selection is inside an experiment pane or content box, it will change
        var blockStr = 'style="position: absolute; left: 350x; top: 200px;"';
        var sizeStr = (imgDim) ? 'width="' + imgDim[0] + '" height="' + imgDim[1] + '"' : '';

        // Is the selection inside a content box? Make the image flow with the text
        if(boxNode) {
          // Image should go with the text flow, so change the default
          blockStr = ''; 
          sizeStr = ''; 

          // Dimensions found? Maybe we can fill the sizeStr variable
          if(imgDim) {
            imgDim[0] = parseInt(imgDim[0]);
            imgDim[1] = parseInt(imgDim[1]);
            var boxW = (boxNode.getComputedStyleProp("width"));
            var boxPL = (boxNode.getComputedStyleProp("padding-left"));
            var boxPR = (boxNode.getComputedStyleProp("padding-right"));  
            
            if(boxW) {
              boxW = parseInt(boxW);

              // Set padding
              var padding = 40;
              if(boxPL && boxPR) {
                padding = parseInt(boxPL) + parseInt(boxPR);
              } 

              if((imgDim[0] > boxW) && (boxW > 0)) {
                // Compute new size
                var r = boxW / imgDim[0];
                imgDim[0] = boxW;
                imgDim[1] = Math.round(imgDim[1]*r);
                sizeStr = 'width="' + imgDim[0] + '" height="' + imgDim[1] + '"';
              }
            }
          } 

        // Check whether the selection is inside the experiment pane (inside slide is default)
        } else if(selType == 2) {
          blockStr = ''; // Image should flow with the text. Remove this absolute positioning
        }

        // Insert the IMG tag!
        if(selType > 0) {
          dom.insertHTML('<img src="' + imageURL + '" class="nm_Image" id="' + uniqueId + '" ' + blockStr + ' ' + sizeStr + ' />', false);
        } else {
          var activeSlide = nm.getActiveSlideNode();
          var inner = activeSlide.innerHTML;
          inner += '<img src="' + imageURL + '" class="nm_Image" id="' + uniqueId + '" ' + blockStr + ' ' + sizeStr + ' />';
          activeSlide.innerHTML = inner;
        }
      // END OF PART USER SELECTION
      //
      //
    }
  

  }

}


function addAccessibility(rtnStr) {
	if (dw.appName == "Contribute") {
    var cmdFile = dreamweaver.getConfigurationPath() + "/Commands/ccImageOptions.htm";
	} else {
		var cmdFile = dreamweaver.getConfigurationPath() + "/Commands/ImageOptions.htm";
	}
  var cmdDOM = dreamweaver.getDocumentDOM(cmdFile);

  cmdDOM.parentWindow.setFormItem(rtnStr); 
  if (dw.appName == "Contribute") {
    dreamweaver.popupCommand("ccImageOptions.htm");
  } else {
    dreamweaver.popupCommand("ImageOptions.htm");
	}
   
  return (cmdDOM.parentWindow.returnAccessibilityStr(rtnStr));
}