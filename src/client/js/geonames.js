function getGeonames(event) {
    event.preventDefault()

    let place = document.getElementById("destinationInput").value
    const route = 'http://localhost:8081/geonames'
    requestGeonamesData(route, { destination: place })
        .then(function (appData) {
            let select = document.querySelector("#placelist")
            while (select.firstChild) {
                select.firstChild.remove()
            }
            let frag = document.createDocumentFragment()

            let counter = 0
            for (const place of appData) {
                frag.appendChild(new Option(`${place.toponymName}, ${place.countryName}`, counter));
                counter++
            }

            select.appendChild(frag);
            let sectionSaveNewTrip = document.querySelector("#sectionSaveNewTrip")
            sectionSaveNewTrip.style.display = "block"
        })
}

async function requestGeonamesData(url = '', data = {}) {
    let geonamesData = {}
    let response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    try {
        geonamesData = await response.json();
        return geonamesData
    }
    catch (error) {
        console.log("error")
    }
}


function saveTrip() {
    // get new destination
    let select = document.getElementById("placelist")
    let selection = select.options[select.selectedIndex].value;

    // get new date
    let newDate = document.getElementById("newTripStart").value

    saveTripServer('http://localhost:8081/saveTrip', { index: selection, date: newDate })
        .then(function (upcomingTrips) {
            let divUpcomingTrips = document.querySelector("#upcomingTrips")
            while (divUpcomingTrips.firstChild) {
                divUpcomingTrips.firstChild.remove()
            }
            let frag = document.createDocumentFragment()

            for (const trip of upcomingTrips) {
                let section = document.createElement("section")

                let pTripDetails = document.createElement("P")
                pTripDetails.innerHTML = `${trip.destination}, ${trip.country} on ${trip.date}`
                section.appendChild(pTripDetails);

                // To set two dates to two variables 
                var dateTrip = new Date(trip.date)
                var dateToday = new Date();

                // To calculate the time difference of two dates 
                var differenceInTime = dateTrip.getTime() - dateToday.getTime();

                // To calculate the no. of days between two dates 
                var differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

                let pTripCountdown = document.createElement("P")
                pTripCountdown.innerHTML = `Trip is ${differenceInDays} days away.`
                section.appendChild(pTripCountdown);

                let pCoordinates = document.createElement("P")
                pCoordinates.innerHTML = `Longitude: ${trip.lng}, Latitude: ${trip.lat}`
                section.appendChild(pCoordinates);

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

            divUpcomingTrips.appendChild(frag);

        })
    let sectionSaveNewTrip = document.querySelector("#sectionSaveNewTrip")
    sectionSaveNewTrip.style.display = "none"

}

// POST route: save data
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
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("Trip was not saved.", error);
    }
}

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
    getGeonames,
    saveTrip
}
