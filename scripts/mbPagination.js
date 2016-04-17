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
			itemsPerPage: [24, 36, 48],
			pagesWithItems: [],
			maxPageDisp: 5,
			currSortMethod: '',
			currItemsPerPage: 0,
			currPage: 1,
			currRangeStart: 0,
			currRangeEnd: 0,
			selectors: {
				paginationTemplate: '#pagination-template',
				contentContainer: 'main > .content-container',
				sortBySelect: '.pagination-bar .sort-by select',
				itemsPerPageSelect: '.pagination-bar .items-per-page select',
				nextBtn: '.pagination-bar .pagination-controls button.next',
				prevBtn: '.pagination-bar .pagination-controls button.prev',
				page: '.pagination-bar .pagination-controls ul.pages > li',
				viewAll: '.pagination-bar .pagination-controls .view-all a',
				resetViewAll: '.pagination-bar .pagination-controls .reset a'
			}
		},
		orderItems: function() {

			mbPagination.settings.sortedItems = [];

			switch(mbPagination.settings.currSortMethod) {
				case mbPagination.settings.sortMethods[0]:
					mbPagination.settings.sortedItems = mbPagination.settings.items;
					break;
				case mbPagination.settings.sortMethods[1]:
					mbPagination.settings.sortedItems = mbPagination.settings.items.slice().sort(mbPagination.sortName);
					break;
				case mbPagination.settings.sortMethods[2]:
					mbPagination.settings.sortedItems = mbPagination.settings.items.slice().sort(mbPagination.sortPriceLowToHigh);
					break;
				case mbPagination.settings.sortMethods[3]:
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
			return 0;
		},
		sortPriceLowToHigh: function(a,b) {
			return a.salePrice-b.salePrice;
		},
		sortPriceHighToLow: function(a, b) {
			return b.salePrice-a.salePrice;
		},
		buildHTML: function() {

			mbPagination.buildContainers();

			var templateHTML = $(mbPagination.settings.selectors.paginationTemplate).html();
			var template = Handlebars.compile(templateHTML);
			
			$(mbPagination.settings.selectors.contentContainer).html(template(mbPagination.settings));

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
		updateResults: function(sortMethod, itemsPerPage, currentPage) {

			if(sortMethod) {
				mbPagination.settings.currSortMethod = sortMethod;
			}
			if(itemsPerPage) {
				mbPagination.settings.currItemsPerPage = itemsPerPage;
			}

			if(currentPage) {
				mbPagination.settings.currPage = currentPage;
			}

			mbPagination.orderItems();
			mbPagination.buildHTML();

		},
		events: function() {

			// sort by select
			$(document).on('change', mbPagination.settings.selectors.sortBySelect, function() {
				var sortMethod = $(this).val();
				mbPagination.updateResults(sortMethod, null, 1);
			})

			// Items per page
			$(document).on('change', mbPagination.settings.selectors.itemsPerPageSelect, function() {
				var ipp = Number($(this).val());
				mbPagination.updateResults(null, ipp);
			})

			// Next button
			$(document).on('click', mbPagination.settings.selectors.nextBtn, function() {
				mbPagination.settings.currPage++;
				mbPagination.updateResults();
			})

			// Previous button
			$(document).on('click', mbPagination.settings.selectors.prevBtn, function() {
				mbPagination.settings.currPage--;
				mbPagination.updateResults();
			})

			// Pagination page number
			$(document).on('click', mbPagination.settings.selectors.page, function() {
				var currPage = Number($(this).text());
				mbPagination.settings.currPage = currPage;
				mbPagination.updateResults();
			});

			// View All
			$(document).on('click', mbPagination.settings.selectors.viewAll, function() {
				mbPagination.updateResults(null, mbPagination.settings.sortedItems.length);
			})

			// Reset
			$(document).on('click', mbPagination.settings.selectors.resetViewAll, function() {
				mbPagination.updateResults(null, mbPagination.settings.itemsPerPage[0]);
			})

		},
		handlebarHelpers: function() {

			Handlebars.registerHelper('sortBySelected', function(sortMethod, options) {
				if(sortMethod === mbPagination.settings.currSortMethod) {
					return options.fn(this);
				}
			})

			Handlebars.registerHelper('itemsPerPageSelected', function(items, options) {
				if(Number(items) === Number(mbPagination.settings.currItemsPerPage)) {
					return options.fn(this);
				}
			})

			Handlebars.registerHelper('currentPage', function(page, currentPage, options) {
				if(page === currentPage - 1) {
					return options.fn(this);
				}
			})

			Handlebars.registerHelper('viewAll', function(options) {
				if(mbPagination.settings.currItemsPerPage == mbPagination.settings.sortedItems.length) {
					return options.fn(this);
				} else {
					return options.inverse(this);
				}
			})

			Handlebars.registerHelper('pagination', function(currentPage, totalPage, size, options) {

				if(totalPage > 1) {
					var startPage, endPage, context;

					if (arguments.length === 3) {
						options = size;
						size = 5;
					}

					startPage = currentPage - Math.floor(size / 2);
					endPage = currentPage + Math.floor(size / 2);

					if (startPage <= 0) {
						endPage -= (startPage - 1);
						startPage = 1;
					}

					if (endPage > totalPage) {
						endPage = totalPage;
						if (endPage - size + 1 > 0) {
							startPage = endPage - size + 1;
						} else {
							startPage = 1;
						}
					}

					context = {
						showPreviousBtn: false,
						pages: [],
						showNextBtn: false,
					};

					if(currentPage != 1) {
						context.showPreviousBtn = true;
					}

					for (var i = startPage; i <= endPage; i++) {
						context.pages.push({
							page: i,
							isCurrent: i === currentPage,
						});
					}

					if (currentPage != totalPage) {
						context.showNextBtn = true;
					}

					return options.fn(context);
				}

			});

		},
		go: function() {

			mbPagination.handlebarHelpers();

			// lazy load
			echo.init({ offsetVertical: 500 });

			mbPagination.updateResults(mbPagination.settings.sortMethods[0], mbPagination.settings.itemsPerPage[0]);
			mbPagination.events();

		}
	}
})(jQuery)