/**
 * Created by Christian on 04/09/2016.
 */

//**----The Model----**//
var model = ko.observableArray([
    {
        title: 'TribeFit',
        location: {
            lat: 25.074822,
            lng: 55.13843799999999
        }
    },
    {
        title: 'Fitness Factory Gym & Caf',
        location: {
            lat: 25.047123,
            lng: 55.13072400000001
        }
    }
]);

//**----The View----**//

//**----The ViewModel----**//
var map;
var viewModel = function(){


};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 25.0601975, lng: 55.2093505},
        zoom: 13,
        mapTypeControl: false
    });
    ko.applyBindings(new viewModel());
}

