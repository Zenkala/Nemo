function getCurrentStay() {
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
        if(theNode != null) {
            if((theNode.tagName == 'INPUT') || (theNode.tagName == 'SPAN') || (theNode.tagName == 'DIV') || (theNode.tagName == 'IMG')) {
                if((theNode.class == 'slide activeSlide') || (theNode.class == 'slide') || (theNode.id == 'ghostDiv') || (theNode.id == 'ghostDivCover') || (theNode.class == 'nm_qItem') || (theNode.class == 'nm_qGroup') || (theNode.id == 'title') || (theNode.id == 'navigation')) {
                    // Do nothing. This works better than the other way around
                } else {
                    theNode.stay = givenStay;
                }
            }
        }
    }
}


//Old system. report stays to extension. and recieve the ghosts from it on slide change.
/*
function getAllStays() {
    var stays = new Array();
    var staysIndex = new Array();
    var theDOM = dw.getDocumentDOM();
    if (theDOM != null) {
        var nodes = getSlideNodes(false);
        if(nodes != null) {
            var i;
            var j;
            for(i=0; i< nodes.length; i++) {
                //for each slide
                for(j=0; j<nodes[i].childNodes.length; j++) {
                    //for each node in a slide
                    if(nodes[i].childNodes[j].stay) { //node has a stay!
                        stays.push(nodes[i].childNodes[j].outerHTML);
                        staysIndex.push(i);
                    }
                }
            }
        }
    }

    if(stays.length>0) {
        var ff = stays.join("-=-");
        return toXML([ {'name':'stays', 'val':"<![CDATA[" + ff + "]]>"}, {'name':'indexes', 'val':staysIndex.join(",")} ]); //encapsule the result. or else it rather breaks the xml
    } else{
        return toXML([{'name':'stays', 'val':"empty"},  {'name':'indexes', 'val':"0"}]);
    }
}

function setGhosts (givenGhosts) {
    var theDOM = dw.getDocumentDOM();
    if (theDOM != null) {
        //split recieved parameter
        var ghosts = new Array;
        ghosts = givenGhosts.split("-=-");

        //empty ghostDiv
        var ghostDiv = theDOM.getElementById("ghostDiv");
        if(ghostDiv != undefined) { 
            ghostDiv.innerHTML = ""; //flusg
        } else {
            //add the ghostDiv, since it's not already here
            theDOM.getElementById("contentDiv").outerHTML = '<div id="ghostDiv"> </div>' + theDOM.getElementById("contentDiv").outerHTML; //sneaky way to append an element below some other element.
            ghostDiv = theDOM.getElementById("ghostDiv");
        }

        //fill ghost with emelents. set alpha of elelemts.
        var i;
        for(i=0; i<ghosts.length; i++) {
            ghostDiv.innerHTML += ghosts[i];
        }
        ghostDiv.innerHTML += '<div id="ghostDivCover"> </div>'
    }

}
*/

