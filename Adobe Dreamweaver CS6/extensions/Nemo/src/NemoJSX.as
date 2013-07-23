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
	import flash.events.Event;
	import mx.events.DragEvent;
	
	public class NemoJSX
	{	
		private static var extension:CSExtension;
		private static var state:String = "Starting";
		private static var currentSlide:int = -1;
		private static var totalSlides:int = -1;
		private static var currentStay:int = 0;
		
		private static var nrSlides: NumericStepper;
		private static var stay: NumericStepper;
		private static var slideContainer: List;
		
		public static function initNemo(givenExtension: CSExtension, _nrSlides: NumericStepper, _stay: NumericStepper, _slideContainer: List): void {
			if(givenExtension) extension = givenExtension;
			state = "Initializing"
			if(extension) extension.status = state;
			
			nrSlides = _nrSlides;
			stay = _stay;
			slideContainer = _slideContainer;

			//reset to slider 1
			callDW("forceGotoSlide", String(0));
			currentSlide = 0;
			slideContainer.selectedIndex = 0;
			updateGUI();

			//set timer
			
            var myTimer:Timer = new Timer(33, 0);
            myTimer.addEventListener("timer", timerHandler);
            myTimer.start();
		}
		
		private static function updateGUI(): void {
			if(extension){
				//get total number of slides
				
				totalSlides = requestDW("getTotalSlides", "false").totalSlides;
				//requestDW("getTotalSlides", true);
				
				nrSlides.value = totalSlides;
				trace("updateGUi ran with: " + currentSlide + "/" + totalSlides);
				//update contents of slideContainer
				slideContainer.dataProvider.removeAll();
				for(var i:int; i<totalSlides; i++) {
					slideContainer.dataProvider.addItem("Slide " + (i+1));
				}

				//currentSlide = requestDW("getCurrentSlide");
				slideContainer.selectedIndex = currentSlide;
			}
		}
		
		public static function selectSlide(event:IndexChangeEvent):void
		{
			trace("change slide selection from " + event.oldIndex + " to " + event.newIndex);
			currentSlide = event.newIndex;
			callDW("gotoSlide", String(currentSlide), String(event.oldIndex)); 
		}

		public static function prevSlide(event:MouseEvent): void {
			var oldSlide: int = currentSlide;
			currentSlide--;		
			if(currentSlide<-1) currentSlide = totalSlides;
			trace("change slide selection from " + oldSlide + " to " + currentSlide);
			callDW("gotoSlide", String(currentSlide), String(oldSlide)); 
			if(extension) slideContainer.selectedIndex = currentSlide;			
		}

		public static function nextSlide(event:MouseEvent): void {
			var oldSlide: int = currentSlide;
			currentSlide++;		
			if(currentSlide>=totalSlides) currentSlide = -1;		
			trace("change slide selection from " + oldSlide + " to " + currentSlide);	
			callDW("gotoSlide", String(currentSlide), String(oldSlide)); 
			if(extension) slideContainer.selectedIndex = currentSlide;
		}	

		public static function listDragComplete(event:DragEvent): void {
			if(extension) extension.status = "completed : " + slideContainer.selectedIndex;
			var oldSlide: int = currentSlide;
			currentSlide = slideContainer.selectedIndex;
			callDW("moveSlide", String(oldSlide), String(currentSlide)); 
			callDW("gotoSlide", String(currentSlide), String(oldSlide)); 
		}	
		
		public static function removeSlide(givenIndex:int):void 
		{
			CSXSInterface.instance.evalScript("remSlide", String(givenIndex));
			//select proper slide now
			currentSlide--;
			callDW("forceGotoSlide", String(currentSlide));

			updateGUI();
		}
		
		public static function addASlide(event:MouseEvent):void
		{
			CSXSInterface.instance.evalScript("addASlide", String(currentSlide)); 	
			
			trace("change slide selection from " + currentSlide + " to " + (currentSlide+1));
			callDW("gotoSlide", String(currentSlide+1), String(currentSlide)); 
			currentSlide++;
			updateGUI();
		}
		
		public static function applySlideTotal(event:MouseEvent):void
		{
			if(nrSlides.value == totalSlides) return;
			if(nrSlides.value > totalSlides) {
				trace("add slides to " + nrSlides.value);
			}else{
				trace("trim slides to " + nrSlides.value);
			}
			
			callDW("updateSlides", String(nrSlides.value), "false"); 
			currentSlide = 0;
			callDW("forceGotoSlide", String(0)); 				
			
			updateGUI();
			
		}
		
		public static function changeStay(event:Event):void
		{
			trace("changing stay to: " + stay.value);
			currentStay = stay.value;
			callDW("setStay", String(currentStay));
			
		}		

		//this function is called 30 times a second. to see if we changed slide.
		public static function timerHandler(event:TimerEvent):void {
		    var result:SyncRequestResult = CSXSInterface.getInstance().evalScript("getCurrentStay");
		    if((SyncRequestResult.COMPLETE == result.status) && result.data)
		    {
		    	if(parseInt(result.data.stay) != currentStay) { //we indeed changed selection!
					currentStay = parseInt(result.data.stay);
		    		//if(extension) extension.status = state + " - " + currentStay;	
		    		if(extension && stay) stay.value = currentStay;
		    	}		    	
		    }
		}

		private static function requestDW (givenFunctionName: String, param1: String = null, param2: String= null): * {
			trace("requestDW: " + givenFunctionName);
			if(param2){
				var result:SyncRequestResult = CSXSInterface.getInstance().evalScript(givenFunctionName, param1, param2);
			}else{ 
				if(param1){
					var result:SyncRequestResult = CSXSInterface.getInstance().evalScript(givenFunctionName, param1);
				}else{ 
					var result:SyncRequestResult = CSXSInterface.getInstance().evalScript(givenFunctionName);
				}
			}
			if((SyncRequestResult.COMPLETE == result.status) && result.data)
			{
				return result.data;	    	
			} else {
				return null;
			}
		}

		private static function callDW (givenFunctionName: String, param1: String = null, param2: String= null): * {
			trace("callDW: " + givenFunctionName);
			if(param2){
				CSXSInterface.getInstance().evalScript(givenFunctionName, param1, param2);
			}else{ 
				if(param1){
					CSXSInterface.getInstance().evalScript(givenFunctionName, param1);
				}else{ 
					CSXSInterface.getInstance().evalScript(givenFunctionName);
				}
			}			
		}		
	}
}