/* Function to check if url is valid */
function validURL(url) {
    // https://regexr.com/39nr7
    let urlRGEX = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

    if (urlRGEX.test(url)) {
        return true
    } else {
        return false
    }
}

export { validURL }