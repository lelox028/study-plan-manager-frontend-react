// import styles from './dist/createMateria.module.scss';

import React from "react";

// Dialog imports
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

// Date picker
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

function createMateria({ materias, thisCarrera, onAdd }) {

    /******************************************************************************************/
    /*                                    Use States                                          */
    /******************************************************************************************/
    const [materiaSeleccionada, setMateriaSeleccionada] = React.useState({});

    /******************************************************************************************/
    /*                                  Creates  Section                                      */
    /******************************************************************************************/

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
        onAdd(newMateria);
        setOpenCreate(false);
    };

    const cancelCreate = () => {
        setMateriaSeleccionada({});
        setOpenCreate(false);
    };

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
                                {(materias || []).map((materia) => (
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
            {/* fila de nueva materia */}
            <div
                onClick={(e) => {
                    handleClickOpenCreate(e, materiaSeleccionada);
                }}
                className={styles.newMateria}
            >
                <Icon icon="tabler:plus" width="24" height="24" /> Nueva Materia
            </div>
        </>
    )
}

export default createMateria;