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