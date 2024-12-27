import styles from './dist/Carrera.module.scss';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import axios from 'axios';


function Carrera() {

    const { slug } = useParams();

    const [thisCarrera, setThisCarrera] = React.useState([]);

    React.useEffect(() => {
        axios.get('http://localhost:8080/carreras/' + slug)
            .then(response => {
                console.log("Datos carrera recibidos: ", response.data);
                setThisCarrera(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la carrera:', error);
            });
    }, [])

    return (
        <div className={styles.Body}>
            <div className={styles.TopBar}>
                <Container className={styles.TopBarContainer}>
                    <div className={styles.Left}>left</div>
                    <div className={styles.Right}>right</div>
                </Container>
            </div>
            <Container maxWidth='lg'>
                <div className={styles.Main}>
                    <div className={styles.MainHeader}>
                        <h2>{thisCarrera.nombreC}</h2>
                    </div>
                    <div className={styles.Table}>aa</div>
                </div>
            </Container>
        </div>
    )
}

export default Carrera;