/******************************************************************************
Name:    MB Pagination
Version: 1.0.0 (March 2016)
Author:  Mike Bostone - http://www.mikebostone.com
******************************************************************************/

var mbPagination = {};
(function($) {
	mbPagination = {
		settings: {

		},
		showItemImages: function() {

			echo.init({
				offsetVertical: 500
			});

		},
		updateResults: function() {

			mbPagination.showItemImages();

		},
		events: function() {

		},
		go: function() {

			mbPagination.updateResults();

		}
	}
})(jQuery)

$(document).ready(function() {
	mbPagination.go();
});