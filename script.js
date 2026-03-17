const API_KEY="0133cc5316757ac730cc46ae342334e4"
const form=document.querySelector('#form')
const weatherDetail=document.querySelector('.info')
const searchHistory=document.querySelector('.historyBtn')

// Load history from localStorage; support old string-based entries and migrate to unique object entries.
let cityHistory = (function () {
    const stored = JSON.parse(localStorage.getItem("cityHistory")) || [];
    if (stored.length && typeof stored[0] === "string") {
        // migrate old format to object with a key (lowercase) for uniqueness
        return stored.map(city => ({
            key: city.toLowerCase(),
            city,
            timestamp: null,
        }));
    }
    return stored;
})();

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const searchCity = city.value;
    console.log(searchCity);
    getData(searchCity);
});

async function getData(searchCity) {
    if (searchCity){
        try{
            const res =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}`)
            const data=await res.json()
            if(data.cod===200){
                weatherDetail.innerHTML=`
                <p>City: ${data.name}</p>
                <p>Temp: ${(data.main.temp-273).toFixed(1)}C</p>
                <p>Weather: ${data.weather[0].main}</p>
                <p>Humidity: ${data.main.humidity}</p>
                <p>Wind: ${data.wind.speed}m/s</p>
                `
                addCityToHistory(searchCity);
                displayHistory();
            }else{
                weatherDetail.innerHTML=`<p>City not found</p>`
            }
        }catch(e){
            console.log(e)
        }
    }
}

function saveHistory() {
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
}

function addCityToHistory(city) {
    const normalized = city.trim();
    const key = normalized.toLowerCase();
    const now = new Date().toISOString();

    const existing = cityHistory.find(entry => entry.key === key);
    if (existing) {
        existing.city = normalized;
        existing.timestamp = now;
    } else {
        cityHistory.push({ key, city: normalized, timestamp: now });
    }

    saveHistory();
}

function loadHistory() {
    cityHistory = (function () {
        const stored = JSON.parse(localStorage.getItem("cityHistory")) || [];
        if (stored.length && typeof stored[0] === "string") {
            return stored.map(city => ({
                key: city.toLowerCase(),
                city,
                timestamp: null,
            }));
        }
        return stored;
    })();
}

function displayHistory() {
    loadHistory();
    searchHistory.innerHTML = "";
    if (!cityHistory || !cityHistory.length) return;

    cityHistory
        .slice()
        .sort((a, b) => {
            if (!a.timestamp) return 1;
            if (!b.timestamp) return -1;
            return b.timestamp.localeCompare(a.timestamp);
        })
        .forEach(entry => {
            const btn = document.createElement("button");
            const timeLabel = entry.timestamp ? ` (${new Date(entry.timestamp).toLocaleString()})` : "";
            btn.innerText = `${entry.city}${timeLabel}`;
            btn.addEventListener("click", function() {
                getData(entry.city);
            });
            searchHistory.appendChild(btn);
        });
}

displayHistory();