//new system. all local on slide change
function createGhosts(givenIndex) {
    var theDOM = dw.getDocumentDOM();
    if (theDOM != null) {

        //empty ghostDiv
        var ghostDiv = theDOM.getElementById("ghostDiv");
        if(ghostDiv != undefined) { 
            ghostDiv.innerHTML = ""; //flush
        } else {
            //add the ghostDiv, since it's not already here
            theDOM.getElementById("contentDiv").outerHTML = '<div id="ghostDiv"> </div>' + theDOM.getElementById("contentDiv").outerHTML; //sneaky way to append/prepend an element below some other element.
            ghostDiv = theDOM.getElementById("ghostDiv");
        }

        var nodes = getSlideNodes(false);
        if(nodes != null) {
            var i;
            var j;
            for(i=0; i< nodes.length; i++) {
                //for each slide
                for(j=0; j<nodes[i].childNodes.length; j++) {
                    //for each node in a slide
                    if(nodes[i].childNodes[j].stay) { //node has a stay!
                        //check if the node should be ghosted
                        if(nodes[i].childNodes[j].stay > 0) { //node has a stay that is actually useful
                            if(givenIndex > i && givenIndex <= i + parseInt(nodes[i].childNodes[j].stay)) {
                                //add to ghosts
                               ghostDiv.innerHTML += nodes[i].childNodes[j].outerHTML;
                            }
                        }   
                    }
                }
            }
        }
        ghostDiv.innerHTML += '<div id="ghostDivCover"> </div>';
        theDOM.setSelectedNode(nodes[givenIndex], false, true);
    }

    if(stays.length>0) {
        var ff = stays.join("-=-");
        return toXML([ {'name':'stays', 'val':"<![CDATA[" + ff + "]]>"}, {'name':'indexes', 'val':staysIndex.join(",")} ]); //encapsule the result. or else it rather breaks the xml
    } else{
        return toXML([{'name':'stays', 'val':"empty"},  {'name':'indexes', 'val':"0"}]);
    }
}


function getDocumentPath() {    
    return toXML([{'name':'path', 'val':dreamweaver.getDocumentPath("document")}]);
}

function getCurrentSlide() {
    var dom = dw.getDocumentDOM();
    var i = 0;
    if(dom) {
        var slide = dom.getElementById("slide"+i);
        while(slide) {
            if(slide.class == "slide activeSlide") {
                // found!
                return toXML([{'name':'currentSlide', 'val':i}]);
                break;
            }
            i++;
            slide = dom.getElementById("slide"+i);
        }
    }
    return toXML([{'name':'currentSlide', 'val':i}]);
 }

/*
   //The old long function
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
   
    return toXML([{'name':'currentSlide', 'val':'2'}]);

}
 */

function gotoSlide(newSlide, oldSlide) {
    forceGotoSlide(newSlide);
    /*
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
    */
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
           
        var node = theDOM.getElementById("slide" + c);
        theDOM.setSelectedNode(node);
        theDOM.insertHTML('<div class="slide" id="slide' + j + '"><p>&nbsp;</p></div>', false);
        
        // Reset slide numbering
        var slides = getSlideNodes (false);
        for(i = 0; i < slides.length; i++) {
            var id = ("slide"+i);
            slides[i].setAttribute("id", id);
        }
    }
}

