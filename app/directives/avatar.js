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