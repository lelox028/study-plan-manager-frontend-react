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


function DefaultTable({ materias, setMaterias, thisCarrera, onEdit, onDelete, onAdd, materiaSeleccionada, setMateriaSeleccionada }) {

    /******************************************************************************************/
    /*                                    Use States                                          */
    /******************************************************************************************/
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
        // Actualiza el campo específico de la materia con el nuevo valor
        let tempMateria = {
            ...materia,
            [editingField.field]: newValue
        }
        // Controles y validaciones necesarias.
        let updatedMateria = {
            ...tempMateria,
            estado: /^(Cursando|Regular|Aprobado|Promocionado)$/.test(tempMateria.estado)
                ? tempMateria.estado
                : "Pendiente",
            correlativas: (tempMateria.correlativas || []).map((item) => {
                return { idMateria: item.idMateria };
            }),
            carrera: { id_C: tempMateria.carrera.id_C },
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

        setMaterias(updatedMaterias); // Actualiza el estado
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
        // Sincroniza correlativas con las referencias de materias
        const correlativasActuales = (materia.correlativas || []).map(corr =>
            materias.find(m => m.idMateria === corr.idMateria)
        ).filter(Boolean);

        setMateriaSeleccionada({
            ...materia,
            correlativas: correlativasActuales
        });
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
                            (materia.idMateria !== materiaSeleccionada.idMateria && (materiaSeleccionada.anio > materia.anio || (materiaSeleccionada.anio === materia.anio && (materiaSeleccionada.cuatrimestre === '2do Cuatrimestre' && materia.cuatrimestre === '1er Cuatrimestre')))) && (
                                <MenuItem key={materia.idMateria} value={materia}>
                                    {materia.nombreMateria}
                                </MenuItem>
                            )
                        ))}
                    </Select>
                </FormControl>
            </Popover>

            <table className={styles.Table}>
                {/* Encabezados */}
                <thead>
                    <tr className={styles.tableHeaders}>
                        {/* <div  */}
                        <th className={styles.singleHeader}> Materia</th>
                        <th className={styles.singleHeader}>Año</th>
                        <th className={styles.singleHeader}>Cuatrimestre</th>
                        <th className={styles.singleHeader}>Estado</th>
                        <th className={styles.singleHeader}>Fecha de Regularización</th>
                        <th className={styles.singleHeader}>Fecha de Aprobación</th>
                        <th className={styles.singleHeader}>Calificación</th>
                        <th className={styles.singleHeader}>Correlativas</th>
                        <th className={styles.singleHeader}>Eliminar</th>
                        {/* </div> */}
                    </tr>
                </thead>

                {/* Filas de datos */}
                <tbody>
                    {(materias || []).map((materia, index) => {
                        return (
                            <tr key={materia.idMateria} className={styles.dataRows}>
                                <td
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
                                </td>
                                <td
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
                                </td>
                                <td
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
                                </td>
                                <td
                                    className={styles.singleData}
                                    onClick={(e) => handleClickEdit(e, materia, "estado")}
                                >
                                    {editingField.id === materia.idMateria &&
                                        editingField.field === "estado" ? (
                                        <Select
                                            value={materia.estado || ""}
                                            onChange={(e) => {
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
                                </td>
                                <td
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
                                        dayjs(materia.fechaRegularizacion).format("DD/MM/YYYY")
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                                <td
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
                                        dayjs(materia.fechaAprobacion).format("DD/MM/YYYY")
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                                <td
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
                                </td>
                                <td
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
                                </td>
                                <td
                                    className={styles.singleData}
                                    onClick={(e) => handleClickEdit(e, materia)}
                                >
                                    <Button onClick={(e) => handleClickDelete(e, materia)}>
                                        <Icon icon="tabler:trash" width="24" height="24" />
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <CreateMateria
                materias={materias}
                thisCarrera={thisCarrera}
                onAdd={onAdd}
            />
        </>
    )
}

export default DefaultTable;