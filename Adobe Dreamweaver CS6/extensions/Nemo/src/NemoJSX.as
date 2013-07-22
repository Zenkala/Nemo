package 
{
	import com.adobe.csxs.core.CSExtension;
	import com.adobe.csxs.core.CSXSInterface;
	import com.adobe.csxs.types.SyncRequestResult;
	import flash.utils.Timer;
	import flash.events.TimerEvent;	
	
	public class NemoJSX
	{	
		private static var extension:CSExtension;
		private static var state:String = "Starting";
		private static var currentSlide:int = -1;
		
		public static function initNemo(givenExtension: CSExtension): void {
			if(givenExtension) extension = givenExtension;
			state = "Initializing"
			if(extension) extension.status = state;

			//set timer
            var myTimer:Timer = new Timer(33, 0);
            myTimer.addEventListener("timer", timerHandler);
            myTimer.start();
		}
		
		public static function run():void 
		{
			//
		}

		//this function is called 30 times a second. to see if we changed slide.
		public static function timerHandler(event:TimerEvent):void {
		    var result:SyncRequestResult = CSXSInterface.getInstance().evalScript("getCurrentSlide");
		    
		    if((SyncRequestResult.COMPLETE == result.status) && result.data)
		    {
		    	if(parseInt(result.data.currentSlide) != currentSlide) { //we indeed changed slide!
		    		currentSlide = parseInt(result.data.currentSlide);
		    		if(extension) extension.status = state + " - " + currentSlide;		    		
		    	}		    	
		    }
		}//end timerHandler
	}
}