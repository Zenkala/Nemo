var currentPage = 0;
var totalPages = 1;
var slideBuffer = [];
var sliding = false;
var quick = false;
var suppresEvents = false;
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
				"css/ui-lightness/jquery-ui-1.10.3.custom.css"
			];
var animations;	

function log(msg) {
	if (console.timeStamp) {
		console.timeStamp(msg);
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
		$("#loaderBar").css("width", currentProgress/totalProgress*2*130);
	}
}
		
function nemoInit(){
	log("-----------NemoInit-----------");	
	//first thing: load jquery
	yepnope.injectJs("js/jquery-1.9.1.min.js", function () {
		console.log("loaded: jquery-1.9.1.min.js");	
		$(function() {
			log("Making preloader");

			//hide and delete comment/ghosting stuff
			$("#contentDiv").hide();
			$("#navigation").hide();
			$("#title").hide();
			$(".comment").remove();
			$("#commentslide").remove();
			$("#ghostDiv").remove();

			//make preloader
			var loader = '<div id="loader" style="width: 210px;height:90px;position:absolute;top:276px;left:412px;"><div id="loaderContainer" style="width: 115px;height: 85px;overflow: hidden;position: absolute;top: 0px;left: 0px;"><div id="loaderBackground" style="background: #CCC;width: 120px;height: 90px;position: absolute;"></div><div id="loaderBar" style="width: 1px;height: 90px;position: absolute;top: 0px;left: 0px;background: #333;"></div><div id="loaderImage" style="width: 120px;height: 90px;background: url(\'css/mask.svg\') no-repeat left top;position: absolute;-webkit-filter: drop-shadow(3px 3px 5px rgba(0,0,0,0.15));"></div></div><div id="loaderTitle" style="font-family: \'Arial Narrow\', Arial, sans; line-height: 24px; font-size: 24px;position: absolute;top: 7px;left: 125px;color: #333"><p><strong>online</strong></p><p><strong>leeromgeving</strong></p><p>nemo ' + $("html").attr("version") + '</p></div></div>';
			$('body').append(loader);

			//calculate totalProgress
			totalProgress = scripts.length + 7; //script length and 7 other steps.

			//check for animations we have to load 
			animations = new Array();
			var animUrl = "";
			//$(".loaderAnimation").each(function(){
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

		//parse all text to set begrippen (eindtermen, begrippen, terms, units)
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
		progress("Parsed begrippen");


		// Parse quiz elements
		$(".nm_qGroup").each(function() {
			var id = $(this).attr("id");
			log("Parse quiz " + id);
			var type = "closed";
			if($(this).attr("type")) type = $(this).attr("type");

			// Give all elements inside group the same name 
			$(this).find("input").attr("name", id);
			$(this).append("<div class=\"nm_qCheck\"></div");

			if(type == "closed") {
				countCorrectItems = $(this).children(".nm_qItem[answer='true']").length;
				if(countCorrectItems == 1) {
					// An closed question with only one correct answer
					$(this).find("input").attr("type", "radio");
					$(this).find("input").attr("onclick", " checkQuiz('" + id + "', '" + type + "'); ");

				} else if(countCorrectItems > 1) {
					// An closed question with multiply correct answers
					$(this).find("input").attr("type", "checkbox");
					$(this).find("input").attr("onclick", " $( this ).parent().toggleClass( 'selected' );");

					// Render button
					$(this).append(checkButton(id, type));
				} else {
					// An closed question with zero answers; incorrect!
					log("The quiz with id " + id + " has no correct answers. Quiz could not be parsed.");
				}

			} else if(type == "open") {
				// Render button
				$(this).append(checkButton(id, type));
			} else {
				log("The quiz with id " + id + " has no type specified. Quiz could not be parsed.")
			}
		});

		// Quiz parse functions
		function checkButton(qGroupId, qGroupType) {
			var cButton = "<button onclick=\"checkQuiz('" + qGroupId + "', '" + qGroupType + "')\">Controleer</button>";
			return cButton;
		}
		progress("Parsed quiz");

		
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
		progress("Slides and content positioned");

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

/*
		$(".nm_TextBubble").each(function(){
			var h = $(this).attr("rHeight");
			if(h > 30) { h = h - 30; }

			if(($(this).hasClass("middle-left") || $(this).hasClass("middle-right")) && (h < 42)) {
				$(this).append('<div class="nm_TextBubblePointer" style="height: ' + h + 'px; margin-top: -' + 0.5*h + 'px"></div>');
			} else {
				$(this).append('<div class="nm_TextBubblePointer"></div>');
			}
		});
*/
		progress("Made nm_InfoBlock and nm_Slider");

		//load our dummy js. Since yepnope is queued, this complete callback will be called when all previous files are loaded.
		yepnope([{
			load: ["js/finished.js"],
			complete: function(){
				doTextBubbles();
			}
		}]);
	});
}

function doTextBubbles() {
	progress("Loaded finished.js");
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
		if(($(this).hasClass("middle-left") || $(this).hasClass("middle-right")) && (h <55)) {
			console.log("making small");
			$(this).append('<div class="nm_TextBubblePointer small"></div>');
		} else {
			console.log("making big");
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

	progress("nm_TextBubble and nm_Explanation");

	//continue work
	endNemoScript();
}

function endNemoScript(){
	//done with all our preperation work
	log("-----------Nemodone-----------");

	setTimeout(function() {
		progress("Done 100ms timeout");
	    onLoad(); //notify the javascript of the module that we're done
	    //goto slide last viewed in Dreamweaver
	    quick = true;
	    for(i=0; i<gotoSlide; i++) {
	    	next();
	    }

	    if(gotoSlide == 0) { //if we don't do a quick next, no enterframe handles are called. So call them manually.
	    	//this also, is a ugly hack that prevnets chrome from f*cking up when there is an animation on slide 1, and there are more slides afterwards.
			suppresEvents = true;
	    	next();
	    	prev();
	    	newSlideHdl(0, false);
	    	newSlideStopHdl(0, false);
	    }
	    
	    quick = false;
	    suppresEvents = false;

	    progress("Gone to proper slide. Done preloader work!");

	    //removing preloader
	    $("#loader").remove();
	    $("#contentDiv").show();
	    $("#navigation").show();
	    $("#title").toggle("slide");

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
		if(!suppresEvents)newSlideHdl(currentPage, false);
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
			if(!suppresEvents)newSlideStopHdl(currentPage, false);
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
			if(!suppresEvents)newSlideHdl(currentPage, true);
		
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
				if(!suppresEvents)newSlideStopHdl(currentPage, true);
				slideBuffer.shift(); //rem first element
				doSlide(); //recursive
			});
		}//end of currentpage==0
	}//end of next/prev if.
}


// Quiz functions
function checkItems(id, type) {
	var succeeded = false;

	// Could I make this function smaller?
	$("#" + id + " input").each(function() {
		if(type == "closed") {
			if($(this).is(":checked") == $(this).parent().is("[answer='true']")) {
				succeeded = true;
				return true;
			} else {
				succeeded = false;
				return false;
			}
		} else if(type == "open") {
			if($(this).val() == $(this).parent().attr("answer")) {
				succeeded = true;
				return true;
			} else {
				succeeded = false;
				return false;
			}
		}
	});
	return succeeded;
}

function checkQuiz(id, type) {
	// Check total attempts
	if(checkItems(id, type)) {
		$("#" + id + " button, #" + id + " input").prop('disabled', true);
		showAnswer(id, type);
		$("#" + id + " .nm_qCheck").hide();
		$("#" + id + " .nm_qCheck").addClass("correct");
		$("#" + id + " .nm_qCheck").removeClass("wrong");
		$("#" + id + " .nm_qCheck").show("blind", "right");
		// disable onhover
		// show good job animation

	} else {
		$("#" + id + " .nm_qCheck").hide();
		$("#" + id + " .nm_qCheck").removeClass("correct");
		$("#" + id + " .nm_qCheck").addClass("wrong");
		$("#" + id + " .nm_qCheck").show("blind", "right").hide("blind", "right");
	}
}

function showAnswer(id, type) {
	// Could I make this function smaller?
	$("#" + id + " input").each(function() {
		succeeded = false;
		if(type == "closed") {
			succeeded = $(this).parent().is("[answer='true']");
		} else if(type == "open") {
			if($(this).val() == $(this).parent().attr("answer")) succeeded = true;
			else succeeded = false;
		}
		if(succeeded) {
			$(this).parent().addClass("correct", 200);
		} else {
			$(this).parent().addClass("wrong", 200);
		}
	});
}

