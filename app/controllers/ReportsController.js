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