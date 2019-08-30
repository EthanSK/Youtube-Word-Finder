"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userDefaults_1 = require("../userDefaults");
const processVideoMetadata_1 = __importDefault(require("./processVideoMetadata"));
const words_1 = require("../words");
const getVideoMetadata_1 = __importDefault(require("./getVideoMetadata"));
const logger_1 = require("../logger");
let wordFoundCounts = [];
//remember, if all words have reached their max rep counts, just end the search. do NOT end the search if searchWordsInSubs returns an empty array, because that could be due to other reasons
function* findWords() {
    let result = [];
    wordFoundCounts = []; //i think not having this may have been causing the glitch earlier
    for (let i = 0; i < userDefaults_1.userDefaultsOnStart.maxNumberOfVideos; i++) {
        const id = yield getVideoMetadata_1.default(i);
        if (!id) {
            logger_1.sendToConsoleOutput("No more videos in playlist or channel", "info");
            break;
        } //no more vids in playlist
        const videoMetadata = processVideoMetadata_1.default(id);
        const clipsToDownload = searchWordsInSubs(videoMetadata);
        logger_1.sendToConsoleOutput(`Found ${Math.round(calculatePercentageFound("main"))}% of the main words (with repetitions) so far`, "info");
        const altWordPercentFound = calculatePercentageFound("alternative");
        if (altWordPercentFound)
            logger_1.sendToConsoleOutput(`Found ${Math.round(altWordPercentFound)}% of the alternative words (with repetitions) so far`, "info");
        result.push(...clipsToDownload);
        // console.log("clipsToDownload", clipsToDownload.length)
        // console.log("word counts", wordFoundCounts.map(el => el.wordCount))
    }
    return result;
}
exports.default = findWords;
function searchWordsInSubs(videoMetadata) {
    let result = [];
    for (let i = 0; i < userDefaults_1.userDefaultsOnStart.words.length; i++) {
        if (!wordFoundCounts[i])
            wordFoundCounts[i] = { wordCount: 0, alternativeWordCount: {} };
        const word = userDefaults_1.userDefaultsOnStart.words[i];
        if (word.mainWord === "")
            continue; //it aint here boss
        const clips = searchWordText(videoMetadata, word.mainWord, false, i, false, word.mainWord, word.originalUnfilteredWord);
        //also need to limit size here as may have returned mor ethan no word reps in one call
        result.push(...clips);
        for (const altWordKey in word.alternativeWords) {
            if (!word.alternativeWords[altWordKey].isBeingUsed)
                continue;
            const altWordText = word.alternativeWords[altWordKey].word;
            if (!wordFoundCounts[i].alternativeWordCount[altWordText])
                wordFoundCounts[i].alternativeWordCount[altWordText] = 0;
            const clips = searchWordText(videoMetadata, altWordText, true, i, false, word.mainWord);
            result.push(...clips);
        }
    }
    return result;
}
function searchWordText(videoMetadata, text, isAlternative, wordIndex, isForManualSearch, mainWord, originalUnfilteredWord) {
    let result = [];
    const subLangCode = isForManualSearch
        ? userDefaults_1.loadUserDefault("subtitleLanguageCode")
        : userDefaults_1.userDefaultsOnStart.subtitleLanguageCode; //doing this in the for loop is SO FUCKING DUMB DO U KNOW HOW LONG IT TAKES
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
            wordIndex,
            mainWord
        };
        if (videoMetadata.subtitles.isIndividualWords) {
            if (text ===
                (words_1.shouldApplyWordFilter(subLangCode)
                    ? words_1.filterWord(phrase.text)
                    : phrase.text)) {
                if (isForManualSearch) {
                    result.push(clip);
                }
                else {
                    pushIfNeeded(clip);
                }
            }
        }
        else {
            for (const subPhrase of phrase.text.split(/\s+/)) {
                if (text ===
                    (words_1.shouldApplyWordFilter(subLangCode)
                        ? words_1.filterWord(subPhrase)
                        : subPhrase)) {
                    if (isForManualSearch) {
                        result.push(clip);
                    }
                    else {
                        pushIfNeeded(clip);
                    }
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
exports.searchWordText = searchWordText;
function calculatePercentageFound(words) {
    if (words === "main") {
        const targetCount = userDefaults_1.userDefaultsOnStart.words.length * userDefaults_1.userDefaultsOnStart.numberOfWordReps;
        let foundCount = 0;
        wordFoundCounts.forEach(el => {
            foundCount += el.wordCount;
        });
        console.log("found count: ", foundCount, "target count: ", targetCount);
        return (foundCount / targetCount) * 100;
    }
    else {
        let targetCount = 0;
        userDefaults_1.userDefaultsOnStart.words.forEach(el => {
            if (el.alternativeWords)
                targetCount +=
                    Object.keys(el.alternativeWords).length *
                        userDefaults_1.userDefaultsOnStart.numberOfWordReps;
        });
        let foundCount = 0;
        wordFoundCounts.forEach(el => {
            foundCount += Object.keys(el.alternativeWordCount).length;
        });
        if (targetCount !== 0)
            return (foundCount / targetCount) * 100;
    }
}
