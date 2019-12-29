import { handleSubmit } from './js/formHandler'
import { validURL } from './js/urlChecker'
import { performAction } from './js/app'
import { getGeonames } from './js/geonames'
import { saveTrip } from './js/geonames'


import './styles/resets.scss'
import './styles/variables.scss'
import './styles/base.scss'
import './styles/header.scss'
import './styles/form.scss'
import './styles/result.scss'
import './styles/footer.scss'

document.getElementById("searchDestinationButton").addEventListener("click", getGeonames)
document.getElementById("saveTripButton").addEventListener("click", saveTrip)

export {
    handleSubmit,
    validURL,
    performAction,
    getGeonames
}


