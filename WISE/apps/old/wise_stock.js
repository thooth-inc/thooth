WISE.apps.stock = {
	"id":"stock",
	"regex":/.*(?:stock )([A-Z]{1,5}).* /i,
	"url":"WISE/apps/wise_stock.js?r=" + Math.random(),
	"action":"stockFetch"
};



function stockFetch(){
	
	if (!WISE.apps.stock) {alert("uh oh"); return false;};
	
	cur = WISE.apps.stock;
	
	WISE.call(WISE.server+"/index.php?action=ajax&rs=wfGetStockQuoteJSON&rsargs[]="+encodeURIComponent(WISE.trim(cur.params[0].replace("stock","")))+"&rsargs[]=stockRender&r="+Math.random(), cur.id);

}

function stockRender( j ){

	
	if( !j.price ){
		return false;
	}
	
	var title = "Stock Quote for: " + j.name + " (" + j.symbol + ")";
	var data = "<table><tr><td colspan=3 style='border-bottom:1px solid #bbbbbb;'><b>" + j.name + "</b> (" + j.exchange + ") " + j.date + " " + j.time + "</td></tr>"
		+"<tr><td valign='top' style='padding-right:30px;'>"
			+"Last: " + j.price + "<br/>"
			+"Change: <span style='color:" + (j.change>0 ? "green" : (j.change<0 ? "red" : "black")) + "'>" + j.change + " (" + Math.round((j.change/j.prevclose)*10000)/100 + "%)</span><br/>"
			+"Last Close: " + j.prevclose + "<br/>"
			+"Open: " + j.open + "<br/>"
			+"P/E (ttm): " + j.pe + "<br/>"
			+"EPS (ttm): " + j.eps + "<br/>"
			+"Mkt Cap: " + j.mktcap + "<br/>"
		+"<td valign='top' style='padding-right:30px;'>"
			+"Bid: " + j.bid + ", "
			+"Ask: " + j.ask + "<br/>"
			+"Volume: " + j.volume + "<br/>"
			+"Avg. Volume: " + j.avgvol + "<br/>"
			+"Day's Range: " + j.drange + "<br/>"
			+"52wk Range: " + j.yrange + "<br/>"
			+"Div & Yield: " + (j.div ? j.div : "N/A") + "(" + j.yield + ")"
		+"<td valign='top'>"
			+"<img src='http://ichart.finance.yahoo.com/t?s=" + j.symbol + "'/>"
			
		+"</td></tr></table>";

	r = WISE.resultAdd( WISE.Q ,"http://finance.yahoo.com/q?s="+j.symbol,title,"",true);

	WISE.annAdd(r,"text",{"sel":data});
	WISE.annRender(r);
	WISE.finalize(WISE.Q, thisApp.id, r); // apply any possible KT stuff
	
}
