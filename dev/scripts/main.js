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
		wineApp.displayWineInfo(item);
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
// wineApp.displayWineInfo= function(data){
// 	$.each(data, function(){
// 		var photo = data.image_url;
// 		var type = data.secondary_category;
// 		if (photo != undefined && type != undefined) {
// 			var name = $('<p>').addClass('wineName').text(data.name);
// 	 	var producer = $('<p>').addClass('wineProducer').text(data.producer_name);
// 	 	var image = $('<img>').attr('src', data.image_url);
// 	 	var description = $('<p>').addClass('wineDescription').text(data.description);
// 	 	var packageInfo = $('<p>').addClass('winePackageNotes').text(data.package);
// 	 	var style = $('<p>').addClass('wineStyleNotes').text(data.style);
// 	 	var id = $('<p>').addClass('wineId').text(data.id);
// 	 	var sugarContent = $('<p>').addClass('sugarContent').text(data.sugar_content);
// 	 	var wineFile = $('<li>').addClass('wineFile').append(image, name, producer, packageInfo, description, style, sugarContent, id);
// 		}
// 		$('.wines-inventory').append(wineFile); 
// 	});
// };

wineApp.displayWine = function(item) {
	if (item.image_url != undefined && item.secondary_category != undefined) {
		var temp = `<div class="wine-item" id="${item.id}" data-type="${item.secondary_category}">
						<figure class="wine-item__img">
							<img src="${item.img_url}" alt="">
						</figure>
						<figcation class="wine-item__info xy-center">
							<p>${item.producer_name}</p>
							<p>${item.description}</p>
							<p>${item.package}</p>
							<p>${item.style}</p>
							<p>${item.id}</p>
							<p>${item.sugar_content}</p>
						</figcation>
						<div> class="wine-item__name">
							<h3>${item.name}</h3>
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

//Document Ready!!
$(function(){
	wineApp.init();
	$('.type-it').typeIt({
     strings: ["Wine it up!", "Wines of Prince Edward County"],
     speed: 240,
     breakLines: false,
     autoStart: false
});
})



