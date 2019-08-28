import { VideoListItem } from "./getNextVideosBatch"
import { Phrase, VideoMetadata } from "./processVideoMetadata"
import { ClipToDownload } from "./findWords"

interface VideoListBatch {
  playlistStart: number
  playlistEnd: number
  videoList: VideoListItem[]
}
export default class VideosContext {
  private _videoListBatches: VideoListBatch[] //always use the last element for the current videos batch
  private _videoMetadata: VideoMetadata[] //always use the last element for the current metadata. if the current one runs out of new subs to offer, the new one gets appended.
  //to get the next word, we scan the current metadata object's phrases in the subt's prop
  private _clipsToDownload: ClipToDownload[]

  constructor() {
    this._videoListBatches = []
    this._videoMetadata = []
    this._clipsToDownload = []
  }

  get videoListBatches() {
    return this._videoListBatches
  }

  get videoMetadata() {
    return this._videoMetadata
  }
  get clipsToDownload() {
    return this._clipsToDownload
  }

  public appendVideoListBatches(item: VideoListBatch) {
    this._videoListBatches.push(item)
  }
  public appendVideoMetadata(item: VideoMetadata) {
    this._videoMetadata.push(item)
  }
  public appendClipsToDownload(item: ClipToDownload) {
    this._clipsToDownload.push(item)
  }

  public hasPhraseBeenUsed(phrase: Phrase): boolean {
    for (const clip of this._clipsToDownload) {
      if (
        clip.start === phrase.start &&
        clip.end === phrase.end &&
        clip.text === phrase.text
      )
        return true
    }
    return false
  }
}
