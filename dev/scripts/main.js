//intial namespace
var wineApp = {};

//wineApp init
wineApp.init = function(){
	console.log("hi");
	// console.log(wineApp.getWine(1));
	wineApp.getAllWines(1);
	console.log("hi");
	wineApp.getPECList();
	wineApp.wineList = wineApp.wineList.filter(wineApp.filterPEC);
}

//Variables for the KEY!!!
wineApp.key = 'MDo5MTFjNGNlMi00NGI5LTExZTctYTg1Ni04M2EzZGQxMDM2Zjg6WUN3NUFvVFV6Qno5RzhPZW9nZFhtN05SQTR6elRTbGRVdlBY';

wineApp.vqa = 'is_vqa';

wineApp.whereNot = 'is_dead,is_discontinued';
wineApp.wineList = [];
wineApp.wineryList = [];

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
	});
}

// if the producer name is in the list of wineries, return true
wineApp.filterPEC = function(item) {
	console.log(item);
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
			// this will filter for all of the wines in PEC
			wineApp.wineList = wineApp.wineList.filter(wineApp.filterPEC);

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
		console.log(wine
			);
		// wineApp.displayWineInfo(wine);
	})
}

// Display this info for each wine.
// wineApp.displayWineInfo= function(data){
// 	$.each(data, function(){
// 		var photo = data.image_url;
// 		var type = data.secondary_category;
// 		if (photo != undefined && type != undefined) {
// 			var name = $('<p>').addClass('wineName').text(data.name);
// 	 	var producer = $('<p>').addClass('wineProducer').text(data.producer_name);
// 	 	var image = $('<img>').attr('src', data.image_url);
// 	 	var wineFile = $('<li>').addClass('wineFile').append(image, name, producer);
// 	 	$('.deck').append(wineFile);
// 		}
// 	});
// };




//Document Ready!!
$(function(){
	wineApp.init();
})


