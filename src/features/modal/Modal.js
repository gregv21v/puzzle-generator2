// source: https://www.digitalocean.com/community/tutorials/react-modal-component

import styles from "./Modal.module.css"

export function Modal({handleClose, show, children}) {
    const showHideClassName = styles.modal + " " + (show ?  + styles.displayBlock : styles.displayNone);

    return (
      <div className={showHideClassName}>
        <section className={styles.modalMain}>
          {children} <br /> <br />
          <button type="button" onClick={handleClose}>
            Close
          </button>
        </section>
      </div>
    );  
}