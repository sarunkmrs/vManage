/**
 * No access controller
 *
 * Controller for no access case
 * @type: CONTROLLER
 */
app.controller('NoaccessController', ['$scope', 'NoaccessService', 'AppService', 'Mailto', function($scope, NoaccessService, AppService, Mailto){
	
	init();
	
	/**
	 * Initialize no access controller
	 *
	 * @param null
	 */
	function init() {
		
		$scope.allLocations = [];
		
		NoaccessService.getLocations().then(function(response){
			
			var exc = AppService.checkException($scope, response.data.exception);
			
			if(!exc){
				$scope.allLocations = response.data.data;
			}
		});
	}
	
	/**
	 * Send the mail
	 *
	 * @param null
	 */
	$scope.ok = function(){
		
		var loc = _.find($scope.allLocations, function(location) { return location.id == $scope.mylocation; });
		
		var recepients = loc.admins;
		
		var params = {
			cc		: $scope.user.email,
			subject	: $scope.translation.NOACCESS.SUBJECT + loc.name,
			body	: $scope.translation.NOACCESS.BODY + loc.name+'.'
		};
		
		Mailto.send(recepients, params);
	};
	
}]);