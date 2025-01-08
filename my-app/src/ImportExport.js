import React from "react";
import styles from "./dist/importExport.module.scss";
import Button from "@mui/material/Button";

const ImportExport = ({ onImport, dataToExport }) => {
  //logic

  // JSON Export Logic:
  const exportJSON = () => {
    // simplifica el arreglo de materias para obtener un json mucho mas pequenio (sin enie)
    const cleanMaterias = dataToExport.materias.map((materia) => {
      console.log("materia: ", materia);
      const { idMateria, ...cleanMateria } = materia;
      return {
        ...cleanMateria,
        carrera: { id_C: dataToExport.carrera.id_C },
        correlativas: (cleanMateria.correlativas || []).map((materia) => {
          return { idMateria: materia.idMateria };
        }),
      };
    });
    const dataStr = JSON.stringify(cleanMaterias, null, 2);
    // crea el archivo de tipo application/json
    const blob = new Blob([dataStr], { type: "application/json" });
    // crea una url para el archivo y luego un link para descargarlo
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "materias.json";
    // lo descarga automaticamente
    a.click();
    // libera la url
    URL.revokeObjectURL(url);
  };

  // JSON Import Logic:
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        onImport(importedData); // Llama al callback para manejar los datos importados
        //setIsPopupVisible(false); // Cierra el popup después de importar
      } catch (error) {
        alert("Error al importar el archivo. Asegúrate de que sea un JSON válido.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className={styles.ExportButton}>
        <Button variant="contained" color="success" onClick={exportJSON}>
          Exportar JSON
        </Button>
      </div>
      <div className={styles.ImportButton}>
        <input
          accept="application/json"
          id="contained-button-file"
          type="file"
          onChange={handleImport}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span">
            Importar JSON
          </Button>
        </label>
      </div>
    </>
  );
};

export default ImportExport;
