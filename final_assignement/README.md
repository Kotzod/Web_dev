# Weather Forecast Application

## Overview
This web application displays weather forecast data for Helsinki, Finland. It fetches data from the Open-Meteo API and presents temperature, cloud coverage, and wind speed information through tables, charts, and statistical analysis.

## Features
- **Data Tables**: Display temperature, cloud coverage, and wind speed for a specified number of hours
- **Interactive Charts**: Visualize weather data with line charts using Chart.js
- **Statistical Analysis**: View key statistics including average, median, mode, range, standard deviation, min, max, and mean absolute deviation
- **Customizable Timespan**: Adjust the number of hours of forecast data to display

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- Chart.js
- Open-Meteo API

## Project Structure
```
final_assignment/
├── main.html         # Main HTML document
├── style.css         # CSS styling
├── script.js         # JavaScript functionality
└── README.md         # This documentation
```

## How to Use
1. Open `main.html` in a web browser
2. The application will automatically load with the default timespan of 20 hours
3. Browse through different sections of data:
   - Phase 1: Data tables
   - Phase 2: Charts
   - Phase 3: Statistics
4. To change the timespan:
   - Navigate to the "Choose a timespan" section
   - Enter a positive number in the input field
   - Click "Submit" to update all displays with the new timespan value

## API Reference
This application uses two APIs from Open-Meteo:
1. **Weather Forecast API**: `https://api.open-meteo.com/v1/forecast`
   - Provides hourly temperature, cloud cover, and wind speed data
2. **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search`
   - Used to get latitude and longitude for Helsinki

## Implementation Details

### Data Processing
The application fetches weather data for Helsinki, processes it, and displays it in various formats. The main data processing steps include:
- Fetching city coordinates
- Retrieving weather forecast data based on those coordinates
- Processing and displaying the data according to the selected timespan

### Statistics Calculated
- **Average**: Sum of values divided by count
- **Median**: Middle value in the sorted dataset
- **Mode**: Most frequently occurring value(s)
- **Range**: Difference between maximum and minimum values
- **Standard Deviation**: Measure of data dispersion
- **Minimum/Maximum**: Smallest/largest values in the dataset
- **Mean Absolute Deviation (MAD)**: Average distance from the mean

### Charts
All charts are created using Chart.js and display the following data:
- **Temperature Chart**: Shows temperature (°C) over time
- **Cloud Coverage Chart**: Shows cloud coverage percentage over time
- **Wind Speed Chart**: Shows wind speed (m/s) over time

## Future Enhancements
Potential improvements for future versions:
- Add location search functionality to view weather for different cities
- Implement forecast comparison between multiple locations
- Add precipitation and humidity data
- Create a mobile-responsive design
- Add day/night mode toggle
