import { RootActions, StateBase } from '@root/reducers'
import { Dispatch } from 'redux'

export type GetState = () => StateBase
export type Dp = Dispatch<RootActions>
