const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("node:path");
const app = new express();
const port = 5000;

// const timelapseFile = path.join(__dirname, "public", "timelapse.gif");
const imagesPath = path.join(__dirname, "public", "images");

app.use(express.static("public"));
app.use(fileUpload());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  let imageCount = 0;

  fs.readdir(imagesPath, (err, files) => {
    imageCount = files.length;
    res.render("index", { imageCount });
  });
});

app.post("/timelapse", function (req, res) {
  const { file } = req.files;
  if (!file) return res.sendStatus(400);

  console.log("Got", file.name);
  file.mv(path.join(imagesPath, file.name));

  res.sendStatus(200);
});

app.listen(port);
