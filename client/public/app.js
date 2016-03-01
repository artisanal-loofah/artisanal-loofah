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
  // Track list items on the rootScope so they are accessible
  // in other list item controllers
  $rootScope.appSubmits = [];
  $rootScope.selectedAppSubmit;
  $rootScope.selectedAppSubmitIndex;
  $scope.sort = 'created';

  // Get all backlogs for given user, called when page loads
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

  // Create new phoneScreen on status==="Accepted"
  $scope.moveToPhoneScreen = function () {
    // user id is added on the backend
    var newPhoneScreen = {
      application_id: $rootScope.selectedAppSubmit.application_id,
      status: 'Pending',
      interviewer: $scope.newPhoneScreenInterviewer,
      date_time: $scope.newPhoneScreenDate_time,
      notes: $scope.newPhoneScreenNotes
    };

    PhoneScreen.addPhoneScreen(newPhoneScreen)
      .then(function (phoneScreen) {
        $rootScope.phoneScreens.push(phoneScreen);
      })
      .catch(function (error) {
        console.log("Error creating PhoneScreen list item on AppSubmit status change : ", error);
      });

    $scope.newPhoneScreenInterviewer = null;
    $scope.newPhoneScreenDate_time = null;
    $scope.newPhoneScreenNotes = null;
  };

  // Assigns rootScope variables to clicked appSubmit, so they can be
  // used elsewhere
  $scope.clickedAppSubmit = function (appSubmit, index) {
    $rootScope.selectedAppSubmit = appSubmit;
    $rootScope.selectedAppSubmitIndex = index;
  };

  // Submit changes on edit, move to next stage if status==='Accepted'
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
  // called when 'submit' is clicked after job title & company are entered in search
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
  // returns the application object, including id. The id is used
  // when creating the backlog object (see above).
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
  // Track list items on the rootScope so they are accessible
  // in other list item controllers
  $rootScope.backlogs = [];
  $rootScope.selectedBacklog;
  $rootScope.selectedBacklogIndex;
  $scope.sort = 'created';

  // Get all backlogs for given user, called when page loads
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

  // Create new appSubmit on status==="Accepted"
  $scope.moveToAppSubmitted = function () {
    // user id is added on the backend
    var newAppSubmit = {
      application_id: $rootScope.selectedBacklog.application_id,
      status: 'Pending',
      notes: $scope.appSubmitNotes
    };

    AppSubmit.addAppSubmit(newAppSubmit)
      .then(function (appSubmit) {
        $rootScope.appSubmits.push(appSubmit);
      })
      .catch(function (error) {
        console.log("Error creating AppSubmit list item on backlog status change: ", error);
      });

    $scope.appSubmitNotes = null;
  };

  // Assigns rootScope variables to clicked backlog, so they can be
  // used elsewhere
  $scope.clickedBacklog = function (backlog, index) {
    $rootScope.selectedBacklog = backlog;
    $rootScope.selectedBacklogIndex = index;
  };

  // Submit changes on edit, move to next stage if status==='Accepted'
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
  // Track list items on the rootScope so they are accessible
  // in other list item controllers
  $rootScope.offers = [];
  $rootScope.selectedOffer;
  $rootScope.selectedOfferIndex;
  $scope.sort = 'created';

  // Get all offers for given user, called when page loads
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

  // Assigns rootScope variables to clicked offer, so they can be
  // used elsewhere
  $scope.clickedOffer = function(offer, index) {
    $rootScope.selectedOffer = offer;
    // convert string (if it exists) to Date object
    if ($rootScope.selectedOffer.deadline) {
      $rootScope.selectedOffer.deadline = new Date($rootScope.selectedOffer.deadline);
    }
    $rootScope.selectedOfferIndex = index;
  };
  
  // Submit changes on edit, move to next stage if status==='Accepted'
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
  // Track list items on the rootScope so they are accessible
  // in other list item controllers
  $rootScope.onSites = [];
  $rootScope.selectedOnSite;
  $rootScope.selectedOnSiteIndex;
  $scope.sort = 'created';

  // Get all onSites for given user, called when page loads
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

  // Create new offer on status==="Accepted"
  $scope.moveToOffer = function() {
    // user id is added on the backend
    var newOffer = {
      application_id: $rootScope.selectedOnSite.application_id,
      status: 'Pending',
      salary: $scope.newOfferSalary,
      deadline: $scope.newOfferDeadline,
      notes: $scope.newOfferNotes
    };

    Offer.addOffer(newOffer)
      .then(function (offer) {
        $rootScope.offers.push(offer);
      })
      .catch(function (error) {
        console.log("Error creating Offer list item on OnSite status change : ", error);
      });

    $scope.newOfferSalary = null;
    $scope.newOfferDeadline = null;
    $scope.newOfferNotes = null;
  };

  // Assigns rootScope variables to clicked onSite, so they can be
  // used elsewhere
  $scope.clickedOnSite = function(onSite, index) {
    $rootScope.selectedOnSite = onSite;
    // convert string (if it exists) to Date object
    if ($rootScope.selectedOnSite.date_time) {
      $rootScope.selectedOnSite.date_time = new Date($rootScope.selectedOnSite.date_time);
    }
    $rootScope.selectedOnSiteIndex = index;
  };

  // Submit changes on edit, move to next stage if status==='Accepted'
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
  // Track list items on the rootScope so they are accessible
  // in other list item controllers
  $rootScope.phoneScreens = [];
  $rootScope.selectedPhoneScreen;
  $rootScope.selectedPhoneScreenIndex;
  $scope.sort = 'created'

  // Get all phoneScreens for given user, called when page loads
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

  // Create new onSite on status==="Accepted"
  $scope.moveToOnSite = function () {
    // user id is added on the backend
    var newOnSite = {
      application_id: $rootScope.selectedPhoneScreen.application_id,
      status: 'Pending',
      interviewer: $scope.newOnSiteInterviewer,
      date_time: $scope.newOnSiteDate_time,
      location: $scope.newOnSiteLocation,
      notes: $scope.newOnSiteNotes
    };

    OnSite.addOnSite(newOnSite)
      .then(function (onSite) {
        $rootScope.onSites.push(onSite);
      })
      .catch(function (error) {
        console.log("Error creating OnSite list item on phoneScreen status change: ", error);
      });

    $scope.newOnSiteInterviewer = null;
    $scope.newOnSiteDate_time = null;
    $scope.newOnSiteLocation = null;
    $scope.newOnSiteNotes = null;
  };

  // Assigns rootScope variables to clicked phoneScreen, so they can be
  // used elsewhere
  $scope.clickedPhoneScreen = function (phoneScreen, index) {
    $rootScope.selectedPhoneScreen = phoneScreen;
    // convert string (if it exists) to Date object
    if ($rootScope.selectedPhoneScreen.date_time) {
      $rootScope.selectedPhoneScreen.date_time = new Date($rootScope.selectedPhoneScreen.date_time);
    }
    $rootScope.selectedPhoneScreenIndex = index;
  };

  // Submit changes on edit, move to next stage if status==='Accepted'
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
  // returns data object with user and token
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
  // returns data object with user and token
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
  // check if a list item with this application id already exists;
  // if so, do not create a new one
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
  // Authenticates through LinkedIn if token not in local storage
  // If in local storage, get user and route to main page.
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

  // Get the user from the db using the LinkedIn id provided by the LinkedIn Auth call.
  // If user does not exist, create user with LI data. Set token and LI id in local storage
  // and call callback (callback above is reroute to main page).
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

// callback called after LinkedIn script returns
function onLinkedInLoad() {
  $('a[id*=li_ui_li_gen_]').css({marginBottom:'20px'}) 
  .html('<img src="../assets/Sign-In-Large---Default.png" height="50" width="250" border="0" />');

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

// initializes user info and sets token (see initializeApp)
function onLinkedInLogin() {
  angular.element(document.getElementById("userBody")).scope().$apply(
    function($scope) {
      $scope.initializeApp();
    }
  );
};
