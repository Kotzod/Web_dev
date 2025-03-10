// Global variable for timespan
let selectedTimespan = 20; // Default to first 20 hours

async function fetchWeather(latitude, longitude) {
    try {
        const ApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m,cloud_cover,wind_speed_10m&timezone=auto`;
        const response = await fetch(ApiUrl);
        const data = await response.json();
        console.log('Weather data:', data);

        const times = data.hourly.time;
        const temperatures = data.hourly.temperature_2m;
        const cloud_cover = data.hourly.cloud_cover;
        const wind_speed = data.hourly.wind_speed_10m;

        return { times, temperatures, cloud_cover, wind_speed };
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
}

async function fetchCity() {
    try {
        const ApiUrlCity = 'https://geocoding-api.open-meteo.com/v1/search?name=Helsinki&count=10&language=en&format=json';
        const response = await fetch(ApiUrlCity);
        const data = await response.json();
        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;
        console.log('Latitude:', latitude, 'Longitude:', longitude);

        const weatherData = await fetchWeather(latitude, longitude);
        if (weatherData) {
            processWeatherData(weatherData);
        }
    } catch (error) {
        console.error('Error fetching city:', error);
    }
}

function processWeatherData({ times, temperatures, cloud_cover, wind_speed }) {
    document.getElementById("timespanForm").addEventListener("submit", function(event){
        event.preventDefault();
        let inputElement = document.getElementById("timespanInput");

        const timespan = parseInt(inputElement.value, 10);
        if (isNaN(timespan) || timespan <= 0) {
            showModal();
            return;
        }
        
        selectedTimespan = timespan;
        updateDisplays(times, temperatures, cloud_cover, wind_speed);
    });

    if (!temperatures.length) return;
    
    updateDisplays(times, temperatures, cloud_cover, wind_speed);
}

function updateDisplays(times, temperatures, cloud_cover, wind_speed) {

    const displayTimes = times.slice(0, selectedTimespan).map(time => new Date(time).toLocaleString());
    const chartLabels = times.slice(0, selectedTimespan).map(time => new Date(time).getHours() + ':00');

    const firstTemps = temperatures.slice(0, selectedTimespan);
    const firstCloudCover = cloud_cover.slice(0, selectedTimespan);
    const firstWindSpeed = wind_speed.slice(0, selectedTimespan);

    populateTable("temperatureTable", displayTimes, firstTemps, "°C");
    populateTable("cloudTable", displayTimes, firstCloudCover, "%");
    populateTable("windTable", displayTimes, firstWindSpeed, "m/s");

    createChart("tempChart", chartLabels, firstTemps, 'Temperature (°C)', 'rgba(255, 99, 132, 0.6)', 
        `Temperature First ${selectedTimespan} Hours`);
    createChart("cloudChart", chartLabels, firstCloudCover, 'Cloud Coverage (%)', 'rgba(54, 162, 235, 0.6)', 
        `Cloud Coverage First ${selectedTimespan} Hours`);
    createChart("windChart", chartLabels, firstWindSpeed, 'Wind Speed (m/s)', 'rgba(75, 192, 192, 0.6)', 
        `Wind Speed First ${selectedTimespan} Hours`);
    
    displayStatistics("tempStats", firstTemps, "°C");
    displayStatistics("cloudStats", firstCloudCover, "%");
    displayStatistics("windStats", firstWindSpeed, "m/s");
    
    document.getElementById("currentTimespan").textContent = selectedTimespan;
}

function showModal() {
    document.getElementById("modal").style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("modalOverlay").style.display = "none";
}

function populateTable(tableId, times, data, unit) {
    const table = document.querySelector(`#${tableId}`);
    let tableBody = table.querySelector("tbody");
    
    if (tableBody) {
        tableBody.innerHTML = "";
    } else {
        tableBody = document.createElement("tbody");
        table.appendChild(tableBody);
    }

    times.forEach((time, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${time}</td><td>${data[i]} ${unit}</td>`;
        tableBody.appendChild(row);
    });
}

function createChart(canvasId, labels, data, label, color, title) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    if (window[canvasId + 'Chart']) {
        window[canvasId + 'Chart'].destroy();
    }

    window[canvasId + 'Chart'] = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: color,
                borderColor: color.replace('0.6', '1'),
                borderWidth: 1,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: "top" },
                title: { display: true, text: title }
            },
            scales: { y: { beginAtZero: false } }
        }
    });
}

function displayStatistics(tableId, data, unit) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    table.innerHTML = `
        <tr><th>Statistic</th><th>Value</th></tr>
        <tr><td>Average</td><td>${getAverage(data).toFixed(2)} ${unit}</td></tr>
        <tr><td>Median</td><td>${getMedian(data).toFixed(2)} ${unit}</td></tr>
        <tr><td>Mode</td><td>${getMode(data).length ? getMode(data).join(', ') + ' ' + unit : 'No mode'}</td></tr>
        <tr><td>Range</td><td>${getRange(data).toFixed(2)} ${unit}</td></tr>
        <tr><td>Standard Deviation</td><td>${getStandardDeviation(data).toFixed(2)} ${unit}</td></tr>
        <tr><td>Min</td><td>${Math.min(...data).toFixed(2)} ${unit}</td></tr>
        <tr><td>Max</td><td>${Math.max(...data).toFixed(2)} ${unit}</td></tr>
        <tr><td>MAD</td><td>${getMAD(data).toFixed(2)} ${unit}</td></tr>`;
}

function getAverage(arr) {
    return arr.reduce((sum, num) => sum + num, 0) / arr.length;
}

function getMedian(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function getMode(arr) {
    let frequency = {};
    let maxFreq = 0;
    let mode = [];

    arr.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        maxFreq = Math.max(maxFreq, frequency[num]);
    });

    for (let num in frequency) {
        if (frequency[num] === maxFreq) {
            mode.push(Number(num));
        }
    }

    return mode.length === arr.length ? [] : mode;
} 

function getRange(arr) {
    return Math.max(...arr) - Math.min(...arr);
}

function getStandardDeviation(arr) {
    const mean = getAverage(arr);
    const variance = getAverage(arr.map(num => (num - mean) ** 2));
    return Math.sqrt(variance);
}

function getMAD(arr) {
    const mean = getAverage(arr);
    const deviations = arr.map(num => Math.abs(num - mean));
    return getAverage(deviations);
}

document.addEventListener('DOMContentLoaded', fetchCity);
