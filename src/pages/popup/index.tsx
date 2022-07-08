import { useOnce } from '@root/hooks'
import { reactRender } from '@root/utils/react-hook'
import { FC } from 'react'
import './index.less'

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true }
  let [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

let App: FC = () => {
  useOnce(() => {
    chrome.runtime.onMessage.addListener((msg, sender) => {
      console.log('msg', msg)
    })
  })
  return <div className="page-popup">this is popup</div>
}

reactRender(<App />)
