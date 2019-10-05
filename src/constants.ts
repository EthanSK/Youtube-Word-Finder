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
  },

  ffmpeg: {
    headers:
      "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20150101 Firefox/47.0 (Chrome)\r\nAccept-Encoding: gzip, deflate\r\nAccept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7\r\nAccept-Language: en-us,en;q=0.5\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
  }
}

export default constants
