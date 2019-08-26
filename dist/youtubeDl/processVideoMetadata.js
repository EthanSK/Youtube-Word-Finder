"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_webvtt_1 = __importDefault(require("node-webvtt"));
const filesystem_1 = require("../filesystem");
const logger_1 = require("../logger");
const fs_1 = __importDefault(require("fs"));
const infoFileExt = ".info.json";
const subtitleFileExt = ".vtt"; //can't be sure if it will be .en.vtt if lang code is different
async function processVideoMetadata() {
    const files = await filesystem_1.getFilesInDir(filesystem_1.getDirName("metadataDir"));
    const infoFiles = files.filter(file => file.slice(-infoFileExt.length) === infoFileExt);
    //loop through each json vtt file par, and if one is missing, or cannot be read, instead of throwing an error and stopping it from working, just console output an error and continue
    let result = [];
    for (const infoFile in infoFiles) {
        const fileNameNoExt = infoFile.slice(0, -infoFileExt.length);
        const correspondingSubsFile = files.filter(file => file.slice(0, fileNameNoExt.length) === fileNameNoExt &&
            file.slice(-subtitleFileExt.length) === subtitleFileExt)[0];
        try {
            const subs = node_webvtt_1.default.parse(correspondingSubsFile, { meta: true });
            const jsonInfo = JSON.parse(fs_1.default.readFileSync(infoFile).toString());
            result.push({
                subtitles: subs,
                id: jsonInfo.id,
                url: jsonInfo.formats[jsonInfo.formats.length - 1].url //last format always seems to be for the best with video and audio
            });
        }
        catch (error) {
            logger_1.sendToConsoleOutput("Error processing video metadata or subtitles: " + error.message, "error");
        }
    }
    return result;
}
exports.default = processVideoMetadata;
