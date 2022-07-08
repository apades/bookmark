const { execSync } = require('child_process')

module.exports = {
  execSync: async (...arg) => {
    let out = await execSync(...arg)
    return out.toString()
  },
}
