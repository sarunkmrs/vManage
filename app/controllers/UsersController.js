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