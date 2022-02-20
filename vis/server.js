const path        = require('path')
const express     = require('express')
const compression = require('compression')
const app         = express()
const opener      = require("opener")
const portfinder  = require('portfinder')
const fs          = require('fs')
let env           = require('minimist')(process.argv.slice(2)).env
const cache       = {maxAge:'7d'}

try {
  env = { production: env.production == true || env.production == 'true' }
} catch(e) {
  env = { production: false }
}

let router = express.Router()
router.use(compression())
let staticFolder, rootFolder
if(env.production) {
  // Production Release
  staticFolder = '/dist'
  rootFolder = '/dist/'
} else {
  // Development
  staticFolder = '/src/assets'
  rootFolder = '/src/tmp/'
}

// 靜態檔案root目錄
router.use(express.static(__dirname + staticFolder, cache))
// 依照html檔名定義router
// fs.readdirSync(__dirname + rootFolder).forEach(function (file) {
//   if (fs.statSync(path.join(__dirname + rootFolder, file)).isFile()) {
//     if(/.html$/.test(file)) {
//       let fileName = file.replace(/.html$/, '')
//       router.get(`/${fileName}*`, (req, res, next) => {
//         res.sendFile(path.join(__dirname + rootFolder + file), cache)
//       })
//     }
//   }
// })

// Index
router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'index.en.html'))
})
router.get('/zh-tw', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'index.zh-hant.html'))
})
router.get('/zh-cn', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'index.zh-hans.html'))
})
router.get('/en-us', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'index.en.html'))
})
// Core
router.get('/core', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'core.en.html'))
})
router.get('/zh-tw/core', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'core.zh-hant.html'))
})
router.get('/zh-cn/core', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'core.zh-hans.html'))
})
router.get('/en-us/core', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'core.en.html'))
})
// Solution
router.get('/solution/1', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution.en.html'))
})
router.get('/zh-tw/solution/1', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution.zh-hant.html'))
})
router.get('/zh-cn/solution/1', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution.zh-hans.html'))
})
router.get('/en-us/solution/1', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution.en.html'))
})

router.get('/solution/2', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution02.en.html'))
})
router.get('/zh-tw/solution/2', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution02.zh-hant.html'))
})
router.get('/zh-cn/solution/2', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution02.zh-hans.html'))
})
router.get('/en-us/solution/2', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution02.en.html'))
})

router.get('/solution/3', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution03.en.html'))
})
router.get('/zh-tw/solution/3', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution03.zh-hant.html'))
})
router.get('/zh-cn/solution/3', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution03.zh-hans.html'))
})
router.get('/en-us/solution/3', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution03.en.html'))
})

router.get('/solution/4', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution04.en.html'))
})
router.get('/zh-tw/solution/4', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution04.zh-hant.html'))
})
router.get('/zh-cn/solution/4', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution04.zh-hans.html'))
})
router.get('/en-us/solution/4', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution04.en.html'))
})

router.get('/solution/5', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution05.en.html'))
})
router.get('/zh-tw/solution/5', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution05.zh-hant.html'))
})
router.get('/zh-cn/solution/5', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution05.zh-hans.html'))
})
router.get('/en-us/solution/5', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'solution05.en.html'))
})
// News
router.get('/news', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'news.en.html'))
})
router.get('/zh-tw/news', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'news.zh-hant.html'))
})
router.get('/zh-cn/news', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'news.zh-hans.html'))
})
router.get('/en-us/news', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'news.en.html'))
})
// News Article
router.get('/news-article*', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'news-article.en.html'))
})
router.get('/zh-tw/news-article*', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'news-article.zh-hant.html'))
})
router.get('/zh-cn/news-article*', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'news-article.zh-hans.html'))
})
router.get('/en-us/news-article*', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'news-article.en.html'))
})
// About
router.get('/about', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'about.en.html'))
})
router.get('/zh-tw/about', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'about.zh-hant.html'))
})
router.get('/zh-cn/about', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'about.zh-hans.html'))
})
router.get('/en-us/about', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'about.en.html'))
})


/*
// 動態設定等同下面結果
router.get('/base*', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'base.html'))
})
router.get('/page*', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'page.html'))
})
*/


if(env.production) {
  portfinder.getPort( (err, port) => {
    app.use(router)
    app.use(compression())
    app.listen(port, () => {
      console.info('[express-server]', `http://localhost:${port}/`)
      opener(`http://localhost:${port}/`)
    })
  })
}


module.exports = router
