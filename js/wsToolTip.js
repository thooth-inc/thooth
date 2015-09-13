var wsToolTip = {
	create:function (obj) { return this.init(obj) },
	init:function (obj) {
		if (!obj.element) return false;
		var temp_tt = {
			timer:-1,
			interval:1000,
			text:"text",
			element:null,
			style:"",
			css:"",
			running:0,
			disableChildren:false
		}
		
		if (obj.timer) temp_tt.timer = obj.timer;
		if (obj.interval) temp_tt.interval = obj.interval;
		if (obj.text) temp_tt.text = obj.text;
		if (obj.element) temp_tt.element = obj.element;
		if (obj.style) temp_tt.style = obj.style;
		if (obj.css) temp_tt.css = obj.css;  
		if (obj.disableChildren) temp_tt.disableChildren = obj.disableChildren;
		
		var id = this.tt.length;
		temp_tt.id = id;
		temp_tt.toolTipEl = document.createElement("span");
		temp_tt.toolTipEl.innerHTML = temp_tt.text;
		if (obj.style) temp_tt.toolTipEl.setAttribute("style", obj.style);
		temp_tt.toolTipEl.style.display = "none";
		temp_tt.toolTipEl.style.position = "absolute";
		temp_tt.toolTipEl.style.top = "0px";
		temp_tt.toolTipEl.style.left = "0px";
		if (obj.css) temp_tt.toolTipEl.className = obj.css;
		
		try{
			//alert(document.readyState);
			if (document.readyState=="complete" || document.readyState=="loaded" || !document.readyState) {
				 document.body.appendChild(temp_tt.toolTipEl);
			}
			else {
				if (window.attachEvent) {
					window.attachEvent('onload', function(){
					  document.body.appendChild(temp_tt.toolTipEl);
					});
				}
				else {
					window.addEventListener('load', function(){
					  document.body.appendChild(temp_tt.toolTipEl);
					}, false);
				}
			}
		}
		catch (ex) {}
		
		if (temp_tt.element.attachEvent) {
			temp_tt.element.attachEvent("onmouseover", function (e){ wsToolTip.show(temp_tt,e);} );
			temp_tt.element.attachEvent("onmouseout", function (e){ wsToolTip.hide(temp_tt,e);});
			temp_tt.element.attachEvent("onmousemove", function (e){ wsToolTip.move(temp_tt,e); });
		}
		else {
			temp_tt.element.addEventListener("mouseover", function (e){ wsToolTip.show(temp_tt,e);}, false);
			temp_tt.element.addEventListener("mouseout", function (e){ wsToolTip.hide(temp_tt,e);}, false);
			temp_tt.element.addEventListener("mousemove", function (e){ wsToolTip.move(temp_tt,e);}, false);
		}
		this.tt.push(temp_tt);
		
		
		return temp_tt;
				
	},
	tt: new Array({}),
	
	tooltip_dec:function(id) {
		t = this.tt[id];
		if (!t.timer) {
			t.toolTipEl.style.display="none";
			clearInterval(t.running);
			t.running=0;
			return;
		}
		t.timer--;
		
	
	},
	show:function(t,e) {
		if(t.timer) {
			t.toolTipEl.style.display="block"; 
			if (!t.running && t.timer!=-1) {
				t.running=setInterval("wsToolTip.tooltip_dec(" + t.id + ")", t.interval);
			}
			if (e) wsToolTip.move(t,e);
		}
	},
	hide:function(t,e) {
		t.toolTipEl.style.display="none";
		if (t.timer!=-1) {
			clearInterval(t.running);
			t.running=0;
		}
	},
	
	move: function(t,e) {
		if(t.running || t.timer==-1) {
			if(window.event) { e = window.event; }
			if (t.disableChildren) {
				var tb = e.target || e.srcElement;
				if (tb.id != t.element.id) {
					wsToolTip.hide(t);
					return;
				}
			}
			var mousePos = wsToolTip.mouseCoords(e,t); 
			t.toolTipEl.style.top = (mousePos.y) + "px"; 
			t.toolTipEl.style.left = (mousePos.x) + "px";
		}
	},
	mouseCoords:function(ev,t){
		
		var mouse_offset = 15;
		var screenBuffer = 25;
		
		if(ev.pageX || ev.pageY){
			if (ev.pageX+mouse_offset+t.toolTipEl.offsetWidth < (document.documentElement.clientWidth >=document.body.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth)-screenBuffer) var x = ev.pageX+mouse_offset;
			else var x = ev.pageX-mouse_offset-t.toolTipEl.offsetWidth;
			if (ev.pageY+mouse_offset+t.toolTipEl.offsetHeight < (document.documentElement.clientHeight >=document.body.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight)-screenBuffer) var y = ev.pageY+mouse_offset;
			else var y = ev.pageY-mouse_offset-t.toolTipEl.offsetHeight;
			
			return {
				x:x,
				y:y
			};
			
		}
		else {
			if (ev.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) - document.body.clientLeft + mouse_offset+t.toolTipEl.offsetWidth < (document.documentElement.clientWidth >=document.body.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth)-screenBuffer) var x = ev.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) - document.body.clientLeft + mouse_offset;
			else var x = ev.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) - document.body.clientLeft-mouse_offset-t.toolTipEl.offsetWidth;
			if (ev.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) - document.body.clientTop + mouse_offset+t.toolTipEl.offsetHeight < (document.documentElement.clientHeight >=document.body.clientHeight ? document.body.clientHeight : document.documentElement.clientHeight)-screenBuffer) var y = ev.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)  - document.body.clientTop + mouse_offset;
			else var y = ev.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)-mouse_offset-t.toolTipEl.offsetHeight;
		return {
			x:x,
			y:y
		};
		}
		
	}
	
}
