function onLinkedInLoad() {
  console.log('loading linkedin');
  IN.Event.on(IN, "auth", function() {
    onLinkedInLogin();
  });
};

function onLinkedInLogin() {
  angular.element(document.getElementById("userBody")).scope().$apply(
    function($scope) {
      $scope.getLinkedInData();
    }
  );
};