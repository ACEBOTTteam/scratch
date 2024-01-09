const fs = require('fs');
const { spawn } = require('child_process');

const upload = require('./upload.js')

//arduino-Cli本地地址
const arduinoCliPath = __dirname + '/arduino-cli.exe'
//需要编译的文件地址
const filePath = __dirname + '/build/build.ino'
//编译后的文件保存地址
const keepFilePath = __dirname + '/build/dist'
/**
 * @description: 将代码保存为文件
 * @param {*} code 传入的代码
 * @return {*} Promise
 */
const writeCodeToFile = (code) => {
    return new Promise((resolve, reject) => {
        // 创建目录  
        fs.mkdirSync(__dirname + '/build', { recursive: true });

        fs.writeFile(filePath, code, (err) => {
            if (err) {
                reject(err, '保存文件的错误');
            } else {
                resolve(true);
            }
        });
    });
}

const compile = (serialPortPath, mainWindow) => {
    console.log(filePath, 'filePath', keepFilePath, 'keepFilePath')
    let command = `compile -b esp32:esp32:esp32 ${filePath} --build-path ${keepFilePath}`
    command = command.split(' ')
    command.forEach((item, index) => {
        if (!item) {
            command.splice(index, 1)
        }
    })
    console.log(command, 'command')
    const esptoolProcess = spawn(arduinoCliPath, command);

    esptoolProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        mainWindow.webContents.send('serialPort', { type: 'portData', data: data })
    });

    esptoolProcess.stderr.on('data', (data) => {
        console.error(`编译的错误 stderr: ${data}`);
        mainWindow.webContents.send('serialPort', { type: 'portData', data: data })
    });

    esptoolProcess.on('error', (error) => {
        console.error(`编译的错误: ${error}`);
        mainWindow.webContents.send('serialPort', { type: 'portData', data: data })
    });

    esptoolProcess.on('close', (code) => {
        console.log(`子进程退出码: ${code}`);
        //编译完成后进行上传
        if (!code) {
            upload(arduinoCliPath, keepFilePath, serialPortPath,mainWindow)
        }
    });
}

module.exports = {
    writeCodeToFile,
    compile
}