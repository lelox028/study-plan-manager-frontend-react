import './dist/Carrera.scss';
import { useParams } from 'react-router-dom';

function Carrera (){

    const { slug } = useParams();
    console.log("this is an slug",slug)

    return(
        <div>
            <h1>CARRERA</h1>
        </div>
    )
}

export default Carrera;