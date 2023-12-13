const http = require('http')
const debugMode = true;

function debug(...args) {
    if (!debugMode) return;
    console.log("[DEBUG] ", ...args)
}

function processErrorData(data) {
    let dataArray = data.split("&")
    for (let i = 0; i < dataArray.length; i++) {
        dataArray[i] = dataArray[i].split("=")
    }
    return dataArray
}

let errorDB = {}
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

const port = 3000
const host = '127.0.0.1'
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)
