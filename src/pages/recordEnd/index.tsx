import svg_download from '@root/assets/download.svg'
import svg_feedback1440 from '@root/assets/feedback-img1440+.svg'
import svg_feedback1366 from '@root/assets/feedback-img1366+.svg'
import svg_feedback1280 from '@root/assets/feedback-img1366-.svg'
import FeedbackModal from '@root/components/FeedbackModal'
import '@root/style/@inject.less'
import { saveWithFile } from '@root/utils'
import _env from '@root/utils/env'
import { reactRender } from '@root/utils/react-hook'
import { Button, Input } from 'antd'
import { FC, useEffect, useState } from 'react'
import './index.less'

let originTitle = ''
let App: FC = () => {
  let [videoUrl, setVideoUrl] = useState('')
  let [title, setTitle] = useState('title')
  let [isFbModalShow, setFbModalShow] = useState(false)

  useEffect(() => {
    let query = new URLSearchParams(location.search)
    let url = _env.uiDev ? '/v2.mp4' : decodeURIComponent(query.get('url'))
    setVideoUrl(url)
    let title = decodeURIComponent(query.get('title'))
    originTitle = title
    setTitle(title)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [])

  return (
    <div className="container">
      <div className="video-container">
        <video controlsList="nodownload" controls src={videoUrl}></video>
      </div>
      <div className="control-pannel f-i-center">
        <Input
          value={title}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (!title.length) {
              setTitle(originTitle)
            }
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            saveWithFile(videoUrl, title + '.mp4')
          }}
        >
          <img src={svg_download} />
          Download in MP4
        </Button>
      </div>
      <div className="feedback-pannel f-i-center">
        <img src={svg_feedback1440} alt="" className="left-img i-1440" />
        <img src={svg_feedback1366} alt="" className="left-img i-1366" />
        <img src={svg_feedback1280} alt="" className="left-img i-1280" />
        <p>
          We focus on user experience, feel free to send us any bugs or
          suggestions.
        </p>
        <Button onClick={() => setFbModalShow(true)}>Feedback</Button>
      </div>

      <FeedbackModal
        visible={isFbModalShow}
        onCancel={() => setFbModalShow(false)}
        maskStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
        }}
      />
    </div>
  )
}

reactRender(<App />)
