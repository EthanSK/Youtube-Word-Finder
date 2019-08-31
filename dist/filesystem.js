"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const userDefaults_1 = require("./userDefaults");
const path_1 = __importDefault(require("path"));
const constants_1 = __importDefault(require("./constants"));
const del_1 = __importDefault(require("del"));
const store_1 = require("./store");
function createDirIfNeeded(path) {
    if (!fs_1.default.existsSync(path)) {
        fs_1.default.mkdirSync(path);
    }
}
exports.createDirIfNeeded = createDirIfNeeded;
function getDirName(dir, useUpdatedDefaults = false) {
    switch (dir) {
        case "mainDir":
            if (useUpdatedDefaults) {
                let outputFolderName = userDefaults_1.loadUserDefault("outputFolderName");
                if (!outputFolderName) {
                    outputFolderName = userDefaults_1.createOutputName(store_1.load(userDefaults_1.userDefaultsKey));
                }
                return path_1.default.join(userDefaults_1.loadUserDefault("outputLocation"), outputFolderName);
            }
            else {
                let outputFolderName = userDefaults_1.userDefaultsOnStart.outputFolderName;
                if (!outputFolderName) {
                    outputFolderName = userDefaults_1.createOutputName(store_1.load(userDefaults_1.userDefaultsKey));
                }
                return path_1.default.join(userDefaults_1.userDefaultsOnStart.outputLocation, outputFolderName);
            }
        case "tempDir":
            return path_1.default.join(getDirName("mainDir", useUpdatedDefaults), constants_1.default.folderNames.temp);
        case "metadataDir":
            return path_1.default.join(getDirName("tempDir", useUpdatedDefaults), constants_1.default.folderNames.metadata);
        case "wordsDir":
            return path_1.default.join(getDirName("mainDir", useUpdatedDefaults), constants_1.default.folderNames.words);
        case "wordsManuallyFoundDir":
            return path_1.default.join(getDirName("mainDir", useUpdatedDefaults), constants_1.default.folderNames.wordsManuallyFound);
    }
}
exports.getDirName = getDirName;
/**
 * returns absolute path of files
 */
function getFilesInDir(dir) {
    return new Promise((resolve, reject) => {
        fs_1.default.readdir(dir, (err, files) => {
            if (err)
                return reject(err);
            resolve(files.map(file => path_1.default.join(dir, file))); //return absolute file
        });
    });
}
exports.getFilesInDir = getFilesInDir;
function createWorkspaceFilesystem(useUpdatedDefaults = false) {
    // createDirIfNeeded(userDefaultsOnStart.outputLocation) //shourdn't need to do this, they should have selected a dir that exists already
    createDirIfNeeded(getDirName("mainDir", useUpdatedDefaults));
    createDirIfNeeded(getDirName("tempDir", useUpdatedDefaults));
    createDirIfNeeded(getDirName("metadataDir", useUpdatedDefaults));
}
exports.createWorkspaceFilesystem = createWorkspaceFilesystem;
function createYoutubeDlFilePath(dir, fileName, useUpdatedDefaults = false) {
    const ret = path_1.default.join(getDirName(dir, useUpdatedDefaults), `%(${fileName})s` //${Date.now().toString()}_
    );
    console.log(ret);
    return ret;
}
exports.createYoutubeDlFilePath = createYoutubeDlFilePath;
async function cleanupDirs(useUpdatedDefaults) {
    try {
        await del_1.default([getDirName("tempDir", useUpdatedDefaults)], { force: true }); //force is true because apparently the stupid fucking library throws an error when deleteing things outside the current working directory.
    }
    catch (error) {
        //don't do anything, coz im lazy . the error will prolly be something like there is no output location set...blah blah blah
    }
}
exports.cleanupDirs = cleanupDirs;
