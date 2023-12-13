// load the config file
const config = require("./config.json")

// require all needed libraries
const http = require('http')

// create our local database
let errorDB = {}

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
    for (let i = 0; i < dataArray.length; i++) {
        // array position 0 = idenifier
        // array position 1 = value
        dataArray[i] = dataArray[i].split("=")
    }
    return dataArray
}

const server = http.createServer(function (request, response) {
    if (request.method == 'POST') {
        debug("Received Post Request")
        var body = ''
        request.on('data', function (data) {
            body += data
        })
        request.on('end', function () {
            errorDB.push(processErrorData(body))
        })
    } else if (request.method == 'GET') {
        var html = `
            <html>
                <body>
                    <h1>ToDO</h1>
                </body>
            </html>`
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.end(html)
    }
})

const port = config.port
const host = config.ip
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)
