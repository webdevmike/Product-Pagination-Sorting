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
					break;
				case 'Name':
					mbPagination.settings.sortedItems = mbPagination.settings.items.slice().sort(mbPagination.sortName);
					break;
				case 'Price Low to High':
					mbPagination.settings.sortedItems = mbPagination.settings.items.slice().sort(mbPagination.sortPriceLowToHigh);
					break;
				case 'Price High to Low':
					mbPagination.settings.sortedItems = mbPagination.settings.items.slice().sort(mbPagination.sortPriceHighToLow);
					break;
			}

		},
		sortName: function(a,b) {
			var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
			//sort string ascending
			if(nameA < nameB) {
				return -1;
			} else if(nameA > nameB) {
				return 1;
			}
			return 0; //default return value (no sorting)
		},
		sortPriceLowToHigh: function(a,b) {
			return a.salePrice-b.salePrice;
		},
		sortPriceHighToLow: function(a, b) {
			return b.salePrice-a.salePrice;
		},
		buildItemHTML: function() {

			var templateHTML = mbPagination.settings.handlebarsTemplate.find('#item-box-template').html();
			var template = Handlebars.compile(templateHTML);
			var itemHTML = '';
			
			mbPagination.settings.sortedItems.forEach(function(item){
				itemHTML += template(item);
			});

			$('#quick-view-popup').html(itemHTML);

			echo.render();

		},
		buildPaginationBar: function() {

			mbPagination.buildSortBy();

		},
		buildSortBy: function() {

			var templateHTML = mbPagination.settings.handlebarsTemplate.find('#sort-by-template').html();
			var template = Handlebars.compile(templateHTML);

			$('.pagination-bar .sort-by').html(template);

		},
		updateResults: function(sortMethod, itemsPerPage) {

			if(sortMethod) {
				mbPagination.settings.sortMethod = sortMethod;
			}
			if(itemsPerPage) {
				mbPagination.settings.itemsPerPage = itemsPerPage;
			}

			mbPagination.orderItems();
			mbPagination.buildPaginationBar();
			mbPagination.buildItemHTML();

		},
		events: function() {

			// sort by select
			$(document).on('change', '.pagination-bar .sort-by select', function() {

				var sortMethod = $(this).val();
				mbPagination.updateResults(sortMethod, null);

			})

		},
		handlebarHelpers: function() {

			// helper
			Handlebars.registerHelper('sortMethod', function() {
				return mbPagination.settings.sortMethod;
			})

		},
		go: function() {

			// Load handlebar.js templates
			$.ajax({
				url: 'templates/templates.handlebars',
				dataType: 'html',
				cache: false,
				success: function(data, status, response) {

					//console.log('template loaded');
					mbPagination.settings.handlebarsTemplate = $(data);

					mbPagination.handlebarHelpers();

					// lazy load
					echo.init({
						offsetVertical: 500
					});

					mbPagination.updateResults();
					mbPagination.events();

				}
			});

		}
	}
})(jQuery)