// store all annotations in their own arrays
function annAdd(r,type,obj){
	if(!r.adb) r.adb = new Object();
	if(!r.adb[type]) r.adb[type] = new Array();
	if(!obj.id) obj.id = false;
	r.adb[type].push(obj);
}

// render annotations once
function annRender(r){
	if(!r.adb) return;
	var htm = "";
	
	htm += annRForm(r.adb.form);
	htm += annRLink(r.adb.link);
	htm += annRText(r.adb.text);
	htm += annRImage(r.adb.image);
	
	if(r.ann.firstChild) r.ann.firstChild.innerHTML = htm;
	else {
		var fc = document.createElement("div");
		r.ann.appendChild(fc);
		r.ann.firstChild.innerHTML = htm;
	}
}

function annHImage(e){
	var r = e.up('.search-result');
	if(!r) return;
	if(!confirm("Do you want to HIDE this Image Annotation? "+e.src)) return;
	e.style.display="none";
	// need history!
	ktSave(Q,"selection",{"url":r.url,"img":e.src,"hide":true});
	annAdd(r,"image",{"url":r.url,"img":e.src,"hide":true,"id":true}); // id true, heh
}

function annRImage(a){
	if(!a) return "";
	var htm = '<div class="annotated-images">';
	var ahide = new Object();	

	for(var i=0; i < a.length; i++){ 
	  if(a[i].hide) {
	    ahide[a[i].img]=a[i].id;
	  }
	}

	for(var i=0; i < a.length; i++){
		if(a[i].hide || ahide[a[i].img] > a[i].id) continue; // if there is one and newer, skip			
		var cur = new Image(); 	
		cur.src = a[i].img;
		cur.onload = function() { // wait for the image to load before using image properties
			var loadedImage = $('search-results').select('[src="'+this.src+'"]')[0];
			if (loadedImage) {			
				var scaledWidth = 15;
				var changed = false;
				if ((this.height / this.width) < .56) { // if the image is greater then 16:9 horizonatally, use a different scale
					if (.25 *  loadedImage.getOffsetParent().clientWidth < this.width) {
						scaledWidth = 40;	// tweak this to change horizontal image scaling
						changed = true;
					}
				}
				else if ((this.height / this.width) > 1.77) { // if the image is greater then 16:9 vertically, use a different scale
					if (.25 *  loadedImage.getOffsetParent().clientWidth < this.height) {
			    		scaledWidth = (.35 *  loadedImage.getOffsetParent().clientWidth) / this.height; // tweak this to change vertical image scaling
					}
					else {
						scaledWidth = (.15 *  loadedImage.getOffsetParent().clientWidth) / this.height;
					}
					scaledWidth = (scaledWidth * this.width) / loadedImage.getOffsetParent().clientWidth;
			    	scaledWidth =  Math.round(scaledWidth * 100);
			    	if (scaledWidth <= 0) {
			    		scaledWidth = 1;
			    	}
					changed = true;
				}
				if (changed) {
					loadedImage.setStyle({width: scaledWidth + '%' });
				}
			}
		}
		htm += '<img src="'+cur.src+'" style="width: 15%" onerror="this.style.display=\'none\'" onclick="return hideN(this,annHImage)">';
	}
	return htm;
}

function annHForm(e){
	var r = e.up('.search-result');
	if(!r) return;
	var l = prompt("Enter a description for this form or 'hide' to hide it: ",e.firstChild.innerHTML);
	if(!l) return;
	if(l == "hide"){
		e.style.display="none";
	}
	e.firstChild.innerHTML = l.escapeHTML();
	// need history!
	ktSave(Q,"selection",{"url":r.url,"form":{"action":e.firstChild.next().action},"label":l});
	annAdd(r,"text",{"url":r.url,"form":{"action":e.firstChild.next().action},"label":l,"id":true}); // id true, heh
}

function annRForm(a){
	if(!a) return "";
	var htm = "";
	var labels = new Object();
	for(var i=0; i < a.length; i++){ if(a[i].label) labels[a[i].form.action]=a[i]; }
	for(var i=0; i < a.length; i++){
		var label = (labels[a[i].form.action]) ? labels[a[i].form.action].label : "";
		if(label == "hide") continue;
		htm += '<div class="annotated-search" onclick="return hideN(this,annHForm)"><span>'+label+'</span>' + reForm(a[i].form,a[i].url) + '</div>';
	}
	return htm;
}

