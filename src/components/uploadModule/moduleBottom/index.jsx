import React, { useRef, useEffect, useState } from 'react'
import styles from './index.css'

import CodeMirror from '@uiw/react-codemirror';
import { materialDarkInit } from '@uiw/codemirror-theme-material';

import { getSerialPort } from '../../../lib/serial/serialPort'

import openSerialPortIcon from '../../../../static/openSerialPort.png'
import closeSerialPortIcon from '../../../../static/closeSerialPort.png'
import listIcon from '../../../../static/list.png'
import clearIcon from '../../../../static/clear.png'
import openIcon from '../../../../static/open.svg'
import closeIcon from '../../../../static/close.svg'

const ModuleBottom = () => {

    const terminalRef = useRef(null)

    //缓存显示的代码
    const codeRef = useRef('')

    const [codeBoxHeight, setCodeBoxHeight] = useState(0)
    //打开、关闭选项
    const [isOpenSelect, setIsOpenSelect] = useState(false)
    //波特率
    const [baudRate, setBaudRate] = useState('115200')
    //十六进制
    const [isHexadecimal, setIsHexadecimal] = useState(false)
    //结束符
    const [terminator, setTerminator] = useState('lineFeed')
    //需要发送的信息
    const [data, setData] = useState('')
    //显示的代码
    const [code,setCode] = useState('')




    const baudRateList = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 76800, 115200, 230400]

    useEffect(() => {
        let timer = setTimeout(() => {
            console.log(terminalRef, terminalRef.current.clientHeight, 'dom')
            setCodeBoxHeight(terminalRef.current.clientHeight)
            clearTimeout(timer)
        }, 150)

        document.addEventListener('click', () => {
            setIsOpenSelect(false)
        })

        window.electronAPI.onUpdateCounter((args) => {
            console.log(args, 'port send')
            if ('portData' === args.type) {
                console.log(args, 'argsss')
                let data = args.data
                const decoder = new TextDecoder();
                data= decoder.decode(data);
                codeRef.current+=data
                setCode(codeRef.current)
                console.log(codeRef.current, 'datadata')
            }
        })

        return () => {
            document.removeEventListener('click', () => {
                setIsOpenSelect(false)
            })
        }
    }, [])

    /**
     * @description: 点击选项
     * @param {Boolean} age 是否打开 
     */
    const clickSelect = (age) => {
        setIsOpenSelect(age)
    }

    const terminatorChange = (ev) => {
        setTerminator(ev.target.value)
    }

    const selectBaudRate = (ev) => {
        setBaudRate(ev.target.value)
    }

    const stop = (e) => {
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation()
        return
    }

    /**
     * @description: 发送
     */
    const send = () => {
        let value = data
        switch (terminator) {
            case 'lineFeed':
                value += '\n'
                break;
            case 'enter':
                value += '\r'
                break;
            case 'all':
                value += '\r\n'
                break
            default:
                break;
        }
        window.electronAPI.clientSend('send', value).then(res => {
            console.log(res, '返回的数据')
        })
    }

    const click = async () => {
        const serial = await getSerialPort()
        await serial.open({ baudRate: 115200 })
        serial.addEventListener('connect', (e) => {
            console.log(e, '连接成功')
        })
    }



    return (
        <div className={styles.terminal}>
            <div className={styles.codeContainer} ref={terminalRef}>
                <CodeMirror
                    theme={materialDarkInit({
                        settings: {
                            caret: '#000',
                            background: '#000',
                            foreground: "#fff",
                            fontFamily: 'monospace',
                        }
                    })}
                    height={codeBoxHeight + 'px'}
                    value={code}
                    editable={false}
                    basicSetup={
                        { lineNumbers: false }
                    }
                />
            </div>
            <div className={styles.maneuveringArea}>
                <div className={styles.areaLeft}>
                    <div title='打开串口'>
                        <img src={openSerialPortIcon} alt="打开串口" />
                    </div>
                    <div title='关闭串口'>
                        <img src={closeSerialPortIcon} alt="关闭串口" />
                    </div>
                </div>
                <div className={styles.middle}>
                    <div className={styles.clearIcon} onClick={click} title='清除输出'>
                        <img src={clearIcon} alt="清除输出" />
                    </div>
                    <div className={styles.inp}>
                        <input type="text" value={data} onChange={(ev) => { setData(ev.target.value) }} />
                    </div>
                    <button onClick={send}>发送</button>
                </div>
                <div className={styles.listBtn} onClick={stop}>
                    <img src={listIcon} alt="选项" onClick={() => clickSelect(true)} />
                    <div className={isOpenSelect ? styles.select : styles.hidden}>
                        <div className={styles.decimal}>
                            <span>16进制</span>
                            <img src={openIcon} alt="采用16进制格式显示和发送信息" />
                            <img src={closeIcon} alt="关闭" />
                        </div>
                        <div className={styles.selectGrowp}>
                            <select value={baudRate} onChange={selectBaudRate}>
                                {
                                    baudRateList.map((item, index) => {
                                        return (
                                            <option value={item} key={index}>{item}波特率</option>
                                        )
                                    })
                                }
                            </select>
                            <select value={terminator} onChange={terminatorChange}>
                                <option value="none">没有结束符</option>
                                <option value="lineFeed">换行符</option>
                                <option value="enter">回车</option>
                                <option value="all">回车加换行</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModuleBottom