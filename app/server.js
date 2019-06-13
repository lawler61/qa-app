const http = require('http')
const fs = require('fs')

const port = 8080

const server = http.createServer((req, res) => {
  const basePath = './dist'
  const filePath = `${basePath}${req.url === '/' ? '/index.html' : req.url}`

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.write('<h1 style="text-align: center; margin: 150px;">404!</h1>')
    } else {
      res.write(data)
    }
    res.end()
  })
})

server.listen(port, () => console.log(`your app is running at http://localhost:${port} :)`))
