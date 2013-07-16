function jsxFunction()
{
	var appName;
	if(app.name == undefined)
	{
		// JavaScript only apps
		appName = app.appName;
	}
	else
	{	
		// ExtendScript enabled apps
		appName = app.name;
	}
	
	//your JSX code here

	var xml = '<object>';
	xml += '<property id="success"><true/></property>';
	xml += '</object>';
	return xml;
}
