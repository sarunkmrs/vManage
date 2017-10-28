/**************************************************************************
	
	Breaking AngularJS apps into the following folder structure:
	
	/app
		/controllers      
		/directives
		/languages
		/partials
		/services
		/views
	
 **************************************************************************/
	
	APP.LANGUAGES = [];
	
	APP.USER = {};
	
	/**
	 * APP User levels
	 */
	APP.USER.ROLES = {
		SUPER_ADMIN:		1,
		LOCAL_ADMIN:		2,
		RECEPTION_GUARD:	4,
		EMPLOYEE:			8,
		CONTRACTOR:			16
	};
	
	/**
	 * APP User page access levels
	 */
	APP.PAGEACCESS = {};
	
	APP.PAGEACCESS.dashboard =(APP.USER.ROLES.SUPER_ADMIN | APP.USER.ROLES.LOCAL_ADMIN | APP.USER.ROLES.RECEPTION_GUARD);
	
	APP.PAGEACCESS.myvisitors = (APP.USER.ROLES.SUPER_ADMIN | APP.USER.ROLES.LOCAL_ADMIN | APP.USER.ROLES.RECEPTION_GUARD | APP.USER.ROLES.EMPLOYEE | APP.USER.ROLES.CONTRACTOR);
	
	APP.PAGEACCESS.schedule = (APP.USER.ROLES.SUPER_ADMIN | APP.USER.ROLES.LOCAL_ADMIN | APP.USER.ROLES.RECEPTION_GUARD | APP.USER.ROLES.EMPLOYEE | APP.USER.ROLES.CONTRACTOR);
	
	APP.PAGEACCESS.bulkschedule = (APP.USER.ROLES.SUPER_ADMIN | APP.USER.ROLES.LOCAL_ADMIN | APP.USER.ROLES.RECEPTION_GUARD | APP.USER.ROLES.EMPLOYEE | APP.USER.ROLES.CONTRACTOR);
	
	APP.PAGEACCESS.reports = (APP.USER.ROLES.SUPER_ADMIN | APP.USER.ROLES.LOCAL_ADMIN | APP.USER.ROLES.RECEPTION_GUARD);
	
	APP.PAGEACCESS.settings = (APP.USER.ROLES.SUPER_ADMIN | APP.USER.ROLES.LOCAL_ADMIN);
	
	APP.PAGEACCESS.admin = (APP.USER.ROLES.SUPER_ADMIN | APP.USER.ROLES.LOCAL_ADMIN);
	
	APP.PAGEACCESS.bannedvisitors = (APP.USER.ROLES.SUPER_ADMIN | APP.USER.ROLES.LOCAL_ADMIN);
	
	APP.PAGEACCESS.bannedschedules = (APP.USER.ROLES.SUPER_ADMIN | APP.USER.ROLES.LOCAL_ADMIN);
	
	APP.PAGEACCESS.badge = (APP.USER.ROLES.SUPER_ADMIN | APP.USER.ROLES.LOCAL_ADMIN);
	
	APP.PAGEACCESS.noaccess = 0;
	
	/**
	 * Setup the user type/role 
	 * and landing page
	 */
	function initUser() {
		
		if(APP.CONFIG.data.noaccess) {
			
			// No access
			APP.USER.ROLE = 0;
			APP.USER.LANDING = 'noaccess';
			
		} else {
			
			var userType = angular.isDefined(APP.CONFIG.data.user.type) ? APP.CONFIG.data.user.type : undefined;
			
			APP.USER.ROLE = angular.isDefined(userType) ? APP.USER.ROLES[userType] : 0;
			
			// Get user role & landing page
			switch(userType){
				case 'SUPER_ADMIN':
					APP.USER.LANDING = 'dashboard';
				break;
				case 'LOCAL_ADMIN':
					APP.USER.LANDING = 'dashboard';
				break;
				case 'RECEPTION_GUARD':
					APP.USER.LANDING = 'dashboard';
				break;
				case 'EMPLOYEE':
					APP.USER.LANDING = 'myvisitors';
				break;
				case 'CONTRACTOR':
					APP.USER.LANDING = 'myvisitors';
				break;
				case undefined:
					APP.USER.LANDING = 'noaccess';
				break;
				default:
					APP.USER.LANDING = 'myvisitors';
				break;
			}
		}
	}
	
	/***************************************** ANGULAR STARTS HERE *****************************************/
	
	/**
	 * APP global object
	 *
	 * Holds the global app object for the entire application
	 * @type: MODULE
	 */
	var app = angular.module('vmApp', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngAnimate', 'ui.bootstrap', 'dialogs.main', 'angularFileUpload', 'xeditable', 'infinite-scroll', 'countTo', 'ui.select', 'angulartics', 'angulartics.google.analytics', 'FBAngular', 'gridster', 'gm.datepickerMultiSelect', 'checklist-model', 'ngToast']);
	
	/**
	 * APP config
	 *
	 * Holds the aplication routing and configurations
	 * @type: CONFIGURATION
	 */
	app.config(['$routeProvider', 'ngToastProvider', '$analyticsProvider', function($routeProvider, ngToastProvider, $analyticsProvider){
		
		/**
		 * Initialize user
		 * set user type
		 * build user access list
		 * set the landing page
		 */
		initUser();
		
		$routeProvider
			.when('/dashboard', {
				controller: 'DashboardController',
				templateUrl: 'app/partials/dashboard.html',
				requireLogin: true,
				access: APP.PAGEACCESS['dashboard']
			})
			.when('/schedule/:scheduleID/:parentPage', {
				controller: 'ScheduleController',
				templateUrl: 'app/partials/schedule.html',
				requireLogin: true,
				access: APP.PAGEACCESS['schedule']
			})
			.when('/schedule', {
				controller: 'ScheduleController',
				templateUrl: 'app/partials/schedule.html',
				requireLogin: true,
				access: APP.PAGEACCESS['schedule']
			})
            .when('/bulkschedule', {
				controller: 'BulkScheduleController',
				templateUrl: 'app/partials/bulk-schedule.html',
				requireLogin: true,
				access: APP.PAGEACCESS['bulkschedule']
			})
			.when('/reports', {
				controller: 'ReportsController',
				templateUrl: 'app/partials/reports.html',
				requireLogin: true,
				access: APP.PAGEACCESS['reports']
			})
			.when('/myvisitors', {
				controller: 'MyVisitorController',
				templateUrl: 'app/partials/my-visitor.html',
				requireLogin: true,
				access: APP.PAGEACCESS['myvisitors']
			})
			.when('/settings', {
				controller: 'SettingsController',
				templateUrl: 'app/partials/settings.html',
				requireLogin: true,
				access: APP.PAGEACCESS['settings']
			})
			.when('/admin', {
				controller: 'AdminController',
				templateUrl: 'app/partials/admin.html',
				requireLogin: true,
				access: APP.PAGEACCESS['admin']
			})
			.when('/bannedvisitors', {
				controller: 'BannedVisitorController',
				templateUrl: 'app/partials/banned-visitors.html',
				requireLogin: true,
				access: APP.PAGEACCESS['bannedvisitors']
			})
			.when('/bannedschedules', {
				controller: 'BannedScheduleController',
				templateUrl: 'app/partials/banned-schedules.html',
				requireLogin: true,
				access: APP.PAGEACCESS['bannedschedules']
			})
			.when('/badge', {
				controller: 'BadgeController',
				templateUrl: 'app/partials/badge.html',
				requireLogin: true,
				access: APP.PAGEACCESS['badge']
			})
			.when('/noaccess', {
				controller: 'NoaccessController',
				templateUrl: 'app/partials/noaccess.html',
				requireLogin: false,
				access: 0
			})
			.otherwise({redirectTo: '/'+APP.USER.LANDING})
		;
		
		/**
		 * ngToast directive configurations
		 */
		/*ngToastProvider.configure({
			animation: 'slide' // or 'fade'
		});*/
		
		
		// turn off automatic tracking
		$analyticsProvider.virtualPageviews(true);
		
	}]).run(['$rootScope', '$location', 'editableOptions', '$templateCache', function($rootScope, $location, editableOptions, $templateCache){
		
		/**
		 * Set bootstrap theme for xeditable
		 */
		editableOptions.theme = 'bs3';
		
		/**
		 * Check if the user has the permission to view the page
		 * Otherwise redirect to the default landing page for that user.
		 */
		$rootScope.$on('$routeChangeStart', function(event, next, current){
			
			if(next.requireLogin && !(next.access & APP.USER.ROLE)) {
				$location.path('/'+APP.USER.LANDING);
			}
		});
		
		/**
		 * Update the tooltip template
		 */
		$templateCache.put('template/tooltip/tooltip-html-unsafe-popup.html', 
		 	'<div class="tooltip {{placement}}{{popupClass}}" ng-class="{ in: isOpen(), fade: animation() }">'+
				'<div class="tooltip-arrow"></div>'+
  				'<div class="tooltip-inner" bind-html-unsafe="content"></div>'+
			'</div>'
		);
	}]);
	

/**
 * Admin controller
 *
 * Controller for the global level CRUD operations
 * @type: CONTROLLER
 */
app.controller('AdminController', ['$scope', '$rootScope', function($scope, $rootScope) {
	
	if (!$rootScope.location) {
		return false;
	}
	
	init();
	
	/**
	 * Form initalization
	 */
	function init() {
		
		$scope.pageList = [
			{name: $scope.translation.ADMIN.USER_MENU, type: 'user', icon: 'fa-user', url: 'app/partials/admin-templates/user-management.html'},
			{name: $scope.translation.ADMIN.LOCATION_MENU, type: 'location', icon: 'fa-map-marker', url: 'app/partials/admin-templates/location-settings.html'}
		];
		
		$scope.pageName 	= $scope.pageList[0].name;
		$scope.pageIcon 	= $scope.pageList[0].icon;
		$scope.pageTemplate = $scope.pageList[0].url;
		
		// set report title
		$scope.translation.REPORTS.TYPE = $scope.translation.VISITOR_REPORTS.TITLE;
	}
	
	/**
	 * Update reports
	 * for the location change
	 *
	 * @param null
	 */
	$scope.changeLocation = function(location) {
		
		$rootScope.location = location;
		
		//Broadcast location change
		$rootScope.$broadcast('locationChange', location);
	};
	
	/**
	 * Change report
	 */
	$scope.changeAdmin = function(selection) {
		
		$scope.pageName 	= selection.name;
		$scope.pageIcon 	= selection.icon;
		$scope.pageTemplate = selection.url;
	};
	
	/**
	 * Update the page list
	 * on language change
	 *
	 * @param null
	 */
	$scope.$on('languageChange', function() {
		
		$scope.pageList = [
			{name: $scope.translation.ADMIN.USER_MENU, type: 'user', icon: 'fa-user', url: 'app/partials/admin-templates/user-management.html'},
			{name: $scope.translation.ADMIN.LOCATION_MENU, type: 'location', icon: 'fa-map-marker', url: 'app/partials/admin-templates/location-settings.html'}
		];
		
		angular.forEach($scope.pageList, function(page){
			
			if(page.url == $scope.pageTemplate) {
				$scope.pageName = page.name;
			}
		});
	});
}]);
/**
 * App controller
 *
 * Controller for the global level CRUD operations
 * @type: CONTROLLER
 */
app.controller('AppController', ['$scope', '$rootScope', '$cookies', '$location', '$timeout', 'AppService', 'Utils', 'Fullscreen', function($scope, $rootScope, $cookies, $location, $timeout, AppService, Utils, Fullscreen){
	
	init();
	
	/**
	 * Initialize the root level app controller
	 *
	 * @param null
	 */
	function init() {
        
		/**
		 * Global settings
		 */
		$rootScope.config = {};
		$rootScope.config.dateFormat = 'MMM d, y';
		$rootScope.config.today = new Date();
		
		/**
		 * Set app access
		 */
		$scope.access = true;
		$scope.errorCode = false;
		
		
		// avatar picture
		$scope.showAvatar = false;
		
		/**
		 * Check master data
		 * Check exception
		 * Check user object
		 * Check locations
		 * Set languages
		 */
		if(APP.CONFIG == null || angular.isUndefined(APP.CONFIG.data) || APP.CONFIG.data == null) {
			
			$scope.access = false;
			
		} else {
			
			/**
			 * initialize the global level variables
			 */
			var config = APP.CONFIG.data;
			
			/**
			 * User checking
			 */
			if(angular.isUndefined(config.user) || config.user == null || angular.isUndefined(config.user.sso)) {
				$scope.access = false;
			} else {
				
				$scope.user = config.user;
				
				/**
				 * Check for avatar picture
				 *
				 * @param null
				 * @return bool
				 */
				Utils.isImage($scope.user.sso).then(function(result) {
					
					$scope.showAvatar = result;
				});
			}
			
			/**
			 * Location checking
			 */
			if(config.locations.length == 0) {
				$scope.access = false;
			} else {
				
				/**
				 * Set the home location
				 */
				$rootScope.location = '';
				$rootScope.locations = config.locations;
				
				angular.forEach($rootScope.locations, function(location){
					if(location.isHome){
						$rootScope.location = location.id;
					}
				});
			}
			
			/**
			 * Set the preferred language
			 */
			var preferred = false;
			$rootScope.languages = config.languages;
			
			angular.forEach($rootScope.languages, function(language){
				if(language.isPreferred){
					preferred = language.code;
				}
			});
			
			if(angular.isUndefined(APP.CONFIG.data.user)){
				preferred = 'en-GB'
			}
			
			$cookies.langCode = (!$cookies.langCode) ? preferred : $cookies.langCode;
			$rootScope.langCode = $cookies.langCode;
			
			/**
			 * Load the app language file
			 */
			$rootScope.translation = APP.LANGUAGES[$cookies.langCode];
		}
	}
	
	/**
	 * Change the language
	 *
	 * @param language string
	 */
	$scope.changeLanguage = function(language){
		
		$cookies.langCode = language;
		$rootScope.langCode = $cookies.langCode;
		
        /**
		 * Load the app language file
		 */
		$rootScope.translation = APP.LANGUAGES[$cookies.langCode];
		
		/**
		 * Broadcast the language change
		 * so tat the placeholder directive can update it
		 */
		$rootScope.$broadcast('languageChange');
		
		/**
		 * Chaeck for access
		 */
        if(APP.CONFIG.exception.status == true) {
			$scope.access = false;
			AppService.showMessage('danger', $rootScope.translation.GLOBAL[APP.CONFIG.exception.code]);			
		}
	};
	
	/**
	 * Show menu based on user type
	 *
	 * @param viewLocation string
	 */
	$scope.showMenu = function(viewLocation){
		
		var ACCESS = APP.PAGEACCESS.hasOwnProperty(viewLocation) ? APP.PAGEACCESS[viewLocation] : APP.PAGEACCESS['noaccess'];
		
		return (APP.USER.ROLE & ACCESS);
	};
	
	/**
	 * Check for the current menu
	 *
	 * @param viewLocation string
	 */
	$scope.isActiveMenu = function(viewLocation){
		
		return ($location.path().indexOf(viewLocation) != -1);
	};
	
	/**
	 * Close message box
	 *
	 * @param null
	 */
    $scope.closeMessage = function(){
		
        $scope.message.type = '';
        $scope.message.text = '';
        $scope.message.show = false;
    };
    
    /**
     * Application Logout 
     */
    $scope.logout = function (){
        
		var logoffUri = '';
        var referrer  = $location.absUrl().split('#')[0];
		
		if($location.host() == 'securityportal.corporate.ge.com') {
			logoffUri = 'https://ssousflogin.corporate.ge.com/logoff/logoff.jsp?referrer=';
		} else {
			logoffUri = 'https://ssousflogin.stage.corporate.ge.com/logoff/logoff.jsp?referrer=';
		}
		
		logoffUri = logoffUri+referrer+'?rnd='+Math.random();
        window.location	= logoffUri;
    }
	
	/**
	 * Check for user authorisation
	 * if not logout user
	 * SMSESSION
	 */
	if(angular.isUndefined($cookies.SMSESSION) || $cookies.SMSESSION === null) {
		//$scope.logout();
	}
	
	/**
	 * Toggle full screen
	 *
	 * @param null
	 */
	Fullscreen.$on('FBFullscreen.change', function(){
		
		$timeout(function(){
			$scope.inFullScreen = Fullscreen.isEnabled();
		});
	});
	
	$scope.toggleFullScreen = function(){
		
		Fullscreen.isEnabled() ? Fullscreen.cancel() : Fullscreen.all();
	};
	
}]);

/**
 * Badge controller
 *
 * Controller for the badge CRUD operations
 * @type: CONTROLLER
 */
app.controller('BadgeController', ['$scope', '$rootScope', function($scope, $rootScope) {
	
	if (!$rootScope.location) {
		return false;
	}
	
	init();
	
	/**
	 * Initalize form
	 */
	function init() {
		
		$scope.gridsterOptions = {
			margins: [5, 5],
			columns: 4,
			draggable: {
				handle: 'h3'
			}
		};
		
		$scope.dashboards = {
			'1': {
				id: '1',
				name: 'Home',
				widgets: [{
					col: 0,
					row: 0,
					sizeY: 1,
					sizeX: 1,
					name: "Widget 1"
				}, {
					col: 2,
					row: 1,
					sizeY: 1,
					sizeX: 1,
					name: "Widget 2"
				}]
			},
			'2': {
				id: '2',
				name: 'Other',
				widgets: [{
					col: 1,
					row: 1,
					sizeY: 1,
					sizeX: 2,
					name: "Other Widget 1"
				}, {
					col: 1,
					row: 3,
					sizeY: 1,
					sizeX: 1,
					name: "Other Widget 2"
				}]
			}
		};

		$scope.clear = function() {
			$scope.dashboard.widgets = [];
		};

		$scope.addWidget = function() {
			$scope.dashboard.widgets.push({
				name: "New Widget",
				sizeX: 1,
				sizeY: 1
			});
		};

		$scope.$watch('selectedDashboardId', function(newVal, oldVal) {
			if (newVal !== oldVal) {
				$scope.dashboard = $scope.dashboards[newVal];
			} else {
				$scope.dashboard = $scope.dashboards[1];
			}
		});

		// init dashboard
		$scope.selectedDashboardId = '1';
		
	}
	
}]);
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
/**
 * Photo capture controller
 *
 * Controller for capturing webcam picture
 * @type: CONTROLLER
 */
app.controller('CaptureController', ['$scope', '$timeout', '$uibModalInstance', function($scope, $timeout, $uibModalInstance){
	
	init();
	
	/**
	 * Initialize the root level app controller
	 *
	 * Check for media support
	 * Get the browser specific media object
	 * Start the video playback
	 *
	 * @param null
	 */
	function init() {
		
		$scope.notSupported	= false;
		$scope.notStarted	= false;
		
		(function() {
		 	// GetUserMedia is not yet supported by all browsers
		 	// Until then, we need to handle the vendor prefixes
		 	navigator.getMedia = (
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia ||
				navigator.msGetUserMedia
			);
			
		  	// Checks if getUserMedia is available on the client browser
		  	window.hasUserMedia = function hasUserMedia() {
				return navigator.getMedia ? true : false;
		  	};
		})();
		
		/**
		 * Final base64 encoded string of image
		 */
		$scope.datastream = null;
		
		/**
		 * Check for capture support
		 *
		 * @param null
		 * @return bool
		 */
		$timeout(function(){
			
			// Check the availability of getUserMedia across supported browsers
			if (!window.hasUserMedia()) {
				$timeout(function(){ $scope.notSupported = true; });
				return;
			}
			
			$scope.video = document.getElementById('video');
          	$scope.video.setAttribute('autoplay', '');
		  	
			$scope.canvas = document.getElementById('canvas');
			$scope.context = $scope.canvas.getContext('2d');
			
			$scope.localMediaStream = null;
			
			/**
			 * Put video listeners into place
			 */
			var params = {video: true, audio: false};
			
			navigator.getMedia(params, function(stream) {
					
					// Firefox supports a src object
					if (navigator.mozGetUserMedia) {
						$scope.video.mozSrcObject = stream;
					} else {
						var url = window.URL || window.webkitURL;
						$scope.video.src = url.createObjectURL(stream);
					}
					
					$scope.localMediaStream = stream;
					
					// Set the canvas dimensions
					setCanvasSize();
					
					/* Start playing the video to show the stream from the webcam */
					$scope.video.play();
					
				}, function(error){
					$timeout(function(){ $scope.notStarted = true; });
				}
			);
		});
	}
	
	/**
	 * video.onloadedmetadata
	 * not firing in Chrome so we have to hack
	 */
	function setCanvasSize() {
		// teppu
  		$timeout(function() {
    		$scope.canvas.width	 = 240;$('#video').innerWidth();//$scope.video.videoWidth;
    		$scope.canvas.height = 200;$('#video').innerHeight();//$scope.video.videoHeight;
  		});
	}
	
	/**
	 * Capture the photo
	 *
	 * @param null
	 */
	$scope.ok = function(){
		
		if($scope.video) {
			
			$scope.context.drawImage($scope.video, 0, 0, $scope.canvas.width, $scope.canvas.height);
			// another theppu
			var idata = $scope.context.getImageData(0, 0, $scope.canvas.width, $scope.canvas.height);
			$scope.context.putImageData(idata, 0, 0);
			
			$scope.datastream = $scope.canvas.toDataURL();
			
			$scope.stop();
			
			$uibModalInstance.close($scope.datastream);
        }
	};
	
	/**
	 * Cancel capture
	 *
	 * @param null
	 */
	$scope.cancel = function(){
		
		$scope.stop();
		$uibModalInstance.dismiss('canceled');
	};
	
	/**
	 * Stop the camera
	 */
	$scope.stop = function(){
		
		/*$scope.video.pause();
		
		if(angular.isObject($scope.localMediaStream)) {
			$scope.localMediaStream.stop(); // Doesn't do anything in Chrome.		
		};*/
		
		if (!!$scope.localMediaStream ) {
			
			var checker = typeof $scope.localMediaStream.getVideoTracks === 'function';
			if($scope.localMediaStream.getVideoTracks && checker) {
				// get video track to call stop in it
				// videoStream.stop() is deprecated and may be removed in the
				// near future
				// ENSURE THIS IS CHECKED FIRST BEFORE THE FALLBACK
				// videoStream.stop()
				var tracks = $scope.localMediaStream.getVideoTracks();
				if (tracks && tracks[0] && tracks[0].stop) {
					tracks[0].stop();
				}
			} else if ($scope.localMediaStream.stop) {
				// deprecated, may be removed in the near future
				$scope.localMediaStream.stop();
			}
		}
	};
}]);
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
/**
 * Location settings controller
 *
 * Controller for the global level CRUD operations
 * @type: CONTROLLER
 */
app.controller('LocationSettingsController', ['$scope', '$rootScope', 'AppService', 'LocationSettingsService', function($scope, $rootScope, AppService, LocationSettingsService) {
	
	if (!$rootScope.location) {
		return false;
	}
	
	init();
	
	/**
	 * Form initalization
	 */
	function init() {
		
		$scope.loc = {};
		$scope.loc.settings = {};
		
		/**
         * Getting the location settings
         */
        LocationSettingsService.getSettings().then(function(response){
          	
			AppService.checkException($scope, response.data.exception);
			
			$scope.customFields = response.data.data;
			
			angular.forEach($scope.customFields, function(item){
				
				$scope.loc.settings[item.key] = item.selectedValue;
			});
			
			$scope.master = angular.copy($scope.loc);
        });
	}
	
	/**
	 * Save settings
	 *
	 * @param null
	 */
	$scope.save = function () {
		
		if($scope.locationSettingsForm.$invalid) {return false;}
		
		$('.actionBtn').attr('disabled', 'disabled');
		
		LocationSettingsService.save($scope.loc.settings).then(function(response){
			
			$('.actionBtn').removeAttr('disabled');
			
			var exc = AppService.checkException($scope, response.data.exception);
			
			if(!exc) {
				
				// show message through service call
				AppService.showMessage('success', $scope.translation.LOCATION.SAVED);
				
				// update the location listing in the root scope
				$rootScope.locations = response.data.data.locations;
				
				$scope.master = angular.copy($scope.loc);
			}
		});
	};
	
	/**
	 * Reset form
	 *
	 * @param null
	 */
	$scope.reset = function(){
		
		$scope.loc = angular.copy($scope.master);
	};
	
	/**
	 * Update the selectbox list
	 * on location change
	 *
	 * @param null
	 */
	$scope.$on('locationChange', function() {
		
		/**
         * Getting the location settings
         */
        LocationSettingsService.getSettings().then(function(response){
          	
			AppService.checkException($scope, response.data.exception);
			
			$scope.customFields = response.data.data;
			
			angular.forEach($scope.customFields, function(item){
				
				$scope.loc.settings[item.key] = item.selectedValue;
			});
			
			$scope.master = angular.copy($scope.loc);			
        });
	});
	
}]);
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
/**
 * Reports controller
 *
 * Controller for reports
 * @type: CONTROLLER
 */
app.controller('ReportsController', ['$scope', '$rootScope', 'AppService', function($scope, $rootScope, AppService){
    
	if(!$rootScope.location){
		return false;
	}
	
    init();
    
    /**
     * Form initalization
     */
    function init() {
		
		$scope.reports = [
			{name: $scope.translation.VISITOR_REPORTS.TITLE, type: 'visitor-history', icon:'fa-signal', url:'app/partials/report-templates/visitor-history.html'}
		];
		
		$scope.reportName = $scope.reports[0].name;
		$scope.reportIcon = $scope.reports[0].icon;
		$scope.ReportTemplate = $scope.reports[0].url;
	    // set report title
		$scope.translation.REPORTS.TYPE = $scope.translation.VISITOR_REPORTS.TITLE;
    }
	
	/**
	 * Update reports
	 * for the location change
	 *
	 * @param null
	 */
	$scope.changeLocation = function(location){
       	
	   	// Update user access
		AppService.updateUserAccess(location);
		
		$rootScope.location = location;
	};
	
	/**
	 * Update the report title
	 * on language change
	 *
	 * @param null
	 */
	$scope.$on('languageChange', function() {
				
		// set report title
		$scope.translation.REPORTS.TYPE = $scope.translation.VISITOR_REPORTS.TITLE;
	});
	
	/**
	 * Change report
	 */
	$scope.changeReport = function(report) {
		
		$scope.reportName = report.name;
		$scope.reportIcon = report.icon;
		$scope.ReportTemplate = report.url;
	}
	
	/**
	 * Update the report list
	 * on language change
	 *
	 * @param null
	 */
	$scope.$on('languageChange', function() {
		
		$scope.reports = [
			{name: $scope.translation.VISITOR_REPORTS.TITLE, type: 'visitor-history', icon:'fa-signal', url:'app/partials/report-templates/visitor-history.html'}
		];
		
		$scope.reportName = $scope.reports[0].name;
	});
}]);
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
/**
 * Settings controller
 *
 * Controller for the global level CRUD operations
 * @type: CONTROLLER
 */
app.controller('SettingsController', ['$scope', '$rootScope', '$cookies', '$location', '$timeout', function($scope, $rootScope, $cookies, $location, $timeout){
	
	$scope.isCollapsedUser = false;
	$scope.isCollapsedLocation = false;

}]);

/**
 * Users controller
 *
 * Controller for the global level CRUD operations
 * @type: CONTROLLER
 */
app.controller('UsersController', ['$scope', '$rootScope', 'AppService', 'UsersService', 'ScheduleService', 'Utils', 'dialogs', '$filter', '$timeout', function($scope, $rootScope, AppService, UsersService, ScheduleService, Utils, dialogs, $filter, $timeout) {

  if (!$rootScope.location) {
    return false;
  }

  init();

  /**
   * Update Location 
   * on location change
   *
   * @param locationid
   */
  $scope.$on('locationChange', function(event,data) {
    
    $rootScope.location = data;
    
    // Update guardList for location change
    AppService.updateUserAccess($rootScope.location);
	
    init();
  });
  
  /**
   * Update the title Field
   * on language change
   *
   * @param null
   */
  $scope.$on('languageChange', function() {
    
    $scope.panes[0].title = $scope.translation.USERS.ADD_USERS;
    $scope.panes[1].title = $scope.translation.USERS.EDIT_USERS;
	
	angular.forEach($scope.access, function(access) {
		access.name = $scope.translation.USERS[access.id]
	});
  });
  
  function init() {
    
    // need to find an alternative for this
    $scope.currentUserSSO = APP.CONFIG.data.user.sso;

    $scope.user = {};
    $scope.users = [];
    
    $scope.panes = [
      { title:$scope.translation.USERS.ADD_USERS, template:"app/partials/admin-templates/user/add-user.html" },
      { title:$scope.translation.USERS.EDIT_USERS, template:"app/partials/admin-templates/user/edit-user.html", active: true}
    ];
    $scope.currentTab = $scope.panes[1].template;
    loadUsers();
  }
  
  /**
   * Tab navigation
   *
   * @param null
   * @return bool
   */
  $scope.onClickTab = function(pane) {
    
    $scope.currentTab = pane.template;
    
    angular.forEach($scope.panes, function(tab) {
      tab.active = false;
    });
    
    pane.active = true;
  }

  /**
   * Check for avatar picture
   *
   * @param null
   * @return bool
   */
  function updateAvatar() {

    angular.forEach($scope.users, function(user) {

      user.sso = (angular.isUndefined(user.sso) || user.sso === null) ? '' : user.sso;

      user.showAvatar = false;

      Utils.isImage(user.sso).then(function(result) {

        user.showAvatar = result;
      });
    });
  }

  /**
   * Getting the users list
   */
  function loadUsers() {

    UsersService.getUsers().then(function(response) {
		
      AppService.checkException($scope, response.data.exception);
		
		$scope.users = response.data.data.users;
		$scope.access = response.data.data.access;
		
		angular.forEach($scope.access, function(access) {
			access.name = $scope.translation.USERS[access.id]
		});
		
	  updateAvatar();
    });
  }

  /**
   * Lookup for sso users
   *
   * @param viewValue string
   */
  $scope.getUsers = function(viewValue) {

    return ScheduleService.getGEUsers(viewValue).then(function(response) {

      var items = response.data['json-service']['services'][0]['response']['data'];

      var users = [];

      angular.forEach(items, function(item) {

        var phone = (angular.isUndefined(item[5]) || item[5] === null) ? false : item[5];

        if (!phone) {
          phone = (angular.isUndefined(item[4]) || item[4] === null) ? false : item[4];
          if (!phone) {
            phone = (angular.isUndefined(item[3]) || item[3] === null) ? false : item[3];
          }
        }

        users.push({
          sso: item[0],
          name: item[1] + ' (' + item[0] + ')',
          firstName: item[1].split(', ')[0],
          lastName: item[1].split(', ')[1],
          phone: phone,
          email: item[6],
          company: item[2]
        });
      });

      return users;
    });
  }

  /**
   * Update the model upon selecting an user
   *
   * @param item obj
   * @param model obj
   * @param label string
   */
  $scope.onSelectUser = function($item, $model, $label) {

    var userExists = false;

    /**
     * Check for existing user
     */
    angular.forEach($scope.users, function(item) {

      var sso = (angular.isUndefined(item.sso) || item.sso === null) ? '' : item.sso;

      if ($item.sso == sso) {
        userExists = true;
      }
    });

    if (userExists) {
      AppService.showMessage('danger', $rootScope.translation.USERS.EXISTING);
      $scope.resetForm();
    } else {
      $scope.user = {};
      angular.extend($scope.user, $item);
    }
  }

  /**
   * Add a Users to a location
   *
   * @param user obj
   */
  $scope.addUser = function() {

    if (angular.isUndefined($scope.user.access)) {
      return false;
    }

    UsersService.addUser($scope.user).then(function(response) {

      var exc = AppService.checkException($scope, response.data.exception);

      if (!exc) {
        // show message through service call
        AppService.showMessage('success', $rootScope.translation.USERS.ADDED);
        
        $scope.resetForm();
        $scope.currentTab = $scope.panes[1].template;
        angular.forEach($scope.panes, function(tab) {
          tab.active = false;
        });
		$scope.panes[1].active = true;
        loadUsers();
      }
    });
  }

  /**
   * Remove an user
   *
   * @param $scope Obj
   */
  $scope.remove = function(user, $index) {

    dialogs.confirm(
      $rootScope.translation.DASHBOARD.DELETE_TITLE,
      $rootScope.translation.USERS.DELETE_CONFIRMATION,
	  {keyboard: false, backdrop: 'static', size: 'md'}
    ).result.then(function(btn) {
      var data = {
        sso: user.sso,
        access: user.access
      };

      UsersService.removeUser(data).then(function(response) {

        var exc = AppService.checkException($scope, response.data.exception);

        if (!exc) {
          // removing a schedule from the list
          $scope.users.splice($index, 1);

          // show message through service call
          AppService.showMessage('success', $rootScope.translation.USERS.DELETED);
        }
      });

    }, function(btn) {
    });
  }

  /**
   * Help popup
   *
   * @param null
   */
  $scope.help = function() {
    $rootScope.page = 'myusers';
    var dlg = dialogs.create('app/partials/help.html', 'HelpController', {}, {keyboard: false, backdrop: 'static', size: 'md'});

    dlg.result.then(function(name) {

    }, function() {

    });
  }

  /**
   * To display access level
   * 
   * @param user obj
   */
  $scope.showAccessLevel = function(user) {
    if (user.access && $scope.access.length) {
      var selected = $filter('filter')($scope.access, {"id": user.access});
      return selected.length ? $rootScope.translation.USERS[selected[0].id] : 'Not set';
    } else {
      return $rootScope.translation.USERS[user.access] || 'Not set';
    }
  };

  /**
   * Update user access level
   *
   * @param access obj
   */
  $scope.saveUser = function(data, sso) {

    angular.extend(data, {sso: sso});

    UsersService.updateAccessLevel(data).then(function(response) {

      var exc = AppService.checkException($scope, response.data.exception);

      if (!exc) {
        // show message through service call
        AppService.showMessage('success', $rootScope.translation.USERS.UPDATED);
      } else {
        init();
      }
    });
  }

  /**
   * Reset form
   *
   * @param null
   */
  $scope.resetForm = function() {
	
	$scope.user = {};
    $scope.searchUser = null;
  }
}]);
/**
 * Visitor History controller
 *
 * Controller for reports
 * @type: CONTROLLER
 */
app.controller('VisitorHistoryController', ['$scope', '$rootScope', '$filter', function($scope, $rootScope, $filter){
    
	if(!$rootScope.location){
		return false;
	}
	
    init();
    
    /**
     * Form initalization
     */
    function init() {
			
        $scope.startDate = new Date();
        $scope.endDate = new Date();
		
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
			//$scope.minDate = new Date();
		}; 
		
		$scope.showMinDate();
		
		/**
		 * Limiting the arrival calender to 30 days duraton
		 */
		$scope.showMaxDate = function(){
			$scope.maxDate = new Date();
		};
		
		$scope.showMaxDate();
		
		/**
		 * Disabling the end date from selecting an old date than arrival date
		 */
		$scope.showEndMinDate = function(){
			$scope.minEndDate = $scope.startDate;
		};
		
		$scope.showEndMinDate();
		
		/**
		 * Disabling the end date from selecting an old date than arrival date
		 */
		$scope.showEndMaxDate = function(){
			$scope.maxEndDate = new Date();
		};
		
		$scope.showEndMaxDate();
		
		/**
		 * Updating the new departure minimum date
		 */
		$scope.changeEndDate = function(){
			
			if($scope.startDate > $scope.endDate) {		
				$scope.endDate = $scope.startDate;
			}
			
			$scope.showEndMinDate();
		}
		
		/**
		 *  Downloading Reports  
		 *
		 * @param startDate, endDate and location id
		 */    
		$scope.downloadReport = function (){
			
			var fromDate  = $filter('date')($scope.startDate, 'MMM d, y'),
				toDate    = $filter('date')($scope.endDate, 'MMM d, y'),
				location  = $rootScope.location;
				
			$.download('VMHistoryReport', "fromDate="+fromDate+"&&toDate="+toDate+"&&langCode="+$rootScope.langCode+"&&locationId="+location);
			return false;
		}
		
		/**
		 * Form Reset
		 */
		$scope.resetForm = function() {
			
			$scope.startDate = new Date();
			$scope.endDate = new Date();
			
			$scope.showEndMinDate();
		}
    }
}]);
/**
 * App root level services
 *
 * Root level app service handler
 * @type: SERVICE
 */
