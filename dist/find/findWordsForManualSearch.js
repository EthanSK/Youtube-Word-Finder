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
async function getCurrentlyDownloadedMetadataIds() {
    const outputFolder = filesystem_1.getDirName("metadataDir", true); //up to date output folder
    return new Promise((resolve, reject) => {
        fs_1.default.readdir(outputFolder, (err, files) => {
            if (err)
                reject(err);
            const ids = files
                .filter(el => {
                return el.includes(".info.json");
            })
                .map(el => el.split(".")[0]);
            resolve(ids);
        });
    });
}
async function getMetadataForManualSearch(idRetrieved, shouldGetUpdated = false) {
    let currentlyDownloaded = [];
    if (!shouldGetUpdated) {
        currentlyDownloaded = await getCurrentlyDownloadedMetadataIds();
        //first return all the ones already downloaded
        for (const id of currentlyDownloaded) {
            idRetrieved(id);
        }
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
function findClipsForManualSearch(word, arrIndex, id) {
    let result = [];
    const videoMetadata = processVideoMetadata_1.default(id, true);
    if (!videoMetadata)
        return result;
    if (word.mainWord === "")
        return result; //it aint here boss
    const clips = findWords_1.searchWordText(videoMetadata, word.mainWord, false, arrIndex, true, word.mainWord, word.originalUnfilteredWord);
    //also need to limit size here as may have returned mor ethan no word reps in one call
    result.push(...clips);
    for (const altWordKey in word.alternativeWords) {
        if (!word.alternativeWords[altWordKey].isBeingUsed)
            continue;
        const altWordText = word.alternativeWords[altWordKey].word;
        const clips = findWords_1.searchWordText(videoMetadata, altWordText, true, arrIndex, true, word.mainWord);
        result.push(...clips);
    }
    return result;
}
exports.findClipsForManualSearch = findClipsForManualSearch;
