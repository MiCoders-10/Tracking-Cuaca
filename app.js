const iconElement = document.querySelector(".weather-icon");
const locationIcon = document.querySelector(".location-icon"); // Pastikan class benar
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

var input = document.getElementById("search");
let city = "";
let latitude = 0.0;
let longitude = 0.0;

input.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        city = input.value.trim(); // Hindari spasi kosong
        if (city) {
            getSearchWeather(city);
            console.log(city);
        } else {
            showError({ message: "Masukkan nama kota terlebih dahulu!" });
        }
    }
});

const weather = {
    temperature: {
        value: null, // Pastikan value didefinisikan sejak awal
        unit: "celsius"
    }
};

const key = "a14aee140f066091b9189ac33b113b27";

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    showError({ message: "Browser tidak mendukung geolocation" });
}

function setPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

locationIcon.addEventListener("click", function () {
    console.log("Mencari cuaca berdasarkan lokasi...");
    getWeather(latitude, longitude);
});

function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

function getSearchWeather(city) {
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;

    fetch(api)
        .then(response => {
            if (!response.ok) throw new Error("Kota tidak ditemukan!");
            return response.json();
        })
        .then(data => {
            if (data.main && data.weather) {
                weather.temperature.value = Math.floor(data.main.temp);
                weather.description = data.weather[0].description;
                weather.iconId = data.weather[0].icon;
                weather.city = data.name;
                weather.country = data.sys.country;
                displayWeather();
            } else {
                throw new Error("Data cuaca tidak lengkap!");
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            showError(error);
        });
}

function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;

    fetch(api)
        .then(response => {
            if (!response.ok) throw new Error("Tidak bisa mendapatkan cuaca dari lokasi!");
            return response.json();
        })
        .then(data => {
            if (data.main && data.weather) {
                weather.temperature.value = Math.floor(data.main.temp);
                weather.description = data.weather[0].description;
                weather.iconId = data.weather[0].icon;
                weather.city = data.name;
                weather.country = data.sys.country;
                displayWeather();
            } else {
                throw new Error("Data cuaca tidak lengkap!");
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            showError(error);
        });
}

function displayWeather() {
    if (weather.temperature.value !== null) {
        iconElement.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather.iconId}@2x.png"/>`;
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        descElement.innerHTML = weather.description;
        locationElement.innerHTML = `${weather.city}, ${weather.country}`;
        notificationElement.style.display = "none"; // Sembunyikan error jika sukses
    } else {
        showError({ message: "Data cuaca tidak tersedia" });
    }
}