app.service('AppService', ['$rootScope', '$http', '$window', '$timeout', '$q', '$location', 'ngToast', function($rootScope, $http, $window, $timeout, $q, $location, ngToast){
	
	/**
	 * Get value
	 *
	 * @param ket string
	 * @param bool bool
	 */
	this.getVal = function(key, bool){
		
		var defaultValue = bool ? false : null;
		
		return angular.isUndefined(key) ? defaultValue : key;
	};
	
	/**
	 * Check for exception in the response
	 *
	 * @param $scope obj
	 * @param exception obj
	 */
	this.checkException = function($scope, exception){
		
		if(exception.status == true) {
			
			if(!$scope.translation.EXCEPTIONS.hasOwnProperty(exception.code)) {
				exception.code = 101;
			}
			
			if(exception.code == 16012 || exception.code == 16013 ) {
				this.showMessage('danger', $rootScope.translation.EXCEPTIONS[exception.code] + exception.message + $rootScope.translation.EXCEPTIONS['COMMON']);
				
				return true;
			} else {
				this.showMessage('danger', $rootScope.translation.EXCEPTIONS[exception.code]);
				
				return true;
			}
		}
		
		return false;
	};
	
	/**
	 * Show message
	 *
	 * @param null
	 */
	this.showMessage = function(type, message){
		
		if(type == 'success') {
			ngToast.success({content: message});
		} else if (type == 'danger') {
			ngToast.danger({content: message});
		} else if (type == 'warning') {
			ngToast.warning({content: message});
		} else {
			ngToast.info({content: message});
		}
	};
	
	/**
	 * Show error message
	 *
	 * @param null
	 */
	this.systemError = function(){
		
		this.showMessage('danger', $rootScope.translation.EXCEPTIONS[100]);
	};
	
	/**
	 * Update user access
	 *
	 * @param null
	 */
	this.updateUserAccess = function(location){
		
		angular.forEach($rootScope.locations, function(loc){
			
			if(loc.id == location){
				
				initUser(loc.role);
				
				var currentPageAccess = APP.PAGEACCESS[$location.path().replace('/', '')];
				
				if(!(APP.USER.ROLE & currentPageAccess)){
					$location.path(APP.USER.LANDING);
				}
			}
		});
	};
	
	/**
	 * Get browser type
	 *
	 * @param null
	 */
	this.getBrowserType = function(){
		
		var userAgent = $window.navigator.userAgent;
		
        var browsers = {
			ipad: /ipad/i,
			chrome: /chrome/i, 
			firefox: /firefox/i, 
			safari: /safari/i, 
			opera: /opera/i, 
			ie: /(msie|trident)/i
		};
		
		for(var key in browsers) {
			if (browsers[key].test(userAgent)) {
				return key;
			}
		}
		
		return 'unknown';
	};
	
	/**
	 * Check if its ie8
	 *
	 * @param null
	 */
	this.isIE8 = function(){
		
		return (document.documentMode && document.documentMode < 9);
	};
}]);

