# mppark-image-carousel

為了在多個瀏覽器上可以同步切換照片輪播的程式。

## CodeSandbox 使用方法

1. 在 CodeSandbox 上面執行: <https://githubbox.com/taichunmin/mppark-image-carousel>
2. 設定 Secrets `CAROUSEL_CSV`，需填入 CSV 網址，從 Google Sheets 取得方法為
    - 檔案
    - 共用
    - 發布到網路
    - 選擇工作表
    - 選擇 .csv
    - 複製網址

## Heroku 使用方法

### 設定環境

1. 安裝 git 及 heroku: <https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up>
2. 執行登入指令 `heroku login`
3. 下載專案程式碼: `git clone https://github.com/taichunmin/mppark-image-carousel.git`
4. 切換至專案資料夾: `cd mppark-image-carousel`
5. 新增遠端: `heroku create`
6. 遠端重新命名: `git remote rename heroku heroku1`
7. 上傳程式碼: `git push heroku master`
8. 設定 config (也可以從網頁設定): `heroku config:set --remote heroku1 'CAROUSEL_CSV='`

### 日常使用

1. 調整機器數量
    - 開機: `heroku ps:scale --remote heroku1 web=1`
    - 關機: `heroku ps:scale --remote heroku1 web=0`
    - 免費帳號可以使用 650 小時，若驗證信用卡後可以增加到 1000 小時
2. 程式碼更新
    - 更新程式碼: `git pull origin master`
    - 上傳程式碼: `git push heroku master`