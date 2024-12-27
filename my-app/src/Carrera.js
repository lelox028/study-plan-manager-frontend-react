import './dist/Carrera.scss';
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
        <div className='Body'>
            <div className='TopBar'>
                <Container className='TopBarContainer'>
                    <div className='Left'>left</div>
                    <div className='Right'>right</div>
                </Container>
            </div>
            <Container maxWidth='lg'>
                <div className='Main'>
                    <div className='Table'></div>
                </div>
            </Container>
        </div>
    )
}

export default Carrera;