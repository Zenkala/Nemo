package
{
	public class Animation
	{
		public var name:String;
		public var path:String;
		public var version:String;
		public var width:int;
		public var height:int;
		
		public function Animation(_name:String, _path:String, _version:String, _width:int, _height:int)
		{
			name = _name;
			path = _path;
			version = _version;
			width = _width;
			height = _height;
		}
	}
}