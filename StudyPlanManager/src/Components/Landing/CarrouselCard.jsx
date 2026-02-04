import styles from '../../dist/landing.module.scss';

function CarrouselCard({ icon, title, description }) {
    return (
        <div className={styles.carouselItem}>
            <div className={styles.iconContainer}>
                <span className={styles.icon}>{icon}</span>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
}

export default CarrouselCard;