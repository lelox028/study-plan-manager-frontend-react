import styles from "./dist/carrera.module.scss";
import React from "react";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import axios from "axios";
import { Popover } from "@mui/material";
import Button from "@mui/material/Button";
import { Icon } from "@iconify/react";


function Carrera() {
    const { slug } = useParams();

    const [thisCarrera, setThisCarrera] = React.useState([]);
    const [materias, setMaterias] = React.useState([]);
    const [materiasAprobadas, setMateriasAprobadas] = React.useState([]);
    const [materiaSeleccionada, setMateriaSeleccionada] = React.useState({});


    React.useEffect(() => {
        // get Carrera Data
        axios
            .get("http://localhost:8080/carreras/" + slug)
            .then((response) => {
                console.log("Datos carrera recibidos: ", response.data);
                setThisCarrera(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener la carrera:", error);
            });
        // get all materias for this carrera
        axios
            .get("http://localhost:8080/materias/carreras/" + slug + "/materias")
            .then((response) => {
                console.log("Datos materias recibidos: ", response.data);
                setMaterias(response.data);
                
                //get all approved materias
                axios
                    .get("http://localhost:8080/materias/carreras/" + slug + "/aprobadas")
                    .then((response) => {
                        console.log("Datos materias aprobadas recibidos: ", response.data);
                        setMateriasAprobadas(response.data);
                    })
                    .catch((error) => {
                        console.error("Error al obtener las materias aprobadas:", error);
                    });
            })
            .catch((error) => {
                console.error("Error al obtener las materias:", error);
            });


    }, []);


    /***********************************************************************************************
    *    REVISAR CONDICION: que pasa si materias esta vacio cuando materias aprobadas se recibe?   *
    ************************************************************************************************/
    React.useEffect(() => {
        // Update estado in each materia once materiasAprobadas has been updated 
        setMaterias(actualizarEstadoMaterias(materias, materiasAprobadas));
    }, [materiasAprobadas])


    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event,materia) => {
        setMateriaSeleccionada(materia);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    // Correlativas Logic
    function actualizarEstadoMaterias(materias, materiasAprobadas) {
        // Obtener los IDs de las materias aprobadas
        const idsMateriasAprobadas = new Set(materiasAprobadas.map(materia => materia.idMateria));

        // Actualizar el estado de las materias
        return materias.map(materia => {
            // Si la materia ya está aprobada o promocionada, no modificar su estado
            if (materia.estado !== "Pendiente") {
                return materia;
            }

            // Verificar si todas las correlativas están aprobadas
            const correlativasNoAprobadas = materia.correlativas.filter(
                correlativa => !idsMateriasAprobadas.has(correlativa.idMateria)
            );

            if (correlativasNoAprobadas.length === 0) {
                // Todas las correlativas están aprobadas
                return { ...materia, estado: "Cursable" };
            } else {
                // Hay correlativas no aprobadas
                const nombresNoAprobadas = correlativasNoAprobadas.map(correlativa => correlativa.nombreMateria);
                return {
                    ...materia,
                    estado: nombresNoAprobadas
                };
            }
        });
    }



    return (
        <div className={styles.Body}>
            <div className={styles.TopBar}>
                <Container className={styles.TopBarContainer}>
                    <div className={styles.Left}>left</div>
                    <div className={styles.Right}>right</div>
                </Container>
            </div>
            <Container maxWidth="lg">
                <div className={styles.Main}>
                    <div className={styles.MainHeader}>
                        <h2>{thisCarrera.nombreC}</h2>
                    </div>
                    <div className={styles.Table}>
                        {/* Encabezados */}
                        <div className={styles.tableHeaders}>
                            <div className={styles.singleHeader}> Materia</div>
                            <div className={styles.singleHeader}>Año</div>
                            <div className={styles.singleHeader}>Cuatrimestre</div>
                            <div className={styles.singleHeader}>Estado</div>
                            <div className={styles.singleHeader}>Fecha de Regularización</div>
                            <div className={styles.singleHeader}>Fecha de Aprobación</div>
                            <div className={styles.singleHeader}>Calificación</div>
                            <div className={styles.singleHeader}>Correlativas</div>
                            <div className={styles.singleHeader}>Editar</div>
                        </div>

                        {/* Filas de datos */}
                        {materias.map((materia) => { 
                                console.log(materia);
                                
                            return (
                            <div key={materia.idMateria} className={styles.dataRows}>
                                <div className={styles.singleData}>{materia.nombreMateria}</div>
                                <div className={styles.singleData}>{materia.anio}</div>
                                <div className={styles.singleData}>{materia.cuatrimestre}</div>
                                <div className={styles.singleData}>{Array.isArray(materia.estado) ? `Falta aprobar: ${materia?.estado?.join(",")}` : materia.estado}</div>
                                <div className={styles.singleData}>
                                    {materia.fechaRegularizacion ? materia.fechaRegularizacion : "N/A"}
                                </div>
                                <div className={styles.singleData}>
                                    {materia.fechaAprobacion ? materia.fechaAprobacion : "N/A"}
                                </div>
                                <div className={styles.singleData}>
                                    {materia.calificacion !== null ? materia.calificacion : "N/A"}
                                </div>
                                <div className={styles.singleData}>
                                    <Button
                                        aria-describedby={id}
                                        variant="contained"
                                        onClick={(e) =>handleClick(e,materia)}
                                    >
                                        <Icon icon="mdi:eye" />
                                    </Button>
                                    <Popover
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: "center",
                                            horizontal: "center",
                                        }}
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "left",
                                        }}
                                    >
                                        {materiaSeleccionada?.correlativas?.length > 0
                                            ? materiaSeleccionada.correlativas
                                                .map((corr) => (
                                                    <span key={corr.idMateria}>
                                                        {corr.nombreMateria}
                                                    </span>
                                                ))
                                                .reduce((prev, curr) => [prev, ", ", curr])
                                            : "Ninguna"}
                                    </Popover>
                                </div>
                                <div>
                                    <Button>
                                        <Icon icon="mdi:pencil" width="24" height="24" />
                                    </Button>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Carrera;
