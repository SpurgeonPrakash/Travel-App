
// function creates a dropdown menu that shows all possible destinations after the user searched for a destination
function getGeonames(event) {
    event.preventDefault()

    let destinationInput = document.getElementById("destinationInput").value
    const route = 'http://localhost:8081/geonames'
    requestGeonamesData(route, { destination: destinationInput })
        .then(function (geonames) {
            let select = document.querySelector("#placelist")
            while (select.firstChild) {
                select.firstChild.remove()
            }
            let frag = document.createDocumentFragment()

            let counter = 0
            for (const place of geonames) {
                frag.appendChild(new Option(`${place.toponymName}, ${place.countryName}`, counter));
                counter++
            }

            select.appendChild(frag);
            let sectionSaveNewTrip = document.querySelector("#sectionSaveNewTrip")
            sectionSaveNewTrip.style.display = "block"
        })
}

// function makes a geonames request, called by getGeonames
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
