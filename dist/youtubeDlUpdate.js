"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_dl_1 = __importDefault(require("youtube-dl"));
const logger_1 = require("./logger");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const electron_1 = require("electron");
let downloader = require("youtube-dl/lib/downloader");
electron_1.ipcMain.on("update-youtube-dl", async (event, data) => {
    try {
        await updateYoutubeDl();
    }
    catch (error) {
        logger_1.sendToConsoleOutput(`Error updating youtube-dl: ${error.message}`, "error");
    }
});
async function updateYoutubeDl() {
    logger_1.sendToConsoleOutput("Updating youtube-dl", "loading");
    //@ts-ignore
    console.log(youtube_dl_1.default.getYtdlBinary());
    //@ts-ignore
    const binDir = path_1.default.dirname(youtube_dl_1.default.getYtdlBinary());
    const binary = path_1.default.join(binDir, "youtube-dl");
    if (fs_1.default.existsSync(binary)) {
        fs_1.default.unlinkSync(binary);
    }
    await new Promise((resolve, reject) => {
        downloader(binDir, function error(err, done) {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            console.log("done updating", done);
            logger_1.sendToConsoleOutput(`youtube-dl updated at ${binDir}`, "success");
            resolve();
        });
    });
}
exports.updateYoutubeDl = updateYoutubeDl;
