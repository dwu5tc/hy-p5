//intial namespace
var wineApp = {};

//wineApp init
wineApp.init = function(){
	wineApp.getWine();
}

//Variables for the KEY!!!
wineApp.key = 'MDo5MTFjNGNlMi00NGI5LTExZTctYTg1Ni04M2EzZGQxMDM2Zjg6WUN3NUFvVFV6Qno5RzhPZW9nZFhtN05SQTR6elRTbGRVdlBY';

wineApp.vqa = 'is_vqa';

wineApp.whereNot = 'is_dead,is_discontinued';


//Here is the Ajax call to LCBO API!
wineApp.getWine = function(){
	$.ajax({
		url: 'https://lcboapi.com/products',
		method: 'GET',
		dataType: 'json',
		data: {
			access_key: wineApp.key,
			per_page: 100,
			where: wineApp.vqa,
			where_not: wineApp.whereNot
		}
	}).then(function(data){
		wineApp.getEachWine(data.result);
	});
};


//This is to separate out each wine.
wineApp.getEachWine = function(wines){
	wines.forEach(function(wine){
		console.log(wine);
		wineApp.displayWineInfo(wine);
	})
}

// Display this info for each wine.
wineApp.displayWineInfo= function(data){
	$.each(data, function(){
		var photo = data.image_url;
		var type = data.secondary_category;
		if (photo != undefined && type != undefined) {
			var name = $('<p>').addClass('wineName').text(data.name);
	 	var producer = $('<p>').addClass('wineProducer').text(data.producer_name);
	 	var image = $('<img>').attr('src', data.image_url);
	 	var wineFile = $('<li>').addClass('wineFile').append(image, name, producer);
	 	$('.deck').append(wineFile);
		}
	});
};


//Document Ready!!
$(function(){
	wineApp.init();
})


