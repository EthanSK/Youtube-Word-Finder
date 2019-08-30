const constants = {
  app: {
    name: "Youtube Word Finder"
  },
  wordOptions: {
    name: "Word Options"
  },
  wordFinder: {
    name: "Word Finder"
  },
  folderNames: {
    temp: "temp",
    // subtitles: "subtitles", //can't figure out a way to specify different -o location when getting subs and info at same time, so just put it all in metadata
    metadata: "metadata",
    words: "wordsAutoFound",
    alternativeWords: "alternativeWords",
    autoFound: "autoFound",
    wordsManuallyFound: "wordsManuallyFound"
  },
  youtube: {
    channelURLPrefix: "https://www.youtube.com/channel/",
    videoURLPrefix: "https://www.youtube.com/watch?v=",
    playlistURLPrefix: "https://www.youtube.com/playlist?list="
  },

  settings: {
    numVidsInBatch: 300
  }
}

export default constants
