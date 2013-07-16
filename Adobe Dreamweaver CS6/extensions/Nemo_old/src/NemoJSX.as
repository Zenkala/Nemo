package 
{

	import com.adobe.csxs.core.CSInterface;
	import com.adobe.csxs.types.SyncRequestResult;

	public class NemoJSX
	{	
		public static function run():void 
		{
			var result:String = CSInterface.instance.evalScript("jsxFunction");	

		}
	}
}