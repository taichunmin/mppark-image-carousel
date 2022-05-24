const _ = require('lodash')
const { middlewareCompose, errToPlainObj } = require('../lib/helper')
const { Server: IoServer } = require('socket.io')
const log = require('../lib/debug')(__filename)

const onConnectHandler = middlewareCompose([
  async (ctx, next) => { // 紀錄連結及斷線
    try {
      const { socket } = ctx
      socket.on('disconnect', () => { log(`disconnected, socket.id = ${socket.id}`) })
      await next()
      log(`connected, socket.id = ${socket.id}`)
    } catch (err) {
      _.set(err, 'data.fn', 'onConnectHandler 未處理的錯誤')
      log(errToPlainObj(err))
    }
  },

  require('./carousel').onSocketConnect,
])

exports.bootstrap = async httpServer => {
  const io = new IoServer(httpServer)

  io.on('connection', socket => onConnectHandler({ io, socket }))
}
