import React from "react";
import styles from "./dist/importExport.module.scss";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Carrera from "./Carrera";

const ImportExport = ({ onImport, dataToExport }) => {
  // LOGIC

  const [importCarrera, setImportCarrera] = React.useState(false);
  const [currentImportObj, setCurrentImportObj] = React.useState({
    materias: [],
    carrera: {},
  });
  // import popup logic
  const [openImport, setOpenImport] = React.useState(false);

  const handleClickOpenImport = (event) => {
    setOpenImport(true);
  };

  const cancelImport = () => {
    setOpenImport(false);
  };

  // JSON Export Logic:
  const exportJSON = () => {
    // simplifica el arreglo de materias para obtener un json mucho mas pequenio (sin enie)
    const cleanMaterias = dataToExport.materias.map((materia) => {
      console.log("materia: ", materia);
      const { idMateria, ...cleanMateria } = materia;
      return {
        ...cleanMateria,
        carrera: { id_C: null },
        correlativas: (cleanMateria.correlativas || []).map((materia) => {
          return { nombreMateria: materia.nombreMateria };
        }),
      };
    });
    //exporta el objeto dataToExport, el cual contiene una arreglo de materias y un objeto carrrera que contiene carrera, facultad y universidad.
    const dataStr = JSON.stringify({...dataToExport, materias:cleanMaterias}, null, 2);
    // crea el archivo de tipo application/json
    const blob = new Blob([dataStr], { type: "application/json" });
    // crea una url para el archivo y luego un link para descargarlo
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "planManagerBackup.json";
    // lo descarga automaticamente
    a.click();
    // libera la url
    URL.revokeObjectURL(url);
  };

  // JSON Import Logic:
  const doImport = () => {
    console.log("a",importCarrera,importCarrera? currentImportObj: {...currentImportObj, carrera:undefined})
    importCarrera? onImport(currentImportObj): onImport({...currentImportObj, carrera:undefined});
      

    //onImport(data); // Llama al callback para manejar los datos importados
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        console.log("importedData: ", importedData);
        setCurrentImportObj(importedData);
      } catch (error) {
        setOpenImport(false);
        alert(
          "Error al importar el archivo. Asegúrate de que sea un JSON válido."
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Dialog
        open={openImport}
        onClose={cancelImport}
        className={styles.importDialog}
        //TransitionComponent={Transition} // Usa la transición personalizada
        keepMounted // Mejora el rendimiento al mantener el componente montado
        aria-describedby="dialog-descripcion"
      >
        <DialogTitle id="alert-dialog-title">Importar Backup</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Aquí puedes importar un Backup
            <input
              accept="application/json"
              id="contained-button-file"
              type="file"
              onChange={(event) => {
                handleImport(event);
              }}
            />
          </DialogContentText>
          {
            //here goes input fields
          }
          Desea restaurar la carrera, universidad y facultad? en caso negativo,
          se agregaran las materias a la carrera actual.
          <Checkbox
            checked={importCarrera}
            onChange={(event) => {
              setImportCarrera(event.target.checked);
            }}
          ></Checkbox>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={cancelImport}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              doImport();
            }}
            autoFocus
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <div className={styles.ExportButton}>
        <Button variant="contained" color="success" onClick={exportJSON}>
          Exportar JSON
        </Button>
      </div>
      <div className={styles.ImportButton}>
        <Button
          variant="contained"
          component="span"
          onClick={() => {
            setOpenImport(true);
          }}
        >
          Importar JSON
        </Button>
      </div>
    </>
  );
};

export default ImportExport;
