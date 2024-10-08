# [Threads Clone](https://threads-react.onrender.com/)

 這是一個複製 Threads 並加入訊息功能的社群平台，主要功能如下：

* **Threads文章系統** - 貼文建立、刪除、按讚、留言功能。
* **Threads首頁** - 顯示已追總者的貼文、建議的追蹤者
* **個人用戶頁面** - 個人資料更改、頭像、個人簡介、追蹤/被追蹤功能、顯示個人發過的所有貼文
* **即時聊天系統** - 透過 socket.io 提供即時聊天、已讀功能、訊息時間功能。
  

## 技術堆疊

### 前端

* 框架：`React`
* 狀態管理：`Recoil`
* 樣式管理：`Chakra UI`
* `RWD`：響應式網頁設計。

### 後端

* 框架：`Node.js Express`
* `JWT`： 安全的第三方登入和用戶資訊儲存。
* `Socket.IO`： 實現即時通訊。
* `RESTful API` & `MVC` 架構： 保持代碼可維護性和可擴展性。

### 資料庫

* `MongoDB` 資料庫：透過 NoSQL 高效資料檢索和可擴展儲存。

### 雲端服務

* `Cloudinary`:文章與使用者圖片儲存。

### Setup .env file

```js
PORT=...
MONGO_URI=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Build the app

```shell
npm run build
```

### Start the app

```shell
npm start
```
