module.exports = {
  main: {
    entry: '../src/ui.dev/index.tsx',
    html: '../src/ui.dev/index.html',
    port: 2000,
  },
  end: {
    entry: '../src/pages/recordEnd/index.tsx',
    html: '../src/pages/recordEnd/index.html',
    port: 2001,
  },
}
