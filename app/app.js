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
	
