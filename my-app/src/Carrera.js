import styles from './dist/Carrera.module.scss';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import axios from 'axios';
// import stuff for tables
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


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
        axios.get('http://localhost:8080/materias/carreras/'+slug+'/materias')
        .then(response => {
            console.log("Datos materias recibidos: ", response.data);
            setThisCarrera(response.data);
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
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Dessert (100g serving)</TableCell>
                                        <TableCell align="right">Calories</TableCell>
                                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.calories}</TableCell>
                                            <TableCell align="right">{row.fat}</TableCell>
                                            <TableCell align="right">{row.carbs}</TableCell>
                                            <TableCell align="right">{row.protein}</TableCell>
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