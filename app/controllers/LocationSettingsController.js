/**
 * Location settings controller
 *
 * Controller for the global level CRUD operations
 * @type: CONTROLLER
 */
app.controller('LocationSettingsController', ['$scope', '$rootScope', 'AppService', 'LocationSettingsService', function($scope, $rootScope, AppService, LocationSettingsService) {
	
	if (!$rootScope.location) {
		return false;
	}
	
	init();
	
	/**
	 * Form initalization
	 */
	function init() {
		
		$scope.loc = {};
		$scope.loc.settings = {};
		
		/**
         * Getting the location settings
         */
        LocationSettingsService.getSettings().then(function(response){
          	
			AppService.checkException($scope, response.data.exception);
			
			$scope.customFields = response.data.data;
			
			angular.forEach($scope.customFields, function(item){
				
				$scope.loc.settings[item.key] = item.selectedValue;
			});
			
			$scope.master = angular.copy($scope.loc);
        });
	}
	
	/**
	 * Save settings
	 *
	 * @param null
	 */
	$scope.save = function () {
		
		if($scope.locationSettingsForm.$invalid) {return false;}
		
		$('.actionBtn').attr('disabled', 'disabled');
		
		LocationSettingsService.save($scope.loc.settings).then(function(response){
			
			$('.actionBtn').removeAttr('disabled');
			
			var exc = AppService.checkException($scope, response.data.exception);
			
			if(!exc) {
				
				// show message through service call
				AppService.showMessage('success', $scope.translation.LOCATION.SAVED);
				
				// update the location listing in the root scope
				$rootScope.locations = response.data.data.locations;
				
				$scope.master = angular.copy($scope.loc);
			}
		});
	};
	
	/**
	 * Reset form
	 *
	 * @param null
	 */
	$scope.reset = function(){
		
		$scope.loc = angular.copy($scope.master);
	};
	
	/**
	 * Update the selectbox list
	 * on location change
	 *
	 * @param null
	 */
	$scope.$on('locationChange', function() {
		
		/**
         * Getting the location settings
         */
        LocationSettingsService.getSettings().then(function(response){
          	
			AppService.checkException($scope, response.data.exception);
			
			$scope.customFields = response.data.data;
			
			angular.forEach($scope.customFields, function(item){
				
				$scope.loc.settings[item.key] = item.selectedValue;
			});
			
			$scope.master = angular.copy($scope.loc);			
        });
	});
	
}]);