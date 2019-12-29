function performAction(e) {
    alert('Click!')
    // // Create a new date instance dynamically with JS
    // let d = new Date();
    // let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

    // const zipCode = document.getElementById('zip').value;
    // retrieveWeatherData(baseURL + zipCode + apiKey)
    //     .then(function (data) {
    //         const uResponse = document.getElementById('feelings').value;
    //         saveWeatherDataAndComment('/saveData', { temperature: data.main.temp, date: newDate, userResponse: uResponse });
    //         updateUI();
    //     })
}

export {
    performAction
}
