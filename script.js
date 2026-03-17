const API_KEY = "0133cc5316757ac730cc46ae342334e4";

// Correct selectors
const cityInput = document.getElementById("cityInput");
const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temp");
const weatherEl = document.getElementById("weather");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const historyDiv = document.getElementById("history");

// Load history
let cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];
displayHistory();

// ✅ MAIN FUNCTION (called from button)
async function getWeather(cityName) {

    console.log("1️⃣ Sync Start");

    const city = cityName || cityInput.value.trim();

    if (!city) {
        alert("Please enter city name");
        return;
    }

    console.log("2️⃣ [ASYNC] Start fetching");

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        console.log("3️⃣ Response received");

        if (!res.ok) {
            throw new Error("City not found");
        }

        const data = await res.json();

        console.log("4️⃣ Data processed");

        // ✅ Update UI (matches your HTML)
        cityEl.innerText = `${data.name}, ${data.sys.country}`;
        tempEl.innerText = `${data.main.temp} °C`;
        weatherEl.innerText = data.weather[0].main;
        humidityEl.innerText = `${data.main.humidity}%`;
        windEl.innerText = `${data.wind.speed} m/s`;

        // ✅ Save history
        if (!cityHistory.includes(city)) {
            cityHistory.push(city);
            localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
            displayHistory();
        }

    } catch (error) {
        console.log("❌ Error:", error);
        alert(error.message);
    }

    console.log("5️⃣ Sync End");
}

// ✅ DISPLAY HISTORY
function displayHistory() {
    historyDiv.innerHTML = "";

    cityHistory.forEach((city) => {
        const span = document.createElement("span");
        span.innerText = city;

        span.addEventListener("click", () => {
            getWeather(city);
        });

        historyDiv.appendChild(span);
    });
}