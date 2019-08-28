"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VideosContext {
    constructor() {
        this._videoListBatches = [];
        this._videoMetadata = [];
        this._clipsToDownload = [];
    }
    get videoListBatches() {
        return this._videoListBatches;
    }
    get videoMetadata() {
        return this._videoMetadata;
    }
    get clipsToDownload() {
        return this._clipsToDownload;
    }
    appendVideoListBatches(item) {
        this._videoListBatches.push(item);
    }
    appendVideoMetadata(item) {
        this._videoMetadata.push(item);
    }
    appendClipsToDownload(item) {
        this._clipsToDownload.push(item);
    }
    hasPhraseBeenUsed(phrase) {
        for (const clip of this._clipsToDownload) {
            if (clip.start === phrase.start &&
                clip.end === phrase.end &&
                clip.text === phrase.text)
                return true;
        }
        return false;
    }
}
exports.default = VideosContext;
