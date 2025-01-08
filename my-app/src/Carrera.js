import styles from "./dist/carrera.module.scss";
import React, { forwardRef } from "react";
import { useParams } from "react-router-dom";
import { Container, Slide } from "@mui/material";
import axios from "axios";
import { Popover } from "@mui/material";
import Button from "@mui/material/Button";
import { Icon } from "@iconify/react";
import Checkbox from "@mui/material/Checkbox";
// Dialog imports
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
// Select imports
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
// Select Correlativas import
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
// Date picker
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

//import/export
import ImportExport, { exportJSON, importJSON } from "./ImportExport";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Carrera = () => {
  const { slug } = useParams();

  // Use States
  const [thisCarrera, setThisCarrera] = React.useState([]);
  const [materias, setMaterias] = React.useState([]);
  const [materiasAprobadas, setMateriasAprobadas] = React.useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = React.useState({});

  // Requests functions
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

  /******************************************************************************************/
  /***                         Documentar esto                                            ***/
  /******************************************************************************************/
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
  /****************************************************************************************/
  /****************************************************************************************/

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
        const nombresNoAprobadas = correlativasNoAprobadas.map(
          (correlativa) => correlativa.nombreMateria
        );
        return {
          ...materia,
          estado: `falta aprobar: ${nombresNoAprobadas.join(", ")}`,
        };
      }
    });
  }

  // Edit logic
  const handleClickOpenEdit = (e, materia) => {
    console.log("Abrir editar ", materia);
  };

  // Delete Logic
  const handleClickDelete = (e, materia) => {
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

  // CREATE Dialog Logic
  const [openCreate, setOpenCreate] = React.useState(false);
  const handleClickOpenCreate = (event, materia) => {
    setMateriaSeleccionada({});
    setOpenCreate(true);
  };

  const succesCreate = () => {
    const newMateria = {
      ...materiaSeleccionada,
      carrera: { id_C: thisCarrera.id_C },
      // Se recorre el arreglo de correlativas y se descartan todos los campos que no son el id de la materia.
      correlativas: materiaSeleccionada.correlativas.map((materia) => {
        return { idMateria: materia.idMateria };
      }),
    };
    axios
      .post("http://localhost:8080/materias", newMateria)
      .then((response) => {
        console.log("resultado post:", response);
        // Se vuelven a cargar las materias desde la database para actualizar la lista
        getAllMaterias();
      })
      .catch((error) => {
        console.log("error al crear materia: ", error);
      });
    setOpenCreate(false);
  };

  const cancelCreate = () => {
    setMateriaSeleccionada({});
    setOpenCreate(false);
  };

  //watch materia seleccionada:
  React.useEffect(() => {
    console.log("materia seleccionada: ", materiaSeleccionada);
  }, [materiaSeleccionada]);

  const handleCorrelativasClick = (event) => {
    const {
      target: { value },
    } = event;
    setMateriaSeleccionada({
      ...materiaSeleccionada,
      correlativas:
        typeof value.nombreMateria === "string" ? value.split(",") : value,
    });
  };

  //json importexport
  const handleImport = (importedData) => {
    // momentaneamente, se agrega las materias importadas al listado de materias actuales
    let importedMaterias =[...materias].concat(importedData)
    setMaterias(importedMaterias);
    // save to database
  };

  return (
    <>
      <Dialog
        open={openCreate}
        onClose={cancelCreate}
        className={styles.newMateriaDialog}
        TransitionComponent={Transition} // Usa la transición personalizada
        keepMounted // Mejora el rendimiento al mantener el componente montado
        aria-describedby="dialog-descripcion"
      >
        <DialogTitle id="alert-dialog-title">
          {materiaSeleccionada.nombreMateria || "Nueva Materia"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Aquí puedes crear una nueva Materia
          </DialogContentText>
          {/* here goes inputfields */}

          <TextField
            id="materia-nombre"
            label="Nombre"
            variant="outlined"
            onChange={(e) => {
              setMateriaSeleccionada({
                ...materiaSeleccionada,
                nombreMateria: e.target.value,
              });
            }}
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Año</InputLabel>

            <Select
              label="Año"
              value={materiaSeleccionada.anio}
              variant="outlined"
              onChange={(e) => {
                setMateriaSeleccionada({
                  ...materiaSeleccionada,
                  anio: e.target.value,
                });
              }}
            >
              <MenuItem value={""} disabled>
                <em>Selecciona un valor</em>
              </MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Cuatrimestre</InputLabel>
            <Select
              value={materiaSeleccionada.cuatrimestre}
              onChange={(e) => {
                setMateriaSeleccionada({
                  ...materiaSeleccionada,
                  cuatrimestre: e.target.value,
                });
              }}
              label="Cuatrimestre"
            >
              <MenuItem value={""} disabled>
                <em>Selecciona un valor</em>
              </MenuItem>
              <MenuItem value={"1er Cuatrimestre"}>1er Cuatrimestre</MenuItem>
              <MenuItem value={"2do Cuatrimestre"}>2do Cuatrimestre</MenuItem>
              <MenuItem value={"Anual"}>Anual</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Estado</InputLabel>
            <Select
              value={materiaSeleccionada.estado}
              onChange={(e) => {
                setMateriaSeleccionada({
                  ...materiaSeleccionada,
                  estado: e.target.value,
                });
              }}
              label="Estado"
            >
              <MenuItem value={""} disabled>
                <em>Selecciona un valor</em>
              </MenuItem>
              <MenuItem value={"Pendiente"}>Pendiente</MenuItem>
              <MenuItem value={"Cursando"}>Cursando</MenuItem>
              <MenuItem value={"Regular"}>Regular</MenuItem>
              <MenuItem value={"Aprobado"}>Aprobado</MenuItem>
              <MenuItem value={"Promocionado"}>Promocionado</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha Regularizacion"
              value={dayjs(materiaSeleccionada.fechaRegularizacion)}
              onChange={(newValue) => {
                setMateriaSeleccionada({
                  ...materiaSeleccionada,
                  fechaRegularizacion: dayjs(newValue).toDate(),
                });
              }}
            />
            <DatePicker
              label="Fecha Aprobación"
              value={dayjs(materiaSeleccionada.fechaAprobacion)}
              onChange={(newValue) => {
                setMateriaSeleccionada({
                  ...materiaSeleccionada,
                  fechaAprobacion: dayjs(newValue).toDate(),
                });
              }}
            />
          </LocalizationProvider>

          <TextField
            id="materia-calificacion"
            label="Calificacion"
            variant="outlined"
            type="number"
            defaultValue=""
            value={materiaSeleccionada.calificacion}
            onChange={(e) => {
              setMateriaSeleccionada({
                ...materiaSeleccionada,
                calificacion: e.target.value,
              });
            }}
          />

          <div className={styles.checkboxTituloIntermedio}>
            <Checkbox
              checked={
                materiaSeleccionada.requeridaPorTituloIntermedio || false
              }
              onChange={(e) => {
                setMateriaSeleccionada({
                  ...materiaSeleccionada,
                  requeridaPorTituloIntermedio: e.target.checked,
                });
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
            <div>¿Requerido por titulo intermedio?</div>
          </div>

          <div className={styles.correlativas}>
            Cargar correlativas
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="correlativas-label">Correlativas</InputLabel>
              <Select
                label="Correlativas"
                multiple
                value={materiaSeleccionada.correlativas || []}
                onChange={(e) => {
                  handleCorrelativasClick(e);
                }}
                input={<OutlinedInput label="Correlativas" />}
              >
                {materias.map((materia) => (
                  <MenuItem key={materia.idMateria} value={materia}>
                    {materia.nombreMateria}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={cancelCreate}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={succesCreate} autoFocus>
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
              <div className={styles.singleHeader}>Eliminar</div>
            </div>

            {/* Filas de datos */}
            {materias.map((materia) => {
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
                    {materia.fechaAprobacion ? materia.fechaAprobacion : "N/A"}
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
                      className={styles.correlativasButton}
                    >
                      <Icon icon="mdi:eye" />
                    </Button>
                  </div>
                  <div className={styles.singleData}>
                    <Button onClick={(e) => handleClickDelete(e, materia)}>
                      <Icon icon="tabler:trash" width="24" height="24" />
                    </Button>
                  </div>
                </div>
              );
            })}
            {/* fila de nueva materia */}
            <div
              onClick={(e) => {
                handleClickOpenCreate(e, materiaSeleccionada);
              }}
              className={styles.newMateria}
            >
              <Icon icon="tabler:plus" width="24" height="24" /> Nueva Materia
            </div>
          </div>
          <ImportExport
            onImport={handleImport}
            dataToExport={{ materias: materias, carrera: thisCarrera }}
          ></ImportExport>
        </div>
      </div>
    </>
  );
};

export default Carrera;
