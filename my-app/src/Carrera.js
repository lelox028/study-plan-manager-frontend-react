import styles from "./dist/carrera.module.scss";
import React from "react";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import axios from "axios";
import { Popover } from "@mui/material";

function Carrera() {
  const { slug } = useParams();

  const [thisCarrera, setThisCarrera] = React.useState([]);
  const [materias, setMaterias] = React.useState([]);

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
      })
      .catch((error) => {
        console.error("Error al obtener las materias:", error);
      });
  }, []);

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
              <div
              className={styles.tableHeaders}
              >
                <div className={styles.singleHeader}> Materia</div>
                <div className={styles.singleHeader}>Año</div>
                <div className={styles.singleHeader}>Cuatrimestre</div>
                <div className={styles.singleHeader}>Estado</div>
                <div className={styles.singleHeader}>
                  Fecha de Aprobación
                </div>
                <div className={styles.singleHeader}>Calificación</div>
                <div className={styles.singleHeader}>Carrera</div>
                <div className={styles.singleHeader}>Correlativas</div>
              </div>

              {/* Filas de datos */}
              {materias.map((materia) => (
                <div
                  key={materia.idMateria}
                  className={styles.dataRows}
                >
                  <div className={styles.singleData}>{materia.nombreMateria}</div>
                  <div className={styles.singleData}>
                    {materia.anio}
                  </div>
                  <div className={styles.singleData}>
                    {materia.cuatrimestre}
                  </div>
                  <div className={styles.singleData}>
                    {materia.estado}
                  </div>
                  <div className={styles.singleData}>
                    {materia.fechaAprobacion ? materia.fechaAprobacion : "N/A"}
                  </div>
                  <div className={styles.singleData}>
                    {materia.calificacion !== null
                      ? materia.calificacion
                      : "N/A"}
                  </div>
                  <div className={styles.singleData}>
                    {materia.carrera.nombreC}
                  </div>
                  <div className={styles.singleData}>
                    {materia.correlativas.length > 0
                      ? materia.correlativas
                          .map((corr) => (
                            <span key={corr.idMateria}>
                              {corr.nombreMateria}
                            </span>
                          ))
                          .reduce((prev, curr) => [prev, ", ", curr])
                      : "Ninguna"}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Carrera;
