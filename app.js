//primer parte convertir la información del archivo results.cvs a json para poder trabajarlo como objetos
import fs from 'fs';
import csvtojson from 'csvtojson';




const csvFilePath = './results.csv';
const jsonFilePath = './data.json';

let data = [];

// Función para convertir CSV a JSON
function convertCsvToJson() {
    csvtojson()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            data = jsonObj;
            writeDataToJsonFile();
            console.log('Archivo CSV convertido y guardado en JSON exitosamente.');
        })
        .catch((err) => {
            console.error('Error al convertir CSV a JSON:', err);
        });
}

// Función para escribir datos en el archivo JSON
function writeDataToJsonFile() {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
}

// Función para verificar cambios en el archivo CSV
function watchCsvFile() {
    fs.watchFile(csvFilePath, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
            console.log('Archivo CSV modificado. Actualizando datos JSON...');
            convertCsvToJson();
        }
    });
}

// Iniciar la conversión inicial y el seguimiento de cambios
convertCsvToJson();
watchCsvFile();