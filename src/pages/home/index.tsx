import { useOnce } from '@root/hooks'
import { reactRender } from '@root/utils/react-hook'
import { FC } from 'react'

let App: FC = () => {
  useOnce(() => {
    chrome.runtime.onMessage.addListener((msg, sender) => {
      console.log('msg', msg)
    })
  })
  return <div className="page-home">this is home page</div>
}

reactRender(<App />)
