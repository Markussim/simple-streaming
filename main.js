const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
var ffmpeg = require("fluent-ffmpeg");
const sharp = require("sharp");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home", { videos: fs.readdirSync("./public/videos") });
});

app.get("/thumbnail/*", (req, res) => {
  let video = req.path.substr(11);
  let thumb = video.substr(0, video.length - 4) + ".png";
  if (video != "thumbs" && fs.readdirSync("./public/videos").includes(video)) {
    res.setHeader("content-type", "img/png");
    if (fs.readdirSync("./public/videos/thumbs").includes(thumb)) {
      res.sendFile(__dirname + "/public/videos/thumbs/" + thumb);
    } else {
      console.log("Found video");
      ffmpeg(__dirname + "/public/videos/" + video)
        .on("end", function () {
          sharp(__dirname + "/public/videos/thumbs/big_" + thumb)
            .resize(500, 500)
            .toFile(__dirname + "/public/videos/thumbs/" + thumb, function (err) {
              console.log("Screenshots taken");
              res.sendFile(__dirname + "/public/videos/thumbs/" + thumb);
            });
        })
        .on("error", function (err) {
          console.error(err);
        })
        .screenshots({
          count: 1,
          folder: __dirname + "/public/videos/thumbs/",
          filename: "big_" + thumb,
        });
    }
  } else {
    res.send("404");
  }
});

app.use(express.static(__dirname + "/public"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
