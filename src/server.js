const express = require('express');
const path = require('path');
const routes_get = require('./service/routes_get');
const app = express();
const PORT = process.env.PORT || 31415;


app.use(routes_get);

app.listen(PORT, () => {
    console.log(`✅`);
    console.log(`🚀 http://localhost:${PORT}/step1/index.html`);
});




