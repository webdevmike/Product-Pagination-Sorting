/******************************************************************************
Name:    MB Pagination
Version: 1.0.0 (March 2016)
Author:  Mike Bostone - http://www.mikebostone.com
******************************************************************************/

var mbPagination = {};
(function($) {
	mbPagination = {
		settings: {
			items: [],
			sortedItems: [],
			sortMethods: ['Featured', 'Name', 'Price Low to High', 'Price High to Low'],
			sortMethod: 'Featured',
			itemsPerPage: 24
		},
		orderItems: function() {

			mbPagination.settings.sortedItems = [];

			switch(mbPagination.settings.sortMethod) {
				case 'Featured':
					mbPagination.settings.sortedItems = mbPagination.settings.items;
					console.log('featured');
					break;
				case 'Name':
					console.log('name');
					break;
				case 'Price Low to High':
					mbPagination.settings.sortedItems = mbPagination.settings.items.slice().sort(mbPagination.sortPriceLowToHigh);
					console.log('price low to high');
					break;
				case 'Price High to Low':
					console.log('price high to low');
					break;
			}

		},
		sortPriceLowToHigh: function(a,b) {
			// should always sort with sale price. If no sale price is present store we will pass regular price in as sale price
			return a.salePrice-b.salePrice;
		},
		sortPriceHighToLow: function(a, b) {
			// should always sort with sale price. If no sale price is present store we will pass regular price in as sale price
			return b.salePrice-a.salePrice;
		},
		buildItemHTML: function() {

			$.ajax({
				url: 'templates/item-box.handlebars',
				dataType: 'html',
				cache: false,
				success: function(data, status, response) {

					//console.log('template loaded');

					var template = Handlebars.compile(response.responseText);
					var itemHTML;
					
					mbPagination.settings.sortedItems.forEach(function(item){
						itemHTML += template(item);
					});

					$('#quick-view-popup').html(itemHTML);

				}
			});

		},
		showItemImages: function() {

			echo.init({
				offsetVertical: 500
			});

		},
		updateResults: function(sortMethod, itemsPerPage) {

			if(sortMethod) {
				mbPagination.settings.sortMethod = sortMethod;
			}
			if(itemsPerPage) {
				mbPagination.settings.itemsPerPage = itemsPerPage;
			}

			mbPagination.orderItems();
			mbPagination.buildItemHTML();
			mbPagination.showItemImages();

		},
		events: function() {

		},
		go: function() {

			mbPagination.updateResults();

		}
	}
})(jQuery)