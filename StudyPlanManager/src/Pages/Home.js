import styles from '../dist/home.module.scss';
import { Container, TextField, Button } from '@mui/material';
import React from 'react'
import axios from 'axios';
import { FaFolder, FaFolderOpen, FaFolderPlus } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";
import TopBar from '../Components/TopBar';
function Home() {
    //logic
    const [universidades, setUniversidades] = React.useState([]);
    const [activeUni, setActiveUni] = React.useState([]);
    const [facultades, setFacultades] = React.useState([]);
    const [activeFacu, setActiveFacu] = React.useState([]);
    const [carreras, setCarreras] = React.useState([]);
    const [isAddingUniversidad, setIsAddingUniversidad] = React.useState(false);
    const [isAddingFacultad, setIsAddingFacultad] = React.useState(false);
    const [isAddingCarrera, setIsAddingCarrera] = React.useState(false);
    const [newNameField, setNewNameField] = React.useState('');
    const [newCarreraNombre, setNewCarreraNombre] = React.useState('');
    const [newCarreraDuracion, setNewCarreraDuracion] = React.useState('');
    const [newCarreraTituloIntermedio, setNewCarreraTituloIntermedio] = React.useState('');



    /******************************************************************************************/
    /*                                         Use Effects                                    */
    /******************************************************************************************/

    React.useEffect(() => {
        loadUniversidades();
    }, []);

    // Load facultades from Active Universidad
    React.useEffect(() => {
        console.log("Active Uni is ", activeUni)
        loadFacultades();
    }, [activeUni])


    React.useEffect(() => {
        console.log("Active facu is ", activeFacu)
        loadCarreras();
    }, [activeFacu])


    /******************************************************************************************/
    /*                                      Requests Section                                  */
    /******************************************************************************************/

    // Load Universidades
    const loadUniversidades = () => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/universidades`)
            .then(response => {
                console.log("Datos recibidos: ", response.data); // Axios ya tiene los datos en 'response.data'
                setUniversidades(response.data);
            })
            .catch(error => {
                console.error('Error al obtener las universidades:', error);
            });
    }

    // Load facultades from Active Universidad
    const loadFacultades = () => {
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
    }

    // Load carreras from Active Facultad
    const loadCarreras = () => {
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
    }

    const createUniversidad = (nombreU) => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/universidades`, { nombre_Universidad: nombreU }).then(response => {
            console.log("Universidad creada: ", response.data);
            loadUniversidades();
        }).catch(error => {
            console.error('Error al crear la universidad:', error);
        });
    }

    const createFacultad = (nombreF) => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/facultades`, { nombreF: nombreF, universidad: activeUni }).then(response => {
            console.log("Facultad creada: ", response.data);
            loadFacultades();
        }).catch(error => {
            console.error('Error al crear la facultad:', error);
        });
    }

    const createCarrera = (carrera) => {
        console.log("Creating carrera: ", carrera);
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/carreras`, carrera).then(response => {
            console.log("Carrera creada: ", response.data);
            loadCarreras();
        }).catch(error => {
            console.error('Error al crear la carrera:', error);
        });
    }

    const deleteUniversidad = (id_Universidad) => {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/universidades/` + id_Universidad).then(response => {
            console.log("Universidad eliminada: ", response.data);
            loadUniversidades();
        }).catch(error => {
            console.error('Error al eliminar la universidad:', error);
        });
    }

    const deleteFacultad = (id_F) => {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/facultades/` + id_F).then(response => {
            console.log("Facultad eliminada: ", response.data);
            loadFacultades();
        }).catch(error => {
            console.error('Error al eliminar la facultad:', error);
        });
    }

    const deleteCarrera = (id_C) => {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/carreras/` + id_C).then(response => {
            console.log("Carrera eliminada: ", response.data);
            loadCarreras();
        }).catch(error => {
            console.error('Error al eliminar la carrera:', error);
        });
    }

    /******************************************************************************************/
    /*                           New Universidad/Facultad Logic                               */
    /******************************************************************************************/
    // Función para guardar la nueva facultad (por ahora, solo en consola; expande para POST)
    const handleSaveFacultad = () => {
        if (newNameField.trim()) {
            console.log('Nueva facultad guardada:', newNameField);  // Aquí puedes agregar el POST al backend
            // Post request to backend can be added here
            createFacultad(newNameField, activeUni.id_Universidad);
            setNewNameField('');
            setIsAddingFacultad(false);
        }
    };

    const handleSaveUniversidad = () => {
        if (newNameField.trim()) {
            console.log('Nueva universidad guardada:', newNameField);  // Aquí puedes agregar el POST al backend
            // Post request to backend can be added here
            createUniversidad(newNameField);
            setNewNameField('');
            setIsAddingUniversidad(false);
        }
    };

    const handleSaveCarrera = () => {
        if (newCarreraNombre.trim() && newCarreraDuracion) {
            const currentCarrera = {
                nombreC: newCarreraNombre,
                duracion: parseInt(newCarreraDuracion),
                tituloIntermedio: newCarreraTituloIntermedio.trim() || null,
                fechaInscripcion: new Date(),
                facultad: activeFacu
            };
            createCarrera(currentCarrera);
            setNewCarreraNombre('');
            setNewCarreraDuracion('');
            setNewCarreraTituloIntermedio('');
            setIsAddingCarrera(false);
        }
    }

    // Funciones para cancelar
    const handleCancelFacultad = () => {
        setNewNameField('');
        setIsAddingFacultad(false);
    };
    const handleCancelUniversidad = () => {
        setNewNameField('');
        setIsAddingUniversidad(false);
    };

    const handleCancelCarrera = () => {
        setNewCarreraNombre('');
        setNewCarreraDuracion('');
        setNewCarreraTituloIntermedio('');
        setIsAddingCarrera(false);
    }

    const handleDelete = (type, id) => {
        if (type === 'universidad') {
            deleteUniversidad(id);
        } else if (type === 'facultad') {
            deleteFacultad(id);
        } else if (type === 'carrera') {
            deleteCarrera(id);
        }
    }



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
                                <div className={styles.Universidad} >
                                    <div className={styles.UniversidadHeader}>
                                        <div>{universidad.id_Universidad === activeUni.id_Universidad ? <FaFolderOpen /> : <FaFolder />}</div>
                                        <div onClick={() => { setActiveUni(activeUni === universidad ? {} : universidad); setActiveFacu({}); }} ><p>{universidad.nombre_Universidad}</p></div>
                                        <div className={styles.DeleteButton} onClick={() => {
                                            window.confirm(`¿Estás seguro de que deseas eliminar la universidad ${universidad.nombre_Universidad}? Esta acción no se puede deshacer.`) &&
                                                handleDelete('universidad', universidad.id_Universidad)
                                        }
                                        }>
                                            <TiDeleteOutline />
                                        </div>
                                    </div>
                                    <div className={(universidad.id_Universidad === activeUni.id_Universidad) ? styles.Facultades : styles.Inactive}>
                                        {(facultades || []).map((facultad) => (
                                            <div className={styles.Facultad} >
                                                <div className={styles.FacultadHeader}>
                                                    <div>{facultad.id_F === activeFacu.id_F ? <FaFolderOpen /> : <FaFolder />}</div>
                                                    <div onClick={() => setActiveFacu(activeFacu === facultad ? {} : facultad)}><p>{facultad.nombreF}</p></div>
                                                    <div className={styles.DeleteButton} onClick={() => {
                                                        window.confirm(`¿Estás seguro de que deseas eliminar la facultad ${facultad.nombreF}? Esta acción no se puede deshacer.`) &&
                                                            handleDelete('facultad', facultad.id_F)
                                                    }
                                                    }>
                                                        <TiDeleteOutline />
                                                    </div>
                                                </div>
                                                <div className={(facultad.id_F === activeFacu.id_F) ? styles.Carreras : styles.Inactive}>
                                                    <ul>
                                                        {(carreras || []).map((carrera) => (
                                                            <div className={styles.Carrera}>
                                                                <li key={carrera.id_C}>
                                                                    <a href={'/carrera/' + carrera.id_C}>{carrera.nombreC}</a>
                                                                    <div className={styles.DeleteButton} onClick={() => {
                                                                        window.confirm(`¿Estás seguro de que deseas eliminar la carrera ${carrera.nombreC}? Esta acción no se puede deshacer.`) &&
                                                                            handleDelete('carrera', carrera.id_C)
                                                                    }
                                                                    }>
                                                                        <TiDeleteOutline />
                                                                    </div>
                                                                </li>
                                                            </div>


                                                        ))}
                                                        {/* Crear Universidad Nueva */}
                                                        <div className={styles.Carrera} >
                                                            <li key={-1}>
                                                                {isAddingCarrera ? (
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                        <TextField size="small" placeholder="Nombre de la carrera" value={newCarreraNombre} onChange={(e) => setNewCarreraNombre(e.target.value)} />
                                                                        <TextField size="small" type="number" placeholder="Duración (años)" value={newCarreraDuracion} onChange={(e) => setNewCarreraDuracion(e.target.value)} />
                                                                        <TextField size="small" placeholder="Título intermedio" value={newCarreraTituloIntermedio} onChange={(e) => setNewCarreraTituloIntermedio(e.target.value)} />
                                                                        <Button variant="contained" size="small" onClick={handleSaveCarrera}>Guardar</Button>
                                                                        <Button variant="outlined" size="small" onClick={handleCancelCarrera}>Cancelar</Button>
                                                                    </div>
                                                                ) : (
                                                                    <span onClick={() => setIsAddingCarrera(true)} className={styles.NewCarreraSpan}>Nueva carrera</span>
                                                                )}
                                                            </li>
                                                        </div>
                                                    </ul>
                                                </div>
                                            </div>
                                        )
                                        )}
                                        {/* Add Facultad */}
                                        <div className={styles.Facultad} >
                                            <div className={styles.FacultadHeader}>
                                                <div>{<FaFolderPlus />}</div>
                                                {isAddingFacultad ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <TextField
                                                            size="small"
                                                            placeholder="Nombre de la facultad"
                                                            value={newNameField}
                                                            onChange={(e) => setNewNameField(e.target.value)}
                                                            onKeyPress={(e) => e.key === 'Enter' && handleSaveFacultad()}
                                                            autoFocus
                                                        />
                                                        <Button variant="contained" size="small" onClick={handleSaveFacultad}>Guardar</Button>
                                                        <Button variant="outlined" size="small" onClick={handleCancelFacultad}>Cancelar</Button>
                                                    </div>
                                                ) : (
                                                    <div onClick={() => setIsAddingFacultad(true)} ><p>Nueva facultad</p></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Add New Universidad */}
                            <div className={styles.Universidad} >
                                <div className={styles.UniversidadHeader}>
                                    <div>{<FaFolderPlus />}</div>
                                    {isAddingUniversidad ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <TextField
                                                size="small"
                                                placeholder="Nombre de la universidad"
                                                value={newNameField}
                                                onChange={(e) => setNewNameField(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSaveUniversidad()}
                                                autoFocus
                                            />
                                            <Button variant="contained" size="small" onClick={handleSaveUniversidad}>Guardar</Button>
                                            <Button variant="outlined" size="small" onClick={handleCancelUniversidad}>Cancelar</Button>
                                        </div>
                                    ) : (
                                        <div onClick={() => setIsAddingUniversidad(true)} ><p>Nueva universidad</p></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Home;