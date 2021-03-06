package 
{
	import com.adobe.csxs.core.CSExtension;
	import com.adobe.csxs.core.CSXSInterface;
	import com.adobe.csxs.types.SyncRequestResult;
	
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	
	import mx.events.DragEvent;
	import mx.events.ItemClickEvent;
	
	import spark.components.List;
	import spark.components.NumericStepper;
	import spark.events.IndexChangeEvent;
	
	public class NemoJSX
	{	
		private static var extension:CSExtension;
		private static var state:String = "Starting";
		private static var currentSlide:int = -1;
		private static var totalSlides:int = -1;
		private static var currentStay:int = 0;
		
		private static var oldDocumentPath: String = "";
		private static var nrSlides: NumericStepper;
		private static var stay: NumericStepper;
		private static var slideContainer: List;
		private static var animationContainer: List;
		private static var stays: Array;
		private static var animations: Array = new Array();
		
		private static var logBook:Array = new Array();
		private static var statusIsOpen:Boolean = false;
		
		private static var lateTimer:Timer;
		lateTimer = new Timer(50, 0);
		lateTimer.addEventListener(TimerEvent.TIMER_COMPLETE, lateUpdate);
		lateTimer.addEventListener("timer", lateUpdate);
		
		
		public static function initNemo(givenExtension: CSExtension, _nrSlides: NumericStepper, _stay: NumericStepper, _slideContainer: List, _animationContainer: List): void {
			if(givenExtension) extension = givenExtension;
			state = "Initializing v0.5.1"
			if(extension) addToLog(state);//extension.status = state;
			
			nrSlides = _nrSlides;
			stay = _stay;
			slideContainer = _slideContainer;
			animationContainer = _animationContainer;
			trace(_animationContainer);

			//reset to slider 1
			callDW("forceGotoSlide", String(0));
			currentSlide = 0;
			slideContainer.selectedIndex = -1;
			updateGUI();

			//set timer
			
            var myTimer:Timer = new Timer(100, 0);
            myTimer.addEventListener("timer", timerHandler);
            myTimer.start();
            var myTimerPath:Timer = new Timer(1000, 0);
            myTimerPath.addEventListener("timer", timerHandlerPath);
            myTimerPath.start();
		}
		
		public static function setAnimationContainer(_animationContainer: List): void {
			animationContainer = _animationContainer;
			getAnimationList();
			updateGUI();
		}
		
		private static function updateGUI(): void {
			if(extension){
				//get total number of slides
				
				totalSlides = requestDW("getTotalSlides", "false").totalSlides;
				//requestDW("getTotalSlides", true);
				
				nrSlides.value = totalSlides;
				addToLog("updateGUi ran with: " + currentSlide + "/" + totalSlides);
				//update contents of slideContainer
				slideContainer.dataProvider.removeAll();
				for(var i:int = 0; i<totalSlides; i++) {
					slideContainer.dataProvider.addItem("Slide " + (i+1));
				}

				slideContainer.selectedIndex = currentSlide;	
				lateTimer.reset();
				lateTimer.start();
				
				//fill animationsContainer
				if(animationContainer) {
					animationContainer.dataProvider.removeAll();
					for(i = 0; i<animations.length; i++) {
						animationContainer.dataProvider.addItem("" + animations[i].name +"," + animations[i].version);
					}
				}
				addToLog("UpdateGUI. Slides: " + currentSlide + "/" + totalSlides + " and " + animations.length + " animations.");				
			}
		}
		
		public static function selectSlide(event:IndexChangeEvent):void
		{
			addToLog("change slide selection from " + event.oldIndex + " to " + event.newIndex);
			currentSlide = event.newIndex;
			callDW("gotoSlide", String(currentSlide), String(event.oldIndex)); 
			//setGhosts();
			callDW("createGhosts", String(currentSlide));
		}

		public static function prevSlide(event:MouseEvent): void {
			var oldSlide: int = currentSlide;
			currentSlide--;		
			if(currentSlide<-1) currentSlide = totalSlides-1;
			addToLog("change slide selection from " + oldSlide + " to " + currentSlide);
			callDW("gotoSlide", String(currentSlide), String(oldSlide)); 
			//callDW("forceGotoSlide", String(currentSlide)); 
			if(extension){
				slideContainer.selectedIndex = currentSlide;
				slideContainer.ensureIndexIsVisible(slideContainer.selectedIndex);
			}
			//setGhosts();
			callDW("createGhosts", String(currentSlide));	
		}

		public static function nextSlide(event:MouseEvent): void {
			var oldSlide: int = currentSlide;
			currentSlide++;		
			if(currentSlide>=totalSlides) currentSlide = -1;		
			addToLog("change slide selection from " + oldSlide + " to " + currentSlide);	
			callDW("gotoSlide", String(currentSlide), String(oldSlide)); 
			//callDW("forceGotoSlide", String(currentSlide)); 
			if(extension){
				slideContainer.selectedIndex = currentSlide;
				slideContainer.ensureIndexIsVisible(slideContainer.selectedIndex);
			}
			//setGhosts();
			callDW("createGhosts", String(currentSlide));
		}	

		public static function selectCommentSlide(event:MouseEvent): void {			
			("to commentSlide from " + currentSlide);
			callDW("gotoSlide", String(-1), String(currentSlide));
			currentSlide = -1;
			slideContainer.selectedIndex = -1;
			slideContainer.ensureIndexIsVisible(slideContainer.selectedIndex);
			//setGhosts();
			callDW("createGhosts", String(currentSlide));
		}

		public static function listDragComplete(event:DragEvent): void {
			//if(extension) extension.status = "completed : " + slideContainer.selectedIndex;
			if(extension) addToLog("completed : " + slideContainer.selectedIndex);
			var oldSlide: int = currentSlide;
			currentSlide = slideContainer.selectedIndex;
			slideContainer.ensureIndexIsVisible(slideContainer.selectedIndex);
			callDW("moveSlide", String(oldSlide), String(currentSlide)); 
			callDW("gotoSlide", String(currentSlide), String(oldSlide)); 
		}	
		
		public static function removeSlide(givenIndex:int):void 
		{
			// substract the stay of all elements on this slide by one  
			CSXSInterface.instance.evalScript("updateStayRemoveSlide", String(currentSlide)); 
			CSXSInterface.instance.evalScript("remSlide", String(givenIndex));
			//select proper slide now
			
			currentSlide--;
			//setGhosts();
			callDW("createGhosts", String(currentSlide));
			callDW("forceGotoSlide", String(currentSlide));
			updateGUI();
		}
		
		public static function addASlide(event:MouseEvent):void
		{
			CSXSInterface.instance.evalScript("updateStayAddSlide", String(currentSlide)); 
			CSXSInterface.instance.evalScript("addASlide", String(currentSlide)); 			
			addToLog("change slide selection from " + currentSlide + " to " + (currentSlide+1));
			callDW("gotoSlide", String(currentSlide+1), String(currentSlide)); 
			
			currentSlide++;
			//setGhosts();
			callDW("createGhosts", String(currentSlide));
			updateGUI();
		}
		
		public static function duplicateSlide(event:MouseEvent):void
		{
			CSXSInterface.instance.evalScript("updateStayDuplicateSlide", String(currentSlide)); 
			CSXSInterface.instance.evalScript("addASlide", String(currentSlide)); 
			CSXSInterface.instance.evalScript("updateSlideLook", String(currentSlide+1)); 
			addToLog("change slide selection from " + currentSlide + " to " + (currentSlide+1));
			callDW("gotoSlide", String(currentSlide+1), String(currentSlide)); 
			
			currentSlide++;
			//setGhosts();
			callDW("createGhosts", String(currentSlide));
			updateGUI();
		}
		
		public static function getAnimationList():void
		{
			var rdata:* = requestDW("checkForAnimations");
			if(rdata.animations == "none") {
				//no animations found! empty the arrays
				addToLog("no animations found");
				animations = new Array();
			} else { //animations found! fill the arrys
				animations = new Array();
				var names:Array = rdata.animations.split(",");
				var paths:Array = rdata.paths.split(",");
				var heights:Array = rdata.heights.split(",");
				var widths:Array = rdata.widths.split(",");
				var versions:Array = rdata.versions.split(",");
				for	(var i:int = 0; i<names.length; i++) {
					animations.push(new Animation(names[i], paths[i], versions[i], widths[i], heights[i]));
				}
				addToLog("animations: " + animations.length);
			}			
		}
		
		public static function addAnimation(event:MouseEvent):void
		{			
			var rdata:* = requestDW("addAnimation", "", "none"); //no name, new animation
			if(rdata.animation == "none"){
				addToLog("addAnimation failed");
			} else {
				var tempAnimation:Animation = new Animation(rdata.animation, rdata.path, rdata.version, rdata.width, rdata.height);
				if(animations.indexOf(tempAnimation) == -1){ //add animation if not already in list.
					animations.push(tempAnimation); 
				}
		
				updateGUI();
				addToLog("Added animation: " + tempAnimation.name + " version: " + tempAnimation.version);
			}
			
		}
		
		public static function updateAnimation(event:ItemClickEvent):void {
			
			var theSelection:Animation;
			if(animationContainer.selectedIndex >= 0) {
				theSelection = animations[animationContainer.selectedIndex];
			}
			
			addToLog("update " + theSelection.name + "(" + theSelection.path + ")");
			var rdata:* = requestDW(
				"addAnimation", //call add, even for update
				theSelection.name, //animation name
				theSelection.path //path, got by getting the index from the name
			);
			if(rdata.animation == "none"){
				addToLog("updateAnimation failed!");
			} else { //there is a chance meta data changed for the animation
				theSelection.path = rdata.path;
				theSelection.version = rdata.version;
				theSelection.width = rdata.width; 
				theSelection.height = rdata.height; 
				theSelection.name = rdata.animation;
				addToLog("" + rdata.animation + " updated to " + rdata.path);
			}
			updateGUI();
		}
		
		public static function assignAnimation(event:MouseEvent):void
		{
			var theSelection:Animation;
			if(animationContainer.selectedIndex >= 0) {
				theSelection = animations[animationContainer.selectedIndex];
			}
			
			addToLog("assign animation: " + theSelection);
			var rstr:String = requestDW("assignAnimation", theSelection.name, theSelection.width.toString(), theSelection.height.toString(), theSelection.version).success;
			if(rstr == "true") {
				addToLog("animation assigned");
			} else { 
				addToLog("meh");
			}
			
		}
		
		public static function removeAnimation(event:ItemClickEvent):void
		{
			callDW("removeAnimation", event.item.toString().split(",")[0]);
			getAnimationList();
			updateGUI();
		}
		
		public static function applySlideTotal(event:MouseEvent):void
		{
			if(nrSlides.value == totalSlides) return;
			if(nrSlides.value > totalSlides) {
				addToLog("add slides to " + nrSlides.value);
			}else{
				addToLog("trim slides to " + nrSlides.value);
			}
			
			callDW("updateSlides", String(nrSlides.value), "false"); 
			currentSlide = 0;
			callDW("forceGotoSlide", String(0)); 				
			
			updateGUI();
			
		}
		
		public static function changeStay(event:Event):void
		{
			addToLog("changing stay to: " + stay.value);
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

		//this function is called each second. to check if we have a document or if it changed.
		public static function timerHandlerPath(event:TimerEvent):void {
			
			var path:String = requestDW("getDocumentPath").path;
			if(!path) path = ""; //set empty
			if(path != oldDocumentPath) { //document changed!
				addToLog("Document changed to: " + path + "!");
				oldDocumentPath = path;
							
				getAnimationList();
				
				updateGUI(); //update gui to reflect new slide and animation amount etc.
				//getNewStays(); //update internal stay storage.
			}
			
		}
		
		private static function lateUpdate(event:TimerEvent):void {
			lateTimer.stop();
			slideContainer.ensureIndexIsVisible(slideContainer.selectedIndex);
		}

		private static function requestDW (givenFunctionName: String, param1: String = null, param2: String= null, param3: String= null, param4: String= null): * {
			//("requestDW: " + givenFunctionName);
			if(param4){
				var result:SyncRequestResult = CSXSInterface.getInstance().evalScript(givenFunctionName, param1, param2, param3, param4);
			} else {
				if(param3){
					var result:SyncRequestResult = CSXSInterface.getInstance().evalScript(givenFunctionName, param1, param2, param3);
				} else {
					if(param2){
						var result:SyncRequestResult = CSXSInterface.getInstance().evalScript(givenFunctionName, param1, param2);
					}else{ 
						if(param1){
							var result:SyncRequestResult = CSXSInterface.getInstance().evalScript(givenFunctionName, param1);
						}else{ 
							var result:SyncRequestResult = CSXSInterface.getInstance().evalScript(givenFunctionName);
						}
					}
				}
			}
			if((SyncRequestResult.COMPLETE == result.status) && result.data)
			{
				return result.data;	    	
			} else {
				addToLog("ERROR: requestDW(" + givenFunctionName +") resturns null!");
				return "";
			}
			
		}
		
		public static function addToLog (givenStatus:String):void {
			logBook.push(givenStatus);
			updateStatus(statusIsOpen);
		}
		
		
		public static function updateStatus(isStatusOpen) {
			statusIsOpen = isStatusOpen;
			if(statusIsOpen) {
				extension.status = "";
				var startPoint = logBook.length-30;
				if(startPoint < 0) { startPoint = 0; }
				for(var i = startPoint; i < logBook.length; i++) {
					extension.status += i + ". " + logBook[i] + "\n";
				}
			} else {
				extension.status = logBook[logBook.length-1];
			}
		}
		
		private static function callDW (givenFunctionName: String, param1: String = null, param2: String= null, param3: String= null): * {
			//("callDW: " + givenFunctionName);
			if(param3){
				CSXSInterface.getInstance().evalScript(givenFunctionName, param1, param2, param3);
			}else {
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
}