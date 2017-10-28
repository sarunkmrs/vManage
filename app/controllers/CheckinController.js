/**
 * Check In controller
 *
 * Controller for check in operations
 * @type: CONTROLLER
 */
app.controller('CheckInController', ['$scope', '$rootScope', '$uibModalInstance', 'data', 'Utils', 'dialogs', 'ScheduleService', 'AppService', function($scope, $rootScope, $uibModalInstance, data, Utils, dialogs, ScheduleService, AppService){
	
	init();
	
	/**
	 * Initialize the popup controller
	 *
	 * @param null
	 */
	function init() {
		
		$scope.webcamSupported = _.includes(['chrome', 'firefox', 'opera'], AppService.getBrowserType());
		
		// check if it's Russia
		checkLocation();
		
		$scope.item = {};
		
		$scope.item.id = data.id;
		$scope.item.sso = (angular.isUndefined(data.sso) || data.sso === null) ? '' : data.sso;
		$scope.item.badge = '';
		$scope.item.visitor = data.visitor;
		$scope.item.instructions = (data.instructions) ? data.instructions : $scope.translation.SCHEDULE.INSTRUCTIONS;
		$scope.item.specialInstruction = (data.specialInstruction) ? data.specialInstruction : null;
		$scope.item.escortRequired = data.escortRequired;
		
		$scope.item.datastream = data.datastream;
		$scope.item.visitorPic = data.visitorPic;
		
		$scope.item.adds = {};
		$scope.item.fileds = [];
		
		ScheduleService.getAdditionalFields(data.id).then(function(response){
			
			var exc = AppService.checkException($scope, response.data.exception);
			
			if(!exc){
				$scope.item.fileds = response.data.data;
				
				angular.forEach($scope.item.fileds, function(field){
					$scope.item.adds[field.key] = field.value;
				});
				
				/**
				 * Chunk it into blocks of two
				 * So as to display it in two column format
				 */
				$scope.item.chunkedItems = [];
				
				while ($scope.item.fileds.length > 0) {
					$scope.item.chunkedItems.push($scope.item.fileds.splice(0, 2));
				}
			}
		});
		
		/**
		 * Check for avatar picture
		 *
		 * @param null
		 * @return bool
		 */
		$scope.showAvatar = false;
		
		Utils.isImage($scope.item.sso).then(function(result) {
			
			$scope.showAvatar = result;
		});
	}
	
	/**
	 * Check in the user
	 *
	 * @param null
	 */
	$scope.ok = function(){
		$uibModalInstance.close($scope.item);
	};
	
	/**
	 * Cancel check in
	 *
	 * @param null
	 */
	$scope.cancel = function(){
		$uibModalInstance.dismiss('canceled');
	};
	
	/**
     * Capture photo popup
	 *
     * @param null
     */
    $scope.capture = function (){
        
		dialogs.create(
			'app/partials/capture.html', 
			'CaptureController', 
			{}, 
			{keyboard: false, backdrop: 'static', size: 'md'}
		).result.then(function(data){
			$scope.item.datastream = data;
		},function(){
			
		});
	};
	
	/**
	 * Check if the location is Russia
	 *
	 * @param null
	 */
	function checkLocation() {
		
		$scope.isRussia = false;
		
		angular.forEach($rootScope.locations, function(loc){
			
			if($rootScope.location == loc.id && loc.isRussia){
				$scope.isRussia = true;
			}
		});
	};
	
}]);