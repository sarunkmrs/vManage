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
