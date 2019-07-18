
function onLoadFunction() {
    gapi.client.getApiKey('AIzaSyBs_ZPTb6Tvxzc1aOSi1djhWMv5ztGeCZg');
    gapi.client.load('plus', 'v1', function() {});

}

'use strict';

// Declare app level module which depends on views, and components
angular.module('mashApp', [])


    .controller('vCtrl', function ($scope, $http) {
        $scope.venueList = new Array();
        $scope.mostRecentReview;
        $scope.getVenues = function () {
            var placeEntered = document.getElementById("place").value;
            var searchQuery = document.getElementById("filter").value;
            if (placeEntered != null && placeEntered != "" && searchQuery != null && searchQuery != "") {
                document.getElementById('review').style.display = 'none';
                //This is the API that gives the list of venues based on the place and search query.
                var handler = $http.get("https://api.foursquare.com/v2/venues/search" +
                    "?client_id=ILPHSIETYXAO42GVTPBAHALP3VXD4ZV2R22LGFZ3IFUAFGFY" +
                    "&client_secret=123NZYY2RYG2LZYMXDSZCN1MGGYJ0UW5GMNQDAFF302YSXXQ" +
                    "&v=20160215&limit=5" +
                    "&near=" + placeEntered +
                    "&query=" + searchQuery);
                handler.success(function (data) {

                    if (data != null && data.response != null && data.response.venues != undefined && data.response.venues != null) {
                        for (var i = 0; i < data.response.venues.length; i++) {
                            $scope.venueList[i] = {
                                "name": data.response.venues[i].name,
                                "id": data.response.venues[i].id,
                                "location": data.response.venues[i].location
                            };
                        }
                    }

                })
                handler.error(function (data) {
                    alert("There was some error processing your request. Please try after some time.");
                });
            }
        }
        $scope.getReviews = function (venueSelected) {
            if (venueSelected != null) {
                //This is the API call being made to get the reviews(tips) for the selected place or venue.
                var handler = $http.get("https://api.foursquare.com/v2/venues/" + venueSelected.id + "/tips" +
                    "?sort=recent" +
                    "&client_id=ILPHSIETYXAO42GVTPBAHALP3VXD4ZV2R22LGFZ3IFUAFGFY" +
                    "&client_secret=123NZYY2RYG2LZYMXDSZCN1MGGYJ0UW5GMNQDAFF302YSXXQ&v=20170207" +
                    "&limit=5");
                handler.success(function (result) {
                    if (result != null && result.response != null && result.response.tips != null &&
                        result.response.tips.items != null) {
                        $scope.mostRecentReview = result.response.tips.items[0];
                        //This is the Alchemy API for getting the sentiment of the most recent review for a place.
                        var callback = $http.get("http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment" +
                            "?apikey=d0e7bf68cdda677938e6c186eaf2b755ef737cd8" +
                            "&outputMode=json&text=" + $scope.mostRecentReview.text);
                        callback.success(function (data) {
                            if(data!=null && data.docSentiment!=null)
                            {
                                $scope.ReviewWithSentiment = {"reviewText" : $scope.mostRecentReview.text,
                                    "sentiment":data.docSentiment.type,
                                    "score":data.docSentiment.score  };
                                document.getElementById('review').style.display = 'block';


                            }
                        })
                    }
                })
                handler.error(function (result) {
                    alert("There was some error processing your request. Please try after some time.")
                })
            }

        }

    });

