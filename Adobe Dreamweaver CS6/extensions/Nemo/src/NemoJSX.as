package 
{
	import com.adobe.csxs.core.CSXSInterface;
	//import com.adobe.csxs.core.CSInterface;
	import com.adobe.csxs.types.SyncRequestResult;

	public class NemoJSX
	{	

		//resize windows
		

		public static function run():void 
		{
			
			//var result:SyncRequestResult = CSXSInterface.instance.evalScript("alert", "test?");
			var result:SyncRequestResult = CSXSInterface.getInstance().evalScript("jsxFunction");
			var strResult:String;
			trace("got root?");
			
			if((SyncRequestResult.COMPLETE == result.status) && result.data)
			{
			trace("path: " + result.data.path);
			
			}
			
			//CSXSInterface.getInstance().

		}
	}
}