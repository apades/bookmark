module.exports = {
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "node": "current"
      },
    }],
    "@babel/preset-typescript",
    [
      "@babel/preset-react",
      {
        "runtime": "automatic"
      }
    ]
  ],
  "plugins": [
    "lodash",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import",
    [
      "import",
      {
        "libraryName": "antd",
        "libraryDirectory": "es",
        "style": true
      }
    ]
  ]
}