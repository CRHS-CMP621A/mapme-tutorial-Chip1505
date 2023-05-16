navigator.geolocation.getCurrentPosition(
    function(position){
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude, longitude);

        var map = L.map('map').setView([51.505, -0.09], 13);

        

    },
    function(){
        alert("Could not get position.");
    }
);