function onLinkedInLoad() {
  console.log('loading linkedin');
  IN.Event.on(IN, "auth", function() {
    console.log('logging innnn');
    onLinkedInLogin();
  });
  IN.Event.on(IN, "logout", function() {
    console.log('linked in logout');
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