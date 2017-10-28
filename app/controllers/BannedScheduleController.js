/* 
 * Banned schedules Controller
 * 
 * Controller for banned schedule CRUD operations
 * @type: CONTROLLER
 */
app.controller('BannedScheduleController', ['$scope', '$rootScope', 'AppService', 'BannedScheduleService', 'Utils', 'dialogs', function ($scope, $rootScope, AppService, BannedScheduleService, Utils, dialogs){
  	
    if(!$rootScope.location){
		return false;
	}
	
	init();
    
    function init(){
      	
		$scope.busy = false;
		$scope.after = 0;
        $scope.schedules = [];
        
        /**
         * Getting the banned schedules list
         */
        BannedScheduleService.getSchedules().then(function(response){
          	
			AppService.checkException($scope, response.data.exception);
			
            $scope.schedules = response.data.data;
			updateAvatar();
        });
    }
    
	/**
	 * Load more schedules
	 * on scrolling down
	 *
	 * @param location and langCode
	 */
	$scope.loadMore = function(){
        
		if($scope.busy || $scope.after >= 10){ return false; }
		
		$scope.busy = true;
		
        BannedScheduleService.getSchedules($scope.after).then(function(response){
          	
			AppService.checkException($scope, response.data.exception);
			
			if(response.data.data.length){
				angular.forEach(response.data.data, function(item) {
					$scope.schedules.push(item);
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
		
		angular.forEach($scope.schedules, function(schedule){
			
			schedule.tooltip = '';
			schedule.showAvatar	= false;
			
			if(schedule.visitorPic) {
				
				schedule.tooltip = '<span class="avatar md"><img src="vm/resources/visitorphoto?recordId='+visitor.id+'" /></span>';
				
			} else {
				
				schedule.visitorSSO = (angular.isUndefined(schedule.visitorSSO) || schedule.visitorSSO === null) ? '' : schedule.visitorSSO;
				
				Utils.isImage(schedule.visitorSSO).then(function(result) {
					
					schedule.showAvatar = result;
					
					if(schedule.showAvatar) {
						schedule.tooltip = '<span class="avatar md"><img src="http://supportcentral.gecdn.com/images/person/temp/'+schedule.visitorSSO+'.jpg" /></span>';
					}
				});
			}
		});
	}
	
    /**
	 * Update schedules List
	 * for the location change
	 *
	 * @param location and langCode
	 */
	$scope.changeLocation = function(location){
        
		// Update user access
		AppService.updateUserAccess(location);
		
		$rootScope.location = location;
		
        BannedScheduleService.getSchedules().then(function(response){
          	
			AppService.checkException($scope, response.data.exception);
			
            $scope.schedules = response.data.data;
			updateAvatar();
        });
	};
    
	/**
     * Approve the schedule
	 *
     * @param scheduleId int
	 * @param $index int
     */
    $scope.approve = function (scheduleId, $index){
        
		var data = {
			id: scheduleId
		};
		
		BannedScheduleService.approve(data).then(function(response){
			
			var exc = AppService.checkException($scope, response.data.exception);
			
			if(!exc) {
				// removing a schedule from the list
				$scope.schedules.splice($index, 1);
				
				// show message through service call
				AppService.showMessage('success', $rootScope.translation.BANNED_SCHEDULES.APPROVED);
			}
		});
    };
	
    /**
     * Reject the schedule
	 *
     * @param scheduleId int
	 * @param $index int
     */
    $scope.reject = function (scheduleId, $index){
        
		dialogs.confirm(
			$rootScope.translation.BANNED_SCHEDULES.REJECT_TITLE, 
			$rootScope.translation.BANNED_SCHEDULES.REJECT_CONFIRMATION,
			{keyboard: false, backdrop: 'static', size: 'md'}
		).result.then(function(btn){
			
			var data = {
				id: scheduleId
			};
			
			BannedScheduleService.reject(data).then(function(response){
				
				var exc = AppService.checkException($scope, response.data.exception);
				
				if(!exc) {
					// removing a schedule from the list
					$scope.schedules.splice($index, 1);
					
					// show message through service call
					AppService.showMessage('success', $rootScope.translation.BANNED_SCHEDULES.REJECTED);
				}
			});
			
		},function(btn){
		});
    };
    
	/**
     * Help popup
	 *
     * @param null
     */
    $scope.help = function (){
		$rootScope.page = "bannedschedules";
		var dlg = dialogs.create('app/partials/help.html', 'HelpController', {}, {keyboard: false, backdrop: 'static', size: 'md'});
		
		dlg.result.then(function(name){
			
		},function(){
			
		});
	};
}]);
