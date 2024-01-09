import React, { useRef, useState } from 'react'
import styles from './index.css'

import uploanIcon from '../../../static/uploadIcon.png'

import ModuleTop from './moduleTop/index.jsx'
import ModuleBottom from './moduleBottom/index.jsx'

const UploadModule = () => {

    const [num, setNum] = useState(1)

    const uploadCode = () => {
        setNum(num + 1)
    }

    return (
        <div className={styles.uploadModuleBox}>
            <div className={styles.top}>
                <div className={styles.upload} onClick={uploadCode}>
                    <img src={uploanIcon} alt="上传" />
                    <span>上传到设备</span>
                </div>
            </div>
            <ModuleTop num={num} />
            <ModuleBottom />
        </div>
    )
}

export default UploadModule