function annHText(e){
	var r = e.up('.search-result');
	if(!r) return;
	if(!confirm("Do you want to HIDE this Text Annotation?")) return;
	e.style.display="none";
	// need history!
	ktSave(Q,"selection",{"url":r.url,"sel":e.id,"hide":true});
	annAdd(r,"text",{"url":r.url,"sel":e.id,"hide":true,"id":true}); // id true, heh
}

function annRText(a){
	if(!a) return "";
	var htm = "";
	var ahide = new Object();
	for(var i=0; i < a.length; i++){ if(a[i].hide) ahide[a[i].sel]=a[i].id; }
	for(var i=0; i < a.length; i++){
		var m = hex_md5(a[i].sel);
		if(a[i].hide || ahide[m] > a[i].id) continue; // if there is one and newer, skip
		htm += '<div id="'+m+'" class="annotated-text" onclick="return hideN(this,annHText)">' + a[i].sel + '</div>';
	}
	return htm;
}

function annHLink(e){
	var r = e.up('.search-result');
	if(!r) return;
	var l = prompt("Enter a new title for this link, or blank to hide the link: ",e.innerHTML);
	if(l == null) return;
	e.innerHTML = l.escapeHTML();
	// need history!
	ktSave(Q,"selection",{"url":r.url,"a":e.href,"title":l});
	annAdd(r,"text",{"url":r.url,"a":e.href,"title":l,"id":true}); // id true, heh
}

function annRLink(a){
	if(!a) return "";
	var htm = '<div class="annotated-links">';
	var lindex = new Object();
	a = a.sort(function(a,b){ return b.id - a.id; }); // ugly, but works
	for(var i=0; i < a.length; i++){
		if(!a[i].a || lindex[a[i].a]) continue; // skip bad/done ones
		lindex[a[i].a] = true;
		htm += '<div class=\"annotated-link-row clearfix\"><div class=\"annotated-link\"><a href="'+a[i].a+'" onclick="return hideN(this,annHLink)">'+a[i].title+'</a></div>';
		if(++i && i < a.length) htm +=  '<div class=\"annotated-link\"><a href="'+a[i].a+'" onclick="return hideN(this,annHLink)">'+a[i].title+'</a></div>';
		htm += '</div>';
	}
	htm += '</div>';
	return htm;
}


// take a simple form object and create the actual html for it
function reForm(f,base)
{
	var submit=false;
	var htm = '';
	var rebase = /(.+\/)[^\/]+$/;
	var method = (f.method && f.method.length > 0) ? f.method : "get";
	var abase = base.match(rebase) ? base.match(rebase)[1] : base; 
	if(f.action.substr(0,4) == "http") abase="";
	if(abase.substr(-1,1) == "/" && f.action.substr(0,1) == "/") f.action = f.action.substr(1); 
	htm += '<form method="'+method+'" action="'+abase+f.action+'">';
	for(var i=0; i < f.elements.length; i++)
	{
		var e = f.elements[i];
		if(e.type == "text"){
			htm += '<input name="'+e.name+'" value="'+e.value+'">';
		}else if(e.type == "button"){
			htm += '<input type="button" name="'+e.name+'" value="'+e.value+'">';
		}else if(e.type == "hidden"){
			htm += '<input type="hidden" name="'+e.name+'" value="'+e.value+'">';
		}else if(e.type == "checkbox"){
			var chk = (e.checked) ? "checked" : "";
			htm += '<input type="checkbox" name="'+e.name+'" value="'+e.value+'" '+chk+'>';
		}else if(e.type == "password"){
			htm += '<input type="password" name="'+e.name+'">';
		}else if(e.type == "reset"){
			htm += '<input type="reset" name="'+e.name+'" value="'+e.value+'">';
		}else if(e.type == "select-one"){
			htm += '<select name="'+e.name+'">';
			for(var k=0; k < e.options.length; k++)
			{
				var sel = (e.options[k].selected) ? "selected" : "";
				htm += '<option value="'+e.options[k].value+'" '+sel+'>'+e.options[k].text+'</option>';
			}
			htm += '</select>';

		}else if(e.type == "submit"){
			submit=true;
			htm += '<input type="submit" name="'+e.name+'" value="'+e.value+'">';
		}else if(e.type == "textarea"){
			htm += '<textarea name="'+e.name+'">"'+e.value+'</textarea>';
		}
	}
	if(!submit) htm += '<input type="submit" value="go">';
	htm += '</form>';
	return htm;
}

// I'm putting this hide stuff here for lack of a better place, and it's mostly for annotations :)

function hideN(e,f)
{	
	if(!shiftychar) return true; // only shift-click activated
	f(e); //perform callback w/ original element
	return false;
}
