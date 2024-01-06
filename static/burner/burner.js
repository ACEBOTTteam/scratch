const { spawn } = require('child_process');
const { resolve } = require('path')
/**
 * @description: 在线烧录固件
 * @param {*} path 串口地址
 * @return {*} 监听烧录烧录过程 
 */
const burner = (path, callback) => {
    const esptoolPath = __dirname+'/esptool.exe'; //esptool.exe的完整路径  
    const avrdudePath = __dirname+'/esp32/'; 
    let partitions = avrdudePath + 'ESP32_Arduino_Online_Firmware.ino.partitions.bin'
    let bootloader = avrdudePath + 'ESP32_Arduino_Online_Firmware.ino.bootloader.bin'
    let reality = avrdudePath + 'ESP32_Arduino_Online_Firmware.ino.bin'

    let command = `--chip esp32 --port ${path} --baud 921600  --before default_reset --after hard_reset write_flash  -z --flash_mode dio --flash_freq 80m --flash_size 8MB 0x1000 ${bootloader} 0x8000 ${partitions}  0x10000 ${reality}`; // 构建要执行的命令  
    command = command.split(' ')
    command.forEach((item, index) => {
        if (!item) {
            command.splice(index, 1)
        }
    })
    console.log(command,'command')
    const esptoolProcess = spawn(esptoolPath, command);

    esptoolProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    esptoolProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    esptoolProcess.on('error', (error) => {
        console.error(`执行出错: ${error}`);
    });

    esptoolProcess.on('close', (code) => {
        console.log(`子进程退出码: ${code}`);
        callback(code)
    });
}

module.exports = burner
// burner()