import { msgData, msgDataMap } from '@root/config/msgType'
import { split } from 'lodash'
import _env from './env'
import { DeepWritable, dykey, ParamType } from './types'

export function formatTime(time: number, zeroHour = false): string {
  let min = ~~(time / 60),
    sec = ~~(time % 60),
    hours = ~~(min / 60)
  if (min >= 60) min = ~~(min % 60)

  let sh = hours || zeroHour ? (hours + '').padStart(2, '0') + ':' : '',
    sm = (min + '').padStart(2, '0') + ':',
    ss = (sec + '').padStart(2, '0')
  return sh + sm + ss
}
export function getTimeDetail(time: number) {
  let min = ~~(time / 60),
    sec = ~~(time % 60),
    hours = ~~(min / 60)
  if (min >= 60) min = ~~(min % 60)
  return {
    hours,
    min,
    sec,
  }
}
export function formatTime2realTime(time: string): number {
  let splitArr = time.split(':')
  switch (splitArr.length) {
    case 1: {
      let sec = +splitArr[0]
      return isNaN(sec) ? 0 : sec
    }
    case 2: {
      let [min, sec] = splitArr
      return +min * 60 + +sec
    }
    case 3: {
      let [h, min, sec] = splitArr
      return +h * 60 * 60 + +min * 60 + +sec
    }
    default:
      return 0
  }
}
export let injectScript = (script: string) => {
  let scriptEl = document.createElement('script')
  scriptEl.textContent = script
  document.documentElement.appendChild(scriptEl)
}
export let injectScriptRemote = (file_path: string, tag = 'body') => {
  let node = document.getElementsByTagName(tag)[0]
  console.log('node', node)
  let script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', file_path)
  node.appendChild(script)
}

export type SendMsgType<T extends keyof msgDataMap> = {
  type: T
} & (msgDataMap[T] extends null
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : {
      data: msgDataMap[T]
    })

type sendMsgAsb = {
  /**默认发送给激活的tab，传入2值发送给所有 */
  <T extends keyof msgDataMap>(
    message: SendMsgType<T>,
    isToBackground?: boolean
  ): void
  /**发送给所有 */
  all: <T extends keyof msgDataMap>(message: SendMsgType<T>) => void
  /**发送给指定tab */
  toTab: <T extends keyof msgDataMap>(
    message: SendMsgType<T>,
    tabId: number
  ) => void
}
let _sendMsg: sendMsgAsb = function sendMsg<T extends keyof msgDataMap>(
  message: SendMsgType<T>,
  isToBackground?: boolean
): void {
  console.log('💬rc:sendMsg', message)
  if (isToBackground) {
    chrome.runtime.sendMessage(message)
  } else
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => chrome.tabs.sendMessage(tabs[0].id, message)
    )
} as any
_sendMsg.toTab = (message, tabId) => chrome.tabs.sendMessage(tabId, message)
_sendMsg.all = (message) => _sendMsg(message, true)
export let sendMsg = _sendMsg
export function deSendToTab(tabId: number) {
  return function <T extends keyof msgDataMap>(msg: SendMsgType<T>) {
    return sendMsg.toTab(msg, tabId)
  }
}

// sendMsg({
//   type: 'rc:popup_pageInit',
// })
let onMsgEventMap: {
  [T in keyof msgDataMap]: ((
    data: msgDataMap[T],
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: SendMsgType<keyof msgDataMap>) => void
  ) => void)[]
} = {} as any

let canLog = false
if (!_env.uiDev)
  chrome.runtime.onMessage.addListener(
    (
      msgData: {
        type: keyof msgDataMap
        data: msgDataMap[keyof msgDataMap]
      },
      sender,
      sendRes
    ) => {
      let type = msgData.type
      !localStorage.disableMsg &&
        canLog &&
        console.log('💬rc:onMsg', type, msgData)

      if (onMsgEventMap[type]) {
        onMsgEventMap[type].forEach((fn) =>
          fn(msgData.data as any, sender, sendRes)
        )
      }
    }
  )

export function onMsg<T extends keyof msgDataMap>(
  type: T,
  callback: (
    data: msgDataMap[T],
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: SendMsgType<keyof msgDataMap>) => void
  ) => void
): void {
  onMsgEventMap[type] = onMsgEventMap[type] ?? []
  onMsgEventMap[type].push(callback)
}

