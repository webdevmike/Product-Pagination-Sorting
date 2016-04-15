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
			sortMethods: ['Featured','Name','Price Low to High','Price High to Low'],
			itemsPerPage: [1, 2, 3],
			pagesWithItems: [],
			maxPageDisp: 2,
			currSortMethod: 'Featured',
			currItemsPerPage: 1,
			currPage: 1,
			currRangeStart: 0,
			currRangeEnd: 0
		},
		orderItems: function() {

			mbPagination.settings.sortedItems = [];

			switch(mbPagination.settings.currSortMethod) {
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
		buildHTML: function() {



			mbPagination.buildContainers();



			var templateHTML = $('#pagination-template').html();
			var template = Handlebars.compile(templateHTML);
			
			$('main > .content-container').html(template(mbPagination.settings));

			echo.render();

		},
		buildContainers: function() {

			// Build Containers
			var numOfContainers = Math.ceil(mbPagination.settings.sortedItems.length / mbPagination.settings.currItemsPerPage);

			// If current page is greater than numOfContainers, reset to 1
			if(mbPagination.settings.currPage > numOfContainers) {
				mbPagination.settings.currPage = 1;
			}

			mbPagination.settings.pagesWithItems = [];

			var rangeStart = 0;
			var rangeEnd = mbPagination.settings.currItemsPerPage;

			for(i=1; i <= numOfContainers; i++) {

				var container = [];

				// loop through range
				for(r=rangeStart; r < rangeEnd; r++) {
					var item = mbPagination.settings.sortedItems[r];
					
					if(item) {
						item.uniqueID = r + 1;
						container.push(item);
					}
				}

				mbPagination.settings.pagesWithItems.push(container);

				rangeStart = rangeStart + mbPagination.settings.currItemsPerPage;
				rangeEnd = rangeEnd + mbPagination.settings.currItemsPerPage;
			}

			var rangeCalcArray = mbPagination.settings.pagesWithItems[mbPagination.settings.currPage - 1];
			mbPagination.settings.currRangeStart = rangeCalcArray[0].uniqueID;
			mbPagination.settings.currRangeEnd = rangeCalcArray[rangeCalcArray.length - 1].uniqueID;

		},
		buildPaginationBar: function() {

			var templateHTML = $('#pagination-bar-template').html();
			var template = Handlebars.compile(templateHTML);

			$('.pagination-bar').html(template(mbPagination.settings));

		},
		updateResults: function(sortMethod, itemsPerPage) {

			if(sortMethod) {
				mbPagination.settings.currSortMethod = sortMethod;
			}
			if(itemsPerPage) {
				mbPagination.settings.currItemsPerPage = itemsPerPage;
			}

			mbPagination.orderItems();
			mbPagination.buildHTML();

		},
		events: function() {

			// sort by select
			$(document).on('change', '.pagination-bar .sort-by select', function() {
				var sortMethod = $(this).val();
				mbPagination.updateResults(sortMethod, null);
			})

			// Items per page
			$(document).on('change', '.pagination-bar .items-per-page select', function() {
				var ipp = Number($(this).val());
				mbPagination.updateResults(null, ipp);
			})

			// Next button
			$(document).on('click', '.pagination-bar .pagination-controls button.next', function() {
				mbPagination.settings.currPage++;
				mbPagination.updateResults();
			})

			// Previous button
			$(document).on('click', '.pagination-bar .pagination-controls button.prev', function() {
				mbPagination.settings.currPage--;
				mbPagination.updateResults();
			})

			// Pagination page number
			$(document).on('click', '.pagination-bar .pagination-controls ul.pages > li:not(.dots)', function() {
				var currPage = Number($(this).text());
				mbPagination.settings.currPage = currPage;
				mbPagination.updateResults();
			});

		},
		handlebarHelpers: function() {

			Handlebars.registerHelper('sortBySelected', function(sortMethod) {
				if(sortMethod === mbPagination.settings.currSortMethod) {
					return " selected";
				}
			})

			Handlebars.registerHelper('itemsPerPageSelected', function(items) {
				if(Number(items) === Number(mbPagination.settings.currItemsPerPage)) {
					return " selected";
				}
			})

			Handlebars.registerHelper('currentPage', function(page) {
				if(page === mbPagination.settings.currPage - 1) {
					return " current";
				}
			})

			Handlebars.registerHelper('paginationPageClasses', function(page) {
				if(page == mbPagination.settings.currPage - 1) {
					return "current";
				}
			})

			Handlebars.registerHelper('paginationPage', function(page) {
				return page + 1;
			})

			Handlebars.registerHelper('previousButton', function(block) {
				if(mbPagination.settings.currPage > 1) {
					return block.fn(this);
				};
			})

			Handlebars.registerHelper('nextButton', function(block) {
				if(mbPagination.settings.currPage !== mbPagination.settings.pagesWithItems.length) {
					return block.fn(this);
				};
			})

			Handlebars.registerHelper('pages', function(page, options) {
				if((page + mbPagination.settings.currPage) > mbPagination.settings.maxPageDisp) {
					return options.fn(this);
				}
			})

			Handlebars.registerHelper('dotsBefore', function(page, options) {
				/*if(mbPagination.settings.currPage === page - mbPagination.settings.maxPageDisp) {
					return options.fn(this);
				}*/
			})

		},
		go: function() {

			mbPagination.handlebarHelpers();

			// lazy load
			echo.init({
				offsetVertical: 500
			});

			mbPagination.updateResults();
			mbPagination.events();

		}
	}
})(jQuery)