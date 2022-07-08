import { formatTime, formatTime2realTime, getTimeDetail } from '@root/utils'
import { Input } from 'antd'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import './index.less'

const canKey = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
type Props = {
  value: number
  max?: number
  min?: number
  inMaxReturnLastNum?: boolean
  inMinReturnLastNum?: boolean
  onChange: (v: number) => void
}
let TimeInput: FC<Props> = (props) => {
  let [isfocus, setfocus] = useState(false)
  let [input, setInput] = useState('')
  let [h, setH] = useState('00')
  let [m, setM] = useState('00')
  let [s, setS] = useState('00')
  let inputTime = `${h}:${m}:${s}`
  let [lastValue, setLastValue] = useState(inputTime)
  let [isInit, setInit] = useState(false)
  let focuTimmerRef = useRef<NodeJS.Timeout>()

  let onValueChange = (value: number) => {
    let { hours, min, sec } = getTimeDetail(value)
    // console.log('props.value', value)
    let padStart = (e: number) => (e + '').padStart(2, '0')
    setH(padStart(hours))
    setM(padStart(min))
    setS(padStart(sec))
    return `${padStart(hours)}:${padStart(min)}:${padStart(sec)}`
  }
  useEffect(() => {
    let time = onValueChange(props.value)
    if (!isInit && props.value !== 0) {
      setInit(true)
      // console.log('setLastValue', time)
      setLastValue(time)
    }
  }, [props.value, isInit])

  let _setInput = (fn: (num: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        canKey.includes((e.nativeEvent as any).data) ||
        (e.nativeEvent as any).inputType === 'deleteContentBackward'
      )
        fn(e.target.value)
    }
  }

  let checkMinMax = (val: number) => {
    if (val < props.min)
      return props.inMinReturnLastNum ? props.value : props.min
    if (val > props.max)
      return props.inMaxReturnLastNum ? props.value : props.max
    return val
  }

  let handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    focuTimmerRef.current && clearTimeout(focuTimmerRef.current)
    e.target.select()
    setfocus(true)
  }
  let handleBlur = () => {
    // TODO 还有小数点的状态没法解决

    setInit(true)
    setfocus(false)

    focuTimmerRef.current = setTimeout(() => {
      if (lastValue !== inputTime) {
        console.log('chagne time')
        let time = checkMinMax(formatTime2realTime(inputTime))
        // console.log('bulr time', time)
        setLastValue(onValueChange(time))
        props.onChange(time)
      }
    }, 10)
  }

  // ! 特殊网站特殊处理
  let handleKeydownCapture = (e: React.KeyboardEvent<HTMLInputElement>) => {
    /* if (location.origin === 'https://www.bilibili.com') */ e.stopPropagation()
  }

  return (
    <div className={`rc-time-input ${isfocus && 'focusing'}`}>
      <Input
        onFocus={handleFocus}
        maxLength={2}
        value={h}
        onKeyDownCapture={handleKeydownCapture}
        onChange={_setInput(setH)}
        onBlur={handleBlur}
      />
      <span>:</span>
      <Input
        onFocus={handleFocus}
        maxLength={2}
        value={m}
        onKeyDownCapture={handleKeydownCapture}
        onChange={_setInput(setM)}
        onBlur={handleBlur}
      />
      <span>:</span>
      <Input
        onFocus={handleFocus}
        maxLength={2}
        value={s}
        onKeyDownCapture={handleKeydownCapture}
        onChange={_setInput(setS)}
        onBlur={handleBlur}
      />
      {/* <span>{formatTime(props.value, true)}</span>
      {isInputing && (
        <input
          ref={inputRef}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onBlur={comfirmInput}
          onKeyDown={(e) => {
            e.code === 'Enter' && comfirmInput()
          }}
        />
      )} */}
    </div>
  )
}

export default TimeInput
