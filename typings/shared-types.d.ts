interface Word {
  mainWord: string
  originalUnfilteredWord: string
  alternativeWords?: {
    [word: string]: AlternativeWord
  }
}

interface ClipToDownload {
  id: string
  bestVideoUrl?: string //we don't use the stems now coz i can't get it to work while being efficient and only downloading a portion of the video from the input (so it doesn't download the whole thing and bes slow)
  bestAudioUrl?: string
  bestCombinedUrl?: string

  start: number
  end: number
  wordSearchedText: string
  originalUnfilteredWord?: string //in case we wanna use it for folder names for non alt
  phraseMatched: string
  isAlternative: boolean
  wordIndex: number //needed for alt and non alt words too to decide download location
  mainWord: string
}

interface ClipToDownloadIPCPkg {
  clip: ClipToDownload
  index: number
}

interface ResponseClipToDownloadIPCPkg {
  downloadPath: string
  index: number
  isError?: boolean
  isVideoURLExpiredError?: boolean
}

interface WordFinderRequestWindowData {
  word: Word
  arrIndex: number
}

interface WordFinderResponseWindowData extends WordFinderRequestWindowData {
  clips: ClipToDownload[]
  isError?: boolean
  didScanNewVideo?: boolean
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
  channelUrl?: string
  playlistUrl?: string
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
  reEncodeVideos?: boolean
  cookiesTextFile?: string
  customYtdlBinary?: string
}
