const { spawn } = require('child_process');
const fs = require('fs');

const upload = (arduinoCliPath, keepFilePath, serialPortPath, mainWindow) => {

    let command = `upload -p ${serialPortPath} -b esp32:esp32:esp32 --input-dir ${keepFilePath}`
    command = command.split(' ')
    command.forEach((item, index) => {
        if (!item) {
            command.splice(index, 1)
        }
    })
    const esptoolProcess = spawn(arduinoCliPath, command);

    esptoolProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        mainWindow.webContents.send('serialPort', { type: 'portData', data: data })
    });

    esptoolProcess.stderr.on('data', (data) => {
        console.error(`上传的错误 stderr: ${data}`);
        mainWindow.webContents.send('serialPort', { type: 'portData', data: data })
    });

    esptoolProcess.on('error', (error) => {
        console.error(`上传的错误: ${error}`);
        mainWindow.webContents.send('serialPort', { type: 'portData', data: data })
    });

    esptoolProcess.on('close', (code) => {
        console.log(`上传子进程退出码: ${code}`);
        if (!code) {
            //上传成功后，将保存和编译的文件删除
            fs.rm(__dirname + '/build', { recursive: true }, (err) => {
                if (err) {
                    console.log('删除时的错误', err)
                } else {
                    console.log('删除成功')
                }
            })
        }
    });

}

module.exports = upload