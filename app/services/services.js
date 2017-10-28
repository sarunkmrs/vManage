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