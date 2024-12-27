import './dist/Home.scss';
import { Container } from '@mui/material';
import React from 'react'
import axios from 'axios';
import { FaFolder, FaFolderOpen } from "react-icons/fa";

function Home() {
    //logic
    const [universidades, setUniversidades] = React.useState([]);
    const [activeUni, setActiveUni] = React.useState([]);
    const [facultades, setFacultades] = React.useState([]);
    const [activeFacu, setActiveFacu] = React.useState([]);
    const [carreras, setCarreras] = React.useState([]);

    // Load Universidades
    React.useEffect(() => {
        axios.get('http://localhost:8080/universidades')
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
            axios.get('http://localhost:8080/facultades/universidades/' + activeUni.id_Universidad + '/facultades')
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
            axios.get('http://localhost:8080/carreras/facultades/' + activeFacu.id_F + '/carreras')
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
        <div className='Body'>
            <div className='TopBar'>
                <Container className='TopBarContainer'>
                    <div className='Left'>left</div>
                    <div className='Right'>right</div>
                </Container>
            </div>
            <Container maxWidth='lg'>
                <div className='Main'>
                    <div className='Title'>
                        <h1>Study Plan Manager v0.0.1</h1>
                    </div>
                    <div className='Description'>
                        <p>Bienvenido a la primer iteracion de este proyecto, aqui es donde todo comienza!</p>
                        <p>PD: si, esta feo, y va a seguir feo durante un buen rato, hasta el dia en que subitamente aflore en mi una nueva pasion por el desarrollo front-end y/o UX/UI, hasta entonces, <b>it is what it is.</b></p>
                    </div>
                    <div className='Data'>
                        <div className='DataHeader'>
                            <p>Para empezar, selecciona una de tus universidades:</p>
                        </div>
                        <div className='DataBody'>
                            {(universidades||[]).map((universidad) => (
                                <div className='Universidad' onClick={() => setActiveUni(universidad)}>
                                    <div className='UniversidadHeader'>
                                        <div>{universidad.id_Universidad === activeUni.id_Universidad ? <FaFolderOpen /> : <FaFolder />}</div>
                                        <div><p>{universidad.nombre_Universidad}</p></div>
                                    </div>
                                    <div className={(universidad.id_Universidad === activeUni.id_Universidad) ? 'Facultades' : 'Inactive'}>
                                        {(facultades||[]).map((facultad) => (
                                            <div className='Facultad' onClick={() => setActiveFacu(facultad)}>
                                                <div className='FacultadHeader'>
                                                    <div>{facultad.id_F === activeFacu.id_F ? <FaFolderOpen /> : <FaFolder />}</div>
                                                    <div><p>{facultad.nombreF}</p></div>
                                                </div>
                                                <div className={(facultad.id_F === activeFacu.id_F)?'Carreras':'Inactive'}>
                                                    <ul>
                                                        {(carreras||[]).map((carrera)=>(
                                                            <div className='Carrera'>
                                                                <li key={carrera.id_C}><a href='/carrera'>{carrera.nombreC}</a></li>
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