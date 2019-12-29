// const url = 'http://api.geonames.org/search?username=' & process.env.usernameGeonames
const url = 'http://api.geonames.org/searchJSON?username=cadwebdev'

function getGeonames(e) {
    let place = document.getElementById("destinationInput").value

    requestGeonamesData(url + "&name_equals=" + place)
        .then(function (appData) {
            let divDropdown = document.querySelector("#placelist")
            while (divDropdown.firstChild) {
                divDropdown.firstChild.remove()
            }
            let frag = document.createDocumentFragment()
            let select = document.createElement("select");

            let counter = 0
            for (const place of appData) {
                select.options.add(new Option(`${place.toponymName}, ${place.countryName}`, counter));
                counter++
            }

            frag.appendChild(select);
            divDropdown.appendChild(frag);
        })
}

// Geonames API
const requestGeonamesData = async (url = '') => {
    let appData = []
    try {
        const res = await fetch(url)
        var data = await res.json()

        let counter = 0
        let addCity = true

        for (const datapoint of data.geonames) {
            if (datapoint.population != 0) {
                for (const place of appData) {
                    if ((Math.abs(place.lat - datapoint.lat) < 15.0) && (place.countryName == datapoint.countryName)) {
                        addCity = false
                    }
                    else if ((Math.abs(place.lng - datapoint.lng) < 15.0) && (place.countryName == datapoint.countryName)) {
                        addCity = false
                    }

                }

                if (addCity) {
                    let { toponymName, countryName, lng, lat } = datapoint
                    appData[counter] = { toponymName, countryName, lng, lat }



                    counter++
                    console.log(datapoint.toponymName)
                    console.log(datapoint.name)
                    console.log(datapoint.countryName)
                    console.log(datapoint.lng)
                    console.log(datapoint.lat)
                    console.log(datapoint.population)
                    console.log(datapoint.fcode)
                    console.log('----------------')
                }
                addCity = true
            }
        }

    } catch (e) {
        console.log(e.toString())
    }

    return appData
}

function saveTrip() {

}

export {
    getGeonames,
    saveTrip
}
