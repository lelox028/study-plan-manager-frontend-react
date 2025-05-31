import styles from './dist/defaultTable.module.scss';
import React from "react";
import { Popover } from "@mui/material";
import Button from "@mui/material/Button";
import { Icon } from "@iconify/react";

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

//import CreateMateria
import CreateMateria from "./CreateMateria";


function DefaultTable({ materias, thisCarrera, onEdit, onDelete, onAdd }) {

    /******************************************************************************************/
    /*                                    Use States                                          */
    /******************************************************************************************/
    const [materiaSeleccionada, setMateriaSeleccionada] = React.useState({});
    const [editingField, setEditingField] = React.useState({
        id: null,
        field: null,
    });
    const [inputValue, setInputValue] = React.useState("");

    /******************************************************************************************/
    /*                                UseEffects Section                                      */
    /******************************************************************************************/
    //watch materia seleccionada:
    React.useEffect(() => {
        console.log("materia seleccionada: ", materiaSeleccionada);
    }, [materiaSeleccionada]);

    /******************************************************************************************/
    /*                                  Edits  Section                                        */
    /******************************************************************************************/

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

    const handleClickEdit = (e, materia, field) => {
        e.stopPropagation();
        setEditingField({ id: materia.idMateria, field });
        setInputValue(materia[field]); // Inicializa con el valor actual
    };

    const handleSaveEdit = (materia) => {
        let newMateria = materias.find((m) => {
            return m.idMateria === materia.idMateria;
        });
        newMateria = {
            ...newMateria,
            [editingField.field]: inputValue,
            estado: /^(Cursando|Regular|Aprobado|Promocionado)$/.test(materia.estado)
                ? materia.estado
                : "Pendiente",
            correlativas: (materia.correlativas || []).map((item) => {
                return { idMateria: item.idMateria };
            }),
            carrera: { id_C: newMateria.carrera.id_C },
        };

        setEditingField({ id: null, field: null });

        onEdit(newMateria);
    };

    const handleSaveEditSelect = (materia, newValue) => {

        let updatedMateria = {
            ...materia,
            [editingField.field]: newValue,
            estado: /^(Cursando|Regular|Aprobado|Promocionado)$/.test(materia.estado)
                ? materia.estado
                : "Pendiente",
            correlativas: (materia.correlativas || []).map((item) => {
                return { idMateria: item.idMateria };
            }),
            carrera: { id_C: materia.carrera.id_C },
        };

        setEditingField({ id: null, field: null }); // Sale del modo edición

        onEdit(updatedMateria);
    };

    const handleSaveCorrelativas = (materia) => {
        const updatedMaterias = materias.map((m) =>
            m.idMateria === materia.idMateria
                ? { ...m, correlativas: materia.correlativas }
                : m
        );

        //setMaterias(updatedMaterias); // Actualiza el estado
        materia = {
            ...materia,
            estado: /^(Cursando|Regular|Aprobado|Promocionado)$/.test(materia.estado)
                ? materia.estado
                : "Pendiente",
            correlativas: (materia.correlativas || []).map((item) => {
                return { idMateria: item.idMateria };
            }),
        };

        onEdit(materia);
    };

    /******************************************************************************************/
    /*                                  Deletes  Section                                      */
    /******************************************************************************************/
    const handleClickDelete = (e, materia) => {
        onDelete(materia);
    };

    /******************************************************************************************/
    /*                                 Documentar esto                                        */
    /******************************************************************************************/
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickCorrelativas = (event, materia) => {
        setMateriaSeleccionada(materia);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (e) => {
        setAnchorEl(null);
        console.log(e);

        handleSaveCorrelativas(materiaSeleccionada);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    /****************************************************************************************/
    /****************************************************************************************/

    return (
        <>
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
            </Popover>

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
                {(materias || []).map((materia, index) => {
                    return (
                        <div key={materia.idMateria} className={styles.dataRows}>
                            <div
                                className={styles.singleData}
                                onClick={(e) =>
                                    handleClickEdit(e, materia, "nombreMateria")
                                }
                            >
                                {editingField.id === materia.idMateria &&
                                    editingField.field === "nombreMateria" ? (
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onBlur={() => handleSaveEdit(materia)}
                                        autoFocus
                                    />
                                ) : (
                                    materia.nombreMateria
                                )}
                            </div>
                            <div
                                className={styles.singleData}
                                onClick={(e) => handleClickEdit(e, materia, "anio")}
                            >
                                {editingField.id === materia.idMateria &&
                                    editingField.field === "anio" ? (
                                    <input
                                        type="number"
                                        value={inputValue || ""}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onBlur={() => handleSaveEdit(materia)}
                                        autoFocus
                                    />
                                ) : (
                                    materia.anio
                                )}
                            </div>
                            <div
                                className={styles.singleData}
                                onClick={(e) => handleClickEdit(e, materia, "cuatrimestre")}
                            >
                                {editingField.id === materia.idMateria &&
                                    editingField.field === "cuatrimestre" ? (
                                    <Select
                                        value={materia.cuatrimestre || ""}
                                        onChange={(e) => {
                                            console.log(e.target);

                                            setInputValue(e.target.value); // Actualiza el inputValue
                                            handleSaveEditSelect(materia, e.target.value); // Guarda directamente
                                        }}
                                        label="Cuatrimestre"
                                        autoFocus
                                        onBlur={() =>
                                            setEditingField({ id: null, field: null })
                                        }
                                    >
                                        <MenuItem value={""} disabled>
                                            <em>Selecciona un valor</em>
                                        </MenuItem>
                                        <MenuItem value={"1er Cuatrimestre"}>
                                            1er Cuatrimestre
                                        </MenuItem>
                                        <MenuItem value={"2do Cuatrimestre"}>
                                            2do Cuatrimestre
                                        </MenuItem>
                                        <MenuItem value={"Anual"}>Anual</MenuItem>
                                    </Select>
                                ) : (
                                    materia.cuatrimestre
                                )}
                            </div>
                            <div
                                className={styles.singleData}
                                onClick={(e) => handleClickEdit(e, materia, "estado")}
                            >
                                {editingField.id === materia.idMateria &&
                                    editingField.field === "estado" ? (
                                    <Select
                                        value={materia.estado || ""}
                                        onChange={(e) => {
                                            console.log(e.target);
                                            setInputValue(e.target.value); // Actualiza el inputValue
                                            handleSaveEditSelect(materia, e.target.value); // Guarda directamente
                                        }}
                                        label="Cuatrimestre"
                                        autoFocus
                                        onBlur={() =>
                                            setEditingField({ id: null, field: null })
                                        }
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
                                ) : Array.isArray(materia.estado) ? (
                                    `Falta aprobar: ${materia?.estado?.join(",")}`
                                ) : (
                                    materia.estado
                                )}
                            </div>
                            <div
                                className={styles.singleData}
                                onClick={(e) =>
                                    handleClickEdit(e, materia, "fechaRegularizacion")
                                }
                            >
                                {editingField.id === materia.idMateria &&
                                    editingField.field === "fechaRegularizacion" ? (
                                    <>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Fecha Regularizacion"
                                                value={dayjs(materia.fechaRegularizacion)}
                                                onChange={(newValue) => {
                                                    handleSaveEditSelect(
                                                        materia,
                                                        dayjs(newValue).toDate()
                                                    );
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </>
                                ) : materia.fechaRegularizacion ? (
                                    dayjs(materia.fechaRegularizacion).toString()
                                ) : (
                                    "N/A"
                                )}
                            </div>
                            <div
                                className={styles.singleData}
                                onClick={(e) =>
                                    handleClickEdit(e, materia, "fechaAprobacion")
                                }
                            >
                                {editingField.id === materia.idMateria &&
                                    editingField.field === "fechaAprobacion" ? (
                                    <>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Fecha Aprobacion"
                                                value={dayjs(materia.fechaAprobacion)}
                                                onChange={(newValue) => {
                                                    handleSaveEditSelect(
                                                        materia,
                                                        dayjs(newValue).toDate()
                                                    );
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </>
                                ) : materia.fechaAprobacion ? (
                                    dayjs(materia.fechaAprobacion).toString()
                                ) : (
                                    "N/A"
                                )}
                            </div>
                            <div
                                className={styles.singleData}
                                onClick={(e) => handleClickEdit(e, materia, "calificacion")}
                            >
                                {editingField.id === materia.idMateria &&
                                    editingField.field === "calificacion" ? (
                                    <input
                                        type="number"
                                        value={inputValue || ""}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onBlur={() => handleSaveEdit(materia)}
                                        autoFocus
                                    />
                                ) : materia.calificacion !== null ? (
                                    materia.calificacion
                                ) : (
                                    "N/A"
                                )}
                            </div>
                            <div
                                className={styles.singleData}
                                onClick={(e) => handleClickCorrelativas(e, materia)}
                            >
                                {materia?.correlativas?.length > 0
                                    ? materia.correlativas
                                        .map((corr) => (
                                            <span key={corr.idMateria}>
                                                {corr.nombreMateria}
                                            </span>
                                        ))
                                        .reduce((prev, curr) => [prev, ", ", curr])
                                    : "Ninguna"}
                            </div>
                            <div
                                className={styles.singleData}
                                onClick={(e) => handleClickEdit(e, materia)}
                            >
                                <Button onClick={(e) => handleClickDelete(e, materia)}>
                                    <Icon icon="tabler:trash" width="24" height="24" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
                <CreateMateria
                    materias={materias}
                    thisCarrera={thisCarrera}
                    onAdd={onAdd}
                />
            </div>
        </>
    )
}

export default DefaultTable;