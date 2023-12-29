import React, { useState, useCallback } from 'react'
import styles from './index.css'
import classNames from 'classnames'

import CodeMirror from '@uiw/react-codemirror';
import { materialDark, materialLight } from '@uiw/codemirror-theme-material';

const ModuleTop = () => {

    //选择手动编辑\自动生成
    const [selectMode, setSelectMode] = useState('auto')
    //显示的代码
    const [code, setCode] = useState('66666666')

    /**
     * @description: 选择自动生成
     */
    const selectAuto = () => {
        setSelectMode('auto')
    }

    /**
     * @description: 选择手动编辑
     */
    const selectManual = () => {
        setSelectMode('manual')
    }


    /**
     * @description: 监听CodeMirror编辑器代码变化
     * @param {*} val 输入的代码
     * @param {*} viewUpdate
     */
    const onChange = useCallback((val, viewUpdate) => {
        console.log('val:', val);
        setValue(setCode);
    }, []);

    return (
        <div className={styles.moduleTop}>
            <div className={styles.codeBoxTop}>
                <div className={classNames('auto' === selectMode ? styles.select : '', styles.auto)}
                    onClick={selectAuto}>自动生成</div>
                <div className={classNames('manual' === selectMode ? styles.select : '', styles.manual)}
                    onClick={selectManual}>手动编辑</div>
            </div>
            <div className={styles.codeBox}>
                <CodeMirror
                    theme={'auto' === selectMode ? materialLight : materialDark} value={code}
                    extensions={[]}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}

export default ModuleTop