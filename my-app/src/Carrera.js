import styles from './dist/Carrera.module.scss';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import axios from 'axios';
// import stuff for tables
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Typography,
  } from '@mui/material';


function Carrera() {

    const { slug } = useParams();

    const [thisCarrera, setThisCarrera] = React.useState([]);
    const [materias, setMaterias] = React.useState([]);

    React.useEffect(() => {
        // get Carrera Data
        axios.get('http://localhost:8080/carreras/' + slug)
            .then(response => {
                console.log("Datos carrera recibidos: ", response.data);
                setThisCarrera(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la carrera:', error);
            });
        // get all materias for this carrera
        axios.get('http://localhost:8080/materias/carreras/' + slug + '/materias')
            .then(response => {
                console.log("Datos materias recibidos: ", response.data);
                setMaterias(response.data);
            })
            .catch(error => {
                console.error('Error al obtener las materias:', error);
            });
    }, [])



    //table logic
    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];

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
                    <div className={styles.Table}>
                        {/* here goes a table */}
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="materias table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Materia</TableCell>
                                        <TableCell align="right">Año</TableCell>
                                        <TableCell align="right">Cuatrimestre</TableCell>
                                        <TableCell align="right">Estado</TableCell>
                                        <TableCell align="right">Fecha de Aprobación</TableCell>
                                        <TableCell align="right">Calificación</TableCell>
                                        <TableCell align="right">Carrera</TableCell>
                                        <TableCell align="right">Correlativas</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {materias.map((materia) => (
                                        <TableRow key={materia.idMateria}>
                                            <TableCell component="th" scope="row">
                                                {materia.nombreMateria}
                                            </TableCell>
                                            <TableCell align="right">{materia.anio}</TableCell>
                                            <TableCell align="right">{materia.cuatrimestre}</TableCell>
                                            <TableCell align="right">{materia.estado}</TableCell>
                                            <TableCell align="right">
                                                {materia.fechaAprobacion ? materia.fechaAprobacion : "N/A"}
                                            </TableCell>
                                            <TableCell align="right">
                                                {materia.calificacion !== null ? materia.calificacion : "N/A"}
                                            </TableCell>
                                            <TableCell align="right">
                                                {materia.carrera.nombreC}
                                            </TableCell>
                                            <TableCell align="right">
                                                {materia.correlativas.length > 0 ? (
                                                    materia.correlativas.map((corr) => (
                                                        <Typography key={corr.idMateria}>
                                                            {corr.nombreMateria}
                                                        </Typography>
                                                    ))
                                                ) : (
                                                    "Ninguna"
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Carrera;