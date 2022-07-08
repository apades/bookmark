import { Player } from '@lottiefiles/react-lottie-player'
import svg_success from '@root/assets/success.svg'
import { stopRecorder } from '@root/core/startRecording'
import { Modal, ModalProps } from 'antd'
import { FC, memo, useEffect } from 'react'
import ProgressBar from '../ProgressBar'
import './index.less'
import animate from './放映机.json'

window.setopRecoding = () => {}
type Props = {
  time: number
  nowTime: number
  isRecording: boolean
  onCancel: () => void
  getContainer: ModalProps['getContainer']
}
let RecordingModal: FC<Props> = (props) => {
  useEffect(() => {
    console.log('visible', props.isRecording)
    if (props.isRecording) {
      window.cancelAllKeydown = true
      window.setopRecoding = () => {
        props.onCancel()
      }
    } else {
      window.cancelAllKeydown = false
      window.setopRecoding = () => {}
    }
    return () => {
      window.cancelAllKeydown = false
      window.setopRecoding = () => {}
    }
  }, [props.isRecording])

  return (
    <Modal
      maskClosable={false}
      className="recording-modal"
      centered
      closeIcon={<></>}
      visible={props.isRecording}
      getContainer={props.getContainer}
    >
      <Player autoplay controls loop src={animate}></Player>
      <ProgressBar
        value={100 - (props.nowTime / props.time) * 100}
        handleStyle={{ display: 'none' }}
      />
      <div className="tips f-i-center">
        <span>Remaining time</span>
        <span className="time">{~~props.nowTime + 1}s</span>
      </div>

      <p>
        The video clip is being processed, please do not close the tab. To
        browse original page, click here{' '}
        <a onClick={() => window.open(location.href)}>
          {'>>'}Go to the original page .
        </a>
      </p>
      <div
        className="cancel"
        onClick={() => {
          props.isRecording && stopRecorder()
          props.onCancel()
        }}
      >
        Cancel
      </div>
    </Modal>
  )
}

export default memo(RecordingModal)
