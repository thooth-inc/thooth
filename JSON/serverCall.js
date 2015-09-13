function getDataFromServer(id, url, callback) { 

	oScript = document.getElementById(id); 

	var head = document.getElementsByTagName("head")[0];
	if (oScript) {  head.removeChild(oScript); }

	// Create object 
	oScript = document.createElement("script");
	
	if (url.indexOf("?") > -1) url += "&random="+Math.random();
	else url+= "?random="+Math.random();
	
	oScript.setAttribute("src",url); 
	oScript.setAttribute("id",id); 
	head.appendChild(oScript); 
} 
