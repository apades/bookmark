import { reduxSetState } from '@root/utils'
import _env from '@root/utils/env'
import { Omit } from 'react-redux'

export type SettingState = {
  sort: 'create' | 'title'
  showMobileMenu: boolean

  bbb: boolean
  ccc: number
}
let settingState: SettingState = {
  sort: 'create',
  // collapsed: localStorage['collapse_nav'] === 'true',
  showMobileMenu: false,

  bbb: true,
  ccc: 1,
}

export type SettingAction = SettingSet
type SettingSet = Partial<Omit<SettingState, 'bbb' | 'ccc'>> & {
  type: 'setting/set'
}

let setting = (state = settingState, action: SettingAction): SettingState => {
  switch (action.type) {
    case 'setting/set':
      return reduxSetState(state, action)
    default:
      return state
  }
}

export default setting
