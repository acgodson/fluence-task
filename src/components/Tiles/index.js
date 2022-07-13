import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.css';


const Tiles = ({ title, subtitle, click, keys, cover, icon }) => {
    return (
        <>
            <div
                className={styles.title}
                onClick={click}
                key={keys}
                style={{
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundImage: `linear-gradient(to bottom, rgba(5, 7, 14, 0.572), rgba(4, 11, 27, 0.778)),url(${cover})`,
                }}
            >
                <span>
                    <FontAwesomeIcon icon={icon} />
                </span>
                <p className={styles.tit}> {title}</p>
                <p className={styles.sub}>{subtitle}</p>
            </div>
        </>
    );
};

export default Tiles;
