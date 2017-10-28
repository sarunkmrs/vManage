/**
 * Settings controller
 *
 * Controller for the global level CRUD operations
 * @type: CONTROLLER
 */
app.controller('SettingsController', ['$scope', '$rootScope', '$cookies', '$location', '$timeout', function($scope, $rootScope, $cookies, $location, $timeout){
	
	$scope.isCollapsedUser = false;
	$scope.isCollapsedLocation = false;

}]);
