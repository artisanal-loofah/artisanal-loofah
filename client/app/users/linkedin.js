function onLinkedInLoad() {
  console.log('loading linkedin');
  IN.Event.on(IN, "auth", function() {
    onLinkedInLogin();
  });
  IN.Event.on(IN, "logout", function() {
    onLinkedInLogout();
  });
}

function onLinkedInLogout() {
  console.log('logging out');
  console.log(location);
  location.reload(true);
}

function onLinkedInLogin() {
  console.log('please login');
  angular.element(document.getElementById("userBody")).scope().$apply(
    function($scope) {
      $scope.getLinkedInData();
    }
  );
}