const server = require('./api/server')

const port = 5000 | 3000;


server.listen(port, () => {
    console.log(` http://localhost:${port}`)
})


