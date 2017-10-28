/**
 * Help controller
 *
 * Controller for help box.
 * @type: CONTROLLER
 */
app.controller('HelpController', ['$scope', '$uibModalInstance', 'data', function($scope, $uibModalInstance, data){
	
    /**
	 * Close modal
	 *
	 * @param null
	 */
    $scope.cancel = function(){
        
        $uibModalInstance.dismiss('Canceled');
	};
}]);