"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userDefaults_1 = require("../userDefaults");
const processVideoMetadata_1 = __importDefault(require("./processVideoMetadata"));
const words_1 = require("../words");
const getVideoMetadata_1 = __importDefault(require("./getVideoMetadata"));
let wordFoundCounts = [];
//remember, if all words have reached their max rep counts, just end the search. do NOT end the search if searchWordsInSubs returns an empty array, because that could be due to other reasons
function* findWords() {
    for (let i = 0; i < userDefaults_1.userDefaultsOnStart.maxNumberOfVideos; i++) {
        const id = yield getVideoMetadata_1.default(i);
        const videoMetadata = processVideoMetadata_1.default(id);
        const clipsToDownload = searchWordsInSubs(videoMetadata);
        console.log("clipsToDownload", clipsToDownload.length);
        console.log("word counts", wordFoundCounts);
    }
}
exports.default = findWords;
function searchWordsInSubs(videoMetadata) {
    let result = [];
    for (let i = 0; i < userDefaults_1.userDefaultsOnStart.words.length; i++) {
        if (!wordFoundCounts[i])
            wordFoundCounts[i] = { wordCount: 0, alternativeWordCount: {} };
        const word = userDefaults_1.userDefaultsOnStart.words[i];
        const clips = searchWordText(videoMetadata, word.mainWord, false, i, word.originalUnfilteredWord);
        //also need to limit size here as may have returned mor ethan no word reps in one call
        result.push(...clips);
        for (const altWordKey in word.alternativeWords) {
            if (!word.alternativeWords[altWordKey].isBeingUsed)
                continue;
            const altWordText = word.alternativeWords[altWordKey].word;
            if (!wordFoundCounts[i].alternativeWordCount[altWordText])
                wordFoundCounts[i].alternativeWordCount[altWordText] = 0;
            const clips = searchWordText(videoMetadata, altWordText, true, i);
            result.push(...clips);
        }
    }
    return result;
}
function searchWordText(videoMetadata, text, isAlternative, wordIndex, originalUnfilteredWord) {
    let result = [];
    for (const phrase of videoMetadata.subtitles.phrases) {
        const clip = {
            id: videoMetadata.id,
            url: videoMetadata.url,
            start: phrase.start,
            end: phrase.end,
            phraseMatched: phrase.text,
            wordSearchedText: text,
            originalUnfilteredWord,
            isAlternative,
            wordIndex
        };
        if (videoMetadata.subtitles.isIndividualWords) {
            if (text === words_1.filterWord(phrase.text)) {
                pushIfNeeded(clip);
            }
        }
        else {
            for (const subPhrase of phrase.text.split(/\s+/)) {
                if (text === words_1.filterWord(subPhrase)) {
                    pushIfNeeded(clip);
                }
            }
        }
    }
    function pushIfNeeded(clip) {
        if (isAlternative) {
            if (wordFoundCounts[wordIndex].alternativeWordCount[text] >=
                userDefaults_1.userDefaultsOnStart.numberOfWordReps) {
                return;
            }
        }
        else {
            if (wordFoundCounts[wordIndex].wordCount >=
                userDefaults_1.userDefaultsOnStart.numberOfWordReps) {
                return;
            }
        }
        result.push(clip);
        if (isAlternative) {
            wordFoundCounts[wordIndex].alternativeWordCount[text] += 1;
        }
        else {
            wordFoundCounts[wordIndex].wordCount += 1;
        }
    }
    return result;
}
