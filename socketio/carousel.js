const _ = require('lodash')
const { errToPlainObj, getCsv, getenv } = require('../lib/helper')
const log = require('../lib/debug')(__filename)

const CAROUSEL_CSV = getenv('CAROUSEL_CSV', 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTfbnxEmnp3K7dHIScLw8tDoqT98XoVWBrltHQfCV45uJ1b9AoiB0OASDcNW3_8hA0WpVutCcQYLwI/pub?gid=0&single=true&output=csv')
const CAROUSEL_FIELD = getenv('CAROUSEL_FIELD', 'image')

const carousel = {
  imgs: [],
  io: null,
  state: {
    imgId: 0, // 圖片的索引值
    imgLen: 0, // 圖片總數
    imgUrl: null, // 圖片網址
  }
}

const setNewImgId = async ({ imgId }) => {
  imgId = _.clamp(imgId, carousel.state.imgLen - 1)
  carousel.state = {
    ...carousel.state,
    imgId,
    imgUrl: carousel.imgs[imgId],
  }
  if (!carousel.state.imgUrl) return
  carousel.io?.emit('state.carousel', carousel.state)
}

const offsetImg = async ctx => {
  const { offset } = ctx
  const { imgId, imgLen } = carousel.state
  await setNewImgId({ ...ctx, imgId: (imgLen + (imgId + offset) % imgLen) % imgLen })
}

const fetchImages = async ctx => {
  const imgs = _.map(await getCsv(CAROUSEL_CSV), CAROUSEL_FIELD)
  if (!imgs.length) throw new Error('圖片列表沒有資料')
  carousel.imgs = imgs
  carousel.state.imgLen = imgs.length
  await setNewImgId({ ...ctx, imgId: carousel.state.imgId })
  log(`載入 ${carousel.state.imgLen} 張圖片`)
}

const initCarousel = async ctx => {
  try {
    if (carousel.state.imgLen) return false // 已經初始化過了
    carousel.io = ctx.io // backup socket.io
    await fetchImages(ctx)
    return true
  } catch (err) {
    _.set(err, 'data.fn', 'initCarousel')
    log(errToPlainObj(err))
  }
}

exports.onSocketConnect = async (ctx, next) => {
  const { socket } = ctx

  // 連線時初始化 carousel 或是傳送目前的 state
  if (!await initCarousel(ctx)) socket.emit('state.carousel', carousel.state)

  // 重新抓取圖片列表
  socket.on('cmd.carousel.fetchImages', cb => fetchImages(ctx).then(cb).catch(err => cb(null, err)))

  // 上下一張圖片
  socket.on('cmd.carousel.offsetImg', (offset, cb) => offsetImg({ ...ctx, offset }).then(cb).catch(err => cb(null, err)))

  // 上下一張圖片
  socket.on('cmd.carousel.setNewImgId', (imgId, cb) => setNewImgId({ ...ctx, imgId }).then(cb).catch(err => cb(null, err)))

  await next()
}