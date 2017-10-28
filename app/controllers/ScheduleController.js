/**
 * Schedule controller
 *
 * Controller for schedule CRUD operations
 * @type: CONTROLLER
 */
app.controller('ScheduleController', ['$scope', '$rootScope', '$location', '$routeParams', '$filter', 'AppService', 'ScheduleService', 'VisitorsService', 'Utils', 'dialogs', function($scope, $rootScope, $location, $routeParams, $filter, AppService, ScheduleService, VisitorsService, Utils, dialogs){
	
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
		$scope.pastVisitorRange = 0;
        $scope.departureMaxDate = 0;
		
		/**
		 * Show avatar picture
		 */
		$scope.showAvatar = false;
		
		$scope.$watch('schedule.sso', function(){
			
			Utils.isImage($scope.schedule.sso).then(function(result) {
				
				$scope.showAvatar = result;
			});
		});
		
		$scope.webcamSupported = _.includes(['chrome', 'firefox', 'opera'], AppService.getBrowserType());
		
		//Grab scheduleID off of the route
		var scheduleID = ($routeParams.scheduleID) ? parseInt($routeParams.scheduleID) : 0;
		
		$scope.onEditPage = scheduleID ? true : false;
		
		$scope.visitorTypes = [
			{id: 'visitor', name: $rootScope.translation.SCHEDULE.NON_GE_VISITOR},
			{id: 'geemployee', name: $rootScope.translation.SCHEDULE.GE_EMPLOYEE},			
			{id: 'pastvisitor', name: $rootScope.translation.SCHEDULE.PAST_VISITOR}
		];
		
		$scope.visitorType = 'visitor';
		
        /**
         * Getting the Hosts list and Special instructions lists
         */
        ScheduleService.getPreferences().then(function(response){
          	
			var exc = AppService.checkException($scope, response.data.exception);
			
			if(!exc) {
				
				/**
				 * Update the date settings here.
				 */
				$scope.pastVisitorRange = response.data.data.pastVisitorRange;
				$scope.departureMaxDate = response.data.data.maxScheduleRange;
				
				$scope.showMinDate($scope.pastVisitorRange);
				$scope.showDepartureMaxDate($scope.departureMaxDate);
				
				$scope.schedule.hosts = response.data.data.hosts;
				
				/**
				 * Set the instruction list
				 */
				$('.instr_list').hide();
				$('#instructionList option:first').html('-'+$rootScope.translation.SCHEDULE.SPECIAL_INSTRUCTIONS+'-');
				$scope.schedule.instructionLists = response.data.data.instructions;
				
				/**
				 * Initialize additional fields 
				 */
				initAdditionalFields(response.data.data.adds);
				
				/**
				 * Make location specific settings
				 */
				//initMobile(response.data.data.mobile_mandatory);
				
				/**
				 * Editing the schedule
				 */
				if (scheduleID) {
					
					ScheduleService.getSchedule(scheduleID).then(function(response){
						
						/**
						 * Check for exception
						 */
						var exc = AppService.checkException($scope, response.data.exception);
						
						if(!exc){
							
							angular.extend($scope.schedule, response.data.data);
							
							// copy the adds values for edit purpose
							$scope.addsMaster = angular.copy($scope.schedule.adds);
							
							// set for SSO/Non SSO users
							if(angular.isDefined($scope.schedule.sso) && $scope.schedule.sso != null){
								$scope.visitorType = 'geemployee';
							}
							
							// set selected host
							angular.forEach($scope.schedule.hosts, function(hostItem){
								
								if(hostItem.id == $scope.schedule.hostId) {
									$scope.schedule.host = hostItem;
								}
							});
							
							// set selected special instruction
							angular.forEach($scope.schedule.instructionLists, function(instructionItem){
								
								if(instructionItem.id == $scope.schedule.instructionId) {
									$scope.schedule.instructionList = instructionItem;
								}
							});
							
							// set additional fields
							setAdditionalFieldValues($scope.schedule.adds);
							
							// build the timestamp to render data
							var arrival = getTimestamp($scope.schedule.scheduledArrival);
							$scope.schedule.scheduledArrival = $filter('date')(arrival, $rootScope.config.dateFormat);
							$scope.schedule.arrivalTime = createDateTime($filter('date')(arrival, 'yyyy-MM-dd'), $filter('date')(arrival, 'h:mm a'));
							
							var departure = getTimestamp($scope.schedule.scheduledDeparture);
							$scope.schedule.scheduledDeparture = $filter('date')(departure, $rootScope.config.dateFormat);
							$scope.schedule.departureTime = createDateTime($filter('date')(departure, 'yyyy-MM-dd'), $filter('date')(departure, 'h:mm a'));
							
							
							if($scope.schedule.recordType == 'past') {
								/**
								 * past
								 * create a new scedule from the existing one
								 * no update/cancel operations
								 * reset date to current date
								 */
								resetToDefault(false); // no initadds
								
								$scope.createRecordBtn = true;
								$scope.updateRecordBtn = false;
								$scope.cancelRecordBtn = false;
								
								$scope.disableArrival = false;
								
							} else if($scope.schedule.recordType == 'currentIn') {
								/**
								 * currentIn
								 * update the checkout time & intrsctions
								 * disable: whole left hand side, host & start datetime
								 * no create/cancel operations
								 */
								$scope.createRecordBtn = false;
								$scope.updateRecordBtn = true;
								$scope.cancelRecordBtn = false;
								
								$scope.disableArrival = true;
								
								$scope.minDate = $scope.schedule.scheduledArrival;
								$scope.showDepartureMinDate();
								
							} else if($scope.schedule.recordType == 'currentNotIn') {
								/**
								 * currentNotIn
								 * update anything
								 * or cancel the schedule
								 * no create operation
								 */
								$scope.createRecordBtn = false;
								$scope.updateRecordBtn = true;
								$scope.cancelRecordBtn = true;	
								
								$scope.disableArrival = false;
								
								//$scope.minDate = $scope.schedule.scheduledArrival;
								$scope.showDepartureMinDate();
								
							} else {
								/**
								 * future
								 * update anything
								 * or cancel the schedule
								 * no create operation
								 */
								$scope.createRecordBtn = false;
								$scope.updateRecordBtn = true;
								$scope.cancelRecordBtn = true;	
								
								$scope.disableArrival = false;
							}
						}
					});
				} else {
					
					/**
					 * Creating new schedule
					 */
					resetToDefault(false); // no initadds
				}
			}
        });
	};
	
	/**
	 * Update schedule visitor
	 * based on the selected search type
	 *
	 * @param null
	 */
	$scope.switchLookup = function(){
		
		$scope.schedule.geUser = null;
		$scope.schedule.pastVisitor = null;
		
		$scope.schedule.recordId	= null;
		$scope.schedule.visitorId	= null;
		$scope.schedule.sso 		= null;
		$scope.schedule.firstName 	= null;
		$scope.schedule.lastName 	= null;
		$scope.schedule.email 		= null;
		$scope.schedule.datastream	= null;
		$scope.schedule.visitorPic	= null;
		
		// reset additional fields
		$scope.schedule.adds = {};
	};
	
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
         * Updating the Hosts list and
		 * Special instructions lists on location change
         */
        ScheduleService.getPreferences().then(function(response){
            
			var exc = AppService.checkException($scope, response.data.exception);
			
			if(!exc) {
				
				/**
				 * Update the date settings here.
				 */
				$scope.pastVisitorRange = response.data.data.pastVisitorRange;
				$scope.departureMaxDate = response.data.data.maxScheduleRange;
				
				$scope.showMinDate($scope.pastVisitorRange);
				$scope.showDepartureMaxDate($scope.departureMaxDate);
								
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
				
				/**
				 * Initialize additional fields 
				 */
				initAdditionalFields(response.data.data.adds);
				
				// get additional fields for the selected user
				getAdditionalFieldValues();
			}
        });
	};
    
	/**
	 * Add new schedule
	 *
	 * @param type string
	 */
	$scope.execute = function(task, addNew){
        
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
		
		/*if(($scope.schedule.arrival < new Date()) && !$scope.disableArrival) {
            AppService.showMessage('danger', $rootScope.translation.SCHEDULE.ERROR_PAST_TIME); 
            return;
        }*/
		
		$('.actionBtn').attr('disabled', 'disabled');
		
		var postdata = {
			task				: task,
			recordId			: AppService.getVal($scope.schedule.recordId),
			recordType			: AppService.getVal($scope.schedule.recordType),
			visitorId			: AppService.getVal($scope.schedule.visitorId),
			sso					: AppService.getVal($scope.schedule.sso),
			firstName 			: AppService.getVal($scope.schedule.firstName),
			lastName 			: AppService.getVal($scope.schedule.lastName),
			email 				: AppService.getVal($scope.schedule.email),
			hostId 				: AppService.getVal($scope.schedule.host.id),
			hostName 			: AppService.getVal($scope.schedule.host.name),
			destinationName 	: '',
			escortRequired 		: AppService.getVal($scope.schedule.escortRequired, true),
			instructions 		: AppService.getVal($scope.schedule.instructions),
			scheduledArrival 	: $filter('date')($scope.schedule.arrival, 'yyyy-MM-dd HH:mm:ss'),
			scheduledDeparture 	: $filter('date')($scope.schedule.departure, 'yyyy-MM-dd HH:mm:ss'),
			adds				: $scope.schedule.adds,
			datastream			: AppService.getVal($scope.schedule.datastream)
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
        
		ScheduleService.execute(postdata).then(function(response){
			
			$('.actionBtn').removeAttr('disabled');
			
			var exc = AppService.checkException($scope, response.data.exception);
			
			if(!exc) {
				
				if(task == 'create') {
					
					if(addNew){
						$scope.schedule.geUser = null;
						$scope.schedule.pastVisitor = null;
						
						$scope.schedule.visitorId	= null;
						$scope.schedule.sso			= null;
						$scope.schedule.firstName	= null;
						$scope.schedule.lastName	= null;
						$scope.schedule.email		= null;
						$scope.schedule.datastream	= null;
						$scope.schedule.visitorPic	= null;
						
						// reset additional fields
						$scope.schedule.adds = {};
						
						resetToDefault(true); // need initadds
						
					} else {
						$scope.resetForm();
					}
					
					// show message through service call
					AppService.showMessage('success', $rootScope.translation.SCHEDULE.CREATED);
				} else {
					
					// show message through service call
					AppService.showMessage('success', $rootScope.translation.SCHEDULE.UPDATED);
				}
			}
		});
	};
    
	/**
	 * Cancel a schedule
	 *
	 * @param type string
	 */
	$scope.cancelSchedule = function(){
		
		dialogs.confirm(
			$rootScope.translation.DASHBOARD.DELETE_TITLE, 
			$rootScope.translation.DASHBOARD.DELETE_CONFIRMATION
		).result.then(function(btn){
			
			var data = {
				id: $scope.schedule.id,
				recordType: null
			};
			
			VisitorsService.removeSchedule(data).then(function(response){
				
				var exc = AppService.checkException($scope, response.data.exception);
				
				if(!exc) {
					// show message through service call
					AppService.showMessage('success', $rootScope.translation.DASHBOARD.DELETED);
				}
				
				$scope.parentPage = ($routeParams.parentPage == 'd') ? '/dashboard' : '/myvisitors';
				// redirect to listing page
				$location.path($scope.parentPage);
			});
			
		},function(btn){
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
        
		// reset additional fields
		$scope.schedule.adds = {};
		
		$scope.visitorType = 'visitor';
		
		resetToDefault(true); // need initadds
	};
	
	/**
	 * Lookup for sso users
	 *
	 * @param viewValue string
	 */
	$scope.getGEUsers = function(viewValue){
		
		return ScheduleService.getGEUsers(viewValue).then(function(response){
			
			var items = [];
			var users = [];
			
			items = response.data['json-service']['services'][0]['response']['data'];
			
			angular.forEach(items, function(item){
				
				var phone = (angular.isUndefined(item[5]) || item[5] === null) ? false : item[5];
				
				if(!phone) {
					phone = (angular.isUndefined(item[4]) || item[4] === null) ? false : item[4];
					if(!phone) {
						phone = (angular.isUndefined(item[3]) || item[3] === null) ? false : item[3];
					}
				}
				
				users.push({
					sso			: item[0],
					name		: item[1]+' ('+item[0]+')',
					firstname   : item[1].split(', ')[0],
					lastname    : item[1].split(', ')[1],
					phone		: phone,
					email		: item[6],
					company		: item[2]
				});
			});
			
			return users;
		});
	};
	
	/**
	 * Update the model upon selecting an user
	 *
	 * @param item obj
	 * @param model obj
	 * @param label string
	 */
	$scope.onSelectGEUser = function($item, $model, $label){
		
		$scope.schedule.visitorId	= $item.visitorId;
		$scope.schedule.sso			= $item.sso;
		$scope.schedule.firstName	= $item.firstname;
		$scope.schedule.lastName	= $item.lastname;
		$scope.schedule.email		= $item.email;
		
		// reset additional fields
		$scope.schedule.adds = {};
		
		/**
		 * For GE employee
		 * Mob number is taken from lookup service
		 * For others
		 * it should taken from our DB
		 */
		$scope.schedule.adds.PHONE		= $item.phone;
		$scope.schedule.adds.COMPANY	= $item.company;
		
		// get additional fields for the selected user
		getAdditionalFieldValues();
	};
	
	/**
	 * Lookup for sso users
	 *
	 * @param viewValue string
	 */
	$scope.getPastVisitors = function(viewValue){
		
		return ScheduleService.getPastVisitors(viewValue).then(function(response){
			
			var users = [];
			
			angular.forEach(response.data.data, function(item){
				
				item.sso = (angular.isUndefined(item.sso) || item.sso === null) ? '' : item.sso;
				
				users.push({
					recordId	: item.recordId,
					visitorId	: item.visitorId,
					sso			: item.sso,
					name		: item.visitor,
					firstname	: item.firstName,
					lastname	: item.lastName,
					email		: item.email,
					phone		: item.phone,
					company		: item.company,
					datastream	: item.datastream,
					visitorPic	: item.visitorPic
				});
			});
			
			return users;
		});
	};
	
	/**
	 * Update the model upon selecting an user
	 *
	 * @param item obj
	 * @param model obj
	 * @param label string
	 */
	$scope.onSelectPastVisitor = function($item, $model, $label){
		
		$scope.schedule.recordId	= $item.recordId;
		$scope.schedule.visitorId	= $item.visitorId;
		$scope.schedule.sso			= $item.sso;
		$scope.schedule.firstName	= $item.firstname;
		$scope.schedule.lastName	= $item.lastname;
		$scope.schedule.email		= $item.email;
		$scope.schedule.datastream	= $item.datastream;
		$scope.schedule.visitorPic	= $item.visitorPic;
		
		// reset additional fields
		$scope.schedule.adds = {};
		
		/**
		 * For GE employee
		 * Mob number is taken from lookup service
		 * For others
		 * it should taken from our DB
		 */
		$scope.schedule.adds.PHONE		= $item.phone;
		$scope.schedule.adds.COMPANY	= $item.company;
		
		// get additional fields for the selected user
		getAdditionalFieldValues();
	};
	
	/**
	 * Lookup for host
	 *
	 * @param viewValue string
	 */
	$scope.getHosts = function(viewValue){
		
		return ScheduleService.getHosts(viewValue).then(function(response){
			
			var users = [];
			
			angular.forEach(response.data.data, function(item){
				
				users.push({
					id	: item.sso,
					name: item.name
				});
			});
			
			return users;
		});
	};
		
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
    };
	
	/**
	 * Disabling the past date in the arrival calender
	 */
	$scope.showMinDate = function(days){
		
		days = angular.isDefined(days) ? days : 0;
		
		var today = new Date();
		today.setDate(today.getDate() - days); 
		
		$scope.minDate = today;
	};
	
	$scope.showMinDate();
	
	/**
	 * Limiting the arrival calender to 30 days duraton
	 */
	$scope.showMaxDate = function(){
		//$scope.maxDate = new Date((new Date($scope.minDate)).getTime() + 30*24*60*60*1000);
	};
	
	$scope.showMaxDate();
	
	/**
	 * Disabling the departure calender from selecting an old date than arrival date
	 */
	$scope.showDepartureMinDate = function(){
		$scope.minDepartureDate = $scope.schedule.scheduledArrival;
	};
	
	$scope.showDepartureMinDate();
	
	/**
	 * Disabling the departure calender from selecting an old date than arrival date
	 */
	$scope.showDepartureMaxDate = function(days){
		
		days = angular.isDefined(days) ? days : 0;
		
		if(days) {
			
			var minDate = angular.isUndefined($scope.schedule.scheduledArrival) ? new Date() : new Date($scope.schedule.scheduledArrival);
			
			$scope.maxDepartureDate = new Date(minDate.getTime() + days*24*60*60*1000);
		} else {
			$scope.maxDepartureDate = null;
		}
	};
	
	$scope.showDepartureMaxDate();
	
	/**
	 * Updating the new departure minimum date
	 */
	$scope.changeDepartureDate = function(){
		
		if($scope.schedule.scheduledArrival > $scope.schedule.scheduledDeparture) {		
			$scope.schedule.scheduledDeparture = $scope.schedule.scheduledArrival;
		}
		
		$scope.showDepartureMinDate();
		$scope.showDepartureMaxDate($scope.departureMaxDate);
	};
	
	/**
     * Cancel Edit and redirect back
     * 
     * @param null
     */
    $scope.backButton = function() {
        
        $scope.parentPage = ($routeParams.parentPage) ? $routeParams.parentPage : '';
        $scope.parentPage = ($scope.parentPage == 'd') ? '/dashboard' : '/myvisitors';
        $location.path($scope.parentPage);
    };
	
	/**
	 * Reset date and time to
	 * default values
	 *
	 * @param null
	 */
	function resetToDefault(reinitialize) {
		
		var coeff = 1000 * 60 * 5;
		var four = 1000 * 60 * 60 * 4;
		
		// Default time for arrival and departure
		$scope.schedule.scheduledArrival = new Date();
		$scope.schedule.scheduledDeparture = new Date(new Date().getTime() + four);
		
		$scope.schedule.arrivalTime = new Date(Math.ceil($scope.schedule.scheduledArrival.getTime() / coeff) * coeff);
		
		$scope.schedule.departureTime = new Date(Math.ceil($scope.schedule.scheduledDeparture.getTime() / coeff) * coeff);
		
		$scope.showDepartureMinDate();
		
		$scope.schedule.host = null;
		
		// set default host as the current user if in the current list
        angular.forEach($scope.schedule.hosts, function(hostItem){
            
            if(hostItem.id == $scope.user.sso) {
                $scope.schedule.host = hostItem;
            }
        });
		
		if(reinitialize) {
			// reset the additional fields
			initAdditionalFields($scope.fields);
		}
	};
	
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
				
				$('.instr_list').hide();
				$('#instructionList option:first').html('-'+$rootScope.translation.SCHEDULE.SPECIAL_INSTRUCTIONS+'-');
				$scope.schedule.instructionLists = response.data.data.instructions; 
			}
		});
		
		/**
		 * Update visitor types
		 */
		$scope.visitorTypes = [
			{id: 'geemployee', name: $rootScope.translation.SCHEDULE.GE_EMPLOYEE},
			{id: 'visitor', name: $rootScope.translation.SCHEDULE.NON_GE_VISITOR},
			{id: 'pastvisitor', name: $rootScope.translation.SCHEDULE.PAST_VISITOR}
		];
		
	});
	
	/**
     * Help popup
	 *
     * @param null
     */
    $scope.help = function (){
        $rootScope.page = "schedule";
		var dlg = dialogs.create('app/partials/help.html', 'HelpController', {}, {keyboard: false, backdrop: 'static', size: 'md'});
		
		dlg.result.then(function(name){
			
		},function(){
			
		});
	};
	
	/**
	 * Create the additional fields if exsits
	 *
	 * @param adds obj
	 */
	function initAdditionalFields(adds) {
		
		// copy the value for resetting later
		$scope.fields = adds;
		
		// actual obj to pass to the server
		$scope.schedule.adds = {};
		
		$scope.showDefaults = false;
		$scope.showAddition = false;
		
		if(angular.isDefined(adds) && adds) {
			
			$scope.defaultFileds = [];
			$scope.additionalFields = [];
			$scope.additionalFieldsSelected = [];
			
			// set the field types
			angular.forEach(adds, function(field){
				
				if(field['visible']) {
					$scope.showDefaults = true;
					$scope.defaultFileds.push(field);							
				} else {
					$scope.showAddition = true;
					$scope.additionalFields.push(field);
				}
			});
		}
	};
	
	/**
	 * Get values for the additional fields
	 *
	 * @param field object
	 */
	function getAdditionalFieldValues() {
		
		if($scope.schedule.sso == null && $scope.schedule.visitorId == null){
			return false;
		}
		
		var params = {
			sso: AppService.getVal($scope.schedule.sso),
			visitorId: AppService.getVal($scope.schedule.visitorId),
			locationId: AppService.getVal($rootScope.location),
		};
		
		/**
		 * Getting the additional field values
		 */
		ScheduleService.getAdditionalFieldValues(params).then(function(response){
			
			$scope.extras = response.data.data;
			
			// set extra fields values if its visible in the current view
			angular.forEach($scope.defaultFileds, function(field){
				
				angular.forEach($scope.extras, function(value, key){
					
					if(field.key == key){
						
						if(!($scope.visitorType == 'geemployee' && (key == 'PHONE' || key == 'COMPANY'))) {
							// push it to $scope.schedule.adds modal
							$scope.schedule.adds[key] = value;
						}
					}
				});
			});
		});
	};
	
	/**
	 * Set values for the additional fields
	 * upon editing/updating a record
	 *
	 * @param items obj
	 */
	function setAdditionalFieldValues(items) {
		
		// copy the additional filed values for reset purpose
		$scope.extras = angular.copy(items);
		
		// display the additional fields
		angular.forEach(items, function(value, key){
			
			angular.forEach($scope.additionalFields, function(field){
				
				if(field.key == key){
					$scope.addFiled(field);
				}
			});
		});
	}
	
	/**
	 * Add more fields
	 *
	 * @param field object
	 */
	$scope.addFiled = function(field){
		
		if(AppService.isIE8()) {
			
			var present = false;
			
			// check if the additional field is already selected
			angular.forEach($scope.additionalFieldsSelected, function(current, index){
				if(field.key == current.key){
					present = true;
				}
			});
			
			if(present){
				AppService.showMessage('danger', $rootScope.translation.SCHEDULE.ALREADY_SELECTED); 
            	return;
			}
		}
		
		// show the additional filed
		$scope.additionalFieldsSelected.push(field);
		
		if(!AppService.isIE8()) {
			
			// remove the additional field from dropdown
			angular.forEach($scope.additionalFields, function(current, index){
				if(field.key == current.key){
					$scope.additionalFields.splice(index, 1);
				}
			});
		}
		
		// set the modal value if its already available
		angular.forEach($scope.extras, function(value, key){
			
			if(field.key == key){
				// push it to $scope.adds
				$scope.schedule.adds[key] = value;
			}
		});
		
		// reset the select modal
		$scope.schedule.more = null;
	};
	
	/**
	 * Remove more fields
	 *
	 * @param field object
	 */
	$scope.removeFiled = function(field, $index){
		
		if(!AppService.isIE8()) {
			
			// push it to the dropdown
			$scope.additionalFields.push(field);
		}
		
		// remove it from the display
		$scope.additionalFieldsSelected.splice($index, 1);
		
		// delete the modal value
		delete $scope.schedule.adds[field.key];
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
			$scope.schedule.datastream = data;
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
	}
	
	/**
	 * Internation Telephone validator
	 */
	function initMobile(required){
		
		//set default countrycode
		$rootScope.countryCode = 'us';
		$scope.valid = !required;
		
		/**
		 * validate phone Input
		 * 
		 * @param {type} telephoneNumber
		 * @param {type} event
		 * @returns boolean
		 */
		$scope.validateTelephoneInput = function (telephoneNumber, event) {
			
			var countryCode = event.target.nextSibling.children[0].children[0].className.split(' ')[1];
			
			/**
			 * validating the telephone number with the country code 
			 * via the google telephone validation library isValidNumber()
			 */
			var IsValidTelephone = window.isValidNumber($.trim(telephoneNumber), countryCode);
			$scope.valid = ((telephoneNumber != '') && IsValidTelephone);
			
			if(!required && angular.equals($scope.schedule.phone, '')) {
				$scope.valid = true;
				$scope.scheduleForm.phone.$setValidity('', $scope.valid);
			} else {
				$scope.scheduleForm.phone.$setValidity('', $scope.valid);
			}
		};
		
		/**
		 * when someone starts to edit the number, 
		 * clear the validation message to avoid confusion
		 */
		$scope.clearValidation = function () {
			
			$scope.scheduleForm.phone.$setValidity('required', $scope.valid);
			return $scope.valid;
		};
		
		/**
		 * Set validity to true
		 * When its not required and empty
		 */
		$scope.$watch('schedule.phone', function() {
			
			if(!required && angular.equals($scope.schedule.phone, '')) {
				
				$scope.valid = true;
				$scope.scheduleForm.phone.$setValidity('', $scope.valid);
			}
   		});
	}
	
	/**
     * Multidate popup
	 *
     * @param null
     */
    $scope.multidate = function (){
        
		var dlg = dialogs.create('app/partials/multi-date.html', 'MultiDateController', $scope.schedule, {keyboard: false, backdrop: 'static', size: 'md'});
		
		dlg.result.then(function(response){
			
			// Update the blocked dates here...
			$scope.schedule.blockedDates = response.blockedDates;
			
		},function(){
		});
	};
	
}]);