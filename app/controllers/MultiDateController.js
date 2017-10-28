/**
 * Multidate controller
 *
 * Controller for handling individual dates within a schedule
 * @type: CONTROLLER
 */
app.controller('MultiDateController', ['$scope', '$rootScope', '$uibModalInstance', 'data', 'ScheduleService', 'AppService', '$filter', function($scope, $rootScope, $uibModalInstance, data, ScheduleService, AppService, $filter){
	
	/**
	 * Initialize the multidate controller
	 *
	 * @param null
	 */
	function init() {
		
		/**
		 * Sechedule dates
		 *     - start date (disable anything before it)
		 *     - end date (disable anything after it)
		 * Available dates
		 *     - mark all as green
		 * Blocked dates
		 *     - mark as red
		 * Show only dates starting from today
		 *     - hide all past in the right side list
		 * Disable the date selection option in calendar
		 */
		$scope.schedule = {};
		
		$scope.schedule.sheduledDates	= [];	// all sheduled dates [past & future]
		$scope.schedule.availableDates	= [];	// all future available dates [future]
		$scope.schedule.blockedDates	= [];	// all blocked dates [past & future]
		$scope.schedule.selectedDates	= [];	// selected dates from the checklist [future]
		
		$scope.schedule.activeDate;	// today
		
		$scope.schedule.id 				= data.id;
		$scope.schedule.startDate 		= new Date(data.scheduledArrival);
		$scope.schedule.endDate 		= new Date(data.scheduledDeparture);
		
		var blockedDates = [];
		
		angular.forEach(data.blockedDates, function(blockedDate){
			blockedDates.push(new Date(blockedDate));
		});
		
		$scope.schedule.blockedDates = blockedDates;
		
		
		/**
		 * Based on the start/end date, build the
		 * scheduled & available dates
		 */
		var tempDate = $scope.schedule.startDate;
		
		if($scope.schedule.startDate && $scope.schedule.endDate){
			
			var noOfDays = dayDiff($scope.schedule.endDate, $scope.schedule.startDate);
			
			for(var i=0; i<=noOfDays; i++){
				
				var newTempDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()+i, tempDate.getHours(), tempDate.getMinutes(), tempDate.getSeconds());
				
				var blocked = $scope.isBlocked(newTempDate);
				var status 	= blocked ? 'not-coming' : 'coming';
				
				if(newTempDate.setHours(0,0,0,0) < new Date().setHours(0,0,0,0)){
					status = 'past';
				} else {
					if(!blocked) {
						$scope.schedule.availableDates.push(newTempDate.setHours(0,0,0,0));
					}
				}
				
				$scope.schedule.sheduledDates.push({date: newTempDate, status: status});
			}
		}
		
	}
	
	/**
	 * Get the day difference
	 *
	 * @param endDate date
	 * @param startDate date
	 *
	 * @return diffDays int
	 */
	function dayDiff(endDate, startDate) {
		
		var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
		
		return diffDays;
	}
	
	/**
	 * Check if its a blocked date
	 *
	 * @param tempDate date
	 *
	 * @return blocked bool
	 */
	$scope.isBlocked = function(tempDate){
		
		var blocked = false;
		
		angular.forEach($scope.schedule.blockedDates, function(blockedDate){
			
			if(blockedDate.setHours(0,0,0,0) === tempDate.setHours(0,0,0,0)){
				blocked = true;
			}
		});
		
		return blocked;
	};
	
	/**
	 * Update date color
	 *
	 * @param date date
	 * @param mode string
	 *
	 * @return class string
	 */
	$scope.getDayClass = function(date, mode) {
		
		if (mode === 'day') {
			
			var dayToCheck = new Date(date).setHours(0,0,0,0);
			
			for (var i=0;i<$scope.schedule.sheduledDates.length;i++){
				
				var currentDay = $scope.schedule.sheduledDates[i].date.setHours(0,0,0,0);
				
				if (dayToCheck === currentDay) {
					
					return $scope.schedule.sheduledDates[i].status;
				}
			}
		}
		
		return '';
	};
	
	/**
	 * Check/Unchek all available dates
	 *
	 * @param null
	 */
	$scope.checkUncheckAll = function() {
		
		if($scope.schedule.checkall) {
			$scope.schedule.selectedDates = angular.copy($scope.schedule.availableDates);
		} else {
			$scope.schedule.selectedDates = [];
		}
	};
	
	/**
	 * Delete dates
	 *
	 * @param null
	 */
    $scope.save = function(){
        
		var selectedDates = [];
		
		angular.forEach($scope.schedule.selectedDates, function(selectedDate){
			selectedDates.push($filter('date')(selectedDate, 'yyyy-MM-dd HH:mm:ss'));
		});
		
		var params = {
			scheduleId: $scope.schedule.id,
			dates: selectedDates
		};
		
		ScheduleService.deleteScheduleDates(params).then(function(response){
			
			/**
			 * Check for exception
			 */
			var exc = AppService.checkException($scope, response.data.exception);
			
			if(!exc){
				
				// show message through service call
				AppService.showMessage('success', $rootScope.translation.SCHEDULE.UPDATED);
				
				$uibModalInstance.close(response.data.data);
			}
		});
		
	};
	
    /**
	 * Close modal
	 *
	 * @param null
	 */
    $scope.cancel = function(){
        
        $uibModalInstance.dismiss('Canceled');
	};
	
	init();
}]);