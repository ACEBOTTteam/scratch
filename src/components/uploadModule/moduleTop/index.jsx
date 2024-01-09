import React, { useState, useCallback, useRef, useEffect } from 'react'
import styles from './index.css'
import classNames from 'classnames'

import CodeMirror from '@uiw/react-codemirror';
import { materialDark, materialLight } from '@uiw/codemirror-theme-material';
import { csharp } from "@replit/codemirror-lang-csharp";
import { StreamLanguage } from '@codemirror/language';
import { connect } from 'react-redux';

const ModuleTop = (props) => {

    const codeBoxRef = useRef(null)

    //选择手动编辑\自动生成
    const [selectMode, setSelectMode] = useState('auto')
    //显示自动生成的代码
    const [autoCode, setAutoCode] = useState('66666666')
    //显示手动编辑的代码
    const [manualCode, setManualCode] = useState('')
    //是否可以手动编辑
    const [editable, setEditable] = useState(false)
    const [codeBoxHeight, setCodeBoxHeight] = useState(0)

    useEffect(() => {
        let timer = setTimeout(() => {
            console.log(codeBoxRef.current.clientHeight, codeBoxRef)
            setCodeBoxHeight(codeBoxRef.current.clientHeight)
            clearTimeout(timer)
        }, 0)
    }, [])

    useEffect(() => {
        if(props.num>1){
            console.log('更新', props.num)
            //上传
            uploadCode()
        }
    }, [props.num])

    /**
     * @description: 选择自动生成
     */
    const selectAuto = () => {
        setSelectMode('auto')
        setEditable(false)
    }

    /**
     * @description: 选择手动编辑
     */
    const selectManual = () => {
        setSelectMode('manual')
        setEditable(true)
    }

    /**
     * @description: 上传代码到设备
     */
    const uploadCode = () => {
        let code = ''
        if ('auto' === selectMode) {
            code = props.codeData
        } else {
            code = manualCode
        }
        console.log(code, '需要上传的代码')
        window.electronAPI.clientSend('sendCode', code).then(res => {
            console.log(res, '发送成功')
        })
    }

    /**
     * @description: 监听CodeMirror编辑器代码变化
     * @param {*} val 输入的代码
     * @param {*} viewUpdate
     */
    const onChange = useCallback((val, viewUpdate) => {
        console.log('val:', val);
        setManualCode(val)
    }, []);

    return (
        <div className={styles.moduleTop}>
            <div className={styles.codeBoxTop}>
                <div className={classNames('auto' === selectMode ? styles.select : '', styles.auto)}
                    onClick={selectAuto}>自动生成</div>
                <div className={classNames('manual' === selectMode ? styles.select : '', styles.manual)}
                    onClick={selectManual}>手动编辑</div>
            </div>
            <div className={styles.codeBox} ref={codeBoxRef}>
                <CodeMirror
                    theme={'auto' === selectMode ? materialLight : materialDark}
                    value={'auto' === selectMode ? props.codeData : manualCode}
                    height={codeBoxHeight + 'px'}
                    // extensions={[StreamLanguage.define(csharp)]}
                    editable={editable}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    codeData: state.scratchGui.codeData.codeData
})

export default connect(
    mapStateToProps
)(ModuleTop)