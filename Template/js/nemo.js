var currentPage = 0;
var totalPages = 1;
var slideBuffer = [];
var sliding = false;
var quick = false;
var gotoSlide = 0;

// "http://fonts.googleapis.com/css!css?family=PT+Sans+Narrow"
var scripts = [	'js/jquery.transit.min.js',
				'js/jquery-ui-1.10.3.custom.min.js',
				'http://uitlegapp.allyne.net/js-libs/jax/MathJax.js?config=AM_HTMLorMML-full&delayStartupUntil=configured',/*,
				"http://uitlegapp.allyne.net/js-libs/jqplot/jquery.jqplot.min.js",
				"http://uitlegapp.allyne.net/js-libs/jqplot/plugins/jqplot.logAxisRenderer.min.js",
				"http://uitlegapp.allyne.net/js-libs/jqplot/plugins/jqplot.canvasTextRenderer.min.js",
				"http://uitlegapp.allyne.net/js-libs/jqplot/plugins/jqplot.canvasAxisLabelRenderer.min.js",
				"http://uitlegapp.allyne.net/js-libs/jqplot/plugins/jqplot.canvasOverlay.min.js",
				"http://uitlegapp.allyne.net/js-libs/jqplot/plugins/jqplot.pointLabels.min.js",
				"http://uitlegapp.allyne.net/js-libs/jqplot/jquery.jqplot.min.css",*/
				"css/ui-lightness/jquery-ui-1.10.3.custom.min.css"
			];
var animations;	

function log(msg) {
	var logger = window.console;
	if (logger && logger.markTimeline) {
		logger.markTimeline(msg);
	}
	console.log(msg)
}

var totalProgress = 14;
var currentProgress = 0;
var enableProgressBar = false;
function progress(msg) {
	currentProgress++;
	log(currentProgress + ": " + msg);
	if(enableProgressBar) {
		$("#loadingLogo").css("margin-left", -325 + currentProgress/totalProgress*600);
	}
}
		
function nemoInit(){
	log("-----------NemoInit-----------");	
	//first thing: load jquery
	yepnope.injectJs("js/jquery-1.9.1.min.js", function () {
		console.log("loaded: jquery-1.9.1.min.js");	
		$(function() {
			log("preloader");

			//hide and delete comment/ghosting stuff
			$("#contentDiv").hide();
			$("#navigation").hide();
			$("#title").hide();
			$(".comment").remove();
			$("#commentslide").remove();
			$("#ghostDiv").remove();

			//display logo
			var img = document.createElement("img");
			img.src = "css/logo.png";

			var lineImg = $('<div id="loadingBar" style="position: absolute; background-image: url(\'css/animation-proxy.svg\'); background-repeat: repeat-x; width: 600px; height: 5px; left:512px; top:336px; margin-left: -300px; margin-top: -2px;" />');			 
			var logoImg = $('<img src="css/logo.png" id="loadingLogo" style="position: absolute; with: 50px; height: 50px; left:512px; top:336px; margin-left: -25px; margin-top: -25px;" />');
			$('body').append(lineImg);
			$('body').append(logoImg);

			//check for animations we have to load 
			animations = new Array();
			var animUrl = "";
			$(".nm_Animation").each(function(){
				animUrl = $(this).attr("url").replace(/%20/g, " ");
				console.log("found animation: " + $(this).attr("id"));
				animations.push("animations/" + animUrl + "/" + animUrl + "_edgePreload.js");
				totalProgress++;
			});

			enableProgressBar = true;
			progress("enable ProgressBar");

			loadLibs();
		});

		
	}, { charset: "utf-8" }, 5000);	
}

//load all the other library's we use
function loadLibs(){	
	$(function() {
		log("loading libraries");
		yepnope([{
			load: scripts,
			callback: function (url, result, key) {
				progress("loaded: " + url);
			},
			complete: function(){
				log("yepnope complete"); 
				loadAnims();		
			}
		}]);
	});
}

//load the EDGE animations
function loadAnims(){
	log("load " + animations.length + " animations");	
	if(animations.length>0){	
		yepnope([{
			load: animations,
			callback: function (url, result, key) {
				progress("loaded: " + url);
			},
			complete: function(){
				log("loading animations complete"); 
				startNemoScript();
			}
		}]);
	}else{
		startNemoScript();
	}
}

