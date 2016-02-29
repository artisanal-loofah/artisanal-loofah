angular.module('huntApp', [
  'hunt.users',
  'hunt.services',
  'hunt.backlog',
  'hunt.appSubmit',
  'hunt.phoneScreen',
  'hunt.onSite',
  'hunt.offer',
  'hunt.application',
  'ngRoute'])

.config(function ($routeProvider, $locationProvider, $httpProvider) {
   $routeProvider
   .when('/signin', {
     templateUrl: 'app/users/signin.html'
   })
   .when('/main', {
     templateUrl: 'app/home/main.html',
     controller: 'UserController',
     authenticate: true
   })
   .otherwise({
     redirectTo: '/main'
   });

   $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('hunt_token');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, $window, User) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !User.isAuth()) {
      $location.path('/signin');
    }
  });
});

angular.module('hunt.appSubmit', ['hunt.backlog'])

.controller('AppSubmitController', function ($scope, $rootScope, $window, AppSubmit, PhoneScreen, Helpers) {
  $rootScope.appSubmits = [];
  $rootScope.selectedAppSubmit;
  $rootScope.selectedAppSubmitIndex;
  $scope.sort = 'created';

  $scope.getAppSubmits = function (sort) {
    // user id is added on the backend
    AppSubmit.getAppSubmits(sort)
    .then(function (data) {
      $rootScope.appSubmits = data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.removeAppSubmit = function (appSubmit, index) {
    if (window.confirm("Are you sure you want to remove this item from this stage?")){
      appSubmit.status = 'Removed';
      $rootScope.appSubmits.splice(index, 1);
      AppSubmit.editAppSubmit(appSubmit)
      .catch(function (error) {
        console.log("Error editing App Submit: ", error);
      });
    }
  };

  $scope.moveToPhoneScreen = function () {
    // user id is added on the backend
    var newPhoneScreen = {
      application_id: $rootScope.selectedAppSubmit.application_id,
      status: 'Pending',
      interviewer: $scope.newPhoneScreen.interviewer,
      date_time: $scope.newPhoneScreen.date_time,
      notes: $scope.newPhoneScreen.notes
    };

    PhoneScreen.addPhoneScreen(newPhoneScreen)
      .then(function (phoneScreen) {
        $rootScope.phoneScreens.push(phoneScreen);
      })
      .catch(function (error) {
        console.log("Error creating PhoneScreen list item on AppSubmit status change : ", error);
      });

    $scope.newPhoneScreen.interviewer = '';
    $scope.newPhoneScreen.date_time = '';
    $scope.newPhoneScreen.notes = '';
  };

  // Function that sets the appSubmitID when user clicks on appSubmit
  $scope.clickedAppSubmit = function (appSubmit, index) {
    $rootScope.selectedAppSubmit = appSubmit;
    $rootScope.selectedAppSubmitIndex = index;
  };

  // Function for submitting any updated changes to a specific appSubmit
  $scope.submitChanges = function () {
    var selectedAppSubmit = $rootScope.selectedAppSubmit;
    AppSubmit.editAppSubmit(selectedAppSubmit)
      .then(function (appSubmit) {
        $rootScope.appSubmits.splice($rootScope.selectedAppSubmitIndex, 1, appSubmit);
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to appSubmit: ", error);
      });

      if (selectedAppSubmit.status === "Accepted" && Helpers.isNotDuplicate($rootScope.phoneScreens, selectedAppSubmit.application_id)) {
        $scope.moveToPhoneScreen();
      }
  };

  $scope.getAppSubmits();
})

.factory('AppSubmit', function ($http) {

  var getAppSubmits = function (sort) {
    return $http({
      method: 'GET',
      url: '/api/appsubmits',
      params: {
        sort: sort
      }
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var addAppSubmit = function (appSubmit) {
    return $http({
      method: 'POST',
      url: 'api/appsubmits',
      data: appSubmit
    })
    .then(function (res) {
      return res.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  var editAppSubmit = function (appSubmit) {
    return $http({
      method: 'PUT',
      url: 'api/appsubmits',
      data: appSubmit
    })
    .then(function (res) {
      return res.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  return {
    getAppSubmits: getAppSubmits,
    addAppSubmit: addAppSubmit,
    editAppSubmit: editAppSubmit
  };
});

angular.module('hunt.application', ['hunt.users'])

.controller('ApplicationController', function ($scope, $rootScope, Application, Backlog) {

  $scope.addApplication = function () {
    // only create application if job title and company name are not empty or whitespace
    if ($scope.jobTitle.trim().length && $scope.company.trim().length) {
      // user id is added on the backend
      var applicationData = {
        jobTitle: $scope.jobTitle,
        company: $scope.company
      };

      Application.createApplication(applicationData)
      .then(function(application) {
        var newBacklog = {
          application_id: application.id,
          status: 'Pending'
        };
        Backlog.addBacklog(newBacklog)
        .then(function(backlog) {
          $rootScope.backlogs.push(backlog);
        });
      });
    }
    $scope.jobTitle = '';
    $scope.company = '';
  };
})

.factory('Application', function ($http) {
  var createApplication = function(application) {
    return $http({
      method: 'POST',
      url: '/api/applications',
      data: application
    }).then(function(res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  return {
    createApplication: createApplication
  };
});

angular.module('hunt.backlog', [])

.controller('BacklogController', function ($scope, $rootScope, $location, $window, Backlog, AppSubmit, Helpers) {
  $rootScope.backlogs = [];
  $rootScope.selectedBacklog;
  $rootScope.selectedBacklogIndex;
  $scope.sort = 'created';

  // Function that retrieves all backlogs for given user
  $scope.getBacklogs = function (sort) {
    // user id is added on the backend
    Backlog.getBacklogs(sort)
      .then(function (data) {
        $rootScope.backlogs = data;
      })
      .catch(function (error) {
        console.log('Error getting backlogs: ', error);
      });
  };

  // Function that removes backlog
  $scope.removeBacklog = function (backlog, index) {
    if (window.confirm("Are you sure you want to remove this item from this stage?")){
      backlog.status = 'Removed';
      $rootScope.backlogs.splice(index, 1);
      Backlog.editBacklog(backlog)
      .catch(function (error) {
        console.log("Error editing backlog: ", error);
      });
    }
  };

  // Function that edits an existing backlog
  $scope.editBacklog = function (backlog) {
    Backlog.editBacklog(backlog)
      .then(function (backlog) {
        $rootScope.backlogs.splice($rootScope.selectedBacklogIndex, 1, backlog);
      })
      .catch(function (error) {
        console.log("Error editing backlog: ", error);
      });
  };

  // Function that moves backlog to application submitted state
  $scope.moveToAppSubmitted = function () {
    // user id is added on the backend
    var newAppSubmit = {
      application_id: $rootScope.selectedBacklog.application_id,
      status: 'Pending',
      notes: $scope.newAppSubmit.notes
    };
    AppSubmit.addAppSubmit(newAppSubmit)
      .then(function (appSubmit) {
        $rootScope.appSubmits.push(appSubmit);
      })
      .catch(function (error) {
        console.log("Error creating AppSubmit list item on backlog status change: ", error);
      });

    // $scope.newAppSubmit.notes = '';
  };

  // Function that sets the selectedBacklog to backlog user clicked on
  $scope.clickedBacklog = function (backlog, index) {
    $rootScope.selectedBacklog = backlog;
    $rootScope.selectedBacklogIndex = index;
  };

  // Function for submitting any updated changes to a specific backlog
  $scope.submitChanges = function () {
    var selectedBacklog = $rootScope.selectedBacklog;
    Backlog.editBacklog(selectedBacklog)
      .then(function (backlog) {
        $rootScope.backlogs.splice($rootScope.selectedBacklogIndex, 1, backlog);
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to backlog: ", error);
      });

    // Only send to next stage if a list item with the same application id doesn't already exist in next stage
    if (selectedBacklog.status === "Accepted" && Helpers.isNotDuplicate($rootScope.appSubmits, selectedBacklog.application_id)) {
      $scope.moveToAppSubmitted();
    } 
  };

  $scope.getBacklogs();
})

.factory('Backlog', function ($http) {

  // Retrieves all backlogs stored in database matching the passed in user id
  var getBacklogs = function (sort) {
    return $http({
      method: 'GET',
      url: '/api/backlogs',
      params: {
        sort: sort
      }
    })
    .then(function (res) {
      return res.data;
    });
  };

  // Adds a new list item to backlog
  var addBacklog = function (backlog) {
    return $http({
      method: 'POST',
      url: '/api/backlogs',
      data: backlog
    })
    .then(function (res) {
      return res.data;
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  // Edits an existing backlog list item
  var editBacklog = function (backlog) {
    return $http({
      method: 'PUT',
      url: '/api/backlogs',
      data: backlog
    })
    .then(function (res) {
      return res.data;
    });
  };

  return {
    getBacklogs: getBacklogs,
    addBacklog: addBacklog,
    editBacklog: editBacklog
  };
});

angular.module('hunt.offer', [])

.controller('OfferController', function ($scope, $rootScope, $window, Offer) {
  $rootScope.offers = [];
  $rootScope.selectedOffer;
  $rootScope.selectedOfferIndex;
  $scope.sort = 'created';

  $scope.getOffers = function (sort) {
    // user id is added on the backend
    Offer.getOffers(sort)
    .then(function (data) {
      $rootScope.offers = data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.removeOffer = function (offer, index) {
    if (window.confirm("Are you sure you want to remove this item from this stage?")){
      offer.status = 'Removed';
      $rootScope.offers.splice(index, 1);
      Offer.editOffer(offer)
      .catch(function (error) {
        console.log("Error editing offer: ", error);
      });
    }
  };

  $scope.clickedOffer = function(offer, index) {
    $rootScope.selectedOffer = offer;
    // convert string (if it exists) to Date object
    if ($rootScope.selectedOffer.deadline) {
      $rootScope.selectedOffer.deadline = new Date($rootScope.selectedOffer.deadline);
    }
    $rootScope.selectedOfferIndex = index;
  };

  $scope.submitChanges = function() {
    Offer.editOffer($rootScope.selectedOffer)
      .then(function (offer) {
        $rootScope.offers.splice($rootScope.selectedOfferIndex, 1, offer);
      })
      .catch(function (error) {
        console.error("There was an error submitting changes to offer: ", error);
      });
  };

  $scope.getOffers();
})

.factory('Offer', function ($http) {
  var getOffers = function (sort) {
    return $http({
      method: 'GET',
      url: '/api/offers',
      params: {
        sort: sort
      }
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var addOffer = function (offer) {
    return $http({
      method: 'POST',
      url: 'api/offers',
      data: offer
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var editOffer = function (offer) {
    return $http({
      method: 'PUT',
      url: 'api/offers',
      data: offer
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    })
  };

  return {
    getOffers: getOffers,
    addOffer: addOffer,
    editOffer: editOffer
  }
});
angular.module('hunt.onSite', [])

.controller('OnSiteController', function ($scope, $rootScope, $window, OnSite, Offer, Helpers) {
  $rootScope.onSites = [];
  $rootScope.selectedOnSite;
  $rootScope.selectedOnSiteIndex;
  $scope.sort = 'created';

  $scope.getOnSites = function (sort) {
    // user id is added on the backend
    OnSite.getOnSites(sort)
    .then(function (data) {
      $rootScope.onSites = data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.removeOnSite = function (onSite, index) {
    if (window.confirm("Are you sure you want to remove this item from this stage?")){
      onSite.status = 'Removed';
      $rootScope.onSites.splice(index, 1);
      OnSite.editOnSite(onSite)
      .catch(function (error) {
        console.log("Error editing on-site: ", error);
      });
    }
  };

  $scope.moveToOffer = function() {
    // user id is added on the backend
    var newOffer = {
      application_id: $rootScope.selectedOnSite.application_id,
      status: 'Pending',
      salary: $scope.newOffer.salary,
      deadline: $scope.newOffer.deadline,
      notes: $scope.newOffer.notes
    };

    Offer.addOffer(newOffer)
      .then(function (offer) {
        $rootScope.offers.push(offer);
      })
      .catch(function (error) {
        console.log("Error creating Offer list item on OnSite status change : ", error);
      });

    $scope.newOffer.salary = '';
    $scope.newOffer.deadline = '';
    $scope.newOffer.notes = '';
  };

  $scope.clickedOnSite = function(onSite, index) {
    $rootScope.selectedOnSite = onSite;
    // convert string (if it exists) to Date object
    if ($rootScope.selectedOnSite.date_time) {
      $rootScope.selectedOnSite.date_time = new Date($rootScope.selectedOnSite.date_time);
    }
    $rootScope.selectedOnSiteIndex = index;
  };

  $scope.submitChanges = function() {
    var selectedOnSite = $rootScope.selectedOnSite;
    OnSite.editOnSite(selectedOnSite)
      .then(function (onSite) {
        $rootScope.onSites.splice($rootScope.selectedOnSiteIndex, 1, onSite);
      })
      .catch(function (error) {
        console.error("There was an error submitting changes to onSite: ", error);
      });

      if (selectedOnSite.status === "Accepted" && Helpers.isNotDuplicate($rootScope.offers, selectedOnSite.application_id)) {
        $scope.moveToOffer();
      }
  };

  $scope.getOnSites();
})

.factory('OnSite', function ($http) {
  var getOnSites = function (sort) {
    return $http({
      method: 'GET',
      url: '/api/onsites',
      params: {
        sort: sort
      }
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var addOnSite = function (onSite) {
    return $http({
      method: 'POST',
      url: 'api/onsites',
      data: onSite
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var editOnSite = function (onSite) {
    return $http({
      method: 'PUT',
      url: 'api/onsites',
      data: onSite
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    })
  };

  return {
    getOnSites: getOnSites,
    addOnSite: addOnSite,
    editOnSite: editOnSite
  }
});
angular.module('hunt.phoneScreen', ['hunt.appSubmit'])

.controller('PhoneScreenController', function ($scope, $rootScope, $window, PhoneScreen, OnSite, Helpers) {
  $rootScope.phoneScreens = [];
  $rootScope.selectedPhoneScreen;
  $rootScope.selectedPhoneScreenIndex;
  $scope.sort = 'created'

  $scope.getPhoneScreens = function (sort) {
    // user id is added on the backend
    PhoneScreen.getPhoneScreens(sort)
    .then(function (data) {
      $rootScope.phoneScreens = data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  $scope.removePhoneScreen = function (phoneScreen, index) {
    if (window.confirm("Are you sure you want to remove this item from this stage?")){
      phoneScreen.status = 'Removed';
      $rootScope.phoneScreens.splice(index, 1);
      PhoneScreen.editPhoneScreen(phoneScreen)
      .catch(function (error) {
        console.log("Error editing phone screen: ", error);
      });
    }
  };

  $scope.moveToOnSite = function () {
    // user id is added on the backend
    var newOnSite = {
      application_id: $rootScope.selectedPhoneScreen.application_id,
      status: 'Pending',
      interviewer: $scope.newOnSite.interviewer,
      date_time: $scope.newOnSite.date_time,
      location: $scope.newOnSite.location,
      notes: $scope.newOnSite.notes
    };

    OnSite.addOnSite(newOnSite)
      .then(function (onSite) {
        $rootScope.onSites.push(onSite);
      })
      .catch(function (error) {
        console.log("Error creating OnSite list item on phoneScreen status change: ", error);
      });

    $scope.newOnSite.interviewer = '';
    $scope.newOnSite.date_time = '';
    $scope.newOnSite.location = '';
    $scope.newOnSite.notes = '';
  };

  // Function that sets the phoneScreenID when user clicks on phoneScreen
  $scope.clickedPhoneScreen = function (phoneScreen, index) {
    $rootScope.selectedPhoneScreen = phoneScreen;
    // convert string (if it exists) to Date object
    if ($rootScope.selectedPhoneScreen.date_time) {
      $rootScope.selectedPhoneScreen.date_time = new Date($rootScope.selectedPhoneScreen.date_time);
    }
    $rootScope.selectedPhoneScreenIndex = index;
  };

  // Function for submitting any updated changes to a specific phoneScreen
  $scope.submitChanges = function () {
    var selectedPhoneScreen = $rootScope.selectedPhoneScreen;
    PhoneScreen.editPhoneScreen(selectedPhoneScreen)
      .then(function (phoneScreen) {
        $rootScope.phoneScreens.splice($rootScope.selectedPhoneScreenIndex, 1, phoneScreen);
      })
      .catch(function (error) {
        console.log("There was an error submitting changes to phoneScreen: ", error);
      });

      if (selectedPhoneScreen.status === "Accepted" && Helpers.isNotDuplicate($rootScope.onSites, selectedPhoneScreen.application_id)) {
        $scope.moveToOnSite();
      }
  };

  $scope.getPhoneScreens();
})

.factory('PhoneScreen', function ($http) {

  var getPhoneScreens = function (sort) {
    return $http({
      method: 'GET',
      url: '/api/phonescreens',
      params: {
        sort: sort
      }
    }).then(function (res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var addPhoneScreen = function (phoneScreen) {
    return $http({
      method: 'POST',
      url: 'api/phoneScreens',
      data: phoneScreen
    })
    .then(function (res) {
      return res.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  var editPhoneScreen = function (phoneScreen) {
    return $http({
      method: 'PUT',
      url: 'api/phoneScreens',
      data: phoneScreen
    })
    .then(function (res) {
      return res.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  return {
    getPhoneScreens: getPhoneScreens,
    addPhoneScreen: addPhoneScreen,
    editPhoneScreen: editPhoneScreen
  };
});

angular.module('hunt.services', [])

.factory('User', function($http, $window) {
  var getUserByLinkedInId = function(linkedInId) {
    return $http({
      method: 'GET',
      url: '/api/users',
      params: {
        linkedInId: linkedInId
      }
    }).then(function(res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var createUser = function(userData) {
    return $http({
      method: 'POST',
      url: '/api/users',
      data: userData
    }).then(function(res) {
      return res.data;
    }).catch(function (error) {
      console.error(error);
    });
  };

  var isAuth = function() {
    return !!$window.localStorage.getItem('hunt_token');
  };

  return {
    getUserByLinkedInId: getUserByLinkedInId,
    createUser: createUser,
    isAuth: isAuth
  }
})

.factory('Helpers', function() {
  // check if a list item with this application id already exists
  var isNotDuplicate = function(nextStageListItems, application_id) {
    for (var i = 0; i < nextStageListItems.length; i++) {
      if (nextStageListItems[i].application_id === application_id) {
        return false;
      }
    }
    return true;
  };

  return {
    isNotDuplicate: isNotDuplicate
  }
});

angular.module('hunt.users', [])

.controller('UserController', function huntUsers($scope, $location, $rootScope, $http, $window, User) {
  $scope.initializeApp = function() {
    if (!User.isAuth()) {
      $scope.getLinkedInData(function() {
        $location.path("/main");
      });
    } else {
      var linkedInId = $window.localStorage.getItem('hunt_userprofile_id');
      User.getUserByLinkedInId(linkedInId)
      .then(function(data) {
        $rootScope.user = data.user;
        $location.path("/main");
      })
      .catch(function(error){
        console.error(error);
      })
    }
  };

  $scope.getLinkedInData = function (callback) {
    IN.API.Profile("me").fields([ "id", "firstName", "lastName", "pictureUrl", "publicProfileUrl", "headline" ])
    .result(function(result) {
      $rootScope.$apply(function() {
        var linkedInProfile = result.values[0];
        $window.localStorage.setItem('hunt_userprofile_id', linkedInProfile.id);
        User.getUserByLinkedInId(linkedInProfile.id)
        .then(function(data) {
          if (data.user) {
            $rootScope.user = data.user;
            $window.localStorage.setItem('hunt_token', data.token);
            callback();
          } else {
            User.createUser(linkedInProfile)
              .then(function (data) {
                $rootScope.user = data.user;
                $window.localStorage.setItem('hunt_token', data.token);
                callback();
              });
          }
        })
        .catch(function(err) {
          console.error(err);
        });
      });
    }).error(function(err) {
      $scope.error = err;
    });
  };

  $scope.logoutLinkedIn = function () {
    IN.User.logout();
    delete $rootScope.user;
    $window.localStorage.removeItem('hunt_token');
    $window.localStorage.removeItem('hunt_userprofile_id');
    $location.path('/signin');
  };
});

function onLinkedInLoad() {
  console.log('loading linkedin');
  IN.Event.on(IN, "auth", function() {
    onLinkedInLogin();
  });
  IN.Event.on(IN, "logout", function() {
    onLinkedInLogout();
  });
};

function onLinkedInLogout() {
  location.reload(true);
};

function onLinkedInLogin() {
  angular.element(document.getElementById("userBody")).scope().$apply(
    function($scope) {
      $scope.initializeApp();
    }
  );
};
