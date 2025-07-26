const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 31415;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`✅ 服务器成功启动！`);
    console.log(`🚀 请在浏览器中打开 http://localhost:${PORT}`);
});