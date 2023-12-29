import React from 'react'
import styles from './index.css'

import uploanIcon from '../../../static/uploadIcon.png'

import ModuleTop from './moduleTop/index.jsx'
import ModuleBottom from './moduleBottom/index.jsx'

const UploadModule = () => {
    return (
        <div className={styles.uploadModuleBox}>
            <div className={styles.top}>
                <div className={styles.upload}>
                    <img src={uploanIcon} alt="上传" />
                    <span>上传到设备</span>
                </div>
            </div>
            <ModuleTop/>
            <ModuleBottom/>
        </div>
    )
}

export default UploadModule