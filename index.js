const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("node:path");
const sizeOf = require("image-size");
const GIFEncoder = require("gif-encoder-2");
const decodeGif = require("decode-gif");
const { Image, createCanvas } = require("canvas");
const { spawn } = require("child_process");
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

  const { width, height } = sizeOf(file.data);

  console.log("\nGot", file.name);
  // console.log(file);
  // console.log("Size:", width, height);

  // let framesToAdd = [];

  // const oldGif = decodeGif(fs.readFileSync(timelapseFile));

  // let encoder = new GIFEncoder(width, height);

  // encoder.createReadStream().pipe(fs.createWriteStream(timelapseFile));

  // encoder.start();
  // encoder.setRepeat(0);
  // encoder.setDelay(500);

  // let canvas = createCanvas(width, height);
  // let ctx = canvas.getContext("2d");

  // for (let frame of oldGif.frames) {
  //   // addImageToGif(encoder, ctx, Buffer.from(frame.data), width, height);
  //   let img = new Image();
  //   img.src = Buffer.from(frame.data);
  //   img.onload = () => {
  //     framesToAdd.push(img);
  //   };
  //   // console.log(Buffer.from(frame.data));
  // }

  // // addImageToGif(encoder, ctx, file.data, width, height);
  // let img = new Image();
  // img.src = file.data;
  // img.onload = () => framesToAdd.push(img);

  // for (let frame of framesToAdd) {
  //   ctx.drawImage(frame, 0, 0, width, height);
  //   encoder.addFrame(ctx);
  // }

  // encoder.finish();

  file.mv(path.join(imagesPath, file.name));

  res.sendStatus(200);
});

function addImageToGif(encoder, ctx, data, width, height) {
  let img = new Image();
  img.src = data;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height);
    encoder.addFrame(ctx);
  };
}

app.listen(port);
