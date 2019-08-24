"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const userDefaults_1 = require("./userDefaults");
const path_1 = __importDefault(require("path"));
const constants_1 = __importDefault(require("./constants"));
function createDirIfNeeded(path) {
    if (!fs_1.default.existsSync(path)) {
        fs_1.default.mkdirSync(path);
    }
}
function getDirName(dir) {
    switch (dir) {
        case "mainDir":
            return path_1.default.join(userDefaults_1.userDefaultsOnStart.outputLocation, userDefaults_1.userDefaultsOnStart.outputFolderName);
        case "tempDir":
            return path_1.default.join(getDirName("mainDir"), constants_1.default.folderNames.temp);
        case "subtitlesDir":
            return path_1.default.join(getDirName("tempDir"), constants_1.default.folderNames.subtitles);
        case "metadataDir":
            return path_1.default.join(getDirName("tempDir"), constants_1.default.folderNames.metadata);
    }
}
exports.getDirName = getDirName;
function createWorkspaceFilesystem() {
    // createDirIfNeeded(userDefaultsOnStart.outputLocation) //shourdn't need to do this, they should have selected a dir that exists already
    createDirIfNeeded(getDirName("mainDir"));
    createDirIfNeeded(getDirName("tempDir"));
    createDirIfNeeded(getDirName("subtitlesDir"));
    createDirIfNeeded(getDirName("metadataDir"));
}
exports.createWorkspaceFilesystem = createWorkspaceFilesystem;
