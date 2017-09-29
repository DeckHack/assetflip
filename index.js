const https = require('https')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const config = require('./config.json')

const download = function(url, dest, cb) {
  const file = fs.createWriteStream(dest)
  const request = https.get(url, function(response) {
    response.pipe(file)
    file.on('finish', function() {
      file.close(cb)
    });
  }).on('error', function(err) {
    fs.unlink(dest)
    if (cb) cb(err.message);
  });
};

const readAssets = function() {
  return JSON.parse(fs.readFileSync(path.resolve(config.data_path, 'assets.json'), 'utf8'))
}

const assets = readAssets()

if (!fs.existsSync(path.resolve(config.output_path, assets.timestamp + '/'))) {
  fse.mkdirs(path.resolve(config.output_path, assets.timestamp.toString()))

  assets.assets.forEach(function (asset) {
    let assetPath = asset.split('/')
    let assetName = assetPath[assetPath.length - 1]

    download(asset, path.resolve(config.output_path, assets.timestamp.toString(), assetName), function(err) {
      if (err) { console.log(err) }
    })

  })
} else {
  console.log('Assets were already downloaded for this revision')
}