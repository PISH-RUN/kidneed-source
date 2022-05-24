var path = require("path");
var os = require("os");
const mime = require("mime-types");
var https = require("https");
var fs = require("fs");

const tmp = (filename) => path.join(os.tmpdir(), filename);

const urlFilename = (url) => {
  return url.split("/").at(-1);
};

async function download(url, dest, repeat = 0, err = null) {
  return new Promise((resolve, reject) => {
    if (repeat > 2) {
      reject(err.message);
    }

    const file = fs.createWriteStream(dest);

    https
      .get(url, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          file.close(() => {
            resolve(file);
          });
        });
      })
      .on("error", function (err) {
        fs.unlink(dest, () => download(url, dest, repeat + 1, err));
      });

    file.on("error", (err) => {
      fs.unlink(dest, () => reject(err.message));
    });
  });
}

const resource = async (url) => {
  const dest = tmp(urlFilename(url));
  await download(url, dest);

  const stats = fs.statSync(dest);

  return {
    path: dest,
    name: urlFilename(url),
    size: stats.size,
    type: mime.lookup(dest),
  };
};

module.exports = {
  resource,
};
