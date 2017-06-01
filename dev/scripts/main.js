//intial namespace
var wineApp = {};

//wineApp init
wineApp.init = function(){
	// console.log(wineApp.getWine(1));
	wineApp.getPECList();
	wineApp.smoothScroll();
}

//Variables for the KEY!!!
wineApp.key = 'MDo5MTFjNGNlMi00NGI5LTExZTctYTg1Ni04M2EzZGQxMDM2Zjg6WUN3NUFvVFV6Qno5RzhPZW9nZFhtN05SQTR6elRTbGRVdlBY';

wineApp.vqa = 'is_vqa';

wineApp.whereNot = 'is_dead,is_discontinued';
wineApp.wineList = [];
wineApp.wineryList = [];
wineApp.currentFilters = [];

//Here is the Ajax call to LCBO API!
// wineApp.getWine = function(){
// 	$.ajax({
// 		url: 'https://lcboapi.com/products',
// 		method: 'GET',
// 		dataType: 'json',
// 		data: {
// 			access_key: wineApp.key,
// 			per_page: 100,
// 			page: 1,
// 			where: wineApp.vqa,
// 			where_not: wineApp.whereNot,
// 			volume_in_milliliters: 750
// 		}
// 	}).then(function(data){
// 		wineApp.getEachWine(data.result);
// 	});
// };


// this will get the list of PEC wineries from sheetsu
wineApp.getPECList = function() {
	$.when(wineApp.getPEC())
	.then(function(resp) {
		resp = resp.map(n => n["Winery Name"]);
		wineApp.wineryList.push(...resp);
		wineApp.getAllWines(1); // beginning of chained ajax calls
	});
}

// if the producer name is in the list of wineries, return true
wineApp.filterPEC = function(item) {
	// console.log(item);
	if (wineApp.wineryList.includes(item.producer_name)) {
		console.log(item);
		return true;
	}
	return false;
}

// this is an api call to sheetsu
wineApp.getPEC = function() {
	return $.ajax({
		url: 'https://sheetsu.com/apis/v1.0/5ba5cb2993e7',
		method: 'GET'
	})
}

// this will recursively call the get wine app with increasing page numbers until no more wines are left
wineApp.getAllWines = function(n) {
	$.when(wineApp.getWine(n))
	.then(function(resp) {
		if (resp.result.length != 0) {
			wineApp.wineList.push(...resp.result);
			wineApp.getAllWines(n+1);
		}
		else {
			// last step: this will filter for all of the wines in PEC 
			wineApp.wineList = wineApp.wineList.filter(wineApp.filterPEC);
			for (var i = 0; i < 9; i++) {
				wineApp.displayWine(wineApp.wineList[i]);
			}
			return;
		}
	});
}

// this is an api call to lcbo with a specific page number
// this gets 100 wines at a time
wineApp.getWine = function(pageNum) {
	return $.ajax({
		url: 'https://lcboapi.com/products',
		method: 'GET',
		dataType: 'json',
		data: {
			access_key: wineApp.key,
			per_page: 100,
			page: pageNum,
			where: wineApp.vqa,
			where_not: wineApp.whereNot,
			volume_in_milliliters: 750
		}
	});
}

wineApp.filterResults = function() {
	return;
}

//We are going to be using a google spread sheet api in order to pull the information
//that we need from the lcbo.
//Using the vineyards we will compare them to the 


//This is to separate out each wine.
wineApp.getEachWine = function(wines){
	wines.forEach(function(wine){
	});
}


// Display this info for each wine on the page.

wineApp.displayWine = function(item) {
	if (item.image_url != undefined && item.secondary_category != undefined) {
		var temp = `<div class="wine-item" id="${item.id}" data-type="${item.secondary_category}">
						<figure class="wine-item__img">
							<img src="${item.image_url}" alt="">
							<figcation class="wine-item__info">
								<div class="p-info xy-center">
									<p>${item.producer_name}</p>
									<p>${item.package}</p>
									<p>${item.style}</p>
									<p>${item.id}</p>
									<p>${item.sugar_content}</p>
								</div>
							</figcation>
						</figure>
						<div class="wine-item__name">
							<h4>${item.name}</h4>
						</div>
					</div>`
		$(".wines-inventory").append(temp);
	}
}


//Smooth Scroll
wineApp.smoothScroll = function(){
	$('.wines_smoothScroll').on('click', function(){
		$('html, body').animate({
			scrollTop: $('.wines').offset().top},
			1500);
	});
	$('.about_smoothScroll').on('click', function(){
		$('html, body').animate({
			scrollTop: $('.about').offset().top},
			1500);
	});
}

wineApp.addFilterListener = function() {
	$(".filter").on("click", function() {
		wineApp.currentFilters = [];
		$(this).toggleClass("filter--selected");
		if ((this).hasClass("all")) {
			$(".reds").removeClass("filter--selected");
			$(".whites").removeClass("filter--selected");
			$(".other").removeClass("filter--selected");
			wineApp.currentFilters = ["Red Wine, White Wine, Sparkling Wine, Rosé Wine, Dessert Wine"];
			wineApp.refreshInventory();
		}
	});
	if ((".reds").hasClass("filter--selected")) { wineApp.currentFilters.push("Red Wine"); }
	if ((".whites").hasClass("filter--selected")) { wineApp.currentFilters.push("White Wine"); }
	if ((".other").hasClass("filter--selected")) { wineApp.currentFilters.push("Sparkling Wine", "Rosé Wine", "Dessert Wine"); }
	wineApp.refreshInventory();
}

wineApp.updateInventory = function() {
	var currentInventory = $(".wine-item");
	for (var i = 0; i < currentInvetory.length; i++) {
		if (wineApp.currentFilters.includes(currentInventory[i].data("type"))) {
			currentInvetory[i].css("transform", "scale(0)");
		}
		else {
			currentInvetory[i].css("transform", "scale(1)");
		}
	}
}

//Document Ready!!
$(function(){
	wineApp.init();
	$('.type-it').typeIt({
     strings: ["Wine it up!", "Wines of Prince Edward County"],
     speed: 210,
     breakLines: true,
     autoStart: false
});
})



