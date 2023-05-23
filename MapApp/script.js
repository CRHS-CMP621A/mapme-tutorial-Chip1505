'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map;
let mapEvent;

////////CLASSES/////////
class Workout{
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coors, distance, duration){
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }
}

class Running extends Workout{
    constructor(coords, distance, duration, cadence){
        super(coords, distance, duration);
        this.cadence = cadence;
    }
}

class Cycling extends Workout{
    constructor(coords, distance, duration, elevationGain){
        super(coords, distance, duration);
        this.elevation = elevationGain;
    }
}

navigator.geolocation.getCurrentPosition(
    function(position){
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const coords = [latitude, longitude]

        map = L.map('map').setView(coords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',{
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        map.on('click', function(mapE){
            mapEvent = mapE
            const lat= mapEvent.latlng.lat
            const lng= mapEvent.latlng.lng
            console.log(mapEvent)
    
            form.classList.remove('hidden');
            inputDistance.focus();

            inputDistance.value = null
            inputCadence.value = null
            inputDuration.value = null
            inputType.value = 'running'
        })

        
    },
    function(){
        alert("Could not get position.");
    }
);

// form event listener to check if submitted/completed
form.addEventListener('submit', function(e){
    e.preventDefault()

    
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    const lat= mapEvent.latlng.lat
    const lng= mapEvent.latlng.lng

    let workout;

    if(type === 'running'){
        const cadence = Number(inputCadence.value);

        workout = new Running([lat,lng],distance,duration,cadence);
    }

    if(type === 'cycling'){
        const elevation = +inputElevation.value;

        workout = new Cycling([lat,lng],distance,duration,elevation);
    }

    workouts.push(workout)

    e.preventDefault()


    L.marker([lat, lng]).addTo(map)
    .bindPopup(L.popup({
        maxWidth:250,
        minWidth:100,
        autoClose:false,
        closeOnClick:false,
        className:'running-popup',
    }))
    .setPopupContent('Workout')
    .openPopup();
})

inputType.addEventListener('change', function(){
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
 })
 