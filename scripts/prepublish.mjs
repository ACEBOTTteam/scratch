// From the NPM docs:
// "If you need to perform operations on your package before it is used, in a way that is not dependent on the
// operating system or architecture of the target system, use a prepublish script."
// Once this step is complete, a developer should be able to work without an Internet connection.
// See also: https://docs.npmjs.com/cli/using-npm/scripts

import fs from 'fs';
import path from 'path';

import crossFetch from 'cross-fetch';
import yauzl from 'yauzl';
import {fileURLToPath} from 'url';

/** @typedef {import('yauzl').Entry} ZipEntry */
/** @typedef {import('yauzl').ZipFile} ZipFile */

// these aren't set in ESM mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// base/root path for the project
const basePath = path.join(__dirname, '..');

/**
 * Extract the first matching file from a zip buffer.
 * The path within the zip file is ignored: the destination path is `${destinationDirectory}/${basename(entry.name)}`.
 * Prints warnings if more than one matching file is found.
 * @param {function(ZipEntry): boolean} filter Returns true if the entry should be extracted.
 * @param {string} relativeDestDir The directory to extract to, relative to `basePath`.
 * @param {Buffer} zipBuffer A buffer containing the zip file.
 * @returns {Promise<string>} A Promise for the base name of the written file (without directory).
 */
const extractFirstMatchingFile = (filter, relativeDestDir, zipBuffer) => new Promise((resolve, reject) => {
    try {
        let extractedFileName;
        yauzl.fromBuffer(zipBuffer, {lazyEntries: true}, (zipError, zipfile) => {
            if (zipError) {
                throw zipError;
            }
            zipfile.readEntry();
            zipfile.on('end', () => {
                resolve(extractedFileName);
            });
            zipfile.on('entry', entry => {
                if (!filter(entry)) {
                    // ignore non-matching file
                    return zipfile.readEntry();
                }
                if (extractedFileName) {
                    console.warn(`Multiple matching files found. Ignoring: ${entry.fileName}`);
                    return zipfile.readEntry();
                }
                extractedFileName = entry.fileName;
                console.info(`Found matching file: ${entry.fileName}`);
                zipfile.openReadStream(entry, (fileError, readStream) => {
                    if (fileError) {
                        throw fileError;
                    }
                    const baseName = path.basename(entry.fileName);
                    const relativeDestFile = path.join(relativeDestDir, baseName);
                    console.info(`Extracting ${relativeDestFile}`);
                    const absoluteDestDir = path.join(basePath, relativeDestDir);
                    fs.mkdirSync(absoluteDestDir, {recursive: true});
                    const absoluteDestFile = path.join(basePath, relativeDestFile);
                    const outStream = fs.createWriteStream(absoluteDestFile);
                    readStream.on('end', () => {
                        outStream.close();
                        zipfile.readEntry();
                    });
                    readStream.pipe(outStream);
                });
            });
        });
    } catch (error) {
        reject(error);
    }
});

const downloadMicrobitHex = async () => {
    const relativeHexDir = path.join('static', 'microbit');
    const hexFileName = "scratch-microbit-1.2.0.hex"
    const relativeHexFile = path.join(relativeHexDir, hexFileName);
    const relativeGeneratedDir = path.join('src', 'generated');
    const relativeGeneratedFile = path.join(relativeGeneratedDir, 'microbit-hex-url.cjs');
    const absoluteGeneratedDir = path.join(basePath, relativeGeneratedDir);
    fs.mkdirSync(absoluteGeneratedDir, {recursive: true});
    const absoluteGeneratedFile = path.join(basePath, relativeGeneratedFile);
    fs.writeFileSync(
        absoluteGeneratedFile,
        [
            '// This file is generated by scripts/prepublish.mjs',
            '// Do not edit this file directly',
            '// This file relies on a loader to turn this `require` into a URL',
            `module.exports = require('./${path.relative(relativeGeneratedDir, relativeHexFile)}');`,
            '' // final newline
        ].join('\n')
    );
    console.info(`Wrote ${relativeGeneratedFile}`);
};

const prepublish = async () => {
    await downloadMicrobitHex();
};

prepublish().then(
    () => {
        console.info('Prepublish script complete');
        process.exit(0);
    },
    e => {
        console.error(e);
        process.exit(1);
    }
);