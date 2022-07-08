/**
 * @description 读取src/pages成entry,Plugin配置
 */
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

let isFolder = (path) => fs.lstatSync(path).isDirectory()
let pr = (..._path) => path.resolve(__dirname, ..._path)

let pagesSrc = pr('../src/pages/')
let pagesDirs = fs.readdirSync(pagesSrc)

let dataList = pagesDirs.map((dir) => {
  let realPath = pr(pagesSrc, dir)
  let isfolder = isFolder(realPath)
  let js,
    html,
    label = dir.replace(/\..*$/g, '')
  if (isfolder) {
    js =
      (fs.existsSync(pr(realPath, 'index.ts')) && pr(realPath, 'index.ts')) ||
      (fs.existsSync(pr(realPath, 'index.tsx')) && pr(realPath, 'index.tsx')) ||
      null
    html =
      fs.existsSync(pr(realPath, 'index.html')) && pr(realPath, 'index.html')
  }
  if (!isfolder) {
    js = (dir.indexOf('ts') > 0 && realPath) || null
    html = (dir.indexOf('html') > 0 && realPath) || null
  }

  return {
    label,
    js,
    html,
  }
})

let entry = {}
dataList.forEach((data) => {
  data.js && (entry[data.label] = data.js)
})

let WebpackPluginList = []

let getTemplate = (name) => `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
</head>

<body>
    <div id="app"></div>
</body>

</html>`
dataList.forEach((data) => {
  if (data.js) {
    /**@type {HtmlWebpackPlugin.Options} */
    let conf = {
      chunks: [data.label],
      filename: `${data.label}.html`,
    }
    if (data.html) {
      conf.template = data.html
    } else {
      conf.templateContent = getTemplate(data.label)
    }
    WebpackPluginList.push(new HtmlWebpackPlugin(conf))
  } else if (data.html) {
    WebpackPluginList.push(
      new CopyPlugin({
        patterns: [
          {
            from: data.html,
            to: '',
          },
        ],
      })
    )
  }
})

module.exports = {
  entry,
  WebpackPluginList,
}
