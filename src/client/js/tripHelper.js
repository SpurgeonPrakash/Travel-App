// function saves a new trip, and rebuilds upcoming trip section
async function saveTrip() {
    // get new destination
    let select = document.getElementById("placelist")
    let selection = select.options[select.selectedIndex].value;

    // get new date
    let newDate = document.getElementById("newTripStart").value

    await saveTripServer('http://localhost:8081/saveTrip', { index: selection, date: newDate })
    const upcomingTrips = await getUpcomingTrips('http://localhost:8081/futureTrips')

    let divUpcomingTrips = document.querySelector("#upcomingTrips")
    while (divUpcomingTrips.firstChild) {
        divUpcomingTrips.firstChild.remove()
    }
    let frag = document.createDocumentFragment()

    for (const trip of upcomingTrips) {
        let section = document.createElement("SECTION")

        let pTripDetails = document.createElement("P")
        pTripDetails.innerHTML = `${trip.destination}, ${trip.country} on ${trip.date}`
        section.appendChild(pTripDetails);

        let pTripCountdown = document.createElement("P")
        pTripCountdown.innerHTML = `Trip is ${trip.daysUntilTripStart} days away.`
        section.appendChild(pTripCountdown);

        let pTemperature = document.createElement("P")
        pTemperature.innerHTML = `Typical weather for then is: High ${trip.temperatureHigh},Low ${trip.temperatureLow}.`
        section.appendChild(pTemperature);

        let tripId = trip.id
        section.setAttribute("id", `trip${tripId}`)

        let deleteTripButton = document.createElement("BUTTON")
        deleteTripButton.innerHTML = "delete"
        section.appendChild(deleteTripButton)
        deleteTripButton.addEventListener("click", function () {
            deleteUpcomingTrip('http://localhost:8081/deleteTrip', { id: tripId })
                .then(function (id) {
                    section = document.querySelector(`#trip${id.deletedTripId}`)
                    while (section.firstChild) {
                        section.firstChild.remove()
                    }

                })

        })
        frag.appendChild(section)
    }
    divUpcomingTrips.appendChild(frag)
    let sectionSaveNewTrip = document.querySelector("#sectionSaveNewTrip")
    sectionSaveNewTrip.style.display = "none"
}



// POST route: save trip data to server
const saveTripServer = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    try {
        // const newData = await response.json();
        // return newData;
    } catch (error) {
        console.log("Trip was not saved.", error);
    }
}

// get upcoming trips saved on the server, data is enriched by countdown and temperature "forecast"
const getUpcomingTrips = async (url = '', data = {}) => {

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    try {
        let result = await response.json();
        return result
    }
    catch (error) {
        console.log("Trip was not deleted")
    }
}

// helper function to delete future trip on the server
const deleteUpcomingTrip = async (url = '', data = {}) => {

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    try {
        let result = await response.json();
        return result
    }
    catch (error) {
        console.log("Trip was not deleted")
    }
}

export {
    saveTrip
}