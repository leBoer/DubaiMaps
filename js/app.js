/**
 * Created by Christian on 18/09/2016.
 */

//**----The Model----**//
var locations = [
    {
        title: 'TribeFit',
        id: '513c0f27e4b024277fd07363',
        location: {
            lat: 25.074822,
            lng: 55.13843799999999
        }
    },
    {
        title: 'Fitness Factory Gym & Cafe',
        id: '4cea56086afd6a314f7ed74d',
        location: {
            lat: 25.047123,
            lng: 55.13072400000001
        }
    },
    {
        title: 'FitRepublik',
        id: '54ab87ed498ea4e6cfdcd05f',
        location: {
            lat: 25.037640479844804,
            lng: 55.22657075753127
        }
    },
    {
        title: 'Fitness First Lakes Club',
        id: '4dc3add57d8b14fb45fd94a0',
        location: {
            lat: 25.079192105184507,
            lng: 55.16771534151269
        }
    },
    {
        title: 'Talise Fitness',
        id: '4c0f78dbb60ed13a327030f2',
        location: {
            lat: 25.134795093065133,
            lng: 55.1857852935791
        }
    }
];
//**----The ViewModel----**//
// Alerts the user that there has been an error unless the maps api responds within 5 seconds.
setTimeout(function() {
    if(!window.google || !window.google.maps) {
        alert('There is a problem with the Google Maps API. Please check back later.')
    }
}, 5000);
// Maps api asynchronous load code here.
var map;
var markers = [];
var viewModel = {
    items: ko.observableArray([]),
    filter: ko.observable(""),

    markersFromModel: function() {
        largeInfowindow = new google.maps.InfoWindow();
        // Creates an array of the locations for use as markers on initialize.
        // Credit goes to the Google API course here on Udacity.
        for (var i = 0; i < locations.length; i++) {
            var position = locations[i].location;
            var title = locations[i].title;
            var id = locations[i].id;
            // Create markers for each location and puts into the markers array.
            var marker = new google.maps.Marker({
                position: position,
                map: map,
                title: title,
                animation: google.maps.Animation.DROP,
                id: id
            });
            // Push the marker to our array of markers.
            markers.push(marker);
            // Create an onclick event to open the large infowindow at each marker.
            marker.addListener('click', function() {
                viewModel.populateInfoWindow(this, largeInfowindow);
            });
        }
    },
    // Start the marker bounce
    toggleBounce: function(marker) {
        viewModel.stopBounce();
        marker.setAnimation(google.maps.Animation.BOUNCE);
    },
    // Stop the marker bounce
    stopBounce: function() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setAnimation(null);
        }
    },
    // First removes all markers, and then places them again if they are part of the filter.
    markersVisible: function() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(false);
            for (var j = 0; j < viewModel.filteredItems().length; j++) {
                if (markers[i].id == viewModel.filteredItems()[j].id) {
                    markers[i].setVisible(true);
                }
            }
        }
    },
    // Opens the infowindow when a gym is clicked in the list
    clickGym : function(item) {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].id == item.id) {
                viewModel.populateInfoWindow(markers[i], largeInfowindow);
            }
        }
    },
    populateInfoWindow: function(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            // Clear the infowindow content to give the streetview time to load.
            infowindow.setContent('');
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
                viewModel.stopBounce();
            });
            // This function does everything needed to get the Foursquare info loaded to the infoWindow.
            function getVenueInfo() {
                var clientId = 'ZQ3FU1XQ41GNCR10FGQMQ54SFUNASZ5CXP1POHJWIEG1GQ3M';
                var clientSecret = 'NOPQ4SNHLMZDLXCZD0WEK2TX0ETRDIJP1MOWCWNKRCGSB5GJ';
                var foursquareLink = 'https://api.foursquare.com/v2/venues/';
                var version = '20160906';
                // Generate the url that we use in the .ajax request towards foursquare.
                var searchLink = foursquareLink + marker.id +'?client_id='+ clientId +'&client_secret='+ clientSecret +'&v='+ version;
                infowindow.setContent('<div>' + marker.title + '</div><div id="photo"></div>');
                $.ajax({
                    url: searchLink
                }).done(function(data){
                    // Adds the best photo to the infowindow
                    if(data.response.venue.bestPhoto) {
                        var bestPhoto = data.response.venue.bestPhoto.prefix +'width200'+ data.response.venue.bestPhoto.suffix;
                        $('#photo').append('<img src="'+ bestPhoto +'">');
                    } else {
                        $('#photo').append('<p>No photos exist of this place. Suspicious?</p>');
                    }
                }).error(function(){
                    alert("There is a problem with our Foursquare data, and you will not be able to see more information. Please come back at a later date.");
                })
            }
            // Open the infowindow on the correct marker.
            viewModel.toggleBounce(marker);
            getVenueInfo();
            infowindow.open(map, marker);
        }
    }
};
//*************The Filtering*************//
viewModel.items = ko.observableArray(locations);
// Filters the items
viewModel.filteredItems = ko.computed(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
        return this.items();
    } else {
        return ko.utils.arrayFilter(this.items(), function(item) {
            return item.title.toLowerCase().indexOf(filter) >=0;
        });
    }
}, viewModel);

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 25.0712980, lng: 55.2093505},
        zoom: 13,
        mapTypeControl: false
    });
    ko.applyBindings(new viewModel.markersFromModel());
}
