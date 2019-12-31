// function creates a dropdown list that shows all possible destinations, after the user searched for a destination
async function getGeonames(event) {
    event.preventDefault()

    let destinationInput = document.getElementById("destinationInput").value
    const route = 'http://localhost:8081/geonames'

    const geonames = await requestGeonamesData(route, { destination: destinationInput })
    try {
        // deleting old entries of dropdown list
        let select = document.querySelector("#placelist")
        while (select.firstChild) {
            select.firstChild.remove()
        }

        // adding new places to dropdown list
        let frag = document.createDocumentFragment()
        let counter = 0
        for (const place of geonames) {
            frag.appendChild(new Option(`${place.toponymName}, ${place.countryName}`, counter));
            counter++
        }
        select.appendChild(frag);

        // after the user searched for a possible destination, dropdown list becomes visible
        let sectionSaveNewTrip = document.querySelector("#sectionSaveNewTrip")
        sectionSaveNewTrip.style.display = "block"
    } catch (e) {
        console.log(e.toString());
    }
}

// function requests geonames data
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
    catch (e) {
        console.log(e.toString())
    }
}

export {
    getGeonames
}
