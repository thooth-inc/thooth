function amazonFetch(){

	var callURL = WISE.server+"/index.php?action=ajax&rs=wfGetAmazonJSON&rsargs[]="+encodeURIComponent(thisApp.params[0])+"&rsargs[]=amazonRender&r="+Math.random()
	WISE.call(callURL, thisApp.id);

}

function amazonRender(j) {
	if(!j.ItemSearchResponse || !j.ItemSearchResponse.Items || !j.ItemSearchResponse.Items.Request || !j.ItemSearchResponse.Items.Request.IsValid || j.ItemSearchResponse.Items.Request.IsValid.toLowerCase() != "true") {
		WISE.clear(thisApp.id);
		return;
	}
	var itemset = j.ItemSearchResponse.Items;
	
	if(!itemset.Item) {
		WISE.clear(thisApp.id);
		return;
	}
	
	for (link in linkstoshow) linkstoshow[link] = 1;
	
	var items;
	if(!itemset.Item.length) {
		items = new Array();
		items.push(itemset.item);
	}
	else items = itemset.Item;
	
	var itemLimit = 3;
	
	var limit = (items.length > 3) ? 3 : items.length;
	
	var title = "Amazon - Results for " + thisApp.params[0];
	var url = "http://www.amazon.com/s/ref=nb_ss_gw?url=search-alias%3Daps&field-keywords=" + encodeURIComponent(thisApp.params[0]) + "&x=0&y=0";
	var output = "<div id='wise_amazon_x_" + encodeURIComponent(WISE.Q.q) + "'>";
	var review_output = "";
	var hasPrice = false;
	var hasReview = false;
	for (var i=0; i<limit; i++) {
		var item = items[i];
		var attrs = item.ItemAttributes;
		var price_output = "";
		var links_output = "";
		var info_output = "";
		var avail_output = "";
		var title_output = "";
		var image_output = "";
		var tags_output = "";
		
		var fullwidth = false;
		
		output += "<div id='item_"+item.ASIN+"_" + encodeURIComponent(WISE.Q.q)+ "' class='wise_amazon_item" + (i==limit-1 ? " wise_amazon_bottomfix" : "") + "'>";
		
		if(item.SmallImage) image_output = "<span class='wise_amazon_image'><image src='" + item.SmallImage.URL + "' /></span>";
		title_output += "<a class='wise_amazon_title' href='" + item.DetailPageURL + "'>" + attrs.Title + "</a>";
		
		//output += "<div id='info_" + item.ASIN + "' style='position:absolute; right:0px; text-align:right;'>";
		
		if (item.Offers && item.Offers.Offer && item.Offers.Offer.OfferListing) {
			price_output += "<span class='wise_amazon_prices'>";
			var listing = item.Offers.Offer.OfferListing;
			price_output += ((item.Offers.Offer.OfferAttributes && item.Offers.Offer.OfferAttributes.Condition) ? item.Offers.Offer.OfferAttributes.Condition + ": " : "Price: ") + "<span class='wise_amazon_price'>" + listing.Price.FormattedPrice + "</span><br/>";
			if(listing.AmountSaved && listing.PercentageSaved) {
				var savings = ((parseFloat(listing.Price.Amount) + parseFloat(listing.AmountSaved.Amount))/100);
				price_output += "List Price: <strike>" + listing.Price.FormattedPrice.replace(/(\d|\.)+/, savings)  + "</strike><br/>";
				price_output += "Save: " + listing.AmountSaved.FormattedPrice  + " (" + listing.PercentageSaved + "%)<br/>";
			}
			else fullwidth = true;
			price_output += "</span>";
		}
		else fullwidth = true;
		
		if (item.Offers && item.Offers.Offer && item.Offers.Offer.OfferListing) {
			//avail_output += "<br/>";
			avail_output += "<div class='wise_amazon_textline" + (fullwidth ? " wise_amazon_fullwidth" : "") + "'>";
			avail_output += (item.Offers.Offer.OfferListing.Availability ? item.Offers.Offer.OfferListing.Availability : "");
			/*
			avail_output += ((avail_output.length > 40) ? "<br/>" : "")
				+ (item.Offers.Offer.OfferListing.IsEligibleForSuperSaverShipping ? " (Eligible for FREE Super Saver Shipping.)" : "");
			*/
			avail_output += (item.Offers.Offer.OfferListing.IsEligibleForSuperSaverShipping ? " (Eligible for FREE Super Saver Shipping.)" : "");
			avail_output += "</div>";
		}
		//output += "</div>";
		//if(item.SalesRank) rank_output = "<br/>Amazon.com sales rank: " + item.SalesRank;
		
		var clear_output = "<div class='wise_amazon_clear'></div>";
		var break_output = "<br/>";
		
		if(item.Tags && item.Tags.Tag) {
			var tags = new Array();
			if(item.Tags.Tag.length) tags = item.Tags.Tag;
			else tags.push(item.Tags.Tag);
			//tags_output += "<br/>Tags: ";
			//tags_output += "<div class='wise_amazon_textline" + (fullwidth ? " wise_amazon_fullwidth" : "") + "'>Tags: ";
			for (var t=0; t<tags.length; t++) {
				if (tags_output.length > 50) {
					tags_output += " (" + (tags.length-t) + " more)";
					break;
				}
				else tags_output += (t ? ", " : "") + tags[t].Name;
			}
			tags_output = "<div class='wise_amazon_textline" + (fullwidth ? " wise_amazon_fullwidth" : "") + "'>Tags: " + tags_output + "</div>";
		}
			
		if(attrs.ProductGroup || attrs.Manufacturer) {
			//info_output += "<br/>";
			info_output += "<div class='wise_amazon_textline" + (fullwidth ? " wise_amazon_fullwidth" : "") + "'>";
			if(attrs.Manufacturer) info_output += "Manufacturer: " + attrs.Manufacturer + "; ";
			if(attrs.ProductGroup) info_output += "Product Group: " + attrs.ProductGroup + "; ";
			info_output += "</div>"
		}
		
		if(item.EditorialReviews && item.EditorialReviews.EditorialReview) {
			var review;
			if (item.EditorialReviews.EditorialReview.length) review = item.EditorialReviews.EditorialReview[0];
			else review = item.EditorialReviews.EditorialReview; 
			review_output += "<div id='wise_amazon_" + i +"_" + encodeURIComponent(WISE.Q.q)+ "' style='display:none;'>"
				+ "<b>" + attrs.Title + "</b> " + (hasPrice ? "(" + hasPrice + ")" : "") + " | <a href='javascript:WISE.apps.amazon.showHide(\"x\");'>Back</a><br/>"
				+ "Review (source: " + review.Source + "): " + review.Content +"</div>" ;
			links_output += "<a href='javascript:WISE.apps.amazon.showHide(\"" + i + "\");'>Description</a> | ";
		}
		
		if(item.ItemLinks && item.ItemLinks.ItemLink) {
			//if (links_output == "") links_output += "<br/>";
			for (var j=0; j<item.ItemLinks.ItemLink.length; j++) {
				if (linkstoshow[item.ItemLinks.ItemLink[j].Description.toLowerCase()])
					linkstoshow[item.ItemLinks.ItemLink[j].Description.toLowerCase()] = "<a href='"+item.ItemLinks.ItemLink[j].URL+"'>" + item.ItemLinks.ItemLink[j].Description + "</a>";
			}
			var linkcount = 0;
			for (link in linkstoshow) {
				links_output += (linkcount ? " | " : "") + linkstoshow[link];
				linkcount++;
			}
		}
		
		output += image_output + title_output + price_output + break_output + tags_output + avail_output + info_output + links_output + clear_output + "</div>";
	}
	output += "</div>"+review_output;
	output += '<div class="wise_amazon_logo"><img border="0" width="120" alt="amazon.com" src="http://g-ecx.images-amazon.com/images/G/01/gno/images/general/navAmazonLogoFooter._V28232323_.gif"/></div>';
	WISE.create(title, url, output, thisApp.id);
}

