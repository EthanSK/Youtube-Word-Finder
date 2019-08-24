interface Word {
  mainWord: string
  originalUnfilteredWord: string
  alternativeWords?: {
    [word: string]: AlternativeWord
  }
}

interface AlternativeWord {
  word: string
  isBeingUsed: boolean
  isFromSuggestion: boolean
  doesMatchCurrentWord: boolean // because if we edit the word, we still want to keep the ones being used, and we need a way to keep track of whether we need to fetch new similar words
  score?: number //from the api, in case we wanna use it for further sortirng
}

type VideoSource = "Channel" | "Playlist" | "Text file"

type DownloadOrder =
  | "allMainThenAllAlt"
  | "allMainWithAllAlt"
  | "nextMainThenAllAlt"
  | "nextMainThenNextAlt"

interface UserDefaultsState {
  hasUserDefaultsLoaded?: boolean
  videoSource?: VideoSource
  channelId?: string
  playlistId?: string
  videoTextFile?: string
  outputLocation?: string
  wordsToFindTextFile?: string
  outputFolderName?: string
  paddingToAdd?: number
  maxNumberOfVideos?: number
  numberOfWordReps?: number
  words?: Word[]
  downloadOrder?: DownloadOrder
}