export function offMsg<T extends keyof msgDataMap>(
  type: T,
  callback: (
    data: msgDataMap[T],
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: SendMsgType<keyof msgDataMap>) => void
  ) => void
): void {
  onMsgEventMap[type] = onMsgEventMap[type] ?? []
  let index = onMsgEventMap[type].findIndex((fn) => fn === callback)
  index !== -1 && onMsgEventMap[type].splice(index, 1)
}

// onMsg('rc:popup_initRes', (data) => {
//   //
// })

export let wait = (time = 0): Promise<void> =>
  new Promise((res) =>
    setTimeout(() => {
      res()
    }, time)
  )

export function saveDataInChrome(data: dykey) {
  return chrome.storage.sync.set(data)
}
export let getDataFromChrome = (keys: string[]) =>
  new Promise((resolve) => {
    chrome.storage.sync.get((res) => {
      let obj: dykey = {}
      keys.forEach((k) => {
        obj[k] = res[k]
      })
      resolve(obj)
    })
  })

export let saveWithFile = async (
  url: string,
  name = 'no name',
  mimetype?: string
): Promise<void> => {
  // if(mimetype){
  //   let
  // }

  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
}
// export let getNowTabId = ()=> chrome.tabs.query(
//   {
//     active: true,
//     currentWindow: true,
//   },
//   (tabs) => chrome.tabs.sendMessage(tabs[0].id, message)
// )

export let minmax = (v: number, min = v, max = v): number =>
  v < min ? min : v > max ? max : v

export function getByClass<T extends HTMLElement>(
  el: HTMLElement,
  name: string
): T {
  return el.getElementsByClassName(name)[0] as T
}

export let sendMsgToVB = (type: string, param: dykey): Promise<dykey> => {
  return new Promise((resolve) => {
    let transposer = document.getElementById('_intercepter_')
    console.log(type, param)
    let handleClick = () => {
      const params: dykey = {}
      if (transposer.getAttribute('type') === type) {
        for (const name of transposer.getAttributeNames()) {
          params[name] = transposer.getAttribute(name)
        }
        transposer.removeAttribute('type')
      }
      resolve(params)
      transposer.removeEventListener('click', handleClick)
    }
    transposer.addEventListener('click', handleClick)
    transposer.dispatchEvent(
      new CustomEvent('bgmsg', {
        detail: {
          type,
          ...param,
        },
      })
    )
  })
}

export let sendMsgToContent = (
  type: string,
  message: dykey
): Promise<dykey> => {
  return new Promise((resolve) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => chrome.tabs.sendMessage(tabs[0].id, message)
    )

    let handleOnMsg: (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => void = (msgData, sender, sendRes) => {
      if (msgData.type === type) {
        resolve(msgData.data)
        chrome.runtime.onMessage.removeListener(handleOnMsg)
      }
    }

    chrome.runtime.onMessage.addListener(handleOnMsg)
  })
}

export function createElement<
  K extends keyof HTMLElementTagNameMap,
  EL = HTMLElement
>(
  key: K,
  option: Partial<HTMLElementTagNameMap[K]> = {}
): HTMLElementTagNameMap[K] {
  let el = document.createElement(key)

  Object.assign(el, option)
  //   let stringAttributeList: (keyof typeof option)[] = ['id', 'class', 'style']
  //   stringAttributeList.forEach((n) => {
  //     option[n] && (el[n] = option[n])
  //   })
  return el
}

export function copyText(text: string): void {
  const el = document.createElement('textarea')
  el.value = text
  el.style.position = 'absolute'
  el.style.top = '-999999px'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

let canvas: HTMLCanvasElement = null
export function drawImage(video: HTMLVideoElement): string {
  if (!canvas) {
    canvas = createElement('canvas')
  }
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  // draw the video at that frame
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
  // convert it to a usable data URL
  const dataURL = canvas.toDataURL()

  return dataURL
}

export function omitOjbect<T, K extends keyof T>(obj: T, key: K[]): Omit<T, K> {
  let rs = { ...obj }
  key.forEach((k) => delete rs[k])
  return rs
}
export function reduxSetState<A, B extends { type: string }>(
  state: A,
  action: B
): A {
  let setting = omitOjbect(action, ['type'])
  Object.assign(state, setting)
  return {
    ...state,
  }
}