function showHide(which) {
	WISE.getQ();
	if(WISE.getElement("wise_amazon_x_" + encodeURIComponent(WISE.Q.q)))WISE.getElement("wise_amazon_x_" + encodeURIComponent(WISE.Q.q)).hide();
	for(i=0; i<3; i++) {
		if(WISE.getElement("wise_amazon_" + i + "_" + encodeURIComponent(WISE.Q.q)))WISE.getElement("wise_amazon_" + i + "_" + encodeURIComponent(WISE.Q.q)).hide();
	}
	if(WISE.getElement("wise_amazon_" + which + "_" + encodeURIComponent(WISE.Q.q)))WISE.getElement("wise_amazon_" + which + "_" + encodeURIComponent(WISE.Q.q)).show();
}


WISE.scope("showHide", showHide, thisApp.id);

var linkstoshow = {"all customer reviews":1, "technical details":1, "add to wishlist":1, "tell a friend":1};

thisApp.css = {
	"item":{
		"min-height":"75px",
		"margin":"0 0 10px 0"
	},
	"title":{
		"display":"block",
		"white-space":"nowrap",
		"overflow":"hidden",
		"width":"65%",
		"float":"left"
	},
	"bottomfix":{
		"border-bottom":"0px !important"
	},
	"image":{
		"height":"75px",
		"width":"75px",
		"float":"left",
		"margin-left":"auto",
		"margin-right":"auto",
		"padding-right":"5px"
	},
	"prices":{
		"position":"absolute",
		"right":"0px",
		"text-align":"right"
	},
	"price":{
		"color":"#ff0024",
		"font-weight":"bold"
	},
	"hidden":{
		"display":"none"
	},
	"textline":{
		"overflow":"hidden",
		"white-space":"nowrap",
		"width":"65%"
	},
	"fullwidth":{
		"width":"80% !important"
	},
	"logo":{
		"margin":"15px 0 0 0"
	},
	"clear":{
		"clear":"left"
	}
	
}
