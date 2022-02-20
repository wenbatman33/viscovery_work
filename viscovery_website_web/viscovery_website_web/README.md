# Source 說明

## 發佈流程

> 安裝 package

``` shell
$ npm install --global yarn
$ yarn
```

> 開發

``` shell
$ yarn run dev
# 執行後確定跑完再觀看 http://localhost:8000/
```

> 發佈

``` shell
$ yarn run release
```

## 上線部署

執行 `yarn run release` 後會將檔案發佈到 `./dist`

此資料夾內所有檔案便是網站所有完整檔案

`./src/.htaccess` 是 server 上 route 設定檔

如果 route 有更改需要同時修改這一份對應 route 並更新上 server

## 檔案結構說明

|    資料夾         | 說明 |
| :--------------- | :--- |
| ./src/ejs/       |  html 樣板內容，要調整 html 請在這調整 |
| ./src/assets/    |  靜態資源檔案，增加額外的圖片或 css, js 請加這裡面 |
| ./src/index.js   |  首頁主程式 |
| ./src/news.js    |  最新動態主程式 |
| ./src/core.js    |  核心技術主程式 |
| ./src/article.js |  文章內頁主程式 |
| ./src/about.js   |  關於我們主程式 |
| ./src/components/solution/SolutionSubMenu.js |  解決方案次選單程式 |
| ./src/components/solution/VisualBanner.js    |  解決方案合作案例程式 |
| ./src/components/solution/SlickArea.js       |  解決方案 slick 區塊程式 |



