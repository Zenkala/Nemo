(function ( $ ) {
	$.fn.nm_slider = function( options ) {		
		return this.each(function() {
			var settings = $.extend({
			    // These are the defaults.
			    value: 50,
			    range: false,
			    min: 1,
			    max: 100,
			    title: "Een Slider",
			    animate: true,
			    _animateOff: false,
			    slide: function(event, ui) { $(ui.handle).find('span').html(ui.value.toLocaleString()); } //slider handle update function
			}, options );
				$(this).css("height", ""); //remove height
				//wrap in container
				$(this).wrap( "<div class='nm_SliderContainer' style='position: " + $(this).css("position") + "; height: 75px; top: " + $(this).css("top") + "; left: " + $(this).css("left") + ";'></div>" );
				$(this).css("left", "");
				$(this).css("top", "");
			$(this).slider(settings); //make the default slider

			//make slider touch friendly
			//$('.ui-slider-handle').draggable();

			//add title
			$( this ).append($('<label class="sliderTitle">' + (settings.title) + '</label>'));

			//make step labels
			if(typeof settings.labelStep != "undefined"){
				if(settings.labelStep > 0) {
					var vals = settings.max - settings.min;
					var firstStepAdjust = settings.min == 1 ? true : false;
					for (var i = 0; i <= vals; i+=(firstStepAdjust && i==0?settings.labelStep-1:settings.labelStep)) {
						var el = $('<label>'+(i+settings.min.toLocaleString())+'</label>').css('left',(i/vals*100)+'%');
						$( this ).append(el);
					}
				}
			} else {
				$( this ).append($('<label>'+(settings.min.toLocaleString())+'</label>').css('left',(0)+'%'));
				$( this ).append($('<label>'+(settings.max.toLocaleString())+'</label>').css('left',(100)+'%'));
			}

			//make handle labels
			if(settings.range){
				$($(this).find(".ui-slider-handle:first")).append($('<span class="sliderHandleLabel sliderHandleMin">' + settings.values[0].toLocaleString() + '</span>'));
				$($(this).find(".ui-slider-handle:nth-child(3)")).append($('<span class="sliderHandleLabel sliderHandleMax">' + settings.values[1].toLocaleString() + '</span>'));
			} else {
			    $($(this).find(".ui-slider-handle:first")).append($('<span class="sliderHandleLabel sliderHandleMin">' + settings.value.toLocaleString() + '</span>'));
			}
		}); 		
	};
}( jQuery ));