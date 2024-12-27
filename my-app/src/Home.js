import './dist/Home.scss';
import { Container } from '@mui/material';
import React from 'react'
import axios from 'axios';

function Home() {
    //logic
    const [universidades, setUniversidades] = React.useState([]);

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
                        <p>PD: si, esta feo, y va a seguir feo durante un buen rato, hasta el dia en que magicamente aflore subitamente en mi una nueva pasion por el desarrollo front-end y/o UX/UI, hasta entonces, <b>it is what it is.</b></p>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Home;