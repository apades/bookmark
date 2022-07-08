import { Dp } from '@root/utils/redux'
import { useCallback, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useDispatch } from 'react-redux'

export function useCallbackStatic<T extends (...args: any[]) => any>(
  callback: T
): T {
  return useCallback(callback, [])
}

export function useOnce(cb: () => void): void {
  return useEffect(cb, [])
}

export const useMobile = (): ReturnType<typeof useMediaQuery> =>
  useMediaQuery({ query: '(max-width: 768px)' })

export const useDp = (): Dp => useDispatch<Dp>()
