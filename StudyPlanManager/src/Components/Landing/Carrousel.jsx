import { Container } from '@mui/material';
import styles from '../../dist/landing.module.scss';
import CarrouselCard from './CarrouselCard';
import { MdFavorite,MdAccountTree,MdBolt } from "react-icons/md";

function Carrousel() {
    const carrouselItems = [
        { 
            icon: <MdAccountTree size={30} />, 
            title: 'Organización', 
            description: 'Estructura tus materias por nivel y semestre. Define tu propio mapa académico de forma lógica.' 
        }, 
        { 
            icon: <MdFavorite size={30} />,
            title: '100% Gratuito', 
            description: 'Proyecto impulsado por la comunidad. Disfruta de todas las funcionalidades sin planes premium ni publicidad.' 
        },
        {
            icon:<MdBolt size={30} />,
            title:'Gestión Simple',
            description:'Interfaz minimalista inspirada en la eficiencia. Gestiona tus créditos y materias con rapidez.'
        }
    ]; // Placeholder items
    return (
        <div className={styles.carrousel}>
            <Container maxWidth="lg" className={styles.container}>
                <div className={styles.carrouselTitle}>
                    <h2>El poder del Open Source al servicio de tu carrera</h2>
                    <p>SPM es 100% gratuito y colaborativo. Sin cuotas mensuales, sin límites, solo tú y tu progreso académico.</p>
                </div>
                <div className={styles.carrouselItems}>
                    {/* Carrousel items go here */}
                    <CarrouselCard {...carrouselItems[0]} />
                    <CarrouselCard {...carrouselItems[1]} />
                    <CarrouselCard {...carrouselItems[2]} />
                </div>
            </Container>
        </div>
    );
}

export default Carrousel;