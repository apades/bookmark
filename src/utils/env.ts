let _env = {
  ver: process.env.buildVer,
  isRecording: false,
  /**vb方案progress`指定时长`没触发，跳动进度条到buffer末尾让系统继续加载 */
  VBJumpCTtimeout: 2000,
  uiDev: !!process.env.uiDev,

  floatBtnVisbleTime: 2000,
  disableInOutside: true,
}

export let vpConfig = {
  minVelTop: 20,
  minVpWidth: 670,
}
export default _env
export let checkOutsideable = (url = '') =>
  !_env.disableInOutside ||
  url.includes('www.youtube.com') ||
  location.href.includes('www.youtube.com')

export let isY2b = () => location.href.includes('www.youtube.com')
export let isV3 = _env.ver === 'v3'
