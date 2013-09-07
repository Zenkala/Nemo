var currentPage = 0;
var slideBuffer = [];
var sliding = false;
var quick = false;
var gotoSlide = 0;

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
	console.log(currentProgress + ": " + msg);
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
			$(".nm_Animation").each(function(){
				console.log("found animation: " + $(this).attr("id"));
				animations.push("animations/" + $(this).attr("id") + "/" + $(this).attr("id") + "_edgePreload.js");
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
				log("loaded " + url)
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
		$(".nm_InfoBlock").width('200px');
		$(".nm_InfoBlock").height('auto');

		//make nm_TextBubbleContent & nm_Explanation divs.
		var divBuffer;		
		$(".nm_TextBubble").each(function(){
			divBuffer = $("<div>").html($(this).html()).addClass("nm_TextBubbleContent");
			$(this).empty(); 
			$(this).append(divBuffer);
			$(this).append('<div class="nm_TextBubblePointer"></div>');
		});
		$(".nm_Explanation").each(function(){
			divBuffer = $("<div>").html($(this).html()).addClass("nm_ExplanationContent");
			$(this).empty();
			$(this).append(divBuffer);
		});
		console.log("content divs for bubbles made");
		
		$(".nm_Exclamation").append('<span class="close">x</span>');
		$(".nm_Exclamation .close").on({
		  click: function(){
		    $(this).closest(".nm_Exclamation").transition({ scale: 0 }, 200);
		  }
		});


		//make sliders
		console.log("do sliders");
		//$(".nm_slider").slider({ step: 5, value: 15, min: 0, max: 30 });

		//make title
		$("#title").html(document.title);

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
	}, 100); //wait 100ms to give initizing scripts within Edge Animations a change to do their stuff.
	

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
		$("#slideIndex").html(""+currentPage+"/?");
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
			$("#slideIndex").html(""+currentPage+"/?");
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
