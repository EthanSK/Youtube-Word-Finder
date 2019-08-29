interface Word {
  mainWord: string
  originalUnfilteredWord: string
  alternativeWords?: {
    [word: string]: AlternativeWord
  }
}

interface ClipToDownload {
  id: string
  url: string
  start: number
  end: number
  wordSearchedText: string
  originalUnfilteredWord?: string //in case we wanna use it for folder names for non alt
  phraseMatched: string
  isAlternative: boolean
  wordIndex: number //needed for alt and non alt words too to decide download location
}

interface WordFinderRequestWindowData {
  word: Word
  arrIndex: number
}

interface WordFinderResponseWindowData extends WordFinderRequestWindowData {
  clips: ClipToDownload[]
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
  subtitleLanguageCode?: string
  words?: Word[]
  downloadOrder?: DownloadOrder
}
