/* 
 * My Visitor Controller
 * 
 * Controller for my visitor CRUD operations
 * @type: CONTROLLER
 */
app.controller('MyVisitorController', ['$scope', '$rootScope', 'AppService', 'VisitorsService', 'Utils', 'dialogs', function ($scope, $rootScope, AppService, VisitorsService, Utils, dialogs){
  	
    if(!$rootScope.location){
		return false;
	}
	
	init();
    
    function init(){
      	
		$scope.busy = false;
		$scope.after = 0;
        $scope.visitors = [];
        
        /**
         * Getting the Visitors list
         */
        VisitorsService.getVisitors().then(function(response){
          	
			AppService.checkException($scope, response.data.exception);
			
            $scope.visitors = response.data.data;
			updateAvatar();
        });
    }
    
	/**
	 * Load more visitors
	 * on scrolling down
	 *
	 * @param location and langCode
	 */
	$scope.loadMore = function(){
        
		if($scope.busy || $scope.after >= 10){ return false; }
		
		$scope.busy = true;
		
        VisitorsService.getVisitors($scope.after).then(function(response){
          	
			AppService.checkException($scope, response.data.exception);
			
			if(response.data.data.length){
				angular.forEach(response.data.data, function(item) {
					$scope.visitors.push(item);
				});
			}
			
			$scope.busy = false;
			$scope.after += 1;
			
			updateAvatar();
        });
	};
	
	/**
	 * Check for avatar picture
	 *
	 * @param null
	 * @return bool
	 */
	function updateAvatar() {
		
		angular.forEach($scope.visitors, function(visitor){
			
			visitor.tooltip = '';
			visitor.showAvatar	= false;
			
			if(visitor.visitorPic) {
				
				visitor.tooltip = '<span class="avatar md"><img src="vm/resources/visitorphoto?recordId='+visitor.id+'" /></span>';
				
			} else {
				
				visitor.sso = (angular.isUndefined(visitor.sso) || visitor.sso === null) ? '' : visitor.sso;
				
				Utils.isImage(visitor.sso).then(function(result) {
					
					visitor.showAvatar = result;
					
					if(visitor.showAvatar) {
						visitor.tooltip = '<span class="avatar md"><img src="http://supportcentral.gecdn.com/images/person/temp/'+visitor.sso+'.jpg" /></span>';
					}
				});
			}
		});
	}
	
    /**
	 * Update Visitors List
	 * for the location change
	 *
	 * @param location and langCode
	 */
	$scope.changeLocation = function(location){
        
		// Update user access
		AppService.updateUserAccess(location);
		
		$rootScope.location = location;
		
        VisitorsService.getVisitors().then(function(response){
          	
			AppService.checkException($scope, response.data.exception);
			
            $scope.visitors = response.data.data;
			updateAvatar();
        });
	};
    
    /**
     * Hide a schedule from the 
	 * My Visitor page
	 *
     * @param $scope Obj
     */
    $scope.hideSchedule = function (visitor, $index){
        
		dialogs.confirm(
			$rootScope.translation.DASHBOARD.DELETE_TITLE, 
			$rootScope.translation.DASHBOARD.HIDE_CONFIRMATION,
			{keyboard: false, backdrop: 'static', size: 'md'}
		).result.then(function(btn){
			
			var data = {
				id: visitor.id,
				recordType: visitor.recordType
			};
			
			VisitorsService.removeSchedule(data).then(function(response){
				
				var exc = AppService.checkException($scope, response.data.exception);
				
				if(!exc) {
					// removing a schedule from the list
					$scope.visitors.splice($index, 1);
					
					// show message through service call
					AppService.showMessage('success', $rootScope.translation.DASHBOARD.HIDES);
				}
			});
			
		},function(btn){
		});
    }
    
	/**
     * Help popup
	 *
     * @param null
     */
    $scope.help = function (){
		$rootScope.page = "myvisitors";
		var dlg = dialogs.create('app/partials/help.html', 'HelpController', {}, {keyboard: false, backdrop: 'static', size: 'md'});
		
		dlg.result.then(function(name){
			
		},function(){
			
		});
	}
}]);
