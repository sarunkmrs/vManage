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