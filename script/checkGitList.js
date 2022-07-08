const { execSync } = require('./utils')
const dayjs = require('dayjs')

async function main() {
  let target = process.env.target || 'dev'
  console.log('zip target ----', target)

  try {
    switch (target) {
      case 'dev': {
        let status = await execSync('git status -s')
        console.log(status)
        if (status.length) {
          return console.error('git must be cleaned')
        }
        let sha1 = await (await execSync('git rev-parse HEAD')).slice(0, 7)

        let name = `videoClip-${sha1}.zip`
        await execSync(`7z a ${name} ./dist/**`)
        console.log(`dev____build as ${name}`)
        return
      }
      case 'prod': {
        let name = `videoClip-prod.zip`
        await execSync(`7z a ${name} ./dist_prod/**`)
        console.log(`prod____build as ${name}`)
        return
      }
      default: {
        return console.error('Unsupport target')
      }
    }
  } catch (error) {
    console.error(`build脚本发生错误`, error)
  }
}

main()
