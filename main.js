const { app, BrowserWindow, ipcMain } = require("electron");
const { SerialPort } = require('serialport');
const path = require("path");

const burner = require('./static/burner/burner.js')
const { writeCodeToFile, compile } = require('./src/lib/compile/build.js')

// const NodeMonkey = require("node-monkey")
// NodeMonkey()

let mainWindow = null;
//判断命令行脚本的第二参数
const mode = process.argv[2];

//全局串口接口
let port = null

// 限制只启动一个
function makeSingleInstance() {
    if (process.mas) return;
    app.requestSingleInstanceLock();
    app.on("second-instance", () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

// 用于添加Chromium插件
// function createDevTools() {
//     const {
//         default: installExtension,
//         REACT_DEVELOPER_TOOLS,
//         REDUX_DEVTOOLS,
//     } = require('electron-devtools-installer');
//     // 安装devtron
//     const devtronExtension = require('devtron');
//     devtronExtension.install();
//     // 安装React开发者工具
//     installExtension(REACT_DEVELOPER_TOOLS);
//     installExtension(REDUX_DEVTOOLS);
// }

// createWindow()方法来将index.html加载进一个新的BrowserWindow实例。
function createWindow() {
    const windowOptions = {
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        // frame: false, // 有没有边框
    };
    mainWindow = new BrowserWindow(windowOptions);
    //判断是否是开发模式
    if (mode === "dev") {
        mainWindow.loadURL("http://localhost:8601/"); // http://localhost:8002/ 前端开发环境地址
        // mainWindow.webContents.openDevTools(); // 自动打开控制台
        // createDevTools();
    } else {
        mainWindow.loadURL(path.join("file://", __dirname, "/build/index.html"));
    }
    //接收渲染进程的信息
    // ipc.on("min", function () {
    //     mainWindow.minimize();
    // });
    // ipc.on("max", function () {
    //     mainWindow.maximize();
    // });
    // ipc.on("login", function () {
    //     mainWindow.maximize();
    // });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

/**
 * @description: 查找所有串口
 * @return {*} 串口
 */
const getSerialPorts = async () => {
    try {
        let ports = await SerialPort.list();
        return ports
    } catch (error) {
        console.log(error);
    }
};

/**
 * @description: 连接串口
 * @param {*} path 串口地址
 * @return {*}
 */
const connectSerialPort = (path) => {
    port = new SerialPort({ path, baudRate: 115200, autoOpen: false });
    //烧录
    burner(path, callback)

    //发送正在烧录提示
    mainWindow.webContents.send('serialPort', { type: 'burner', data: 'going' })

    //监听数据
    port.on('data', (data) => {
        mainWindow.webContents.send('serialPort', { type: 'portData', data })
        console.log(data, 'return data')
    })
}

/**
 * @description: 打开串口
 */
const openSerialPort = () => {
    console.log(port, '所连接的串口数据')
    if (port) {
        port.open(function (err) {
            if (err) {
                console.log('error', err);
                mainWindow.webContents.send('serialPort', { type: 'connect', data: 'error' })
                return 'error'
            }
            console.log('success')
            //向渲染程序发送连接串口成功的消息
            mainWindow.webContents.send('serialPort', { type: 'connect', data: 'success' })

            return 'success'
        });
    }
}

/**
 * @description: 监听烧录是否完成
 * @param {*} code code===0是烧录完成
 */
const callback = (code) => {
    if (0 === code) {
        console.log('call callback')
        //烧录完成是打开串口
        openSerialPort()
        mainWindow.webContents.send('serialPort', { type: 'burner', data: 'success' })
    } else {
        mainWindow.webContents.send('serialPort', { type: 'burner', data: 'error' })
    }
}

/**
 * @description: 发送数据
 * @param {*} data 数据
 */
const sendData = (data) => {
    if (port) {
        console.log('send ', data)
        port.write(data);
        port.drain(err => {
            if (err) {
                console.log('send error')
                return
            };
            console.log('send success');
        });
    }
}

/**
 * @description: 解析buff数据
 * @param {*} data buff数据
 * @return {*} 解析过的字符串
 */
const analysis = (data) => {
    console.log(data, typeof data)
    const newString = data.replace(/Buffer|<|>| /g, "");
    // 创建一个 Buffer  
    const buffer = Buffer.from(newString, 'hex');

    // 将 Buffer 解析为字符串  
    const str = buffer.toString('utf8');
    return str
}

// 限制器
makeSingleInstance();

// app主进程的事件和方法
// 只有在ready事件被激发后才能创建浏览器窗口
app.whenReady().then(() => {
    createWindow();
    // 针对macos系统，在没有浏览器窗口打开的情况下调用你仅存的 createWindow() 方法
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    //处理通信
    ipcMain.handle('client', async (enent, ...args) => {
        console.log(args, '33333333')
        let item = null
        switch (args[0]) {
            case 'getserialPorts':
                item = await getSerialPorts()
                break;
            case 'connect':
                item = connectSerialPort(args[1])
                break;
            case 'send':
                sendData(args[1])
                break
            case 'sendCode':
                writeToFile(args[1])
                break
            default:
                break;
        }
        console.log(item, 'item')
        return item
    })


});

/**
 * @description: 保存代码为文件
 * @param {*} code 代码
 */
const writeToFile = (code) => {
    //编译前先将串口断开，已保证上传时Arduino-cli可以正连接串口并上传。
    port.close((error) => {
        if (error) {
            console.log(error, 'close err')
            return
        }
        console.log('close success')
        writeCodeToFile(code).then(res => {
            //保存成功后进行编译
            compile(port.settings.path,mainWindow)
        })
    }) //关闭串口连接

}

// 关闭所有窗口通常会完全退出一个应用程序
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        if (port) {
            port.close((error) => {
                if (error) {
                    console.log(error, 'close err')
                    return
                }
                console.log('close success')
            }) //关闭串口连接
        }
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

module.exports = mainWindow;
