import styles from "./dist/carrera.module.scss";
import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";
import TopBar from './TopBar';

import { useNavigate } from "react-router-dom";

// import DefaultTable
import DefaultTable from "./DefaultTable";


//import/export
import ImportExport, { exportJSON, importJSON } from "./ImportExport";
import { Container } from "@mui/material";




const Carrera = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  /******************************************************************************************/
  /*                                    Use States                                          */
  /******************************************************************************************/
  const [thisCarrera, setThisCarrera] = React.useState([]);
  const [materias, setMaterias] = React.useState([]);
  const [materiasPorAnio, setMateriasPorAnio] = React.useState({});
  const [materiasAprobadas, setMateriasAprobadas] = React.useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = React.useState({});
  const [activeTab, setActiveTab] = React.useState(0);

  /******************************************************************************************/
  /*                                    Aux Functions                                       */
  /******************************************************************************************/
  const segregateMateriasByYear = (materias) => {
    const materiasPorAnio = [];
    materias.forEach((materia) => {
      const anio = materia.anio;
      if (!materiasPorAnio[anio]) {
        materiasPorAnio[anio] = [];
      }
      materiasPorAnio[anio].push(materia);
    });
    return materiasPorAnio;
  };

  /******************************************************************************************/
  /*                                  Requests Section                                      */
  /******************************************************************************************/
  const getCarreraFromDatabase = () => {
    axios
      .get("http://localhost:8080/carreras/" + slug)
      .then((response) => {
        console.log("Datos carrera recibidos: ", response.data);
        setThisCarrera(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener la carrera:", error);
      });
  };

  const getMateriasAprobadasFromDatabase = () => {
    axios
      .get("http://localhost:8080/materias/carreras/" + slug + "/aprobadas")
      .then((response) => {
        console.log("Datos materias aprobadas recibidos: ", response.data);
        setMateriasAprobadas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las materias aprobadas:", error);
      });
  };

  //this function gets both materias and materias aprobadas.
  const getAllMaterias = () => {
    axios
      .get("http://localhost:8080/materias/carreras/" + slug + "/materias")
      .then((response) => {
        console.log("Datos materias recibidos: ", response.data);
        setMaterias(response.data);

        //get all approved materias
        getMateriasAprobadasFromDatabase();
      })
      .catch((error) => {
        console.error("Error al obtener las materias:", error);
      });
  };

  const deleteMateriaById = (materia) => {
    axios
      .delete("http://localhost:8080/materias/" + materia.idMateria)
      .then((response) => {
        console.log("deleted: ", response);
        // Se vuelven a cargar las materias desde la database para actualizar la lista
        getAllMaterias();
      })
      .catch((error) => {
        console.log("error al borrar materia: ", error);
      });
  };

  const createMateria = (materia) => {
    axios
      .post("http://localhost:8080/materias", materia)
      .then((response) => {
        console.log("resultado post:", response);
        // Se vuelven a cargar las materias desde la database para actualizar la lista
        getAllMaterias();
      })
      .catch((error) => {
        console.log("error al crear materia: ", error);
      });
  };

  const updateMateria = (materia) => {
    axios
      .put(`http://localhost:8080/materias/${materia.idMateria}`, materia)
      .then((response) => {
        console.log("updated: ", response);
        getAllMaterias();
      })
      .catch((error) => {
        console.log("error al actualizar materia: ", error);
      });
  };

  /******************************************************************************************/
  /*                                UseEffects Section                                      */
  /******************************************************************************************/
  React.useEffect(() => {
    // get all necesary data from database
    getCarreraFromDatabase();
    // get all materias for this carrera
    getAllMaterias();
  }, []);

  // cuando el listado de materias aprobadas se actualice, se actualiza el estado de las correlativas para todas las materias.
  React.useEffect(() => {
    setMaterias(actualizarEstadoMaterias(materias, materiasAprobadas));
  }, [materiasAprobadas]);

  React.useEffect(() => {
    // segregate materias by year
    setMateriasPorAnio(segregateMateriasByYear(materias));
    console.log("Materias por año: ", materiasPorAnio);
  }, [materias]);


  /******************************************************************************************/
  /*                                  Correlativas Section                                  */
  /******************************************************************************************/
  function actualizarEstadoMaterias(materias, materiasAprobadas) {
    // Obtener los IDs de las materias aprobadas
    const idsMateriasAprobadas = new Set(
      materiasAprobadas.map((materia) => materia.idMateria)
    );

    // Actualizar el estado de las materias
    return (materias || []).map((materia) => {
      // Si la materia ya está aprobada o promocionada, no modificar su estado
      if (materia.estado !== "Pendiente") {
        return materia;
      }

      // Verificar si todas las correlativas están aprobadas
      const correlativasNoAprobadas = materia.correlativas.filter(
        (correlativa) => !idsMateriasAprobadas.has(correlativa.idMateria)
      );

      if (correlativasNoAprobadas.length === 0) {
        // Todas las correlativas están aprobadas
        return { ...materia, estado: "Cursable" };
      } else {
        // Hay correlativas no aprobadas
        const nombresNoAprobadas = correlativasNoAprobadas.map(
          (correlativa) => correlativa.nombreMateria
        );
        return {
          ...materia,
          estado: `Falta aprobar: ${nombresNoAprobadas.join(", ")}`,
        };
      }
    });
  }



  /******************************************************************************************/
  /*                                  Import/Export  Section                                */
  /******************************************************************************************/

  // JSON import Logic
  const handleImport = (importedData) => {
    console.log("importedData: ", importedData);
    if (importedData.carrera) {
      axios
        .post("http://localhost:8080/carreras/import", importedData)
        .then((response) => {
          //esto deberia ir dentro de un popup que te avise que se creo la carrera y si queres verla inmediatamente
          navigate("/carrera/" + response.data.carrera.id_C, {
            replace: false,
          });
        });
    } else {
      // se reemplaza la carrera de cada materia por la actual
      importedData.materias = importedData.materias.map((materia) => {
        return {
          ...materia,
          carrera: { id_C: thisCarrera.id_C },
        };
      });
      axios
        .post("http://localhost:8080/materias/batch", importedData.materias)
        .then((response) => {
          console.log("materias importadas: ", response);
          getAllMaterias();
        });
    }
    /**************************************************************************************/
    /* momentaneamente, se agrega las materias importadas al listado de materias actuales */
    /**************************************************************************************/
    let importedMaterias = [...materias].concat(importedData.materias);
    setMaterias(importedMaterias);
    /**************************************************************************************/

    // save to database
  };

  return (
    <>
      <div className={styles.Body}>
        <TopBar />
        <div className={styles.Main}>
          <Container maxWidth="xl">
            <div className={styles.MainHeader}>
              <div className={styles.Title}>
                <h2>{thisCarrera.nombreC}</h2><Icon icon="tabler:share-2" width="24" height="24" />
              </div>
              <div className={styles.tabViews}>
                <div
                  className={`${styles.tabView} ${activeTab === 0 ? styles.active : ""}`}
                  onClick={() => setActiveTab(0)}
                >
                  Default View
                </div>
                <div
                  className={`${styles.tabView} ${activeTab === 1 ? styles.active : ""}`}
                  onClick={() => setActiveTab(1)}
                >
                  Per-Year View
                </div>
                <div
                  className={`${styles.tabView} ${activeTab === 2 ? styles.active : ""}`}
                  onClick={() => setActiveTab(2)}
                >
                  Cursables View
                </div>
              </div>
            </div>
            {activeTab === 0 && (
              <DefaultTable
                onDelete={deleteMateriaById}
                onEdit={updateMateria}
                onAdd={createMateria}
                materias={materias}
                setMaterias={setMaterias}
                thisCarrera={thisCarrera}
                materiaSeleccionada={materiaSeleccionada}
                setMateriaSeleccionada={setMateriaSeleccionada}
              ></DefaultTable>
            )
            }
            {activeTab === 1 && (
              materiasPorAnio.map((currentMaterias, anio) => (
                <div key={anio} className={styles.yearTable}>
                  <div className={styles.yearTitle}>
                    <h3>Año {anio}</h3>
                  </div>
                  <DefaultTable
                    onDelete={deleteMateriaById}
                    onEdit={updateMateria}
                    onAdd={createMateria}
                    materias={currentMaterias}
                    setMaterias={setMaterias}
                    thisCarrera={thisCarrera}
                    materiaSeleccionada={materiaSeleccionada}
                    setMateriaSeleccionada={setMateriaSeleccionada}
                  ></DefaultTable>
                </div>
              ))
            )}
            {activeTab === 2 && (
              <div>
                Cursables
              </div>
            )}

            <ImportExport
              onImport={handleImport}
              dataToExport={{ materias: materias, carrera: thisCarrera }}
            ></ImportExport>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Carrera;
