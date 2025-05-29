import styles from './dist/defaultTable.module.scss';

function DefaultTable(){
    // return(<div className={styles.Table}>
    //         {/* Encabezados */}
    //         <div className={styles.tableHeaders}>
    //           <div className={styles.singleHeader}> Materia</div>
    //           <div className={styles.singleHeader}>Año</div>
    //           <div className={styles.singleHeader}>Cuatrimestre</div>
    //           <div className={styles.singleHeader}>Estado</div>
    //           <div className={styles.singleHeader}>Fecha de Regularización</div>
    //           <div className={styles.singleHeader}>Fecha de Aprobación</div>
    //           <div className={styles.singleHeader}>Calificación</div>
    //           <div className={styles.singleHeader}>Correlativas</div>
    //           <div className={styles.singleHeader}>Eliminar</div>
    //         </div>

    //         {/* Filas de datos */}
    //         {(materias || []).map((materia, index) => {
    //           return (
    //             <div key={materia.idMateria} className={styles.dataRows}>
    //               <div
    //                 className={styles.singleData}
    //                 onClick={(e) =>
    //                   handleClickEdit(e, materia, "nombreMateria")
    //                 }
    //               >
    //                 {editingField.id === materia.idMateria &&
    //                   editingField.field === "nombreMateria" ? (
    //                   <input
    //                     type="text"
    //                     value={inputValue}
    //                     onChange={(e) => setInputValue(e.target.value)}
    //                     onBlur={() => handleSaveEdit(materia)}
    //                     autoFocus
    //                   />
    //                 ) : (
    //                   materia.nombreMateria
    //                 )}
    //               </div>
    //               <div
    //                 className={styles.singleData}
    //                 onClick={(e) => handleClickEdit(e, materia, "anio")}
    //               >
    //                 {editingField.id === materia.idMateria &&
    //                   editingField.field === "anio" ? (
    //                   <input
    //                     type="number"
    //                     value={inputValue || ""}
    //                     onChange={(e) => setInputValue(e.target.value)}
    //                     onBlur={() => handleSaveEdit(materia)}
    //                     autoFocus
    //                   />
    //                 ) : (
    //                   materia.anio
    //                 )}
    //               </div>
    //               <div
    //                 className={styles.singleData}
    //                 onClick={(e) => handleClickEdit(e, materia, "cuatrimestre")}
    //               >
    //                 {editingField.id === materia.idMateria &&
    //                   editingField.field === "cuatrimestre" ? (
    //                   <Select
    //                     value={materia.cuatrimestre || ""}
    //                     onChange={(e) => {
    //                       console.log(e.target);

    //                       setInputValue(e.target.value); // Actualiza el inputValue
    //                       handleSaveEditSelect(materia, e.target.value); // Guarda directamente
    //                     }}
    //                     label="Cuatrimestre"
    //                     autoFocus
    //                     onBlur={() =>
    //                       setEditingField({ id: null, field: null })
    //                     }
    //                   >
    //                     <MenuItem value={""} disabled>
    //                       <em>Selecciona un valor</em>
    //                     </MenuItem>
    //                     <MenuItem value={"1er Cuatrimestre"}>
    //                       1er Cuatrimestre
    //                     </MenuItem>
    //                     <MenuItem value={"2do Cuatrimestre"}>
    //                       2do Cuatrimestre
    //                     </MenuItem>
    //                     <MenuItem value={"Anual"}>Anual</MenuItem>
    //                   </Select>
    //                 ) : (
    //                   materia.cuatrimestre
    //                 )}
    //               </div>
    //               <div
    //                 className={styles.singleData}
    //                 onClick={(e) => handleClickEdit(e, materia, "estado")}
    //               >
    //                 {editingField.id === materia.idMateria &&
    //                   editingField.field === "estado" ? (
    //                   <Select
    //                     value={materia.estado || ""}
    //                     onChange={(e) => {
    //                       console.log(e.target);
    //                       setInputValue(e.target.value); // Actualiza el inputValue
    //                       handleSaveEditSelect(materia, e.target.value); // Guarda directamente
    //                     }}
    //                     label="Cuatrimestre"
    //                     autoFocus
    //                     onBlur={() =>
    //                       setEditingField({ id: null, field: null })
    //                     }
    //                   >
    //                     <MenuItem value={""} disabled>
    //                       <em>Selecciona un valor</em>
    //                     </MenuItem>
    //                     <MenuItem value={"Pendiente"}>Pendiente</MenuItem>
    //                     <MenuItem value={"Cursando"}>Cursando</MenuItem>
    //                     <MenuItem value={"Regular"}>Regular</MenuItem>
    //                     <MenuItem value={"Aprobado"}>Aprobado</MenuItem>
    //                     <MenuItem value={"Promocionado"}>Promocionado</MenuItem>
    //                   </Select>
    //                 ) : Array.isArray(materia.estado) ? (
    //                   `Falta aprobar: ${materia?.estado?.join(",")}`
    //                 ) : (
    //                   materia.estado
    //                 )}
    //               </div>
    //               <div
    //                 className={styles.singleData}
    //                 onClick={(e) =>
    //                   handleClickEdit(e, materia, "fechaRegularizacion")
    //                 }
    //               >
    //                 {editingField.id === materia.idMateria &&
    //                   editingField.field === "fechaRegularizacion" ? (
    //                   <>
    //                     <LocalizationProvider dateAdapter={AdapterDayjs}>
    //                       <DatePicker
    //                         label="Fecha Regularizacion"
    //                         value={dayjs(materia.fechaRegularizacion)}
    //                         onChange={(newValue) => {
    //                           handleSaveEditSelect(
    //                             materia,
    //                             dayjs(newValue).toDate()
    //                           );
    //                         }}
    //                       />
    //                     </LocalizationProvider>
    //                   </>
    //                 ) : materia.fechaRegularizacion ? (
    //                   dayjs(materia.fechaRegularizacion).toString()
    //                 ) : (
    //                   "N/A"
    //                 )}
    //               </div>
    //               <div
    //                 className={styles.singleData}
    //                 onClick={(e) =>
    //                   handleClickEdit(e, materia, "fechaAprobacion")
    //                 }
    //               >
    //                 {editingField.id === materia.idMateria &&
    //                   editingField.field === "fechaAprobacion" ? (
    //                   <>
    //                     <LocalizationProvider dateAdapter={AdapterDayjs}>
    //                       <DatePicker
    //                         label="Fecha Aprobacion"
    //                         value={dayjs(materia.fechaAprobacion)}
    //                         onChange={(newValue) => {
    //                           handleSaveEditSelect(
    //                             materia,
    //                             dayjs(newValue).toDate()
    //                           );
    //                         }}
    //                       />
    //                     </LocalizationProvider>
    //                   </>
    //                 ) : materia.fechaAprobacion ? (
    //                   dayjs(materia.fechaAprobacion).toString()
    //                 ) : (
    //                   "N/A"
    //                 )}
    //               </div>
    //               <div
    //                 className={styles.singleData}
    //                 onClick={(e) => handleClickEdit(e, materia, "calificacion")}
    //               >
    //                 {editingField.id === materia.idMateria &&
    //                   editingField.field === "calificacion" ? (
    //                   <input
    //                     type="number"
    //                     value={inputValue || ""}
    //                     onChange={(e) => setInputValue(e.target.value)}
    //                     onBlur={() => handleSaveEdit(materia)}
    //                     autoFocus
    //                   />
    //                 ) : materia.calificacion !== null ? (
    //                   materia.calificacion
    //                 ) : (
    //                   "N/A"
    //                 )}
    //               </div>
    //               <div
    //                 className={styles.singleData}
    //                 onClick={(e) => handleClickCorrelativas(e, materia)}
    //               >
    //                 {materia?.correlativas?.length > 0
    //                   ? materia.correlativas
    //                     .map((corr) => (
    //                       <span key={corr.idMateria}>
    //                         {corr.nombreMateria}
    //                       </span>
    //                     ))
    //                     .reduce((prev, curr) => [prev, ", ", curr])
    //                   : "Ninguna"}
    //               </div>
    //               <div
    //                 className={styles.singleData}
    //                 onClick={(e) => handleClickEdit(e, materia)}
    //               >
    //                 <Button onClick={(e) => handleClickDelete(e, materia)}>
    //                   <Icon icon="tabler:trash" width="24" height="24" />
    //                 </Button>
    //               </div>
    //             </div>
    //           );
    //         })}
    //         {/* fila de nueva materia */}
    //         <div
    //           onClick={(e) => {
    //             handleClickOpenCreate(e, materiaSeleccionada);
    //           }}
    //           className={styles.newMateria}
    //         >
    //           <Icon icon="tabler:plus" width="24" height="24" /> Nueva Materia
    //         </div>
    //       </div>
    //       )
    return <></>
}

export default DefaultTable;