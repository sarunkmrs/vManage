/**
 * Admin controller
 *
 * Controller for the global level CRUD operations
 * @type: CONTROLLER
 */
app.controller('AdminController', ['$scope', '$rootScope', function($scope, $rootScope) {
	
	if (!$rootScope.location) {
		return false;
	}
	
	init();
	
	/**
	 * Form initalization
	 */
	function init() {
		
		$scope.pageList = [
			{name: $scope.translation.ADMIN.USER_MENU, type: 'user', icon: 'fa-user', url: 'app/partials/admin-templates/user-management.html'},
			{name: $scope.translation.ADMIN.LOCATION_MENU, type: 'location', icon: 'fa-map-marker', url: 'app/partials/admin-templates/location-settings.html'}
		];
		
		$scope.pageName 	= $scope.pageList[0].name;
		$scope.pageIcon 	= $scope.pageList[0].icon;
		$scope.pageTemplate = $scope.pageList[0].url;
		
		// set report title
		$scope.translation.REPORTS.TYPE = $scope.translation.VISITOR_REPORTS.TITLE;
	}
	
	/**
	 * Update reports
	 * for the location change
	 *
	 * @param null
	 */
	$scope.changeLocation = function(location) {
		
		$rootScope.location = location;
		
		//Broadcast location change
		$rootScope.$broadcast('locationChange', location);
	};
	
	/**
	 * Change report
	 */
	$scope.changeAdmin = function(selection) {
		
		$scope.pageName 	= selection.name;
		$scope.pageIcon 	= selection.icon;
		$scope.pageTemplate = selection.url;
	};
	
	/**
	 * Update the page list
	 * on language change
	 *
	 * @param null
	 */
	$scope.$on('languageChange', function() {
		
		$scope.pageList = [
			{name: $scope.translation.ADMIN.USER_MENU, type: 'user', icon: 'fa-user', url: 'app/partials/admin-templates/user-management.html'},
			{name: $scope.translation.ADMIN.LOCATION_MENU, type: 'location', icon: 'fa-map-marker', url: 'app/partials/admin-templates/location-settings.html'}
		];
		
		angular.forEach($scope.pageList, function(page){
			
			if(page.url == $scope.pageTemplate) {
				$scope.pageName = page.name;
			}
		});
	});
}]);