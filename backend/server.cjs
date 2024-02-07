const express = require("express");
const cors = require("cors");
const ytdl = require('ytdl-core');

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5173'
}));

app.get("/yt/:video_code", (req, res) => {
    const stream = ytdl("https://www.youtube.com/watch?v=" + req.params.video_code, {
        quality: 251
    }).pipe(res);
});

app.listen(5000, () => {console.log("Server has started!")});