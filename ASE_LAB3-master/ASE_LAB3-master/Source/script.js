var mashUp = angular.module ("mashUp", []);

mashup.controller('mashController', ['$scope', function($scope) {
    $scope.gmail={
        username :"",
        email :""
    };
    $scope.onGoogleLogin = function() {
        var param = {
            'clientid': '253727449572-384d4h6v3glcocsaa5kak5k1mjb2m8fj.apps.googleusercontent.com',
            'cookiepolicy': 'single_host_origin',
            'callback': function(result) {
                if(result['status']['signed_in']){
                    var req = gapi.client.plus.people.get(
                        {
                            'userId': 'me'
                        }
                    );
                    req.execute(function(resp){
                        $scope.$apply(function() {
                            $scope.gmail.username = resp.displayName;
                            $scope.gmail.email = resp.emails[0].value;
                            }
                        )
                    })
                }

            },
            'approvalprompt':'force',
            '$scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
        };

        gapi.auth.signIn(param);

    }

}]);

