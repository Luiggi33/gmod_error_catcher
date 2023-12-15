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
        if (temp[0] == "error" || temp[0] == "stack") {
            temp[1] = decodeURIComponent(temp[1])
            temp[1] = temp[1].replace(/\+/g, " ")
        }
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
            let data = processErrorData(body)
            data.date = new Date()
            errorDB.push(data)
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
        } else if (url == "/errorview") {
            response.writeHead(200, { 'Content-Type': 'text/html' })
            response.write("<h1>Errors</h1>")
            response.write("<p>There are " + errorDB.length + " errors</p>")
            for (let i = 0; i < errorDB.length; i++) {
                let error = errorDB[i]
                response.write("<h2> Error " + (i + 1) + "</h2>")
                response.write("<p> Error: " + error.error + "</p>")
                response.write("<p> Stack</p>")
                response.write("<pre>" + error.stack + "</pre>")
                response.write("<p> Date: " + error.date + "</p>")
            }
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
