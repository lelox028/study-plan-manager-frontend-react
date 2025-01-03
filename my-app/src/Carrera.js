import styles from "./dist/carrera.module.scss";
import React from "react";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import axios from "axios";
import { Popover } from "@mui/material";
import Button from "@mui/material/Button";
import { Icon } from "@iconify/react";
// Dialog imports
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';



function Carrera() {
  const { slug } = useParams();
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

  const handleClick = (event, materia) => {
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
    const idsMateriasAprobadas = new Set(
      materiasAprobadas.map((materia) => materia.idMateria)
    );

    // Actualizar el estado de las materias
    return materias.map((materia) => {
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
        const nombresNoAprobadas = correlativasNoAprobadas.map(correlativa => correlativa.nombreMateria);
        return {
          ...materia,
          estado: `falta aprobar: ${nombresNoAprobadas.join(", ")}`
        };
      }
    });
  }

  // Edit logic
  const handleClickOpenEdit = (e, materia) => {
    console.log("Abrir editar ", materia)
  }

  // CREATE Dialog Logic
  const [openCreate, setOpenCreate] = React.useState(false);
  const handleClickOpenCreate = (event, materia) => {
    setMateriaSeleccionada({});
    setOpenCreate(true);
  };

  const succesCreate = () => {
    setOpenCreate(false);
    //axios.post materia
  };

  const cancelCreate = () => {
    setMateriaSeleccionada({})
    setOpenCreate(false);
  };

  //watch materia seleccionada:
  React.useEffect(() => {
    console.log("materia seleccionada: ", materiaSeleccionada)
  }, [materiaSeleccionada])

  return (
    <>
      <Dialog
        open={openCreate}
        onClose={cancelCreate}
      >
        { }
        <DialogTitle id="alert-dialog-title">
          { materiaSeleccionada.nombreMateria||"New Materia"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Here you can create a new materia... but you already knew that, lol.
          </DialogContentText>
          {/* here goes inputfields */}
          <TextField
            id="materia-nombre"
            label="Nombre"
            variant="outlined"
            defaultValue="New Materia"
            onChange={(e) => { setMateriaSeleccionada({ ...materiaSeleccionada, nombreMateria: e.target.value }) }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelCreate}>
            Cancelar
          </Button>
          <Button onClick={succesCreate} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
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
                <span key={corr.idMateria}>{corr.nombreMateria}</span>
              ))
              .reduce((prev, curr) => [prev, ", ", curr])
          : "Ninguna"}
      </Popover>
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
                <div className={styles.singleHeader}>
                  Fecha de Regularización
                </div>
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
                    <div className={styles.singleData}>
                      {materia.nombreMateria}
                    </div>
                    <div className={styles.singleData}>{materia.anio}</div>
                    <div className={styles.singleData}>
                      {materia.cuatrimestre}
                    </div>
                    <div className={styles.singleData}>
                      {Array.isArray(materia.estado)
                        ? `Falta aprobar: ${materia?.estado?.join(",")}`
                        : materia.estado}
                    </div>
                    <div className={styles.singleData}>
                      {materia.fechaRegularizacion
                        ? materia.fechaRegularizacion
                        : "N/A"}
                    </div>
                    <div className={styles.singleData}>
                      {materia.fechaAprobacion
                        ? materia.fechaAprobacion
                        : "N/A"}
                    </div>
                    <div className={styles.singleData}>
                      {materia.calificacion !== null
                        ? materia.calificacion
                        : "N/A"}
                    </div>
                    <div className={styles.singleData}>
                      <Button
                        aria-describedby={id}
                        variant="contained"
                        onClick={(e) => handleClick(e, materia)}
                      >
                        <Icon icon="mdi:eye" />
                      </Button>
                    </div>
                    <div>
                    <Button
                        onClick={(e) => handleClickOpenEdit(e, materia)}
                      >
                        <Icon icon="mdi:pencil" width="24" height="24" />
                      </Button>
                    </div>
                  </div>
                )
              })}
              {/* fila de nueva materia */}
              <div 
                onClick={(e)=>{
                  handleClickOpenCreate(e,materiaSeleccionada)
                }}  
              > 
              <Icon icon="tabler:plus" width="24" height="24" /> Nueva Materia
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Carrera;
