/**
 * Badge controller
 *
 * Controller for the badge CRUD operations
 * @type: CONTROLLER
 */
app.controller('BadgeController', ['$scope', '$rootScope', function($scope, $rootScope) {
	
	if (!$rootScope.location) {
		return false;
	}
	
	init();
	
	/**
	 * Initalize form
	 */
	function init() {
		
		$scope.gridsterOptions = {
			margins: [5, 5],
			columns: 4,
			draggable: {
				handle: 'h3'
			}
		};
		
		$scope.dashboards = {
			'1': {
				id: '1',
				name: 'Home',
				widgets: [{
					col: 0,
					row: 0,
					sizeY: 1,
					sizeX: 1,
					name: "Widget 1"
				}, {
					col: 2,
					row: 1,
					sizeY: 1,
					sizeX: 1,
					name: "Widget 2"
				}]
			},
			'2': {
				id: '2',
				name: 'Other',
				widgets: [{
					col: 1,
					row: 1,
					sizeY: 1,
					sizeX: 2,
					name: "Other Widget 1"
				}, {
					col: 1,
					row: 3,
					sizeY: 1,
					sizeX: 1,
					name: "Other Widget 2"
				}]
			}
		};

		$scope.clear = function() {
			$scope.dashboard.widgets = [];
		};

		$scope.addWidget = function() {
			$scope.dashboard.widgets.push({
				name: "New Widget",
				sizeX: 1,
				sizeY: 1
			});
		};

		$scope.$watch('selectedDashboardId', function(newVal, oldVal) {
			if (newVal !== oldVal) {
				$scope.dashboard = $scope.dashboards[newVal];
			} else {
				$scope.dashboard = $scope.dashboards[1];
			}
		});

		// init dashboard
		$scope.selectedDashboardId = '1';
		
	}
	
}]);