// A Forecast Request returns the current weather conditions, a minute-by-minute forecast for the next hour (where available), an hour-by-hour forecast for the next 48 hours, and a day-by-day forecast for the next week.
// https://api.darksky.net/forecast/16dbe7197b8a20ac2c88d6bf52a98374/37.8267,-122.4233?exclude=minutely,hourly,daily,alerts,flags

// https://api.darksky.net/forecast/16dbe7197b8a20ac2c88d6bf52a98374/42.3601,-71.0589,1602148860?exclude=currently,minutely,hourly,alerts
// A Time Machine Request returns the observed (in the past) or forecasted (in the future) hour-by-hour weather and daily weather conditions for a particular date. A Time Machine request is identical in structure to a Forecast Request, except:

// The currently data point will refer to the time provided, rather than the current time.
// The minutely data block will be omitted, unless you are requesting a time within an hour of the present.
// The hourly data block will contain data points starting at midnight (local time) of the day requested, and continuing until midnight (local time) of the following day.
// The daily data block will contain a single data point referring to the requested date.
// The alerts data block will be omitted.

// currently
// minutely
// hourly
// daily
// alerts
// flags


const getForecast = async (data = {}) => {

    const response = await fetch('http://localhost:8081/forecast', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    try {
        let forecast = await response.json();
        return forecast
    }
    catch (error) {
        console.log("No forecast available")
    }
}