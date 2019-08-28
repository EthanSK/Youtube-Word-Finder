"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userDefaults_1 = require("../userDefaults");
const processVideoMetadata_1 = __importDefault(require("./processVideoMetadata"));
const words_1 = require("../words");
const getVideoMetadata_1 = __importDefault(require("./getVideoMetadata"));
let wordFoundCounts;
function* findWords() {
    for (let i = 0; i < userDefaults_1.userDefaultsOnStart.maxNumberOfVideos; i++) {
        const id = yield getVideoMetadata_1.default(i);
        const videoMetadata = processVideoMetadata_1.default(id);
        const clipsToDownload = searchWordsInSubs(videoMetadata);
        console.log("clipsToDownload", clipsToDownload.length);
    }
}
exports.default = findWords;
function searchWordsInSubs(videoMetadata) {
    let result = [];
    for (let i = 0; i < userDefaults_1.userDefaultsOnStart.words.length; i++) {
        const word = userDefaults_1.userDefaultsOnStart.words[i];
        // if (wordFoundCounts[i] >= userDefaultsOnStart.numberOfWordReps!) continue
        const clips = searchWordText(videoMetadata, word.mainWord, false, i, word.originalUnfilteredWord);
        result.push(...clips);
        // console.log("result: ", result.length)
        // for (const altWordKey in word.alternativeWords) {
        //   const searchedAltWord = searchWordText(
        //     videoMetadata,
        //     word.alternativeWords[altWordKey].word
        //   )
        //   let start: number | undefined
        //   let end: number | undefined
        //   let phraseMatched: string | undefined
        //   if (searchedAltWord) {
        //     start = searchedAltWord.start
        //     end = searchedAltWord.end
        //     phraseMatched = searchedAltWord.phraseMatched
        //   }
        //   const altWordClip = {
        //     id: videoMetadata.id,
        //     url: videoMetadata.url,
        //     start,
        //     end,
        //     wordSearchedText: word.alternativeWords[altWordKey].word,
        //     phraseMatched
        //   }
        //   clip.altWordClips!.push(altWordClip)
        // }
    }
    return result;
}
function searchWordText(videoMetadata, wordText, isAlternative, wordIndex, originalUnfilteredWord) {
    let result = [];
    for (const phrase of videoMetadata.subtitles.phrases) {
        const clip = {
            id: videoMetadata.id,
            url: videoMetadata.url,
            start: phrase.start,
            end: phrase.end,
            phraseMatched: phrase.text,
            wordSearchedText: wordText,
            originalUnfilteredWord,
            isAlternative,
            wordIndex
        };
        if (videoMetadata.subtitles.isIndividualWords) {
            if (wordText === words_1.filterWord(phrase.text)) {
                result.push(clip);
            }
        }
        else {
            for (const subPhrase of phrase.text.split(/\s+/)) {
                if (wordText === words_1.filterWord(subPhrase)) {
                    result.push(clip);
                    // break //don't use same phrase twice for one word, even if there are multiple occurrences. actually, the bot will finish faster and it will still have done its correct job, so do it.
                }
            }
        }
    }
    return result;
}
