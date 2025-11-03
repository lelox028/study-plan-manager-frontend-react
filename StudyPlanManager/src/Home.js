import styles from './dist/home.module.scss';
import { Container } from '@mui/material';
import React from 'react'
import axios from 'axios';
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import TopBar from './TopBar';
function Home() {
    //logic
    const [universidades, setUniversidades] = React.useState([]);
    const [activeUni, setActiveUni] = React.useState([]);
    const [facultades, setFacultades] = React.useState([]);
    const [activeFacu, setActiveFacu] = React.useState([]);
    const [carreras, setCarreras] = React.useState([]);

    // Load Universidades
    React.useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/universidades`)
            .then(response => {
                console.log("Datos recibidos: ", response.data); // Axios ya tiene los datos en 'response.data'
                setUniversidades(response.data);
            })
            .catch(error => {
                console.error('Error al obtener las universidades:', error);
            });
    }, []);

    // Load facultades from Active Universidad
    React.useEffect(() => {
        console.log("Active Uni is ", activeUni)
        if (activeUni.id_Universidad) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/facultades/universidades/` + activeUni.id_Universidad + '/facultades')
                .then(response => {
                    console.log("Datos facultad recibidos: ", response.data); // Axios ya tiene los datos en 'response.data'
                    setFacultades(response.data);
                })
                .catch(error => {
                    console.error('Error al obtener las facultades:', error);
                });
        }
    }, [activeUni])

    // Load carreras from Active Facultad
    React.useEffect(() => {
        console.log("Active facu is ", activeFacu)
        if (activeFacu.id_F) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/carreras/facultades/` + activeFacu.id_F + '/carreras')
                .then(response => {
                    console.log("Datos carreras recibidos: ", response.data); // Axios ya tiene los datos en 'response.data'
                    setCarreras(response.data);
                })
                .catch(error => {
                    console.error('Error al obtener las facultades:', error);
                });
        }
    }, [activeFacu])

    return (
        <div className={styles.Body}>
            <TopBar />
            <Container maxWidth='lg'>
                <div className={styles.Main}>
                    <div className={styles.Title}>
                        <h1>Study Plan Manager v0.0.1</h1>
                    </div>
                    <div className={styles.Description}>
                        <p>Bienvenido a la primer iteracion de este proyecto, aqui es donde todo comienza!</p>
                        <p>PD: si, esta feo, y va a seguir feo durante un buen rato, hasta el dia en que subitamente aflore en mi una nueva pasion por el desarrollo front-end y/o UX/UI, hasta entonces, <b>it is what it is.</b></p>
                    </div>
                    <div className={styles.Data}>
                        <div className={styles.DataHeader}>
                            <p>Para empezar, selecciona una de tus universidades:</p>
                        </div>
                        <div className={styles.DataBody}>
                            {(universidades || []).map((universidad) => (
                                <div className={styles.Universidad} onClick={() => setActiveUni(universidad)}>
                                    <div className={styles.UniversidadHeader}>
                                        <div>{universidad.id_Universidad === activeUni.id_Universidad ? <FaFolderOpen /> : <FaFolder />}</div>
                                        <div><p>{universidad.nombre_Universidad}</p></div>
                                    </div>
                                    <div className={(universidad.id_Universidad === activeUni.id_Universidad) ? styles.Facultades : styles.Inactive}>
                                        {(facultades || []).map((facultad) => (
                                            <div className={styles.Facultad} onClick={() => setActiveFacu(facultad)}>
                                                <div className={styles.FacultadHeader}>
                                                    <div>{facultad.id_F === activeFacu.id_F ? <FaFolderOpen /> : <FaFolder />}</div>
                                                    <div><p>{facultad.nombreF}</p></div>
                                                </div>
                                                <div className={(facultad.id_F === activeFacu.id_F) ? styles.Carreras : styles.Inactive}>
                                                    <ul>
                                                        {(carreras || []).map((carrera) => (
                                                            <div className={styles.Carrera}>
                                                                <li key={carrera.id_C}><a href={'/carrera/' + carrera.id_C}>{carrera.nombreC}</a></li>
                                                            </div>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Home;