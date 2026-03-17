import { Button, Container } from "@mui/material";
import styles from '../../dist/landing.module.scss';
import { MdOutlineTerminal } from "react-icons/md";
import { MdOutlineCode } from "react-icons/md";
import demoImage from '../../dist/img/placeholder.png';
import { Navigate, useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    return (
        <>
            <div className={styles.home}>
                <Container maxWidth="lg" className={styles.container}>
                    <div className={styles.leftMain}>
                        <div>
                            <div className={styles.chip}>
                                <MdOutlineCode size={20} style={{ marginRight: '8px' }} />
                                Herramienta Open Source y Gratuita
                            </div>
                            <h1>Organiza tu camino<span> académico </span></h1>
                            <p className={styles.secondaryText}>
                                Estructura tu progreso universitario con una plataforma de código abierto, minimalista y diseñada para la eficiencia total del estudiante.
                            </p>
                        </div>
                        <div className={styles.buttons}>
                            <Button
                                className={styles.primaryButton}
                                onClick={() => navigate('/home')}
                            >
                                Empezar Ahora
                            </Button>
                            <Button
                                className={styles.secondaryButton}
                                onClick={() => window.open('https://github.com/lelox028/study-plan-manager-frontend-react')}
                            >
                                <MdOutlineTerminal size={20} style={{ marginRight: '8px' }} />
                                Ver en github
                            </Button>
                        </div>
                    </div>
                    <div className={styles.rightMain}>
                        <div className={styles.blurEffect}></div>
                        <div className={styles.demoImage}>
                            <img src={demoImage} alt="Landing Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
}

export default Home;