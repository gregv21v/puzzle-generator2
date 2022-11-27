import styles from "./Menus.module.css"

export function Menus() {
    return (
        <div className={styles.menus}>
            <div className={styles.menu}>File</div> | 
            <div className={styles.menu}>Edit</div>
        </div>
    )
}