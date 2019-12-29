/* Function is called when user clicks submit button */
/* Function triggers AYLIEN analysis */
function handleSubmit(event) {
    event.preventDefault()

    // check if a correct url was put into the form field
    let formText = document.getElementById('url').value
    let correctURL = Client.validURL(formText)

    if (correctURL) {
        clearForm()
        const route = 'http://localhost:8081/sentiment'
        getSentimentAnalysis(route, { url: formText })
            .then(function (analysis) {
                if (analysis.status == "OK") {
                    document.getElementById('polarity').innerHTML = analysis.polarity
                    document.getElementById('polarityConfidence').innerHTML = Number.parseFloat(analysis.polarityConfidence).toFixed(2)
                    document.getElementById('subjectivity').innerHTML = analysis.subjectivity
                    document.getElementById('subjectivityConfidence').innerHTML = Number.parseFloat(analysis.subjectivityConfidence).toFixed(2)
                    document.getElementById('status').innerHTML = analysis.status
                } else {
                    document.getElementById('status').innerHTML = analysis.status
                }
            })
    } else {
        document.getElementById("status").innerHTML = "invalid url"
    }
}

/* Function to retrieve AYLIEN analysis */
async function getSentimentAnalysis(url = '', data = {}) {
    let analysis = {}
    let response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    try {
        analysis = await response.json();
        return analysis
    }
    catch (error) {
        analysis.status = "unknown error"
        return analysis
    }

}

/* Function to clear input form and output fields */
function clearForm() {
    document.getElementById('polarity').innerHTML = ""
    document.getElementById('polarityConfidence').innerHTML = ""
    document.getElementById('subjectivity').innerHTML = ""
    document.getElementById('subjectivityConfidence').innerHTML = ""
    document.getElementById('status').innerHTML = ""
}

export {
    handleSubmit,
    getSentimentAnalysis
}
