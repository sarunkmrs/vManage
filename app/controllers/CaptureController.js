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