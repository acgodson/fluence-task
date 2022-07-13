import styles from "./styles.module.css";


const Modal = ({style, children, closeModal, big }) => {
 


  return (
    <>
      <div
      style={style}
        className={[
          styles.modal,
          big ? styles.modal__big : styles.modal__small,
        ].join(" ")}
      >
        {children}

      </div>
      <div className={styles.backdrop} onClick={closeModal}></div>    
    </>
  );
};

export default Modal;
