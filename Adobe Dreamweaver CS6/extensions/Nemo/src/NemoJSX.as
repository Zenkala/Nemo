package 
{
	import com.adobe.csxs.core.CSExtension;
	import com.adobe.csxs.core.CSXSInterface;
	import com.adobe.csxs.types.SyncRequestResult;
	
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	
	import spark.components.List;
	import spark.components.NumericStepper;
	import spark.events.IndexChangeEvent;
	import flash.events.MouseEvent;
	
	public class NemoJSX
	{	
		private static var extension:CSExtension;
		private static var state:String = "Starting";
		private static var currentSlide:int = -1;
		private static var totalSlides:int = -1;
		
		private static var nrSlides: NumericStepper;
		private static var slideContainer: List;
		
		public static function initNemo(givenExtension: CSExtension, _nrSlides: NumericStepper, _slideContainer: List): void {
			if(givenExtension) extension = givenExtension;
			state = "Initializing"
			if(extension) extension.status = state;
			
			nrSlides = _nrSlides;
			slideContainer = _slideContainer;

			updateGUI();

			//set timer
			/*
            var myTimer:Timer = new Timer(33, 0);
            myTimer.addEventListener("timer", timerHandler);
            myTimer.start();
			*/
            var result:SyncRequestResult = CSXSInterface.getInstance().evalScript("getCurrentSlide");
            if((SyncRequestResult.COMPLETE == result.status) && result.data)
            {
            	if(parseInt(result.data.currentSlide) != currentSlide) { //we indeed changed slide!
            		currentSlide = parseInt(result.data.currentSlide);
            		if(extension) extension.status = state + " - " + currentSlide;	
        			if(extension && currentSlide<=totalSlides) slideContainer.selectedIndex = currentSlide;
            	}		    	
            }
		}
		
		public static function run():void 
		{
			//
			CSXSInterface.instance.evalScript("gotoSlide", "1", "3"); //min one for contentslide is -1;
		}
		
		private static function updateGUI(): void {
			//get total number of slides
			totalSlides = requestDW("getTotalSlides").totalSlides;
			nrSlides.value = totalSlides;
			trace("updateGUi ran with: " + totalSlides);
			//update contents of slideContainer
			slideContainer.dataProvider.removeAll();
			slideContainer.dataProvider.addItem("ContentSlide");
			for(var i:int; i<totalSlides; i++) {
				slideContainer.dataProvider.addItem("Slide " + i);
			}
		}
		
		public static function selectSlide(event:IndexChangeEvent):void
		{
			// TODO Auto-generated method stub
			trace("change slide selection from " + event.oldIndex + " to " + event.newIndex);
			currentSlide = event.newIndex;
			CSXSInterface.instance.evalScript("gotoSlide", String(currentSlide-1), String(event.oldIndex-1)); //min one for contentslide is -1;
		}

		public static function prevSlide(event:MouseEvent): void {
			var oldSlide: int = currentSlide;
			currentSlide--;		
			if(currentSlide<0) currentSlide = totalSlides;
			CSXSInterface.instance.evalScript("gotoSlide", String(currentSlide-1), String(oldSlide-1)); //min one for contentslide is -1;
			if(extension) slideContainer.selectedIndex = currentSlide;			
		}

		public static function nextSlide(event:MouseEvent): void {
			var oldSlide: int = currentSlide;
			currentSlide++;		
			if(currentSlide>totalSlides) currentSlide = 0;			
			CSXSInterface.instance.evalScript("gotoSlide", String(currentSlide-1), String(oldSlide-1)); //min one for contentslide is -1;
			if(extension) slideContainer.selectedIndex = currentSlide;
		}	
		
		//this function is called 30 times a second. to see if we changed slide.
		public static function timerHandler(event:TimerEvent):void {
		    var result:SyncRequestResult = CSXSInterface.getInstance().evalScript("getCurrentSlide");
		    if((SyncRequestResult.COMPLETE == result.status) && result.data)
		    {
		    	if(parseInt(result.data.currentSlide) != currentSlide) { //we indeed changed slide!
		    		currentSlide = parseInt(result.data.currentSlide);
		    		if(extension) extension.status = state + " - " + currentSlide;	
					if(extension && currentSlide<=totalSlides) slideContainer.selectedIndex = currentSlide;
		    	}		    	
		    }
		}//end timerHandler

		private static function requestDW (givenFunctionName: String): * {
			var result:SyncRequestResult = CSXSInterface.getInstance().evalScript(givenFunctionName);
			if((SyncRequestResult.COMPLETE == result.status) && result.data)
			{
				return result.data;	    	
			}
		}
	}
}