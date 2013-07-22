var currentPage = 0;
var slideBuffer = [];
var sliding = false;

var scripts = [	'js/jquery.transit.min.js',
				'js/jquery-ui-1.10.3.custom.min.js',
				'http://uitlegapp.allyne.net/js-libs/jax/MathJax.js?config=AM_HTMLorMML-full&delayStartupUntil=configured',
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
		
function nemoInit(givenAnimations){
	log("-----------NemoInit-----------");
	animations = givenAnimations;
	totalProgress+=animations.length; //animations means loanger load time
	
	//first thing: load jquery
	yepnope.injectJs("js/jquery-1.9.1.min.js", function () {
		console.log("loaded: jquery-1.9.1.min.js");	
		$(function() {
			log("preloader");

			//hide stuff
			$("#contentDiv").hide();
			$("#navigation").hide();
			$("#title").hide();

			//display logo
			var img = document.createElement("img");
			img.src = "css/logo.png";

			var lineImg = $('<div id="loadingBar" style="position: absolute; background-image: url(\'css/animation-proxy.svg\'); background-repeat: repeat-x; width: 600px; height: 5px; left:512px; top:336px; margin-left: -300px; margin-top: -2px;" />');			 
			var logoImg = $('<img src="css/logo.png" id="loadingLogo" style="position: absolute; with: 50px; height: 50px; left:512px; top:336px; margin-left: -25px; margin-top: -25px;" />');
			$('body').append(lineImg);
			$('body').append(logoImg);
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
		/*
		animations.push("animations/edge_walking_test/edge_includes/edge.1.5.0.min.js");
		animations.push("animations/edge_walking_test/edge_walking_test_edge.js");
		animations.push("animations/edge_walking_test/edge_walking_test_edgeActions.js");
		*/
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
		
		$(".nm_Exclamation").append('<span class="close">x</span');
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
		
		//done with all our preperation work
		log("-----------Nemodone-----------");
		progress("NemoDone");		
		$("#loadingLogo").remove();
		$("#loadingBar").remove();
		$("#contentDiv").show();
		$("#navigation").show();
		$("#title").show();

		//hacking
		console.log("hack");
		$('div').each(function() {
		    if($(this).css('display') == "none") {
		        console.log('found element: ' + this.id);
		    }
		});
		
		onLoad(); //notify the javascript of the module that we're done
		
	});		
	
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
	console.log("doSlide called. buffer: " + slideBuffer.length)
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
				console.log("buffering: " + $(this).attr("id"));
				elementbuffer.push($(this));
				$('#contentDiv').append( $(this) );
			}
		});
		//move all slides
		$(".slide").transition({ translate: (currentPage*-1024) }, 350, 'easeOutExpo');
		$("html").transition({}, 350, function() {		
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
			$(".slide").transition({ translate: (currentPage*-1024) }, 350, 'easeOutExpo');
			$("html").transition({}, 350, function() {			
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