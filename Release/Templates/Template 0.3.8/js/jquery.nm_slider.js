(function ( $ ) {
	$.fn.nm_slider = function( options ) {
	 
	    return this.each(function() {

	    	console.log(options);
	    	var settings = $.extend({
	            // These are the defaults.
	            value: 50,
	            min: 1,
	            max: 100,
	            title: "Een Slider",
	            slide: function(event, ui) { $(ui.handle).find('span').html(ui.value); } //slider handle update function
	        }, options );

	       	$(this).css("height", ""); //remove height
	        $(this).slider(settings); //make the default slider

	    	//add title
	    	$( this ).append($('<label class="sliderTitle">' + (settings.title) + '</label>'));

	    	//make step labels
	    	if(typeof settings.labelStep != "undefined"){
	    		if(settings.labelStep > 0) {
	    			var vals = settings.max - settings.min;
	    			var firstStepAdjust = settings.min == 1 ? true : false;
	    			for (var i = 0; i <= vals; i+=(firstStepAdjust && i==0?settings.labelStep-1:settings.labelStep)) {
	    				var el = $('<label>'+(i+settings.min)+'</label>').css('left',(i/vals*100)+'%');
	    				$( this ).append(el);
	    			}
	    		}
	    	} else {
	    		$( this ).append($('<label>'+(settings.min)+'</label>').css('left',(0)+'%'));
	    		$( this ).append($('<label>'+(settings.max)+'</label>').css('left',(100)+'%'));
	    	}

	    	//make handle labels
	    	if(typeof settings.values != "undefined"){
		    	$($(this).find(".ui-slider-handle:first")).append($('<span class="sliderHandleLabel sliderHandleMin">' + settings.values[0] + '</span>'));
		    	$($(this).find(".ui-slider-handle:nth-child(3)")).append($('<span class="sliderHandleLabel sliderHandleMax">' + settings.values[1] + '</span>'));
		    } else {
    	    	if(typeof settings.value != "undefined"){
    		    	$($(this).find(".ui-slider-handle:first")).append($('<span class="sliderHandleLabel sliderHandleMin">' + settings.value + '</span>'));
    		    } 
		    }
	    }); 
	};
}( jQuery ));