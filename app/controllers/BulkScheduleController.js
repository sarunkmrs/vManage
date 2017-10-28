/**
 * BulkSchedule Controller
 *
 * Controller for scheduling a Group of visitors CRUD operations
 * @type: CONTROLLER
 */
app.controller('BulkScheduleController', ['$scope', '$rootScope', '$location', '$filter', 'AppService', 'ScheduleService', 'VisitorsService', '$upload', function($scope, $rootScope, $location, $filter, AppService, ScheduleService, VisitorsService, $upload){
	
	if(!$rootScope.location){
		return false;
	}
	
	init();
	
	/**
	 * Initialize the schedule controller
	 *
	 * @param null
	 */
	function init() {
		
		// check if it's Russia
		checkLocation();
		
        $scope.schedule = {};
		
        /**
         * Getting the Hosts list and Special instructions lists
         */
        ScheduleService.getPreferences().then(function(response){
          	
			var exc = AppService.checkException($scope, response.data.exception);
			
			if(!exc) {
				
				$scope.schedule.hosts = response.data.data.hosts;
				
				$('.instr_list').hide();
				$('#instructionList option:first').html('-'+$rootScope.translation.SCHEDULE.SPECIAL_INSTRUCTIONS+'-');
				$scope.schedule.instructionLists = response.data.data.instructions;
				
     			resetToDefault();
			}
        });
	}
	
    /**
	 * Update schedule pages
	 * for the location change
	 *
	 * @param null
	 */
	$scope.changeLocation = function(location){
        
		// Update user access
		AppService.updateUserAccess(location);
		
		$rootScope.location = location;
		
		// check if it's Russia
		checkLocation();
		
		$scope.schedule.host = null;
		$scope.schedule.hosts = [];
		
        $('.instr_list').show();
        $('#instructionList option:first').html($rootScope.translation.SCHEDULE.LOADING);
        
        /**
         * Updating the Hosts list and Special instructions lists on location change
         */
        ScheduleService.getPreferences().then(function(response){
            
			var exc = AppService.checkException($scope, response.data.exception);
			
			if(!exc) {
				
				$scope.schedule.hosts = response.data.data.hosts;
				
				// set default host as the current user if in the current list
				angular.forEach($scope.schedule.hosts, function(hostItem){
					
					if(hostItem.id == $scope.user.sso) {
						$scope.schedule.host = hostItem;
					}
				});
				
				$('.instr_list').hide();
				$('#instructionList option:first').html('-'+$rootScope.translation.SCHEDULE.SPECIAL_INSTRUCTIONS+'-');
				$scope.schedule.instructionLists = response.data.data.instructions;
				$scope.schedule.instructionList = null;
			}
        });
	};
    
	/**
	 * Add new schedule
	 *
	 * @param type string
	 */
	$scope.execute = function(task){
        
		if($scope.scheduleForm.$invalid) {return false;}
		
        /*
		 * Combines the date and time together
		 */
        $scope.schedule.arrival = createDateTime(
			$filter('date')(new Date($scope.schedule.scheduledArrival), 'yyyy-MM-dd'), 
			$filter('date')(new Date($scope.schedule.arrivalTime), 'h:mm a'));
		
		$scope.schedule.departure = createDateTime(
			$filter('date')(new Date($scope.schedule.scheduledDeparture), 'yyyy-MM-dd'), 
			$filter('date')(new Date($scope.schedule.departureTime), 'h:mm a'));
        
        if($scope.schedule.arrival >= $scope.schedule.departure) {
            AppService.showMessage('danger', $rootScope.translation.SCHEDULE.ERROR_DATE); 
            return;
        }
		
		$('.actionBtn').attr('disabled', 'disabled');
		var postdata = {
			task				: task,
			fileName 			: $scope.uploadResult.fileName,
			hostId 				: AppService.getVal($scope.schedule.host.id),
			hostName 			: AppService.getVal($scope.schedule.host.name),
			destinationName 	: '',
			escortRequired 		: AppService.getVal($scope.schedule.escortRequired, true),
			instructions 		: AppService.getVal($scope.schedule.instructions),
			scheduledArrival 	: $filter('date')($scope.schedule.arrival, 'yyyy-MM-dd HH:mm:ss'),
			scheduledDeparture 	: $filter('date')($scope.schedule.departure, 'yyyy-MM-dd HH:mm:ss')
		};
        
        if($scope.schedule.instructionLists.length){
            if($scope.schedule.instructionList){
                postdata.instructionId   = AppService.getVal($scope.schedule.instructionList.id);
                postdata.instructionName = AppService.getVal($scope.schedule.instructionList.name);
            } else{
                postdata.instructionId   = null;
                postdata.instructionName = null;
            }
        }
        
		ScheduleService.bulkSchedule(postdata).then(function(response){
			
			$('.actionBtn').removeAttr('disabled');
			
			var exc = AppService.checkException($scope, response.data.exception);
			
			if(!exc) {
                $scope.resetForm();
                var noOfRecords = response.data.count,
                    message = ( noOfRecords > 0 ) ? $rootScope.translation.SCHEDULE.CREATED + " <br /> "+ noOfRecords + $rootScope.translation.SCHEDULE.COUNT_MESSAGE : $rootScope.translation.SCHEDULE.CREATED
                
                // show message through service call
                AppService.showMessage('success', message);
            }
		});
	};
		
	/**
	 * Reset form
	 *
	 * @param null
	 */
	$scope.resetForm = function(){
        
        var tmpHosts = $scope.schedule.hosts;
        var tmpInstructions = $scope.schedule.instructionLists;
		
        $scope.schedule = {};
		
        $scope.schedule.host = null;
		$scope.schedule.hosts = tmpHosts;
        $scope.schedule.instructionLists = tmpInstructions;
		
        $scope.cancelUploads();
		resetToDefault();
	}
	
	/**
     * Open the calendar popup
	 * on icon click
     * 
     * @param $event obj
	 * @param type string
     */
    $scope.openCalendar = function($event, type) {
		
		$event.preventDefault();
		$event.stopPropagation();
		
		if(type == 'arrival') {
			$scope.arrivalOpened = true;
		} else {
			$scope.departureOpened = true;
		}
    }
	
	/**
	 * Disabling the past date in the arrival calender
	 */
	$scope.showMinDate = function(){
		$scope.minDate = ( $scope.minDate ) ? null : new Date();
	}; 
	
	$scope.showMinDate();
	
    /**
	 * Disabling the departure calender from selecting an old date than arrival date
	 */
	$scope.showDepartureMinDate = function(){
		$scope.minDepartureDate = $scope.schedule.scheduledArrival;
	};
	
	$scope.showDepartureMinDate();
	
	/**
	 * Updating the new departure minimum date
	 */
	$scope.changeDepartureDate = function(){	
        if($scope.schedule.scheduledArrival > $scope.schedule.scheduledDeparture) {		
            $scope.schedule.scheduledDeparture = $scope.schedule.scheduledArrival;
        }
		$scope.showDepartureMinDate();
	}
	
	/**
	 * Reset date and time to
	 * default values
	 *
	 * @param null
	 */
	function resetToDefault() {
		
		// Default time for arrival and departure
		$scope.schedule.scheduledArrival = new Date();
		$scope.schedule.scheduledDeparture = new Date();
		
		$scope.schedule.arrivalTime = createDateTime($filter('date')(new Date($scope.schedule.scheduledArrival), 'yyyy-MM-dd'), '08:00 AM');
		$scope.schedule.departureTime = createDateTime($filter('date')(new Date($scope.schedule.scheduledArrival), 'yyyy-MM-dd'), '05:00 PM');
		
		// set default host as the current user if in the current list
		angular.forEach($scope.schedule.hosts, function(hostItem){
			
			if(hostItem.id == $scope.user.sso) {
				$scope.schedule.host = hostItem;
			}
		});
	}
    
    /**
	 * Update the instruction list
	 * on language change
	 *
	 * @param null
	 */
	$scope.$on('languageChange', function() {
		
		/**
		 * Getting the Special instructions lists
		 */
		ScheduleService.getPreferences().then(function(response){
			
			var exc = AppService.checkException($scope, response.data.exception);
			
			if(!exc) {
				$('.host_list').hide();
				$('#host option:first').html('-'+$rootScope.translation.SCHEDULE.HOST_SELECTION+'-');
				$('.instr_list').hide();
				$('#instructionList option:first').html('-'+$rootScope.translation.SCHEDULE.SPECIAL_INSTRUCTIONS+'-');
				$scope.schedule.instructionLists = response.data.data.instructions;
			}
		});
	});
    
    /**
     * File upload operation
     * 
     * @param File Obj
     */
    $scope.onFileSelect = function($files) {
      
        $scope.selectedFiles = [];
		$scope.progress = [];
		if ($scope.upload && $scope.upload.length > 0) {
			for (var i = 0; i < $scope.upload.length; i++) {
				if ($scope.upload[i] != null) {
					$scope.upload[i].abort();
				}
			}
		}
        
        $scope.upload = [];
		$scope.uploadResult = [];
		$scope.selectedFiles = $files;
        
        for ( var i = 0; i < $files.length; i++) {
			var file = $files[i];
            var ext = file.name.split('.').pop();
            
            if(ext=="xlsx" || ext=="xls"){
              $scope.progress[i] = -1;
              $scope.start(i);
            } else {
                $scope.cancelUploads();
                // show message through service call
                AppService.showMessage('danger', $rootScope.translation.BULK_SCHEDULE.UPLOAD_ERROR);
                return false;
            }
		}
    };
    
    /**
     * Initialize the file Upload
     * 
     * @params Obj
     */
    $scope.start = function($index) {
      
        $scope.progress[$index] = 0;
        $scope.upload = $upload.upload({
            url: 'vm/resources/UploadVisitorDoc',
            method: 'POST',
            file: $scope.selectedFiles[$index]      
        }).progress(function(evt) {
            $scope.progress[$index] = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function(data, status, headers, config) {
            // file is uploaded successfully
            var exc = AppService.checkException($scope, data.exception);
            if(!exc) {
                $scope.sucess = true;         
                $scope.uploadResult = data;
            } else {
                $scope.sucess = false;
                return false;
            }
        });
    };
    
    /**
     * Canceling file upload operation
     * 
     * @params null
     */
    $scope.cancelUploads= function() {
        $scope.uploadResult = {};
        $scope.selectedFiles = [];
        $scope.selectedFiles = null;
        $scope.sucess = false;
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
	}
	
}]);