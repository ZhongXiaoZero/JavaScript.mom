const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')()
const logger = require('koa-logger')

const index = require('./routes/index')
const about = require('./routes/about')
const article = require('./routes/article')


// middlewares
app.use(convert(bodyparser))
app.use(convert(json()))
app.use(convert(logger()))
app.use(convert(require('koa-static')(__dirname + '/public')))

app.use(views(__dirname + '/views', {
  extension: 'jade'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

router.use('/', index.routes(), index.allowedMethods())
router.use('/about', about.routes(), about.allowedMethods())
router.use('/article/:articleId', article.routes(), article.allowedMethods())


app.use(router.routes(), router.allowedMethods())
// response

app.on('error', (err, ctx)=>{
  console.log(err)
  log.error('server error', err, ctx)
})


module.exports = app
