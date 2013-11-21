jQuery.fn.extend({
    reposition: function (target) {
    	// Initialize method
    	var b = $(this);
    	var t = target;
    	var pointer = 0;

    	// Check whether it has a pointer or not
    	if(b.children(".nm_TextBubblePointer")) {
    		var x = b.children(".nm_TextBubblePointer").outerHeight();
			var y = b.children(".nm_TextBubblePointer").outerWidth();
			pointer = ((x > y) ? x : y );
    	} else {
    		pointer = 0;
    	}

    	// Reposition the current object
		if(b.hasClass("middle-left")) { b.offset({top: (t.offset().top + 5), left:(t.offset().left + t.width() + 0.5*b.width() + pointer)}); 
		} else if(b.hasClass("middle-right")) { b.offset({top: (t.offset().top + 5), left:(t.offset().left - 0.5*b.width() - pointer)});
		} else if(b.hasClass("bottom-left")) { b.offset({top: (t.offset().top - b.outerHeight()), left:(t.offset().left + t.width() + 0.5*b.outerWidth() - 30)});
		} else if(b.hasClass("bottom-right")) { b.offset({top: (t.offset().top - b.outerHeight()), left:(t.offset().left + t.width() - 0.5*b.outerWidth() - 30)});
		} else if(b.hasClass("top-left")) { b.offset({top: (t.offset().top + 0.5*b.outerHeight() + pointer), left:(t.offset().left + t.width() + 0.5*b.outerWidth() - 30)});
		} else if(b.hasClass("top-right")) { b.offset({top: (t.offset().top + 0.5*b.outerHeight() + pointer), left:(t.offset().left + t.width() - 0.5*b.outerWidth() - 30)});
		} else if(b.hasClass("top-middle")) { b.offset({top: (t.offset().top + 0.5*b.outerHeight() + pointer), left:(t.offset().left + t.width())});
		} else if(b.hasClass("bottom-middle")) { b.offset({top: (t.offset().top - b.outerHeight()), left:(t.offset().left + t.width())});
		} else {
			// No pointer is defined, so new postion could not be generated. 
			console.log(b.attr("id") + " could not be repositioned.");
		}
    return b;
    }
});

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

function checkQuiz(id, type, e) {
	console.log("Quiz " + id + ": Check if user gave correct answer.");

	$(".activeSlide .nm_Explanation").each(function() {
		$(this).transition({ scale: 0 }, 0); 
	});
	
	// Check total attempts
	if(checkItems(id, type)) {
		/* ANSWER IS CORRECT */
		console.log("Quiz " + id + ": Correct answer selected.");

		$("#" + id + " button, #" + id + " input").prop('disabled', true);
		showAnswer(id, type);
		showTip();
		//showExplanation(e, true);
		$("#" + id + " .nm_qCheck svg").hide();
		$("#" + id + " .nm_qCheck .correct").show();
		$("#" + id + " .nm_qCheck").show();

	} else {
		/* ANSWER IS WRONG */
		console.log("Quiz " + id + ": Wrong answer selected.");

		//showExplanation(e, false);
		$("#" + id + " .nm_qCheck").hide();
		$("#" + id + " input:selected").each(function() {
			$(this).parent().toggleClass( 'selected' );
		});

		showTip(id, type);
		
		$("#" + id + " .nm_qCheck svg").hide();
		$("#" + id + " .nm_qCheck .wrong").show();
		$("#" + id + " .nm_qCheck").show();
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

function showExplanation(e, check) {
	// Check if the clicked element has an explanation attribute
	var attr = $("#" + e).attr("explanation");
	$(".nm_Explanation").transition({ scale: 0 }, 0);

	// No? Maybe it is the button that you clicked. Or there is no specifiek explanation per item specified
	if(!attr) {
		if(check) {
			attr = $("#" + e).parent().attr("correctexp");
		} else if(!check) {
			attr = $("#" + e).parent().attr("wrongexp");
		} 
	}

	if(attr) {
		var expBubble = $("#" + attr);
		var target = $("#" + e);
		if(expBubble && target) {
			expBubble.reposition(target);
			expBubble.transition({ scale: 1 }, 200); 
			expBubble.attr("clicked", "true");
		} else {
			console.log("showExplanation: Could not find the element " + attr + " or " + e + ".");
		}
	} else {
		// None explanation set
		console.log("showExplanation: None explanation set.");
	}
}

function showTip(id, type) {
	// Could I make this function smaller?
	$("#" + id + " input").each(function() {
		if(type == "closed") {
			if($(this).is(":checked") != $(this).parent().is("[answer='true']")) {
				var tip = $(this).parent().attr("tip");
				if(tip) {
					$("#" + tip).transition({ scale: 1 }, 200); 
				}
			} 
		}
	});
}

function nemoLoader() {
	return;
}

function quizCheck() {
  return '<svg class="correct" version="1.1" width="100px" height="100px" viewBox="0 0 100 100"><path fill="none" stroke="#000000" stroke-width="5" stroke-dashoffset="0" stroke-dasharray="330 330" stroke miterlimit="10" d="M1.354,70.315c0,0,15.266-9.843,30.833-21.556C47.755,37.048,71.272,10.815,66.355,3.732c-2.191-3.157-13.432,0.067-25.167,6.083C26.59,17.298,11.064,28.961,9.354,36.398C6.271,49.814,28.106,47.035,34.188,46.815c4.478-0.162,16.123-1.007,22.353,1.622s7.668,11.003,3.605,17.503S40.283,84.316,43.854,90.982s21.958-1.792,31.042-5.542s22.875-11.208,22.875-11.208"></path></svg><svg class="wrong" width="100px" height="100px" viewBox="0 0 100 100"><path class="a" fill="none" stroke="black" stroke-width="5" stroke-miterlimit="10" d="M5.833,85.38C23.801,57.896,56.463,28.071,81.862,8.202"/><path class="b" fill="none" stroke="black" stroke-width="5" stroke-miterlimit="10" d="M5.833,13.321c7.068,7.208,46.47,47.115,71.676,77.179"/></svg>';
}


/*
	Functions for experiment slides
*/
function moveTitle(currentPage, quick) {
	var shouldTitleMove = (slidesToMoveTitle.indexOf(currentPage) >= 0);
	if(shouldTitleMove && !isTitleMoved) {
		$("#title").transition({ x: '320px' }, quick?0:350, 'easeOutExpo');
		isTitleMoved = true;
	} else if(!shouldTitleMove && isTitleMoved) {
		$("#title").transition({ x: '0px' }, quick?0:350, 'easeOutExpo');
		isTitleMoved = false;
	}
}

function updateSlideLook(currentPage) {
	var bg = $("#contentDiv_bg");
	var isSlideExperiment = ($("#slide" + currentPage).attr("type") == "experiment");
	if(isSlideExperiment) {
		bg.addClass("experiment");
		bg.removeClass("default");
	} else {
		if(bg.hasClass("experiment")) {
			bg.addClass("default");
			bg.removeClass("experiment");
		}
	}
}