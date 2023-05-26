'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

//Task 3.2 Declare map and mapEvent as global variables
let map;
let mapEvent;
let workouts = [];

//Task 4.1 - create the classes
///// CLASSES ////
class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in kms
    this.duration = duration; //in mins
  }
}

//Task 4.2 - children of workout class
class Running extends Workout {
  type = "Running";

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration); // from Workout class
    this.cadence = cadence;
    this.calcPace(); //calculates the pace
    this.setDescription(); //sets the description for the workout title
  }

  //methods
  calcPace() {
    
    this.pace = this.duration / this.distance;
    this.pace = this.pace.toFixed(1);
    return this.pace;
  }

  setDescription() {
    // Running on ___date____
    this.description = `${this.type} on ${this.date.toDateString()}`;
  }
}

class Cycling extends Workout {
  type = "Cycling";
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration); // from Workout class
    this.elevation = elevationGain;
    this.calcSpeed();
    this.setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    this.speed = this.speed.toFixed(1);
    return this.speed;
  }

  setDescription() {
    // Cycling on ___date____
    this.description = `${this.type} on ${this.date.toDateString()}`;
  }
}

//Task 4.3  Testing Workout classes
const run1 = new Running([39, -12], 5.2, 24, 178);
const cycling1 = new Cycling([39, -12], 27, 95, 523);
console.log(run1, cycling1);

navigator.geolocation.getCurrentPosition(
  function (position) {
    // console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords = [latitude, longitude];

    map = L.map("map").setView(coords, 13);

    map.on("click", function (mapE) {
      mapEvent = mapE; // Task 3.2 - assign the mapE local variable to the global MapEvent variable

      // Task 3.1 - Display user input form on the left of the screen
      form.classList.remove("hidden");
      inputDistance.focus();
    });

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const data = JSON.parse(localStorage.getItem("workouts"));

    if (data) {
      workouts = data;
      console.log(data);
    }

    let html;
    for (let workout of workouts) {

      if (workout.type === "Running") {
        html = `<li class="workout workout--running" data-id=${workout.id}>
                <h2 class="workout__title">${workout.description}</h2>
                <div class="workout__details">
                  <span class="workout__icon">🏃‍♂️</span>
                  <span class="workout__value">${workout.distance}</span>
                  <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">⏱</span>
                  <span class="workout__value">${workout.duration}</span>
                  <span class="workout__unit">min</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">⚡️</span>
                  <span class="workout__value">${workout.pace}</span>
                  <span class="workout__unit">min/km</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">🦶🏼</span>
                  <span class="workout__value">${workout.cadence}</span>
                  <span class="workout__unit">spm</span>
                </div>
              </li>`;
      } else if (workout.type === "Cycling") {
        html = `<li class="workout workout--cycling" data-id=${workout.id}>
            <h2 class="workout__title">${workout.description}</h2>
            <div class="workout__details">
              <span class="workout__icon">🚴‍♀️</span>
              <span class="workout__value">${workout.distance}</span>
              <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${workout.duration}</span>
              <span class="workout__unit">min</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.speed}</span>
              <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⛰</span>
              <span class="workout__value">${workout.elevation}</span>
              <span class="workout__unit">m</span>
            </div>
          </li>`;
      }
      console.log(html);
      form.insertAdjacentHTML("afterend", html);
    }
  },
  function () {
    alert("Could not get position.");
  }
);

form.addEventListener("submit", function (e) {
  e.preventDefault(); 

  const type = inputType.value;
  const distance = Number(inputDistance.value);
  const duration = Number(inputDuration.value);
  const lat = mapEvent.latlng.lat;
  const lng = mapEvent.latlng.lng;
  let workout;

  if (type === "running") {
    const cadence = Number(inputCadence.value);

    workout = new Running([lat, lng], distance, duration, cadence);
  }

  if (type === "cycling") {
    const elevation = +inputElevation.value;

    workout = new Cycling([lat, lng], distance, duration, elevation);
  }

  workouts.push(workout); 
  console.log(workouts);

  localStorage.setItem("workouts", JSON.stringify(workouts));

  let html;

  if (type === "running") {
    html = `<li class="workout workout--running" data-id=${workout.id}>
                <h2 class="workout__title">${workout.description}</h2>
                <div class="workout__details">
                  <span class="workout__icon">🏃‍♂️</span>
                  <span class="workout__value">${workout.distance}</span>
                  <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">⏱</span>
                  <span class="workout__value">${workout.duration}</span>
                  <span class="workout__unit">min</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">⚡️</span>
                  <span class="workout__value">${workout.pace}</span>
                  <span class="workout__unit">min/km</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">🦶🏼</span>
                  <span class="workout__value">${workout.cadence}</span>
                  <span class="workout__unit">spm</span>
                </div>
              </li>`;
  } else if (type === "cycling") {
    html = `<li class="workout workout--cycling" data-id=${workout.id}>
            <h2 class="workout__title">${workout.description}</h2>
            <div class="workout__details">
              <span class="workout__icon">🚴‍♀️</span>
              <span class="workout__value">${workout.distance}</span>
              <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${workout.duration}</span>
              <span class="workout__unit">min</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.speed}</span>
              <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⛰</span>
              <span class="workout__value">${workout.elevation}</span>
              <span class="workout__unit">m</span>
            </div>
          </li>`;
  }

  form.insertAdjacentHTML("afterend", html);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("Workout")
    .openPopup();

  form.reset();
  form.classList.add("hidden");
});

inputType.addEventListener("change", function () {
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
});

containerWorkouts.addEventListener("click", function (e) {
  const workoutEl = e.target.closest(".workout"); 

  if (!workoutEl) return;

  const workout = workouts.find((work) => work.id === workoutEl.dataset.id);

  map.setView(workout.coords, 13, {
    animate: true,
    pan: {
      duration: 1,
    },
  });
});



 
 

 
 