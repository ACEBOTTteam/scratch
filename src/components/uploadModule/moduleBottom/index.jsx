import React from 'react'
import styles from './index.css'

import CodeMirror from '@uiw/react-codemirror';
import {  materialDarkInit } from '@uiw/codemirror-theme-material';

const ModuleBottom = () => {
    return (
        <div>
            <div className={styles.terminal}>
                <CodeMirror
                    theme={materialDarkInit({
                        settings: {
                            caret: '#000',
                            background: '#000',
                            foreground: "#000",
                            fontFamily: 'monospace',
                        }
                    })}
                    value={''}
                    height="200px"
                />
            </div>
        </div>
    )
}

export default ModuleBottom