import { flatDataMapToTypeAndData } from '@root/utils/types'

export type msgType = msgData['type']

export type msgData = _msgData

type _msgData = flatDataMapToTypeAndData<msgDataMap, keyof msgDataMap>

type infoMember = 'content' | 'popup' | 'bg' | 'inject' | 'any'
export type msgDataMap = {
  // - test
  'rc:script_youtube': {
    type: string
    list: any[]
  }
}

export type _msgType = keyof msgDataMap
