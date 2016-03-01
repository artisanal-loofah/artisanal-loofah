function onLinkedInLoad() {
  $('a[id*=li_ui_li_gen_]').css({marginBottom:'20px'}) 
  .html('<img src="../assets/Sign-In-Large---Default.png" height="50" width="250" border="0" />');
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