function startNemoScript(){		
	//apply MathJax

	log("configure MathJax");
	//jax initializes slow. So there is a change it's not yet done when we get here.
	if(typeof MathJax == 'undefined') {
		console.log("jax undefined! trying again over 200 ms");		
		window.setTimeout("startNemoScript()",200);//try again
		return null; //quick this function for now.
	}//else: jax is defined. we can continue!

	MathJax.Hub.Configured();
	MathJax.Hub.Register.StartupHook("End", function () {
		progress("MathJax ended");			

		//parse all text to set Items (eindtermen, begrippen, terms, units)
		$(".nm_Text, .nm_TextField, .nm_TextBubble, .nm_Exclamation, .nm_InfoBlock").each(function() {
			//replace with: #[\w\d ]*?# ?[\d]*
			var patt = /#[^#]*?# ?[\d]*/g;
			var strPatt = /[^#][^#]*(?=#)/; //weirdness
			var targetPatt = /\d*$/;
			var str = $(this).html();

			//get all matches
			var result      = patt.exec(str)
			var results     = new Array();
			var oldresult   = "";
			while( result && result!=oldresult){
			    oldresult   = result;
			    results.push(result);
			    result      = patt.exec(str);
			}

			for(var i=0; i<results.length; i++){
				console.log("replacing: " + results[i] + " with : " + strPatt.exec(results[i]));
			    str = str.replace(results[i], '<output class="nm_Begrip" target="' + targetPatt.exec(results[i]) + '">' + strPatt.exec(results[i]) + "</output>"); //get string ending with # and skipping any #'s along the way
			}
			$(this).html(str);
		});
	
		//set contentDiv width and innerHeight
		$("#contentDiv").css("width", "1024px");
		$("#contentDiv").css("height", "643px");
		//set other css styles which are set for workview
		$(".slide").css("border", '');
		
		//remove commentSlide
		$("#commentslide").remove();

		//position all the slides.
		console.log("positioning the slides");
		var i = 0;
		$(".slide").each(function() {
			$(this).css("left", (i*1024) + "px");
			//also check if this is the slide we should display.
			if($(this).attr("class") == "slide activeSlide") gotoSlide = i; //console.log("current selected!");
			i++;
		});

		//swap work css to display css 
		var oldlink = document.getElementById("mainCSS");
		var newlink = document.createElement("link");
		newlink.setAttribute("rel", "stylesheet");
		newlink.setAttribute("type", "text/css");
		newlink.setAttribute("href", "css/nemo.css");		
		document.getElementsByTagName("head")[0].replaceChild(newlink, oldlink);	
		console.log("Swapping " + oldlink.getAttribute("href") + " with " + newlink.getAttribute("href"));	
		 		
		//set original parent of each element.
		$(".slide").children().each(function(){
			$(this).attr("org", $(this).parent().attr("id").substring(5));
			//console.log("set " + $(this).attr("id") + "(" + $(this).attr("class") + ") org to: " + $(this).attr("org"));
		});
		console.log("element origins set");
		

		// Add open/close functionality to InfoBlock
		$(".nm_InfoBlock").on({
			click: function() {
				var opencloseLid = $(this).find(".opencloseLid");
				$(this).find(".paragraph").slideToggle(function() {
					opencloseLid.toggleClass("open");
				});
			}
		});
		//$(".nm_InfoBlock").width('200px');
		$(".nm_InfoBlock").height('auto');
		//remove position absolute and attempt to place on the right position for it's children.
		$(".nm_InfoBlock .paragraph").children().each(function(){
			$(this).css("position", ""); 
			$(this).css("margin-left", $(this).css("left"));
			$(this).css("margin-top", $(this).css("top"));
		});

		//make nm_TextBubbleContent & nm_Explanation divs.
		var divBuffer;		
		$(".nm_TextBubble").each(function(){
			divBuffer = $("<div>").html($(this).html()).addClass("nm_TextBubbleContent");
			$(this).empty(); 
			$(this).append(divBuffer);
		});
		$(".nm_Explanation").each(function(){
			divBuffer = $("<div>").html($(this).html()).addClass("nm_ExplanationContent");
			$(this).empty();
			$(this).append(divBuffer);
		});
		console.log("content divs for bubbles made");

		$("body").append('<div id="dummyRender"></div>');
		$(".nm_TextBubble").each(function(){
			var tempBubble = $(this).clone().appendTo($('#dummyRender')).css("visibility", "hidden");
			$(this).attr("rHeight", tempBubble.outerHeight());
			$(this).attr("rWidth", tempBubble.outerWidth());
		});
		$("#dummyRender").remove();

		//attach bubbels to their targets if any
		$(".nm_TextBubble").each(function(){
			var h = $(this).attr("rHeight");
			if(($(this).hasClass("middle-left") || $(this).hasClass("middle-right")) && (h < 42)) {
				$(this).append('<div class="nm_TextBubblePointer" style="height: ' + h + 'px; margin-top: -' + 0.5*h + 'px"></div>');
			} else {
				$(this).append('<div class="nm_TextBubblePointer"></div>');
			}
		});

		//attach bubbels to their targets if any And change them to explanations
		$(".nm_TextBubble[target]").each(function(){
			$(this).addClass("nm_Explanation");
			var target = $("#" + $(this).attr("target"));
			var bubble = $(this);
			console.log(target)
			console.log(target.css("left"), $(this).attr("rHeight"), $(this).attr("rWidth"));
			var leftOffset = 0;
			var topOffset = 0;
			if(bubble.hasClass("bottom-left")){		topOffset = -parseInt(bubble.attr("rHeight")) - 58; }
			if(bubble.hasClass("bottom-middle")){	topOffset = -parseInt(bubble.attr("rHeight")) - 58; 								leftOffset = (parseInt(target.css("width"))-parseInt(bubble.attr("rWidth")))/2;}
			if(bubble.hasClass("bottom-right")){	topOffset = -parseInt(bubble.attr("rHeight")) - 58;									leftOffset = parseInt(target.css("width"))-parseInt(bubble.attr("rWidth"));}
			if(bubble.hasClass("middle-left")){		topOffset = (parseInt(target.css("height")) - parseInt(bubble.attr("rHeight")))/2; 	leftOffset = parseInt(target.css("width")); }
			if(bubble.hasClass("middle-right")){	topOffset = (parseInt(target.css("height")) - parseInt(bubble.attr("rHeight")))/2; 	leftOffset -= parseInt(bubble.attr("rWidth")); }
			if(bubble.hasClass("top-left")){		topOffset = parseInt(target.css("height")); }
			if(bubble.hasClass("top-middle")){		topOffset = parseInt(target.css("height")); 										leftOffset = (parseInt(target.css("width"))-parseInt(bubble.attr("rWidth")))/2;}
			if(bubble.hasClass("top-right")){		topOffset = parseInt(target.css("height"));											leftOffset = parseInt(target.css("width"))-parseInt(bubble.attr("rWidth"));}	
			bubble.css("left", (parseInt(target.css("left")) + leftOffset) + "px");
			bubble.css("top", (parseInt(target.css("top")) + topOffset) + "px");
			//make the target clickable
			target.on("click", function(event){ bubble.transition({ scale: 1 }, 200); bubble.attr("clicked", "true")});
			target.mouseenter(function(event){ bubble.transition({ scale: 1 }, 100)});
			target.mouseleave(function(event){ if(bubble.attr("clicked") != "true") bubble.transition({ scale: 0 }, 100)});
			target.addClass("hoverable");
			bubble.transition({ scale: 0 }, 0);
		});
		
		$(".nm_Explanation").append('<span class="close">x</span>');
		$(".nm_Explanation .close").on({
		  click: function(){
		    $(this).closest(".nm_Explanation").transition({ scale: 0 }, 200);
		    $(this).closest(".nm_Explanation").removeAttr("clicked");
		  }
		});


		//make sliders
		console.log("do sliders");
		//$(".nm_slider").slider({ step: 5, value: 15, min: 0, max: 30 });

		//make title
		$("#title span").html(document.title);

		//set total slides
		totalPages = 0;
		$(".slide").each(function(){
			totalPages++;
		});
		$("#slideIndex").html("1/"+totalPages);

		$(".nm_TextBubble").each(function(){
			var h = $(this).attr("rHeight");
			if(h > 30) { h = h - 30; }

			if(($(this).hasClass("middle-left") || $(this).hasClass("middle-right")) && (h < 42)) {
				$(this).append('<div class="nm_TextBubblePointer" style="height: ' + h + 'px; margin-top: -' + 0.5*h + 'px"></div>');
			} else {
				$(this).append('<div class="nm_TextBubblePointer"></div>');
			}
		});

		//load our dummy js. Since yepnope is queued, this complete callback will be called when all previous files are loaded.
		yepnope([{
			load: ["js/finished.js"],
			complete: function(){
				progress("Finishing");
				endNemoScript();
			}
		}]);
	});
}

function endNemoScript(){
	//done with all our preperation work
	log("-----------Nemodone-----------");
	$("#loadingLogo").remove();
	$("#loadingBar").remove();
	$("#contentDiv").show();
	$("#navigation").show();
	$("#title").show();

	setTimeout(function() {
	    onLoad(); //notify the javascript of the module that we're done
	    //goto slide last viewed in Dreamweaver
	    for(i=0; i<gotoSlide; i++) {
	    	quick = true;
	    	next();
	    }

	    if(gotoSlide == 0) { //if we don't do a quick next, no enterframe handles are called. So call them manually.
	    	newSlideHdl(0, false);
	    	newSlideStopHdl(0, false);
	    }
	    
	    quick = false;
	}, 100); //wait 100ms to give initizing scripts within Edge Animations a chance to do their stuff.

	//prevent scroll
	$(document).on('touchmove',function(e){
		e.preventDefault();
	});
	
	//$('html').on("swipeleft", function(){next();});
	//$('html').on("swiperight", function(){prev();});
}

function next(){
	slideBuffer.push("next");
	if(!sliding)doSlide();
}
function prev(){
	slideBuffer.push("prev");	
	if(!sliding)doSlide();
}

function doSlide(){
	console.log("doSlide called. buffer: " + slideBuffer.length + " quick: " + quick)
	if(slideBuffer.length<=0){
		console.log("stop");
		sliding = false;
		return;
		
	}
		
	sliding = true;
	console.log("go");
	if(slideBuffer[0] == "next"){
		var elementbuffer = [];		
		currentPage++;
		console.log("next to " + currentPage);	
		$("#slideIndex").html(""+(currentPage+1)+"/" + totalPages);
		newSlideHdl(currentPage, false);
		//put back children that are here to stay
		$("#slide"+(currentPage-1)).children().each(function(){
			if((parseInt($(this).attr("org"))+parseInt($(this).attr("stay")))>=currentPage){
				//attach satys children to content div as temporairy storage
				elementbuffer.push($(this));
				$('#contentDiv').append( $(this) );
			}
		});
		//move all slides
		$(".slide").transition({ translate: (currentPage*-1024) }, quick?0:350, 'easeOutExpo');
		$("html").transition({}, quick?0:350, function() {		
			elementbuffer.reverse().forEach(function(entry){
				$(entry).prependTo($('#slide' + currentPage));
			});
			newSlideStopHdl(currentPage, false);
			slideBuffer.shift(); //rem first element
			doSlide(); //recursive
		});
	}else{ //back
		if(currentPage==0){//skip this order
			slideBuffer.shift(); //rem first element
			doSlide(); //recursive
		}else{
			var elementbuffer = [];
			currentPage--;
			console.log("prev to " + currentPage);	
			$("#slideIndex").html(""+(currentPage+1)+"/"+totalPages);
			newSlideHdl(currentPage, true);
		
			//put back children that are here to stay
			$("#slide"+(currentPage+1)).children().each(function(){
				if(parseInt($(this).attr("org"))<=currentPage){
					if(parseInt($(this).attr("stay")) >= (currentPage-parseInt($(this).parent().attr("id").substring(5)))){
						//attach satys children to content div as temporairy storage
						elementbuffer.push($(this));
						$('#contentDiv').append( $(this) );
					}
				}else{
					//$(this).transition({translate:0}, 350, 'easeOutExpo');
				}
			});		
			//move all slides
			$(".slide").transition({ translate: (currentPage*-1024) }, quick?0:350, 'easeOutExpo');
			$("html").transition({}, quick?0:350, function() {			
				elementbuffer.reverse().forEach(function(entry){
					$(entry).prependTo($('#slide' + currentPage));
				});
				newSlideStopHdl(currentPage, true);
				slideBuffer.shift(); //rem first element
				doSlide(); //recursive
			});
		}//end of currentpage==0
	}//end of next/prev if.
}
