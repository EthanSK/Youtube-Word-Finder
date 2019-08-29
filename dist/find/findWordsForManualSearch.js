"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const filesystem_1 = require("../filesystem");
const fs_1 = __importDefault(require("fs"));
const getVideoMetadata_1 = __importDefault(require("./getVideoMetadata"));
const userDefaults_1 = require("../userDefaults");
const logger_1 = require("../logger");
const processVideoMetadata_1 = __importDefault(require("./processVideoMetadata"));
const findWords_1 = require("./findWords");
function getCurrentlyDownloadedMetadataIds() {
    const outputFolder = filesystem_1.getDirName("metadataDir", true); //up to date output folder
    const ids = fs_1.default
        .readdirSync(outputFolder)
        .filter(el => {
        return el.includes(".info.json");
    })
        .map(el => el.split(".")[0]);
    return ids;
}
async function getMetadataForManualSearch(idRetrieved) {
    const currentlyDownloaded = getCurrentlyDownloadedMetadataIds();
    //first return all the ones already downloaded
    for (const id of currentlyDownloaded) {
        idRetrieved(id);
    }
    //then get the remaining subs needed
    for (let i = currentlyDownloaded.length; i < userDefaults_1.loadUserDefault("maxNumberOfVideos"); i++) {
        const id = await getVideoMetadata_1.default(i, true);
        if (!id) {
            logger_1.sendToConsoleOutput("No more videos in playlist or channel", "info");
            break;
        } //no more vids in playlist. this is so we don't waste a lot of time searching for hundreds of videos that aren't there.
        idRetrieved(id);
    }
}
exports.getMetadataForManualSearch = getMetadataForManualSearch;
function findClipsForManualSearch(word, arrIndex) {
    let result = [];
    const currentlyDownloaded = getCurrentlyDownloadedMetadataIds();
    for (const id of currentlyDownloaded) {
        const videoMetadata = processVideoMetadata_1.default(id, true);
        if (word.mainWord === "")
            continue; //it aint here boss
        const clips = findWords_1.searchWordText(videoMetadata, word.mainWord, false, arrIndex, true, word.originalUnfilteredWord);
        //also need to limit size here as may have returned mor ethan no word reps in one call
        result.push(...clips);
        for (const altWordKey in word.alternativeWords) {
            if (!word.alternativeWords[altWordKey].isBeingUsed)
                continue;
            const altWordText = word.alternativeWords[altWordKey].word;
            const clips = findWords_1.searchWordText(videoMetadata, altWordText, true, arrIndex, true);
            result.push(...clips);
        }
    }
    return result;
}
exports.findClipsForManualSearch = findClipsForManualSearch;
