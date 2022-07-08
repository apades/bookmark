import { reduxSetState } from '@root/utils/index'
import { PartialOmit } from '@root/utils/types'
import { DeepPartial } from 'redux'
import { SelectItem } from './select'

type Bookmarks = (
  | {
      type: 'folder'
    }
  | {
      type: 'bookmark'
      url: string
    }
) & {
  name: string
}
export type FoldersMap = {
  [key: string]: Bookmarks
}
export type FoldersIDListMap = {
  [key: string]: string[]
}

export type BookmarksState = {
  foldersMap: FoldersMap
  foldersIDListMap: FoldersIDListMap
  isLoading: boolean
  loaded: boolean
}
let bookmarksState: BookmarksState = {
  foldersMap: {},
  foldersIDListMap: {
    0: [],
  },

  isLoading: false,
  loaded: false,
}

export type BookmarksAction =
  | BookmarksLoad
  | BookmarksNew
  | BookmarksSetState
  | BookmarksUpdate
  | BookmarksRemove
  | BookmarksMove
  | BookmarksClearEmpty
  | BookmarksAdd

type BookmarksLoad = {
  type: 'bookmarks/load'
  bookmarkss: {
    [key: string]: Bookmarks[]
  }
}
type BookmarksNew = {
  type: 'bookmarks/new'
  pid: string
}
type BookmarksAdd = {
  type: 'bookmarks/add'
  bookmarkss: Bookmarks[]
}
type BookmarksUpdate = {
  type: 'bookmarks/update'
  id: string
  data: DeepPartial<Bookmarks>
}
type BookmarksRemove = {
  type: 'bookmarks/remove'
  bookmarkss: (SelectItem<'bookmarks'> | Bookmarks)[]
}
type BookmarksMove = {
  type: 'bookmarks/move'
  bookmarkss: (SelectItem<'bookmarks'> | Bookmarks)[]
  targetId: string
  nowPid?: string
}
type BookmarksClearEmpty = {
  type: 'bookmarks/clearEmpty'
}
type BookmarksSetState = {
  type: 'bookmarks/setState'
} & PartialOmit<BookmarksState, 'foldersIDListMap' | 'foldersMap'>

function clearIdListMap(list: string[], idList: string[]): string[] {
  return list.filter((d) => {
    let find = idList.findIndex((v) => v === d)
    if (find !== -1) {
      idList.splice(find, 1)
      return false
    }
    return true
  })
}

export default function bookmarks(
  state = bookmarksState,
  action: BookmarksAction
): BookmarksState {
  switch (action.type) {
    case 'bookmarks/setState':
      return reduxSetState(state, action)
    default:
      return state
  }
}
