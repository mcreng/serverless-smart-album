const express = require("express");
const app = express();
const axios = require("axios");

const link =
  "http://localhost:8000/unsafe/400x500/top/smart/wwwimage-secure.cbsstatic.com/thumbnails/photos/w1920/marquee/11/77/27/6/hero_landscape_91e1b039-11ef-4d97-a01e-639b6ee4990a.jpg";

app.use(express.json());
app.use(express.static("img"));

app.post("/", async (req, res) => {
  // const links = req.body.map(link => 'http://localho');
  // res.json({ test: "fuck" });
  axios
    .get(link)
    .then(result => {
      console.log(result.data);
      res.contentType("document");
      res.end(result.data, "binary");
    })
    .catch(e => res.send(e));
  // const promises = links.map(axios.get);
  // res.json(await Promise.all(promises));
});

app.listen(4000, console.log({ test: "started world" }));
