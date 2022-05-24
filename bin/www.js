#!/usr/bin/env node

const app = require('../app')
const log = require('../lib/debug')(__filename)
const http = require('http')

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort (val) {
  const port = parseInt(val, 10)
  if (isNaN(port)) return val // named pipe
  return port >= 0 ? port : false // port number
}

async function main () {
  /**
   * Get port from environment and store in Express.
   */
  const port = normalizePort(process.env.PORT || '3000')
  app.set('port', port)

  /**
   * Create HTTP server.
   */
  const server = http.createServer(app)

  /**
   * Socket.io bootstrap
   */
  await require('../socketio').bootstrap(server)

  /**
   * Event listener for HTTP server "error" event.
   */
  server.on('error', err => {
    if (err.syscall !== 'listen') throw err
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port

    // handle specific listen errors with friendly messages
    switch (err.code) {
      case 'EACCES':
        console.err(bind + ' requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.err(bind + ' is already in use')
        process.exit(1)
        break
      default:
        throw err
    }
  })

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port, () => {
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    log('Listening on ' + bind)
  })
}

main()
