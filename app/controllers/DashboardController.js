/**
 * Dashboard controller
 *
 * Controller for dashboard CRUD operations
 * @type: CONTROLLER
 */
app.controller('DashboardController', ['$scope', '$rootScope', '$timeout', 'AppService', 'ScheduleService', 'PrintService', 'Utils', 'dialogs', '$filter', '$compile', function($scope, $rootScope, $timeout, AppService, ScheduleService, PrintService, Utils, dialogs, $filter, $compile){
	
	if(!$rootScope.location){
		return false;
	}
	
	init(false);
    
    /**
     * Page Auto refresh in every 5 min 
	 *
	 * @param null
     */
    var update = function(){
		init(true);
        $timeout(update, 5*60000);
    };
	
	$timeout(update, 5*60000);
	
	/**
	 * Initialize the schedule controller
	 *
	 * @param null
	 */
	function init(update) {
		
		if(!update) {
			$scope.schedules = [];
			$scope.selectedDate = new Date();
		} else {
			$scope.processing = true;
		}
		
		// Rest the sort icon to reset
        $('th.h i').each(function(){
            // icon reset
            $(this).removeClass().addClass('fa fa-2x fa-sort');
        });
		
        if($rootScope.location) {
            
			setPrintPermission();
			
			ScheduleService.getSchedules($scope.selectedDate).then(function(response){
				
				$scope.processing = false;
				
				AppService.checkException($scope, response.data.exception);
				$scope.schedules = response.data.data;
				
				updateAvatar();
			});
        }
	}
	
    /**
	 * Update dashboard
	 * for the location change
	 *
	 * @param location int
	 */
	$scope.changeLocation = function(location){
        
		// Update user access
		AppService.updateUserAccess(location);
		
		$rootScope.location = location;
		
		setPrintPermission();
		
        ScheduleService.getSchedules($scope.selectedDate).then(function(response){
            
            AppService.checkException($scope, response.data.exception);
            $scope.schedules = response.data.data;
			
			updateAvatar();
        });
	};
	
	/*
     * Update dashboard
	 * for the date change
     *
     * @param null
     */
    $scope.changeDate = function() {
		
        ScheduleService.getSchedules($scope.selectedDate).then(function(response){
			
			AppService.checkException($scope, response.data.exception);
			$scope.schedules = response.data.data;
			
			updateAvatar();
		});
    };
	
	/**
     * Update dashboard
	 * for the refresh action
	 *
	 * @param null
     */
    $scope.refresh = function() {
        init(true);
    }
	
	/**
	 * Disabling the past date
	 * in the calender
	 *
	 * @param null
	 */
	$scope.showMinDate = function(){
		$scope.minDate = ($scope.minDate) ? null : new Date();
	};
	
	$scope.showMinDate();
	
	/**
     * Open the calendar popup
	 * on icon click
     * 
     * @param $event obj
     */
    $scope.openCalendar = function($event) {
		
		$event.preventDefault();
		$event.stopPropagation();
		
		$scope.opened = true;
    }
	
	/**
	 * Check in user
	 *
	 * @param schedule obj
	 * @param $index int
	 */
	$scope.checkin = function (schedule, $index) {
		
		dialogs.create(
			'app/partials/checkin-modal.html',					// modal template
			'CheckInController',								// modal controller
			schedule,											// controller params
			{keyboard: false, backdrop: 'static', size: 'md'}	// actual modal params
		).result.then(
			function(data) {                
				// success callback
				
				$('.actionBtn').attr('disabled', 'disabled');
				
				var params = {
					 'id'					: data.id,
					 'badge'				: data.badge,
					 'visitor'				: data.visitor,
					 'instructions'			: data.instructions,
					 'specialInstruction'	: data.specialInstruction,
					 'datastream'			: data.datastream,
					 'adds'					: data.adds
				};
				
				ScheduleService.checkin(params, $scope.selectedDate).then(function(response){
					
					$('.actionBtn').removeAttr('disabled');
					
					var exc = AppService.checkException($scope, response.data.exception);
					
					if(!exc) {
						// update the statistics
						$scope.schedules.statistics = response.data.data.statistics;
						
						// remove from scheduled list
						$scope.schedules.scheduled.splice($index, 1);
						
						// add to checkedin list
						$scope.schedules.checkedin.unshift(response.data.data.checkedin);
						
						updateAvatar();
						
						// show message through service call
						AppService.showMessage('success', $scope.translation.DASHBOARD.CHECKED_IN);
						
						if($scope.hasPrint) {
							// print the badge
							PrintService.download(response.data.data.checkedin);
						}
					}
				});
				
			}, function() {
				// error/cancel callback
			}
		);
	};
	
	/**
	 * Check Out user
	 *
	 * @param schedule obj
	 */
	$scope.checkout = function (schedule, $index) {
      	
		/*dialogs.confirm(
			$rootScope.translation.DASHBOARD.CONFIRM_TITLE, 
			$rootScope.translation.DASHBOARD.CHECKOUT_CONFIRMATION+schedule.visitorLastName+', '+schedule.visitorFirstName+' ?'
		).result.then(function(data){*/
			
			if(angular.isDefined(schedule.tooltip)) {
				delete schedule.tooltip;
			}
			
			ScheduleService.checkout(schedule, $scope.selectedDate).then(function(response){
				
                var exc = AppService.checkException($scope, response.data.exception);
				
                if(!exc) {
					
                    // update the statistics
                    $scope.schedules.statistics = response.data.data.statistics;
					
                    // remove from checkedin list
                    $scope.schedules.checkedin.splice($index, 1);
					
                    // show message through service call
                    AppService.showMessage('success', $rootScope.translation.DASHBOARD.CHECKED_OUT);
                }
            });
			
		/*},function(data){
		});*/
	};
    
    /**
     * CheckIn button visibility check
     */
    $scope.checkInButtonVisibility = function(){
		
        return ($scope.selectedDate >= new Date()) ? false : true;
    }
	
	/**
	 * Enable/disable badge printing
	 *
	 * @param null
	 */
	function setPrintPermission() {
		
		$scope.hasPrint = false;
		
		angular.forEach($rootScope.locations, function(loc){
			
			if($rootScope.location == loc.id && loc.hasPrint){
				$scope.hasPrint = true;
			}
		});
	}
	
	$rootScope.printFile = '';
	$rootScope.printData = {};
	
	/**
     * Print the badge template
     */
    $scope.print = function(schedule) {
		
		// print the badge
		PrintService.download(schedule);
    }
	
	/**
     * Print the emergency list
     */
    $scope.printEmergencyList = function() {
		
		/*var locationName = '';
		
		angular.forEach($rootScope.locations, function(loc){
			
			if(loc.id == $rootScope.location){
				locationName = loc.name;
			}
		});
		
		$rootScope.printData.schedules = $scope.schedules.checkedin;
		$rootScope.printData.locationName = locationName;
		$rootScope.printData.time = $filter('date')(new Date(), 'MMM d, y h:mm a');
		
		Utils.renderBlock('emergency-list.html').then(function(response){
			
			var html = $compile(angular.element(response.data))($scope)[0];
			
			console.log(html);
		});*/
		
		ScheduleService.sendEmergecyList();
		PrintService.printEmergencyList($scope, $scope.schedules.checkedin);
    }
    
    //dafault reverse flag
    $scope.reverse = false;
	
    /**
     * Sorting the Content
     * 
     * @param string fieldName
     */
    $scope.sortBy = function(fieldName, type) {
		
		if(type == 'scheduled') {
			$scope.schedules.scheduled = $filter('orderBy')($scope.schedules.scheduled, fieldName, $scope.reverse);
		} else {
			$scope.schedules.checkedin = $filter('orderBy')($scope.schedules.checkedin, fieldName, $scope.reverse);
		}
		
		// Rest the sort icon to reset
		$('th.h i').each(function(){
			// icon reset
			$(this).removeClass().addClass('fa fa-2x fa-sort');
		});
		
		if ($scope.reverse){
			$('th.h#'+fieldName+'-'+type+' i').removeClass().addClass('fa fa-2x fa-sort-asc');
			$scope.reverse= false;
		}else{
			$('th.h#'+fieldName+'-'+type+' i').removeClass().addClass('fa fa-2x fa-sort-desc');
			$scope.reverse= true;
		}
    };
	
	/**
	 * Check for avatar picture
	 *
	 * @param null
	 * @return bool
	 */
	function updateAvatar() {
		
		/**
		 * Scheduled user list
		 */
		angular.forEach($scope.schedules.scheduled, function(schedule){
			
			schedule.tooltip = '';
			schedule.showAvatar	= false;
			
			if(schedule.visitorPic) {
				
				schedule.tooltip = '<span class="avatar md"><img src="vm/resources/visitorphoto?recordId='+schedule.id+'" /></span>';
				
			} else {
				
				schedule.sso = (angular.isUndefined(schedule.sso) || schedule.sso === null) ? '' : schedule.sso;
				
				Utils.isImage(schedule.sso).then(function(result) {
					
					schedule.showAvatar = result;
					
					if(schedule.showAvatar) {
						schedule.tooltip = '<span class="avatar md"><img src="http://supportcentral.gecdn.com/images/person/temp/'+schedule.sso+'.jpg" /></span>';
					}
				});
			}
		});
		
		/**
		 * Checked In user list
		 */
		angular.forEach($scope.schedules.checkedin, function(schedule){
			
			schedule.tooltip = '';
			schedule.showAvatar	= false;
			
			if(schedule.visitorPic) {
				
				schedule.tooltip = '<span class="avatar md"><img src="vm/resources/visitorphoto?recordId='+schedule.id+'" /></span>';
								
			} else {
				
				schedule.sso = (angular.isUndefined(schedule.sso) || schedule.sso === null) ? '' : schedule.sso;
				
				Utils.isImage(schedule.sso).then(function(result) {
					
					schedule.showAvatar = result;
					
					if(schedule.showAvatar) {
						schedule.tooltip = '<span class="avatar md"><img src="http://supportcentral.gecdn.com/images/person/temp/'+schedule.sso+'.jpg" /></span>';
					}
				});
			}
		});
	}
	
}]);