// load the config file
const config = require("./config.json")

// require all needed libraries
const http = require('http')

// create our local database
let errorDB = []

// the debug print function
let debugMode = config.debugMode
function debug(...args) {
    if (!debugMode) return;
    console.log("[DEBUG] ", ...args)
}

// the error data is passed as a string like get request params
// this is why we process it into a array via this function
function processErrorData(params) {
    let dataArray = params.split("&")
    let dataDict = {}
    for (let i = 0; i < dataArray.length; i++) {
        // array position 0 = idenifier
        // array position 1 = value
        let temp = dataArray[i].split("=")
        if (temp[0] == "error" || temp[0] == "stack") temp[1] = decodeURIComponent(temp[1])
        dataDict[temp[0]] = temp[1]
    }
    return dataDict
}

const server = http.createServer(function (request, response) {
    if (request.method == 'POST') {
        debug("Received Post Request")
        let body = ''
        request.on('data', function (data) {
            body += data
        })
        request.on('end', function () {
            errorDB.push(processErrorData(body))
        })
    } else if (request.method == 'GET') {
        let url = request.url
        if (url == "/") {
            response.writeHead(200, { 'Content-Type': 'text/html' })
            response.write("<h1>Server is running</h1>")
            response.end()
        } else if (url == "/errors") {
            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.write(JSON.stringify(errorDB))
            response.end()
        } else {
            response.writeHead(404, { 'Content-Type': 'text/html' })
            response.write("<h1>404 Not Found</h1>")
            response.end()
        }
    }
})

const port = config.port
const host = config.ip
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)
