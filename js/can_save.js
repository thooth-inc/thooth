var can_save = true;
var next_can_save = 0;
function canSave() {
	
	var exdate=new Date();
	
	if ( exdate.getTime() > next_can_save ) {
		
		var i = document.getElementById("canSaveFrame"); 
		var head = document.getElementsByTagName('head')[0];
		if (i) head.removeChild(i);
		i = document.createElement('iframe');
		i.style.display="none";
		i.setAttribute("id","canSaveFrame");
		head.appendChild(i);
		
		var doc = null;  
		    if(i.contentDocument)  
		       // Firefox, Opera  
		       doc = i.contentDocument;  
		    else if(i.contentWindow)  
		       // Internet Explorer  
		       doc = i.contentWindow.document;  
		    else if(i.document)  
		       // Others?  
		       doc = i.document;  
		   
		    if(doc == null)  
		       throw "Document not initialized";  
		    
		doc.open();
		doc.write("<script type=\"text/javascript\">function handle_block_check(block_array){parent.handle_block_check(block_array);}</script>");
		doc.write("<script type=\"text/javascript\" src=\"" + server_to_use + "/js/userblock.js" + "\" defer=\"defer\"></script>");
		doc.close();
		next_can_save=exdate.getTime()+120000;
	}
	else {
		can_save = (getCookie("ws_save_block")=="yes" ? false : true); 
	}
	
}

function handle_block_check(block_array) {

	var exdate=new Date();
	extime=exdate.getTime();
	exdate.setTime(extime+120000);
	cookieTime = exdate;
	if (block_array && block_array.hash != "" && block_array.hash!=null) {
		can_save=true;
	}
	else if (block_array && (block_array.hash == "" || block_array.hash==null)) {
		can_save=false;
	}
	else {
		can_save = false;
	}

}
