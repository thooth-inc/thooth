var WISE_gen = {
	"test_obj":{},
	"buildItemUrl":function(base, params, obj) {
		var url = base;
		
		if (params) {
			for (var i=0; i<params.length; i++) {
				var repl = "$"+(i+1) + "";
				if (obj[params[i]]) url = url.replace(repl, obj[params[i]]);
			}
		}
		return url;
		
	},
	"processApiResult":function (obj) {
		var resp_hand = this.test_obj;
		t_resp_hand = resp_hand;
		var resp_str = "";
		resp_hand = resp_hand.response;
		var r_obj;

		if (resp_hand.rootelement && eval("obj." + resp_hand.rootelement)) r_obj=eval("obj." + resp_hand.rootelement);
		else r_obj = obj;
		
		var hasResults = false;
		if (r_obj) {
			if(!r_obj[resp_hand.containerElement] || r_obj[resp_hand.containerElement].length == 0) {
				
				if (resp_hand.isDefault) {
					if($("adv_add_prevh3"))$("adv_add_prevh3").hide();
				}
			}
			else {
				hasResults=true;
			}
			
			try{var maxlength = ((this.test_obj.response.size && r_obj[resp_hand.containerElement] && this.test_obj.response.size < r_obj[resp_hand.containerElement].length) ? this.test_obj.response.size : r_obj[resp_hand.containerElement].length);}
			catch(ex){var maxlength= (r_obj[resp_hand.containerElement] ? r_obj[resp_hand.containerElement].length : 0)}
			
			for (var i=0; i<maxlength; i++) {
				var cur_str = '<div>';
				var cur = r_obj[resp_hand.containerElement][i];
				
				var url = (resp_hand.url.field ? cur[resp_hand.url.field] : this.buildItemUrl(resp_hand.url.base, resp_hand.url.params, cur)); 
				
				cur_str += "<div><div>";
				cur_str += "<a href='" + url + "'>" +((cur[resp_hand.titleField] && cur[resp_hand.titleField]!="undefined") ? cur[resp_hand.titleField] : cur[resp_hand.backupTitle]) + "</a></div>";
				cur_str += "</div>";
				
				cur_str += "<div>";
				
				if (resp_hand.image) {
					if (resp_hand.image.field && cur[resp_hand.image.field]) cur_str += "<img src='" +  cur[resp_hand.image.field] + "' />";
					else cur_str += "<img src='" +  this.buildItemUrl(resp_hand.image.base, resp_hand.image.params, cur) + "' />";
				}
				for (var j=0; j<resp_hand.contentFields.length; j++) {
					cur_str += this.processContentField(resp_hand.contentFields[j], cur, resp_hand, false);
				}
				cur_str += "</div>";
				resp_str += cur_str + "</div>";
			}
			
		}
		else resp_str = "error";
		$("output").innerHTML = resp_str;
	},
	"processContentField":function(curField, cur, resp_hand, from_sel) {
		var return_str = "";
		
		var fieldText = false;
		
		var theField = eval("cur."+curField.field);
		
		try{if (theField && theField != '') fieldText = theField;}catch(ex){return return_str;}
		
		if (!fieldText) return return_str;
		if (from_sel && !curField.for_desc) return return_str;
		
		var process_type=false;
		if (curField.type) process_type=curField.type;
		
		switch(process_type) {
			case "unixdate":
				var myDate = new Date();
				myDate.setTime(parseInt(fieldText)*1000);
				fieldText = myDate.toLocaleString();
			break;
		}
		
		try{
			return_str += (curField.prefix ? curField.prefix : "") 
				+ ((curField.limit && fieldText.length > curField.limit) ? fieldText.substr(0, curField.limit)+"..." : fieldText) 
				+ (curField.suffix ? curField.suffix : "");
		} 
		catch(ex){}
		
		if (from_sel && curField.for_desc) return_str = return_str.replace(/\<([^\>]+)\>/g, "");
		
		return return_str;
	},
	"load":function(q) {

		if (this.test_obj) {
			var params = {}; 
			this.test_obj.params = params;
			var start;
			if (!params.start) start = (this.test_obj.request.start ? this.test_obj.request.start : 0);
			else start = params.start;
			this.start=start;
			this.test_obj.params.start = start;
			
			//check if need to redeclare callback
			if(this.test_obj.redeclare) { eval(this.test_obj.redeclare);}
			
			//build url
			var r = this.test_obj.request;
			var url = r.url;
			
			var custom_modify = new Array();
			if(r.urlmodify && r.custom) {
				for (var i=0; i<r.custom.length; i++) {
					url = url.replace("$"+r.custom[i].param, r.params[r.custom[i].param]);
					custom_modify[r.custom[i].param]=1;
				}
			}
			
			if (r.params) {
				url += "?";
				for (param in r.params) {
					if (!custom_modify[param]) url += param + "=" + r.params[param] + "&";
				}
				url = url.substr(0, url.length-1);
			}
			if (r.search) {
				//url += (r.params ? "&" : "?") + r.search + "=" + encodeURIComponent(q);
				url += ((url.indexOf("?") > -1) ? "&" : "?") + r.search + "=" + encodeURIComponent(q);
			}
			if (r.next && start) url += ((url.indexOf("?") > -1) ? "&" : "?")+r.next + "=" + (r.offset ? start+r.offset : start);
			
			var id="test";
			oScript = document.getElementById(id); 
			var head = document.getElementsByTagName("head")[0];
			if (oScript) {  head.removeChild(oScript); }
			
			// Create object 
			oScript = document.createElement("script");
			oScript.setAttribute("src",url); 
			oScript.setAttribute("id",id); 
			head.appendChild(oScript);
			
		}
	}
}


	
