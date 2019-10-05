"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const electron_1 = require("electron");
let getBinary = require("youtube-dl/lib/get-binary");
let downloader = require("youtube-dl/lib/downloader");
electron_1.ipcMain.on("update-youtube-dl", (event, data) => {
    updateYoutubeDl();
});
async function updateYoutubeDl() {
    logger_1.sendToConsoleOutput("Updating youtube-dl", "loading");
    console.log(getBinary());
    const binDir = path_1.default
        .dirname(getBinary())
        .replace("app.asar", "app.asar.unpacked");
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