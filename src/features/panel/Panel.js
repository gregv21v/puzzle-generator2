/**
 * Panel - the main building block of the application
 */

import React, { useState } from 'react';

import styles from './Panel.module.css';

export function Panel({style, title, children}) {
    const [hidden, setHidden] = useState(false)

    /**
     * showHide()
     * @descriptions shows and hides the panel depending on its previous state
     */
    function showHide() {
        setHidden(!hidden)
    }

    
    return (
        <div className={styles.container + " " + style}>
            <div className={styles.heading} onClick={showHide}>
                <p className={styles.title}>{title}</p>
                <p className={styles.icon}><strong>{(hidden) ? "+" : "-"}</strong></p>
            </div>
            {
                (hidden) ? "" : (
                    <div className={styles.body}>
                        {children}
                    </div>
                )
            }
        </div>      
    )
}