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