function duplicateSlide(givenCurrentSlide) {
    var theDOM = dw.getDocumentDOM();
    
    if(theDOM != null) {
        var j = getTotalSlides(true);
        var c = parseInt(givenCurrentSlide);
           
        var node = theDOM.getElementById("slide" + c);
        theDOM.setSelectedNode(node);
        theDOM.insertHTML('<div class="slide" id="slide' + j + '"><p>&nbsp;</p></div>', false);
        
        // Reset slide numbering
        var slides = getSlideNodes (false);
        for(i = 0; i < slides.length; i++) {
            var id = ("slide"+i);
            slides[i].setAttribute("id", id);
        }
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

function updateStayAddSlide(givenIndex) {
	var index = parseInt(givenIndex);
	var nodes = getSlideNodes(false);

	if(nodes != null) {
		var elList = [];
		//	Which elements are on the selected slide?

			// First, do the 'real' elements on the previous slide
			elList = nodes[index].childNodes; // The nodes that are certainly on this slide
			for(var i = 0; i < elList.length; ++i) {
				if(elList[i].stay) {
					if(elList[i].stay > 0) {
                        elList[i].stay++;
					}
				}
			}

			// Second, look out for ghost element on theSlide
			var k = 0;
			for(var j = (index-1); j >= 0; --j) {
				elList = nodes[j].childNodes;
				for(var i = 0; i < elList.length; ++i) {
					if(elList[i].stay) {
						if(elList[i].stay > (1+k)) {
                            elList[i].stay++;
						}
					}
				}
				k++;
			}

	}
}

function updateStayRemoveSlide(givenIndex) {
	var index = parseInt(givenIndex);
	var nodes = getSlideNodes(false);
	if(nodes != null) {
		var elList = [];
			// Second, look out for ghost element on theSlide
			var k = 0;
			for(var j = (index-1); j >= 0; --j) {
				elList = nodes[j].childNodes;
				for(var i = 0; i < elList.length; ++i) {
					if(elList[i].stay) {
						if(elList[i].stay > (k)) {
							elList[i].stay--;
						}
					}
				}
				k++;
			}
	}
 }

function updateStayDuplicateSlide(givenIndex) {
	var index = parseInt(givenIndex);
	var nodes = getSlideNodes(false);

	if(nodes != null) {
		var elList = [];
		//	Which elements are on the previous slide, before inserting new slide?
            var k = 0;
			for(var j = (index-1); j >= 0; --j) {
				elList = nodes[j].childNodes;
				for(var i = 0; i < elList.length; ++i) {
					if(elList[i].stay) {
						if(elList[i].stay > (k)) {
                            elList[i].stay++;
						}
					}
				}
				k++;
			}
			// First, do the 'real' elements on the previous slide
			elList = nodes[index].childNodes; // The nodes that are certainly on this slide
			for(var i = 0; i < elList.length; ++i) {
                    if(elList[i].stay) {
                        elList[i].stay++;
                    } else {
                        elList[i].setAttribute("stay", "1");
                    }   
			}
        
                // Second, look out for ghost element on theSlide
			
     } 
}

function updateSlideLook(givenIndex) {
    // The given index of the new slide
    var index = parseInt(givenIndex);
    var nodes = getSlideNodes(false);
    
    var prevSlide = nodes[index-1];
    var curSlide = nodes[index];
    
    if(prevSlide.type) {
        if(prevSlide.getAttribute("type") == "experiment") {
            curSlide.setAttribute("type", "experiment");
        }    
    }
    

}

/*
function updateStay(givenIndex, action) {
    
    var index = parseInt(givenIndex);
  
   
    var nodes = getSlideNodes(false);
    if(nodes != null) {
        var i;
        var j;
        for(i=0; i< index; i++) {
            //for each slide
            for(j=0; j<nodes[i].childNodes.length; j++) {
                //for each node in a slide
                if(nodes[i].childNodes[j].stay) { //node has a stay!
                    if(nodes[i].childNodes[j].stay != 0) {
                        if((i + nodes[i].childNodes[j].stay) > index) {
                            if(action == 'add') {
                                nodes[i].childNodes[j].stay++;
                            } else {
                                nodes[i].childNodes[j].stay--;
                            }
                        }
                    }
                }
            }
        }
    }
}
*/
//////======== Animation functions ==========================//////////
var pathpatt = /^(.*[\\\/])/

function checkForAnimations(){
    var localPathPatt = /\/\/updatePath:.*(?=\*)/;
    var folderpath = pathpatt.exec(dreamweaver.getDocumentPath("document"))[0];
    var fileURL;

    if(DWfile.exists(folderpath + "animations")){
        //var list = DWfile.listFolder(dreamweaver.getDocumentPath("document") + "animations", "directories");                  
        
        var list = DWfile.listFolder(folderpath + "animations", "directories");
        var pathList = new Array();
        //fill animations from named of the folders
        if (list){
            for(var i=0; i<list.length; i++){
                fileURL    = folderpath + "animations/" + list[i] + "/" + list[i] + "_edgePreload.js";
                var str    = DWfile.read(fileURL);
                var result = localPathPatt.exec(str);
                if(result != null){
                    pathList.push(result[0].substring(13));
                }else {
                    pathList.push(""); //add an empty, to keep the order aligned.
                }
            }
            if(list.length <= 0) {
                return toXML([ {'name':'animations', 'val':"none"}, {'name':'paths', 'val':"none"} ]);
            } else {
                return toXML([ {'name':'animations', 'val':list.join(",")}, {'name':'paths', 'val':pathList.join(",")} ]);
            }
        } else {
            return toXML([ {'name':'animations', 'val':"none"}, {'name':'paths', 'val':"none"} ]);
        }
    }else{
        return toXML([ {'name':'animations', 'val':"none"}, {'name':'paths', 'val':"none"} ]);
    }
}

/*
user selects the path to the web export
floater copies the image folder content to the image folder in the site root
floater copies the js files to the aniamtionJS folder in the site root
floater copies content of the edgePreload.js file to memory
floater edits the urls to the js files.
floater writes the edited content back to the edgeProload.js file.

display a list of animations and their name.
Ability to add and remove aniamtiosn
abiliy to update them
ability to fill the current selected animation-object with the selected animation
  -loads the container div with the prober id and class
  -adds the right call to the OLO loader
  */

function addAnimation(givenName, givenPath){
    var folderpath = pathpatt.exec(dreamweaver.getDocumentPath("document"))[0];
    var fileURL;

    if(givenPath == "none") { //new animation
        //ask use to select a folder
        fileURL = dreamweaver.browseForFileURL("select", "Select a '_edgePreload.js' File", false, true, new Array("Javascript Files (*.js)|*.js"), folderpath + "/../../animations_src/");
    } else { //updating an existing animation
        if (DWfile.exists(givenPath)){ //lets do this!
            fileURL = givenPath;
        }else{ //aniamtion not found. request user to locate it
            //fileURL = dreamweaver.browseForFileURL("select", "Select new location of '" + givenName + "_edgePreload.js'", false, true, new Array("Javascript Files (*.js)|*.js"), folderpath);
            fileURL = dreamweaver.browseForFileURL("select", "Select new location of '" + givenName + "_edgePreload.js'", false, true, new Array("Javascript Files (*.js)|*.js"), folderpath);
            givenPath = "none"; //flag we do use selected mode.
        }
        
    }
    
    if(fileURL == false) {
        fileURL = "";
        return toXML([{'name':'animation', 'val':"none"},{'name':'path', 'val':"none"}]);
    } else {
        if(fileURL[0] == "f"){
            //fixed. do nothing
        }else{
            //reletive. add our root
            fileURL = folderpath + fileURL;
        }

        var error = false;
        var animationName = "";
        var sourceFolderURL = "";

        //
        //  Retrieve animation name and location from URL
        //
        if(givenPath == "none") {
            animationName = /[^\/]+(?=_edge)/.exec(fileURL);
            sourceFolderURL = /.*(?=\/)/.exec(fileURL);
        } else {
            animationName = givenName; //else, get name from givenName
            sourceFolderURL = givenPath; //else, get path from givenPath
        }

        if((animationName == "") || (sourceFolderURL == "")) {
            error = "Failed to import animation. This is not a correct file.";
        }

        //
        //  Check if sourceFolderURL is published folder
        //
        if(!error) {
            isPublishedSourceFolderURL = /publish\/web/.test(sourceFolderURL);
            if(!isPublishedSourceFolderURL) {
                sourceFolderURL = sourceFolderURL + "/publish/web";
            }
        
        //
        //  Check if the edge files exists (from directory)
        //
            if(!DWfile.exists(sourceFolderURL + "/" + animationName + "_edgePreload.js")) {
                error = "Please publish your animation first. Could not find published files.";
            }
         }

        //
        //  Create animations and images folder inside _web directory (if not exists)
        //
        if(!error) {
            if (!DWfile.exists(folderpath + "animations")) DWfile.createFolder(folderpath + "animations");
            if (!DWfile.exists(folderpath + "images")) DWfile.createFolder(folderpath + "images");

        //
        //  Generate target folder
        //
            var folderURL = folderpath + "animations/" + animationName;


        //
        //  Check if the to directory already exists. That means that we're updating an older animation
        //
            if(DWfile.exists(folderURL + "/" + animationName + "_edgePreload.js")){
                // Check if the file includes the text NEMO. Yes? User should first Publish his file 
                var sourcePreloadURL = sourceFolderURL + "/" + animationName + "_edgePreload.js";
                //open a file
                var sourcePreloadFile = DWfile.read(sourcePreloadURL); 
                if(/Imported by Nemo/.test(sourcePreloadFile)) {
                    error = "Koekwous! Update failed. Please re-publish your animation first.";
                } else {
                    alert("Updating an older version of " + animationName + "!");
                    DWfile.remove(folderURL + "/" + animationName + "_edgePreload.js");    
                }

            } else { //not updating, create the folder
                DWfile.createFolder(folderURL);
            }
        }


        //
        //  It's time to copy the files!
        //
        if(error) {
            alert(error);
            return toXML([{'name':'animation', 'val':"none"},{'name':'path', 'val':"none"}]);
        } else {
            //copy all the Js files to that place
            DWfile.copy(sourceFolderURL + "/" + animationName + "_edge.js", folderURL + "/" + animationName + "_edge.js");
            DWfile.copy(sourceFolderURL + "/" + animationName + "_edgeActions.js", folderURL + "/" + animationName + "_edgeActions.js");
            DWfile.copy(sourceFolderURL + "/" + animationName + "_edgePreload.js", folderURL + "/" + animationName + "_edgePreload.js");


             //copy all the images to root/images
            var list = DWfile.listFolder(sourceFolderURL + "/images");
            if (list){
                for(var j=0; j<list.length; j++){
                    DWfile.copy(sourceFolderURL + "/images/" + list[j], folderpath + "/images/" + list[j]);
                }
            }


        //
        // Edit the preload file! Get the edgePreloadFile
        //

            //switch fileURL to the preLoad one we've copied
            edgePreloadURL = folderURL + "/" + animationName + "_edgePreload.js";
            //open a file
            var edgePreloadFile = DWfile.read(edgePreloadURL); 

        //
        //  Define regex patterns
        //
            var pattAction = /[\w\_%]*_edge\.js|[\w\_%]*_edgeActions\.js/g; //match the composition specific files
            var pattActionName = /[^\/]+$/; //name of edge lib
            var pattEdgeInclude = /edge_includes/g;//entire edge lib path
            var pattJquery = /load:"[\w_\/\.\d-]*jquery[\w_\/\.\d-]*"/g; //entire jquery loading statements.
            var pattLoad    = /preContent={dom:/; //after the loading statement

        //
        //  Reallocate links in edgePreloadFile
        //
            var result      = pattAction.exec(edgePreloadFile);
            var results     = new Array();
            var oldresult   = "";
            while( result && result!=oldresult){
                oldresult   = result;
                results.push(result);
                result      = pattAction.exec(edgePreloadFile);
            }

            for(var i=0; i<results.length; i++){
                edgePreloadFile = edgePreloadFile.replace(results[i], "animations/" + animationName + "/" + results[i]);
            }

        //
        //  Reallocate link to edge library
        //
            result      = pattJquery.exec(edgePreloadFile);
            results     = new Array();
            oldresult   = "";
            while( result && result!=oldresult){
                oldresult   = result;
                results.push(result);
                result      = pattJquery.exec(edgePreloadFile);
            }

            for(i=0; i<results.length; i++){
                edgePreloadFile = edgePreloadFile.replace(results[i], 'load:""');
            }

        //
        //  Flag the animation source file that we've imported it. T
        //
            var sourcePreloadURL = sourceFolderURL + "/" + animationName + "_edgePreload.js";
            var sourcePreloadFile = DWfile.read(sourcePreloadURL);
            DWfile.write(sourcePreloadURL, (" \/* Imported by Nemo *\/ " + sourcePreloadFile));


        //
        //  Add some usefull info
        //
            edgePreloadFile = edgePreloadFile.replace(pattLoad, "onDocLoaded();preContent={dom:"); //add onDocLoaded event that would otherwise never be called
            edgePreloadFile = edgePreloadFile + "\/\/updatePath:" + sourceFolderURL + "*"; 

            if (DWfile.write(edgePreloadURL, (" \/* Edited by Nemo *\/ " + edgePreloadFile) )) { 
                // start by announching it is edited.
                //document.getElementById("status").innerHTML = "Loaded " + animationName;
                //all is succesful. notify the extension
                return toXML([{'name':'animation', 'val':animationName},{'name':'path', 'val':sourceFolderURL}]);
            } else {
                //weird stuff happened
                alert("Failed to import animation. Could not write the file.");
                return toXML([{'name':'animation', 'val':"none"},{'name':'path', 'val':"none"}]);
            }

        

        }
    }
}

function assignAnimation(givenAnimation) {
    if(givenAnimation != "none") {
        var folderpath = pathpatt.exec(dreamweaver.getDocumentPath("document"))[0];
        var theDOM = dw.getDocumentDOM();
        var widthPatt = /\.P\(w,[0-9]{3,4}\)/g;
        var heightPatt = /\.P\(h,[0-9]{3,4}\)/g;
        var numPatt = /[0-9]{3,4}/;
        if (theDOM != null) {
            var theNode   = theDOM.getSelectedNode();
            var oldAssign = theNode.id;
            var classList = theNode.class.split(" ");
            if(contains(classList, "nm_Animation")){ //select an animation container
                theNode.setAttribute("url",encodeURIComponent(givenAnimation) );
                theNode.class = "" + givenAnimation.replace(/^[_\d]*| /g, "") + " nm_Animation";
                theNode.id = "" + givenAnimation.replace(/^[_\d]*| /g, ""); //remove any digits and underscores in front of the first proper character. And any spaces.
                //open <givenAnimation>_edge.js, extract the height and width of the stage and assign it to the animationContainer
                var str = DWfile.read(folderpath + "animations/" + givenAnimation + "/" +givenAnimation + "_edge.js"); 
                var maxWidth  = 0;
                var maxHeight = 0;
                var result    = numPatt.exec(widthPatt.exec(str));
                var oldresult = "";
                while( result && result!=oldresult){
                    oldresult = result;
                    if(parseInt(result) > maxWidth) maxWidth = parseInt(result);
                    result    = numPatt.exec(widthPatt.exec(str));
                }
                result    = numPatt.exec(heightPatt.exec(str));
                while( result && result!=oldresult){
                    oldresult = result;
                    if(parseInt(result) > maxHeight) maxHeight = parseInt(result);
                    result    = numPatt.exec(heightPatt.exec(str));
                }            

                theNode.style.width = maxWidth   + "px";
                theNode.style.height = maxHeight + "px";
                //done
                return toXML([{'name':'success', 'val':"true"}]);
            }else{
                alert("Please select an animation container from the stage.");
                return toXML([{'name':'success', 'val':"false"}]);
            }
        }else{
            alert("open a file first!");
            return toXML([{'name':'success', 'val':"false"}]);
        }
    } else {
         alert("Please select an animation from the list.");
         return toXML([{'name':'success', 'val':"false"}]);
    }
   
}


function removeAnimation(givenName) {
    //on to the target folder     
    var folderURL = pathpatt.exec(dreamweaver.getDocumentPath("document"))[0] + "animations/" + givenName;

    //check if preload exists. if it does, remove it and notify the user that we're updating an older animation
    if(DWfile.exists(folderURL)){
        if (confirm("Are you sure you want to remove " + givenName + "?\n(" + folderURL + ")") ) {
            DWfile.remove(folderURL);
        }
    }
}

//////======== XML functions, used for communication back and forth jsx <-> extension ==========================//////////

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

//because Array.contains is somtimes not supported?
function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}