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
	var bg = $("#contentDiv");
	var isSlideExperiment = ($("#slide" + currentPage).attr("type") == "experiment");
	if(isSlideExperiment) {
		bg.addClass("experiment");
		bg.removeClass("default");
	} else {
		if(bg.hasClass("experiment")) {
			bg.addClass("default");
			bg.removeClass("experiment");
		} else if(!bg.attr("class")) {
			bg.addClass("default");
		}
	}
}