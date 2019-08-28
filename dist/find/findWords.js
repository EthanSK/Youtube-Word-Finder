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
        console.log("clipsToDownload", clipsToDownload
            .filter(el => el.phraseMatched)
            .map(el => {
            return { phrase: el.phraseMatched, word: el.wordSearchedText };
        }));
        if (clipsToDownload.length === 0) {
            break; // no more were found
        }
    }
}
exports.default = findWords;
function searchWordsInSubs(videoMetadata) {
    let result = [];
    for (let i = 0; i < userDefaults_1.userDefaultsOnStart.words.length; i++) {
        const word = userDefaults_1.userDefaultsOnStart.words[i];
        // if (wordFoundCounts[i] >= userDefaultsOnStart.numberOfWordReps!) continue
        const searchedWord = searchWordText(videoMetadata, word.mainWord);
        let start;
        let end;
        let phraseMatched;
        if (searchedWord) {
            start = searchedWord.start;
            end = searchedWord.end;
            phraseMatched = searchedWord.phraseMatched;
        }
        const clip = {
            id: videoMetadata.id,
            url: videoMetadata.url,
            start,
            end,
            altWordClips: [],
            wordSearchedText: word.mainWord,
            phraseMatched
        };
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
        result.push(clip);
    }
    return result;
}
function searchWordText(videoMetadata, wordText) {
    for (const phrase of videoMetadata.subtitles.phrases) {
        const clip = {
            start: phrase.start,
            end: phrase.end,
            phraseMatched: phrase.text
        };
        if (videoMetadata.subtitles.isIndividualWords) {
            if (wordText === words_1.filterWord(phrase.text)) {
                return clip;
            }
        }
        else {
            for (const subPhrase of phrase.text.split(/\s+/)) {
                if (wordText === words_1.filterWord(subPhrase)) {
                    return clip;
                }
            }
        }
    }
}
