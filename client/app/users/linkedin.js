function onLinkedInLoad() {
  IN.Event.on(IN, "auth", function() {
    onLinkedInLogin();
  });
  IN.Event.on(IN, "logout", function() {
    onLinkedInLogout();
  });
}

function onLinkedInLogout() {
  location.reload(true);
}

function onLinkedInLogin() {
  angular.element(document.getElementById("userBody")).scope().$apply(
    function($scope) {
      $scope.getLinkedInData();
    }
  );
}