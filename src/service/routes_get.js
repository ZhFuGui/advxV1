const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const fs = require('fs').promises; 

// 设置最大请求体大小为1MB
app.use(express.json({ limit: '1mb' }));

//步骤一
app.use('/step1/index.html',express.static(path.resolve(__dirname, '../step1/index.html')));
app.use('/step1/style.css',express.static(path.resolve(__dirname, '../step1/style.css')));
app.use('/step1/script.js',express.static(path.resolve(__dirname, '../step1/script.js')));


//步骤二
app.use('/step2/index.html',express.static(path.resolve(__dirname, '../step2/index.html')));
app.use('/step2/style.css',express.static(path.resolve(__dirname, '../step2/style.css')));
app.use('/step2/script.js',express.static(path.resolve(__dirname, '../step2/script.js')));



const dataFilePath = path.join(__dirname, '..', '..','data', 'sign_in_stats.json');

app.get('/api/qiandao/get', async (req, res) => {
    try {
        const fileContent = await fs.readFile(dataFilePath, 'utf8');
        const stats = JSON.parse(fileContent);
        
        const currentCount = (stats.timestamps && stats.timestamps.length) || 0;
        const timesUsedArray = stats.timesused || [];

        console.log(`[GET] 查询成功，总数: ${currentCount}, 用时记录数: ${timesUsedArray.length}`);
        res.json({ data: currentCount, timesused: timesUsedArray });

    } catch (error) {
        console.error('[GET] /api/qiandao/get 请求处理失败:', error);
        res.status(500).json({ error: '服务器内部错误，无法获取签到数据。' });
    }
});


app.post('/api/qiandao/add', async (req, res) => {
    try {
        const { timestamp: clientTimestamp, timesused } = req.body;
        const serverTimestamp = Date.now();

        if (typeof clientTimestamp !== 'number' || isNaN(clientTimestamp)) {
            return res.status(400).json({ error: '无效的时间戳格式，必须为数字。' });
        }
        const timeDifference = serverTimestamp - clientTimestamp;
        if (timeDifference < 0 || timeDifference > 2000) {
            return res.status(400).json({ error: '请求已过期或时间戳无效，请重试。' });
        }

        if (typeof timesused !== 'number' || isNaN(timesused)) {
            return res.status(400).json({ error: '无效的用时(timesused)格式，必须为数字。' });
        }

        const fileContent = await fs.readFile(dataFilePath, 'utf8');
        const stats = JSON.parse(fileContent);
        
        if (!Array.isArray(stats.timestamps)) stats.timestamps = [];
        if (!Array.isArray(stats.timesused)) stats.timesused = [];

        stats.timestamps.push(clientTimestamp);
        stats.timesused.push(timesused);
        stats.data = stats.timestamps.length;

        await fs.writeFile(dataFilePath, JSON.stringify(stats, null, 2));

        console.log(`[POST] 签到成功！新总数: ${stats.data}, 本次用时: ${timesused}s`);
        res.json({ data: stats.data });

    } catch (error) {
        console.error('[POST] /api/qiandao/add 请求处理失败:', error);
        res.status(500).json({ error: '服务器内部错误，无法完成签到操作。' });
    }
});

module.exports = app;