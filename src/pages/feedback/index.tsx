import FeedbackModal from '@root/components/FeedbackModal'
import { reactRender } from '@root/utils/react-hook'
import { FC } from 'react'

let App: FC = () => {
  return <FeedbackModal onClose={() => {}} />
}

reactRender(<App />)
