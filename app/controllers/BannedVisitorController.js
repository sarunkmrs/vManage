/* 
 * Banned Visitor Controller
 * 
 * Controller for bannedVisitors CRUD operations
 * @type: CONTROLLER
 */
app.controller('BannedVisitorController', ['$scope', '$rootScope', 'AppService', 'VisitorsService', 'Utils', 'dialogs', '$filter', function ($scope, $rootScope, AppService, VisitorsService, Utils, dialogs, $filter){
  	
    if(!$rootScope.location){
		return false;
	}
	
	init();
    
    function init(){
      	
		$scope.busy = false;
		$scope.after = 0;
        $scope.bannedVisitors = [];
        
        /**
         * Getting the banned visitors list
         */
        VisitorsService.getBannedVisitors().then(function(response){
          	
			AppService.checkException($scope, response.data.exception);
			
            $scope.bannedVisitors = response.data.data;
			updateAvatar();
        });
    }
    
	/**
	 * Load more bannedVisitors
	 * on scrolling down
	 *
	 * @param location and langCode
	 */
	$scope.loadMore = function(){
        
		if($scope.busy || $scope.after >= 10){ return false; }
		
		$scope.busy = true;
		
        VisitorsService.getBannedVisitors($scope.after).then(function(response){
          	
			AppService.checkException($scope, response.data.exception);
			
			if(response.data.data.length){
				angular.forEach(response.data.data, function(item) {
					$scope.bannedVisitors.push(item);
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
		
		angular.forEach($scope.bannedVisitors, function(visitor){
			
			processImages(visitor);
		});
	}
	
	/**
	 * Process images
	 *
	 * @param visitor obj
	 * @return bool
	 */
	function processImages(visitor) {
		
		visitor.tooltipVisitor = visitor.tooltipRequester = '';
		visitor.showAvatarVisitor = visitor.showAvatarRequester = false;
		
		if(visitor.visitorPic) {
			
			visitor.tooltip = '<span class="avatar md"><img src="vm/resources/bannedvisitorphoto?recordId='+visitor.recordId+'" /></span>';
			
		} else {
			
			visitor.sso = (angular.isUndefined(visitor.sso) || visitor.sso === null) ? '' : visitor.sso;
			
			Utils.isImage(visitor.sso).then(function(result) {
				
				visitor.showAvatarVisitor = result;
				
				if(visitor.showAvatarVisitor) {
					visitor.tooltipVisitor = '<span class="avatar md"><img src="http://supportcentral.gecdn.com/images/person/temp/'+visitor.sso+'.jpg" /></span>';
				}
			});
		}
		
		Utils.isImage(visitor.requesterSSO).then(function(result) {
			
			visitor.showAvatarRequester = result;
			
			if(visitor.showAvatarRequester) {
				visitor.tooltipRequester = '<span class="avatar md"><img src="http://supportcentral.gecdn.com/images/person/temp/'+visitor.requesterSSO+'.jpg" /></span>';
			}
		});
	}
	
    /**
	 * Update banned visitors list
	 * for the location change
	 *
	 * @param location and langCode
	 */
	$scope.changeLocation = function(location){
        
		// Update user access
		AppService.updateUserAccess(location);
		
		$rootScope.location = location;
		
        VisitorsService.getBannedVisitors().then(function(response){
          	
			AppService.checkException($scope, response.data.exception);
			
            $scope.bannedVisitors = response.data.data;
			updateAvatar();
        });
	};
    
	/**
	 * Bann a visitor
	 *
	 * @param visitor obj
	 * @param $index int
	 */
	$scope.bann = function (visitor, $index) {
		
		var isUpdate = angular.isDefined(visitor);
		
		dialogs.create(
			'app/partials/bann-modal.html',						// modal template
			'BannVisitorController',							// modal controller
			visitor,											// visitor information
			{keyboard: false, backdrop: 'static', size: 'md'}	// actual modal params
		).result.then(
			function(data) {
				// success callback
				
				var params = {
					 'task'			: isUpdate ? 'update' : 'create',
					 'recordId'		: angular.isDefined(data.recordId) ? data.recordId : null,
					 'sso'			: data.sso,
					 'firstName'	: data.firstName,
					 'lastName'		: data.lastName,
					 'datastream'	: angular.isDefined(data.datastream) ? data.datastream : null,
					 'reason'		: data.reason,
					 'startDate'	: $filter('date')(new Date(data.startDate), 'yyyy-MM-dd'),
					 'endDate'		: $filter('date')(new Date(data.endDate), 'yyyy-MM-dd'),
					 'forever'		: angular.isDefined(data.forever) ? data.forever : false
				};
				
				VisitorsService.bann(params).then(function(response){
					
					var exc = AppService.checkException($scope, response.data.exception);
					
					if(!exc) {
						
						var visitor = response.data.data;
						processImages(visitor);
						
						if(isUpdate) {
							
							// show message through service call
							AppService.showMessage('success', $scope.translation.BANNED_VISITORS.UPDATED);
							
							angular.forEach($scope.bannedVisitors, function(item){
								
								// update the record
								if(item.recordId == visitor.recordId) {
									
									item.sso		= visitor.sso;
									item.firstName	= visitor.firstName;
									item.lastName	= visitor.lastName;
									item.startDate	= visitor.startDate;
									item.endDate	= visitor.endDate;
									item.forever	= visitor.forever;
									item.reason		= visitor.reason;
									item.datastream = visitor.datastream;
									item.visitorPic = visitor.visitorPic;
									
									item.requesterSSO		= item.requesterSSO;
									item.requesterFirstName	= item.requesterFirstName;
									item.requesterLastName	= item.requesterLastName;
								}
							});
							
						} else {
							
							// show message through service call
							AppService.showMessage('success', $scope.translation.BANNED_VISITORS.ADDED);
							
							// add the new record to the list
							//$scope.bannedVisitors.push(visitor);
							$scope.bannedVisitors.splice(0, 0, visitor);
						}
					}
				});
				
			}, function() {
				// error/cancel callback
			}
		);
	};
	
	/**
     * Remove bann
	 *
     * @param visitor object
	 * @param $index int
     */
    $scope.removeBann = function (visitor, $index){
        
		dialogs.confirm(
			$rootScope.translation.BANNED_VISITORS.REMOVE_TITLE, 
			$rootScope.translation.BANNED_VISITORS.REMOVE_CONFIRMATION,
			{keyboard: false, backdrop: 'static', size: 'md'}
		).result.then(function(btn){
			
			var data = {recordId: visitor.recordId};
			
			VisitorsService.removeBann(data).then(function(response){
				
				var exc = AppService.checkException($scope, response.data.exception);
				
				if(!exc) {
					// removing a visitor from the list
					$scope.bannedVisitors.splice($index, 1);
					
					// show message through service call
					AppService.showMessage('success', $rootScope.translation.BANNED_VISITORS.REMOVED);
				}
			});
			
		},function(btn){
		});
    };
	
}]);


/**
 * Bann visitor controller
 *
 * Controller for check in operations
 * @type: CONTROLLER
 */
app.controller('BannVisitorController', ['$scope', '$rootScope', '$uibModalInstance', 'data', 'Utils', 'dialogs', 'VisitorsService', 'ScheduleService', 'AppService', '$filter', function($scope, $rootScope, $uibModalInstance, data, Utils, dialogs, VisitorsService, ScheduleService, AppService, $filter){
	
	init();
	
	/**
	 * Initialize the popup controller
	 *
	 * @param null
	 */
	function init() {
		
		$scope.webcamSupported = _.includes(['chrome', 'firefox', 'opera'], AppService.getBrowserType());
		
		$scope.visitorTypes = [
			{id: 'visitor', name: $rootScope.translation.SCHEDULE.NON_GE_VISITOR},
			{id: 'geemployee', name: $rootScope.translation.SCHEDULE.GE_EMPLOYEE},			
			{id: 'pastvisitor', name: $rootScope.translation.SCHEDULE.PAST_VISITOR}
		];
		
		$scope.visitorType = 'visitor';
		
		$scope.onEditPage = angular.isDefined(data);
		
		$scope.item = {};
		
		$scope.item.startDate = $scope.item.endDate = new Date();
		
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
			
			if(type == 'start') {
				$scope.startOpened = true;
				$scope.endOpened = false;
			} else {
				$scope.startOpened = false;
				$scope.endOpened = true;
			}
		}
		
		/**
		 * Disabling the past date in the arrival calender
		 */
		$scope.showMinDate = function(){
			$scope.minDate = new Date();
		}; 
		
		$scope.showMinDate();
		
		/**
		 * Limiting the arrival calender to 30 days duraton
		 */
		$scope.showMaxDate = function(){
			//$scope.maxDate = new Date((new Date()).getTime() + 30*24*60*60*1000);
		};
		
		$scope.showMaxDate();
		
		/**
		 * Disabling the end date from selecting an old date than arrival date
		 */
		$scope.showEndMinDate = function(){
			$scope.minEndDate = $scope.item.startDate;
		};
		
		$scope.showEndMinDate();
		
		/**
		 * Disabling the end date from selecting an old date than arrival date
		 */
		$scope.showEndMaxDate = function(){
			//$scope.maxEndDate = new Date();
		};
		
		$scope.showEndMaxDate();
		
		/**
		 * Updating the new departure minimum date
		 */
		$scope.changeEndDate = function(){
			
			if($scope.item.startDate > $scope.item.endDate) {
				$scope.item.endDate = $scope.item.startDate;
			}
			
			$scope.showEndMinDate();
		}
		
		// updating the record
		if(angular.isDefined(data)) {
			
			$scope.item = data;
			
			$scope.item.startDate	= $filter('date')(data.startDate, $rootScope.config.dateFormat);
			$scope.item.endDate		= $filter('date')(data.endDate, $rootScope.config.dateFormat);
			
			var startDate = createDateTime($filter('date')(new Date($scope.item.startDate), 'yyyy-MM-dd'), '00:00:00');
			var minDate = createDateTime($filter('date')(new Date($scope.minDate), 'yyyy-MM-dd'), '00:00:00');
			
			$scope.minDate = (startDate < minDate) ? startDate : $scope.minDate;
			
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
			
			VisitorsService.getBannedVisitor(data.recordId).then(function(response){
				
				var exc = AppService.checkException($scope, response.data.exception);
				
				if(!exc){
					$scope.item.datastream = response.data.data.datastream;
				}
			});
			
		}
	}
	
	/**
	 * Update banned visitor
	 * based on the selected search type
	 *
	 * @param null
	 */
	$scope.switchLookup = function(){
		
		$scope.item.geUser = null;
		$scope.item.pastVisitor = null;
		
		$scope.item.recordId	= null;
		$scope.item.visitorId	= null;
		$scope.item.sso 		= null;
		$scope.item.firstName 	= null;
		$scope.item.lastName 	= null;
		$scope.item.email 		= null;
		$scope.item.datastream	= null;
		$scope.item.visitorPic	= null;
	};
	
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
	 * Lookup for sso users
	 *
	 * @param viewValue string
	 */
	$scope.getGEUsers = function(viewValue){
		
		return ScheduleService.getGEUsers(viewValue).then(function(response){
			
			var items = response.data['json-service']['services'][0]['response']['data'];
			
			var users = [];
			
			angular.forEach(items, function(item){
				
				users.push({
					sso			: item[0],
					name		: item[1]+' ('+item[0]+')',
					firstName   : item[1].split(', ')[0],
					lastName    : item[1].split(', ')[1],
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
		
		$scope.item.visitorId	= $item.visitorId;
		$scope.item.sso			= $item.sso;
		$scope.item.firstName	= $item.firstName;
		$scope.item.lastName	= $item.lastName;
		$scope.item.email		= $item.email;
		
		Utils.isImage($scope.item.sso).then(function(result) {
			
			$scope.showAvatar = result;
		});
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
					firstName	: item.firstName,
					lastName	: item.lastName,
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
		
		$scope.item.visitorId	= $item.recordId;
		$scope.item.sso			= $item.sso;
		$scope.item.firstName	= $item.firstName;
		$scope.item.lastName	= $item.lastName;
		$scope.item.email		= $item.email;
		$scope.item.datastream	= $item.datastream;
		$scope.item.visitorPic	= $item.visitorPic;
		
		Utils.isImage($scope.item.sso).then(function(result) {
			
			$scope.showAvatar = result;
		});
		
		// if uploaded img is available, push that to the current model
		if($scope.item.visitorPic) {
			
			VisitorsService.getVisitorPic($item.recordId).then(function(response){
				
				var exc = AppService.checkException($scope, response.data.exception);
				
				if(!exc){
					$scope.item.datastream = response.data.data.datastream;
				}
			});
		}
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
     * Help popup
	 *
     * @param null
     */
    $scope.help = function (){
        $rootScope.page = "bannedvisitors";
		var dlg = dialogs.create('app/partials/help.html', 'HelpController', {}, {keyboard: false, backdrop: 'static', size: 'md'});
		
		dlg.result.then(function(name){
			
		},function(){
			
		});
	};
	
}]);