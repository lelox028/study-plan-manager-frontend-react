import styles from '../../dist/landing.module.scss';


function CallToAction(){
    return(
        <div className={styles.callToAction}>
            <div className={styles.ctaContainer}>
                <div className={styles.ctaContent}>
                    <div className={styles.blurEffectTop}></div>
                    <div className={styles.blurEffectBottom}></div>
                    
                    <div className={styles.ctaBody}>
                        <h2>¿Listo para dominar tu próximo semestre?</h2>
                        <p>Únete a la comunidad de estudiantes que construyen y utilizan la mejor herramienta abierta para el seguimiento académico.</p>
                        <div className={styles.ctaButtons}>
                            <button className={styles.ctaButton}>
                                <span>Empezar ahora</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CallToAction;