/**
 * Schedule service
 *
 * Schedule handler for schedule CRUD operations
 * @type: SERVICE
 */
app.service('ScheduleService', ['$rootScope', '$http', '$filter', 'AppService', function($rootScope, $http, $filter, AppService){
	
	/**
	 * Get all schedules
	 * for the selected location
	 *
	 * @param date string
	 * @param location int
	 */
	this.getSchedules = function(date){
		
		var postdata = {
			data: {
				langCode: $rootScope.langCode,
				locationId: $rootScope.location, 
				scheduledArrival: $filter('date')(date, 'yyyy-MM-dd HH:mm:ss')
			}
		};
		
		var promise = $http.post('vm/resources/home', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
	 * Schedule CRUD operations
	 *
	 * @param schedule object
	 * @param location int
	 */
	this.execute = function(schedule) {
		
		schedule.langCode = $rootScope.langCode;
		schedule.locationId = $rootScope.location;
		
		var postdata = {
			data: schedule
		};
		
		var promise = $http.post('vm/resources/scheduleVisitor', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
	 * Get schedule details
	 *
	 * @param scheduleId int
	 */
	this.getSchedule = function(scheduleId) {
		
		var postdata = {
			data: {
				id: scheduleId, 
				langCode: $rootScope.langCode,
				locationId: $rootScope.location
			}
		};
		
		var promise = $http.post('vm/resources/schedule', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
	 * Check In an user
	 *
	 * @param schedule object
	 */
	this.checkin = function(schedule, date) {
		
		// Append the location and selected date to the request
		schedule.langCode = $rootScope.langCode;
		schedule.locationId = $rootScope.location;
		schedule.scheduledArrival = date;
		schedule.checkInTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
		
		var postdata = {
			data: schedule
		};
		
		var promise = $http.post('vm/resources/checkin', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
	 * Check Out an user
	 *
	 * @param schedule object
	 */
	this.checkout = function(schedule, date) {
		
		// Append the location and selected date to the request
		schedule.langCode = $rootScope.langCode;
		schedule.locationId = $rootScope.location;
		schedule.scheduledArrival = date;
		schedule.checkOutTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
		
		var postdata = {
			data: schedule
		};
		
		var promise = $http.post('vm/resources/checkout', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
    
	/**
     * Send emrgency list
     * as a mail with attachment for all reception guards
	 *
     * @param null
     */
	this.sendEmergecyList = function(){
		
        var locationName = '';
		var currDate = $filter('date')(new Date(), 'MMM d, y h:mm a');
		angular.forEach($rootScope.locations, function(loc){
			
			if(loc.id == $rootScope.location){
				locationName = loc.name;
			}
		});
        
		var postdata = {
			data: {
				langCode: $rootScope.langCode,
				locationId: $rootScope.location,
                locationName : locationName,
                date : currDate
			}
		};
		
		var promise = $http.post('vm/resources/sendmail', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
    /**
     * Preference service
     *
     * Service handle listing hosts and location wice instructions 
     * on schedule page
	 *
     * @param null
     */
	this.getPreferences = function(){
		
		var postdata = {
			data: {
				langCode: $rootScope.langCode,
				locationId: $rootScope.location
			}
		};
		
		var promise = $http.post('vm/resources/locationInfo', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
     * Users lookup service
     * for getting the ge empoloyees from the lookup service
	 *
     * @param query string
     */
	this.getGEUsers = function(query){
		
		var url = 	'http://services.dmt.corporate.ge.com/lookupservices/json/person/'+
					query+
					'/1/20/extra/email,phone?callback=JSON_CALLBACK';
		
		var promise = $http.jsonp(url).
			success(function(response, status, headers, config){
				return true;
			}).error(function(data, status, headers, config){
				//AppService.systemError();
			});
		
		return promise;
	};
	
	/**
     * Users lookup service
     * for getting the past visitors from the VM DB lookup service
	 *
     * @param query string
     */
	this.getPastVisitors = function(query){
		
		var postdata = {
			data: {
				query: query,
				langCode: $rootScope.langCode,
				locationId: $rootScope.location
			}
		};
		
		var promise = $http.post('vm/resources/pastlookup', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
    
	/**
     * Host lookup service
     * for getting the hosts
	 *
     * @param query string
     */
	this.getHosts = function(query){
		
		var postdata = {
			data: {
				query: query,
				langCode: $rootScope.langCode,
				locationId: $rootScope.location
			}
		};
		
		var promise = $http.post('vm/resources/hosts', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
    /**
	 * Bulk Schedule 
	 *
	 * @param schedule object
	 * @param location int
	 */
	this.bulkSchedule = function(schedule) {
		
		schedule.langCode = $rootScope.langCode;
		schedule.locationId = $rootScope.location;
		
		var postdata = {
			data: schedule
		};
		
		var promise = $http.post('vm/resources/bulkSchedule', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
	 * Get all additional filed values
	 * for the selected user based on location id & sso / visitor id
	 *
	 * @param params obj
	 */
	this.getAdditionalFieldValues = function(params){
		
		var postdata = {
			data: params
		};
		
		var promise = $http.post('vm/resources/userAddtlsFields', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
	 * Get additional fields
	 * for the selected schedule and location
	 *
	 * @param date string
	 * @param location int
	 */
	this.getAdditionalFields = function(scheduleId){
		
		var postdata = {
			data: {
				id: scheduleId,
				langCode: $rootScope.langCode,
				locationId: $rootScope.location
			}
		};
		
		var promise = $http.post('vm/resources/editCheckin', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
	 * Delete schedule dates
	 *
	 * @param params obj
	 */
	this.deleteScheduleDates = function(params){
		
		var postdata = {
			data: {
				id: params.scheduleId,
				dates: params.dates,
				langCode: $rootScope.langCode,
				locationId: $rootScope.location
			}
		};
		
		var promise = $http.post('vm/resources/removeScheduleDates', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
}]);

/**
 * Visitor Service
 */
app.service('VisitorsService', ['$rootScope', '$http', 'AppService', function($rootScope, $http, AppService){
  	
    /**
	 * Get all visitors
	 */
    this.getVisitors = function (){
		
        var postdata = {
            data: {
				langCode: $rootScope.langCode,
				locationId: $rootScope.location
			}
        };
		
        var promise = $http.post('vm/resources/myvisitors', postdata).
            success(function(response, status, headers, config){
                return response.data;
            }).error(function(data, status, headers, config){
                AppService.systemError();
            });
		
        return promise;
    };
    
	/**
	 * Cancel/remove/hide a schedule
	 *
	 * @param schedule object
	 * @param location int
	 */
	this.removeSchedule = function(data) {
		
		data.langCode = $rootScope.langCode;
		data.locationId = $rootScope.location;
		
		var postdata = {
			data: data
		};
		
		var promise = $http.post('vm/resources/remove', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
	 * Get all bannned visitors
	 * for thes selected location
	 *
	 * @param null
	 */
    this.getBannedVisitors = function (){
		
        var postdata = {
            data: {
				langCode: $rootScope.langCode,
				locationId: $rootScope.location
			}
        };
		
        var promise = $http.post('vm/resources/bannedvisitors', postdata).
            success(function(response, status, headers, config){
                return response.data;
            }).error(function(data, status, headers, config){
                AppService.systemError();
            });
		
        return promise;
    };
    
	/**
	 * Remove bann
	 *
	 * @param data object
	 */
	this.removeBann = function(data) {
		
		data.langCode = $rootScope.langCode;
		data.locationId = $rootScope.location;
		
		var postdata = {
			data: data
		};
		
		var promise = $http.post('vm/resources/removebann', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
	 * Get bannned visitor details
	 *
	 * @param recordId int
	 */
    this.getBannedVisitor = function (recordId){
		
        var postdata = {
            data: {
				langCode: $rootScope.langCode,
				locationId: $rootScope.location,
				recordId: recordId
			}
        };
		
        var promise = $http.post('vm/resources/bannedvisitor', postdata).
            success(function(response, status, headers, config){
                return response.data;
            }).error(function(data, status, headers, config){
                AppService.systemError();
            });
		
        return promise;
    };
	
	/**
	 * Bann
	 *
	 * @param data object
	 */
	this.bann = function(data) {
		
		data.langCode = $rootScope.langCode;
		data.locationId = $rootScope.location;
		
		var postdata = {
			data: data
		};
		
		var promise = $http.post('vm/resources/bann', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
	 * Get visitor pic
	 *
	 * @param recordId int
	 */
    this.getVisitorPic = function (recordId){
		
		var postdata = {
            data: {
				langCode: $rootScope.langCode,
				locationId: $rootScope.location,
				recordId: recordId
			}
        };
		
        var promise = $http.post('vm/resources/visitorpic', postdata).
            success(function(response, status, headers, config){
                return response.data;
            }).error(function(data, status, headers, config){
                AppService.systemError();
            });
		
        return promise;
    };
}]);

/**
 * Banned schedule service
 *
 * Schedule handler for banned schedule CRUD operations
 * @type: SERVICE
 */
app.service('BannedScheduleService', ['$rootScope', '$http', '$filter', 'AppService', function($rootScope, $http, $filter, AppService){
	
	/**
	 * Get all banned schedules
	 * for the selected location
	 *
	 * @param location int
	 */
	this.getSchedules = function(){
		
		var postdata = {
			data: {
				langCode: $rootScope.langCode,
				locationId: $rootScope.location, 
			}
		};
		
		var promise = $http.post('vm/resources/bannedschedules', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
	 * Approve a banned schedule
	 *
     * @param data obj
	 */
	this.approve = function(data) {
		
		data.langCode 	= $rootScope.langCode;
		data.locationId = $rootScope.location;
		data.task 		= 'approve';
		
		var postdata = {
			data: data
		};
		
		var promise = $http.post('vm/resources/managependingschedule', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
	 * Approve a banned schedule
	 *
     * @param data obj
	 */
	this.reject = function(data) {
		
		data.langCode 	= $rootScope.langCode;
		data.locationId = $rootScope.location;
		data.task 		= 'reject';
		
		var postdata = {
			data: data
		};
		
		var promise = $http.post('vm/resources/managependingschedule', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
}])

/**
 * Print service
 *
 * @type: SERVICE
 */
app.service('PrintService', ['$rootScope', '$http', '$timeout', '$window', '$filter', 'AppService', function($rootScope, $http, $timeout, $window, $filter, AppService){
	
	/**
	 * Print the badge
	 *
	 * @param scope obj
	 * @param schedule obj
	 */
	this.print = function($scope, schedule){
		
		var slug = false;
		var orientation = 'p';
		
		angular.forEach($rootScope.locations, function(loc){
			
			if(loc.id == $rootScope.location && loc.hasPrint){
				slug = loc.name.replace(/[^\w\s-]/g, '').trim().toLowerCase();
		        slug = slug.replace(/[-\s]+/g, '-');
			}
		});
		
		if(!slug) {	return false; }
		
		if(slug == 'plano-shil-tx-us') { orientation = 'l'; }
		
		$rootScope.printFile = 'app/partials/badge-templates/'+slug+'.html';
		$rootScope.printData = schedule;
		
		$http.get($rootScope.printFile) 
		.success(function(data){
			$timeout(function(){
				$window.print();
			}, 500);
		}) 
		.error(function(){
			
			/**
			 * If the print file is not available,
			 * use the default one
			 */
			$rootScope.printFile = 'app/partials/badge-templates/default.html';
			
			$http.get($rootScope.printFile) 
			.success(function(data){
				$timeout(function(){
					$window.print();
				}, 500);
			}) 
			.error(function(){
				AppService.showMessage('danger', $rootScope.translation.GLOBAL.NOFILE);
			});
			
		});
	};
	
	/**
	 * Print the emergence list
	 *
	 * @param scope obj
	 * @param users obj
	 */
	this.printEmergencyList = function($scope, schedules){
		
		var locationName = '';
		
		angular.forEach($rootScope.locations, function(loc){
			
			if(loc.id == $rootScope.location){
				locationName = loc.name;
			}
		});
		
		$rootScope.printFile = 'app/partials/emergency-list.html';
		$rootScope.printData.schedules = schedules;
		$rootScope.printData.locationName = locationName;
		$rootScope.printData.time = $filter('date')(new Date(), 'MMM d, y h:mm a');
		
		$http.get($rootScope.printFile) 
		.success(function(data){
			$timeout(function(){$window.print();}, 500);
		}) 
		.error(function(){
			
			/**
			 * If the print file is not available,
			 * use the default one
			 */
			$rootScope.printFile = 'app/partials/emergency-list.html';
			
			$http.get($rootScope.printFile) 
			.success(function(data){
				$timeout(function(){$window.print();}, 500);
			}) 
			.error(function(){
				AppService.showMessage('danger', $rootScope.translation.GLOBAL.NOFILE);
			});
			
		});
	};
	
	/**
	 * Create PDF from server end
	 *
	 * @param null
	 */
	this.download = function(schedule){
		
		var params = {};
		
		params.id				= schedule.id;
		params.visitorFirstName	= schedule.visitorFirstName;
		params.visitorLastName 	= schedule.visitorLastName;
		params.escortRequired 	= schedule.escortRequired;
		params.company 			= schedule.company;
		params.badge 			= schedule.badge;
		params.code 			= schedule.code;
		params.host 			= schedule.host;
		params.createdDate 		= schedule.timestamp;
		params.locationId 		= $rootScope.location;
		
		$.download('badge', params, 'post');
		
		return false;
	};
}]);

/**
 * Users Service
 */
app.service('UsersService', ['$rootScope', '$http', 'AppService', function($rootScope, $http, AppService){
  	
    /**
	 * Get all users
	 */
    this.getUsers = function (){
		
        var postdata = {
            data: {
				langCode: $rootScope.langCode,
				locationId: $rootScope.location
			}
        };
		
        var promise = $http.post('vm/resources/admin/guardslist', postdata).
            success(function(response, status, headers, config){
                return response.data;
            }).error(function(data, status, headers, config){
                AppService.systemError();
            });
		
        return promise;
    }
    
    /**
	 * Add an user
	 *
	 * @param user object
	 */
	this.addUser = function(data) {
		
		data.langCode = $rootScope.langCode;
		data.locationId = $rootScope.location;
		
		var postdata = {
			data: data
		};
		
		var promise = $http.post('vm/resources/admin/addguard', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
	
	/**
	 * Remove an user
	 *
	 * @param user object
	 */
	this.removeUser = function(data) {
		
		data.langCode = $rootScope.langCode;
		data.locationId = $rootScope.location;
		
		var postdata = {
			data: data
		};
		
		var promise = $http.post('vm/resources/admin/removeguard', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
    
	
	/**
	 * Update an user access lvel
	 *
	 * @param user object
	 */
	this.updateAccessLevel = function(data) {
		
		data.langCode = $rootScope.langCode;
		data.locationId = $rootScope.location;
		
		var postdata = {
			data: data
		};
		
		var promise = $http.post('vm/resources/admin/editguard', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
}]);

/**
 * Location Settings Service
 */
app.service('LocationSettingsService', ['$rootScope', '$http', 'AppService', function($rootScope, $http, AppService){
  	
    /**
	 * Get location specific settings
	 */
    this.getSettings = function (){
		
        var postdata = {
            data: {
				langCode: $rootScope.langCode,
				locationId: $rootScope.location
			}
        };
		
        var promise = $http.post('vm/resources/settings', postdata).
            success(function(response, status, headers, config){
                return response.data;
            }).error(function(data, status, headers, config){
                AppService.systemError();
            });
		
        return promise;
    };
    
	/**
	 * Update location settings
	 *
	 * @param data object
	 */
	this.save = function(data) {
		
		data.langCode = $rootScope.langCode;
		data.locationId = $rootScope.location;
		
		var postdata = {
			data: data
		};
		
		var promise = $http.post('vm/resources/savelocsettings', postdata).
			success(function(response, status, headers, config){
				return response.data;
			}).error(function(data, status, headers, config){
				AppService.systemError();
			});
		
		return promise;
	};
}]);

/**
 * No Access Service
 */
app.service('NoaccessService', ['$rootScope', '$http', 'AppService', function($rootScope, $http, AppService){
  	
    /**
	 * Get locations
	 */
    this.getLocations = function (){
		
        var postdata = {data: {langCode: $rootScope.langCode}};
		
        var promise = $http.post('vm/resources/getlocations', postdata).
            success(function(response, status, headers, config){
                return response.data;
            }).error(function(data, status, headers, config){
                AppService.systemError();
            });
		
        return promise;
    };
}]);

/**
 * App root level utilities
 *
 * Root level app factory handler
 * @type: FACTORY
 */
app.factory('Utils', ['$q', '$http', '$templateCache', '$compile', 'AppService', function($q, $http, $templateCache, $compile, AppService) {
    return {
        isImage: function(sso) {
        	
			var src = 'http://supportcentral.gecdn.com/images/person/temp/'+sso+'.jpg';
			
            var deferred = $q.defer();
        	
            var image = new Image();
			
            image.onerror = function() {
                deferred.resolve(false);
            };
            image.onload = function() {
                deferred.resolve(true);
            };
			
            image.src = src;
        	
            return deferred.promise;
        },
		renderBlock: function(template) {
			
			var templateUrl = 'app/partials/'+template;
			
			var promise = $http.get(templateUrl).
				success(function(response, status, headers, config){
					return response;
				}).error(function(data, status, headers, config){
					AppService.systemError();
				});
			
			return promise;
		}
    };
}]);

/**
 * Mailto
 *
 * @type: FACTORY
 */
app.factory('Mailto', ['$window', function($window) {
	
	var api = {};

	/**
	 * Returns a URL for a mailto-link
	 * @param  {String} recepient    - Recepient email address
	 * @param  {Object} opts         - Options to construct the URL
	 * @param  {String} opts.cc      - Cc recepient email address (optional)
	 * @param  {String} opts.bcc     - Bcc recepient email address (optional)
	 * @param  {String} opts.subject - Email subject (optional)
	 * @param  {String} opts.body    - Email body (optional). Separate lines with the newline character (\n)
	 * @return {String}              - Returns the URL to put into the href-attribute of a mailto link
	 */
	api.send = function(recepients, opts) {
		
		recepient = angular.isArray(recepients) ? recepients.join(';') : recepients;
		
		var link = "mailto:";
		link += window.encodeURIComponent(recepient);
		
		var params = [];
		
		angular.forEach(opts, function(value, key) {
			params.push(key.toLowerCase() + "=" + window.encodeURIComponent(value));
		});
		
		if (params.length > 0) {
			link += "?" + params.join("&");
		}
		
		$window.location = link;
	};

	return api;
}]);


app.filter('futureDatesOnly', function() {
	
	return function (items) {
		
		var filteredList = [];
		var today = new Date().setHours(0,0,0,0);
		
		angular.forEach(items, function(item){
						
			if (new Date(item.date).setHours(0,0,0,0) >= today) {
				
				filteredList.push(item);
			}
		});
		
		return filteredList;
	}
});
/**
 * Upload and resize avatar picture
 *
 * @type: DIRECTIVE
 */
app.directive('avatar', ['$q', function($q) {
	
	/**
	 * Private methods goes here
	 */
	var URL = window.URL || window.webkitURL;
	
	var resizeImage = function (origImage, options) {
		
		var maxHeight = options.resizeMaxHeight || 300;
		var maxWidth = options.resizeMaxWidth || 250;
		var quality = options.resizeQuality || 0.7;
		var type = options.resizeType || 'image/png';
		
		var canvas = document.createElement('canvas');
		canvas.style.display = 'none';
		document.body.appendChild(canvas);
		
		var height = origImage.height;
		var width = origImage.width;
		
		// calculate the width and height, constraining the proportions
		if (width > height) {
			if (width > maxWidth) {
				height = Math.round(height *= maxWidth / width);
				width = maxWidth;
			}
		} else {
			if (height > maxHeight) {
				width = Math.round(width *= maxHeight / height);
				height = maxHeight;
			}
		}
		
		canvas.width = width;
		canvas.height = height;
		
		//draw image on canvas
		var ctx = canvas.getContext('2d');
		ctx.drawImage(origImage, 0, 0, width, height);
		
		// get the data from canvas as 70% jpg (or specified type).
		return canvas.toDataURL(type, quality);
	};
	
	var fileToDataURL = function (file) {
		var deferred = $q.defer();
		var reader = new FileReader();
		reader.onload = function (e) {
			deferred.resolve(e.target.result);
		};
		reader.readAsDataURL(file);
		return deferred.promise;
	};
	
	/**
	 * Return the main
	 * directive
	 */
	return {
		restrict: 'A',
		scope: {avatar: '='},
		link: function($scope, $element, $attr) {
			
			/**
			 * resize max height
			 * resize max width
			 * resize quality
			 * resize type
			 */
			var inputAttrs = $attr.hasOwnProperty('avatarAttrs') && $scope.$eval($attr.avatarAttrs);
			
			/**
			 * Check if these is the FILE input
			 * If not present create one inside the dom element
			 * and assign all attributes to it.
			 * finally hide it.
			 */
			if (typeof $element.length === 'undefined') {
				$element = [$element];
			}
			
			angular.forEach($element, function (domNode) {
				
				var input;
				
				if (domNode.tagName === 'INPUT' && domNode.type === 'file') {
					input = domNode;
				} else {
					
					input = document.createElement('input');
					input.setAttribute('type', 'file');
					
					angular.extend(input.style, {
						visibility: 'hidden',
						position: 'absolute'
					});
					
					angular.forEach(inputAttrs, function (value, key) {
						input.setAttribute(key, value);
					});
					
					// append the input FILE into the current dom node
					domNode.appendChild(input);
					
					/**
					 * Fire the original
					 * click/browse event
					 */
					domNode.addEventListener('click', function() {
						input.click();
					}, false);
				}
				
				/**
				 * The real browse/upload
				 * method goes here
				 */
				input.addEventListener('change', function (evt) {
					
					var files = evt.target.files;
					
					for(var i=0; i<files.length; i++) {
						
						//create a result object for each file in files
						var imageResult = {
							file: files[i],
							url: URL.createObjectURL(files[i])
						};
						
						fileToDataURL(files[i]).then(function (dataURL) {
							
							imageResult.dataURL = dataURL;
							
							// original image
							$scope.avatar = imageResult.dataURL;
							
							/**
							 * Resize image
							 */
							var image = new Image();
							
							image.onload = function() {
								
								var dataURL = resizeImage(image, $scope);
								
								imageResult.resized = {
									dataURL: dataURL,
									type: dataURL.match(/:(.+\/.+);/)[1],
								};
								
								$scope.$apply(function() {
									
									// resized image
									$scope.avatar = dataURL;
								});
							};
							
							image.src = imageResult.url;
							
						});
					}
				});
			});
		}
	}
}]);
/**
 * Placeholder for non HTML5 browsers
 *
 * @type: DIRECTIVE
 */
app.directive('placeholder', ['$log', '$timeout', function($log, $timeout) {
	
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			
			var browserVersion = parseInt((/msie (\d+)/.exec(angular.lowercase(navigator.userAgent)) || [])[1]);
			
			if(!(browserVersion <= 10)) {
				return false;
			}
						
			var txt = attrs.placeholder;
			
			elem.bind('focus', function() {
				if(elem.val() === txt) {
					elem.val('');
				}
				scope.$apply()
			});
			
			elem.bind('blur', function() {
				if(elem.val() === '') {
					elem.val(txt);
				}
				scope.$apply()
			});
			
			// Initialise placeholder
			$timeout(function() {
				if(elem.val() === '') {
					elem.val(txt);
				}
				scope.$apply();
			});
			
			// Update the placeholder text for language change
			scope.$on('languageChange', function() {
				
				$timeout(function() {
					txt = attrs.placeholder;
					if(elem.val() === '') {
						elem.val(txt);
					}
					scope.$apply();
				});
            });
		}
	}
}]);
/**
 * Placeholder for International telephone
 *   
 * @type DIRECTIVE
 */
app.directive('intlTel', ['$rootScope', function($rootScope){
	
	return{
		replace:true,
		restrict: 'E',
		require: 'ngModel',
		template: '<input type="text" placeholder="e.g. +1 702 123 4567" class="form-control" name="phone" />',
		link: function(scope,element,attrs,ngModel){
			var read = function() {
				var inputValue = element.val();
				ngModel.$setViewValue(inputValue);
			};
			element.intlTelInput({
				defaultCountry: $rootScope.countryCode,
			});
			element.on('focus blur keyup change', function() {
				scope.$apply(read);
			});
			read();
		}
	}
}]);
/* 
 * Custom methods
 */
window.console = window.console || {}; 
window.console.log = window.console.log || function() {};

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/gm, '');
	};
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    }
}

/**
 * Download/Export file
 * 
 * @version 1.0
 */
$.download = function(url, data, method, target) {
    // url and data options required
    if (url && data) {
        // data can be string of parameters or array/object
        data = typeof data == 'string' ? data : $.param(data);

        // split params into form inputs
        var inputs = '';

        $.each(data.split('&'), function() {
            var pair = this.split('=');
            inputs += '<input type="hidden" name="' + pair[0] + '" value="'
            + pair[1] + '" />';
        });

        // send request
        $('<form action="' + url + '" target="' + (target || '_blank')
        + '"' + '" method="' + (method || 'post') + '">'
        + inputs + '</form>').appendTo('body').submit()
        .remove();
    }
};

/**
 * Removing Modal elements
 */
function removeModal() {
  
    //koothara pani To remove the element from the DOM
    $('.modal, .modal-backdrop').remove();
    $('body').removeClass('modal-open'); 
}

/**
 * Convert meridian date string to 24 hour format date string
 */
function createDateTime(dateStr, timeStr)
{
    var meridian = timeStr.substr(timeStr.length-2).toLowerCase();
    var hours    = timeStr.substring(0, timeStr.indexOf(':'));
    var minutes  = timeStr.substring(timeStr.indexOf(':')+1, timeStr.indexOf(' '));
     if (meridian=='pm') {
        hours = (hours=='12') ? '12' : parseInt(hours, 10)+12 ;
    } else {
        hours = (hours=='12') ? '00' : parseInt(hours, 10) ;
    }
	
	if(hours.length<2) {
        hours = '0' + hours;
    }
	
    return getTimestamp(dateStr + ' ' + hours+':'+minutes+':00');
}

/**
 * Convert date string to timestamp
 */
function getTimestamp(str) {
  	var d = str.match(/\d+/g); // extract date parts
  	return +new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]); // build Date object
}

$('document').ready(function() {
	
	/**
	 * Disable autocomplete for ie browser
	 */
	$('input').attr('autocomplete','off');
	
    $('#side-menu').metisMenu();
	
	//Loads the correct sidebar on window load
    $(function() {
        $(window).bind('load', function() {
            if ($(this).width() < 753) {
                $('div.sidebar-collapse').addClass('collapse')
            } else {
                $('div.sidebar-collapse').removeClass('collapse')
            }
        })
    })
	
	//Collapses the sidebar on window resize
    $(function() {
        $(window).bind('resize', function() {
            if (this.innerWidth < 768) {
                $('div.sidebar-collapse').addClass('collapse')
            } else {
                $('div.sidebar-collapse').removeClass('collapse')
            }
        })
    });
});