// ==========================================
// TEST - Cotización Emisivo (Google Sheets)
// ==========================================
import { agregarConsultaEmisivo } from './utils/googleSheets.js';

console.log('🧪 Iniciando test de Cotización Emisivo...\n');

// Datos de prueba
const datosPrueba = {
    nombre: 'Test Usuario Cotización',
    telefono: '5493875051112',
    correo: 'dmbruno61@gmail.com',
    lugar: 'Brasil - Río de Janeiro',
    cantidadPersonas: '2 adultos y 1 menor de 13 años',
    fechaViaje: 'Marzo, del 15 al 25',
    cantidadDias: '10 días'
};

try {
    console.log('📝 Datos a insertar (ORDEN ACTUALIZADO):');
    console.log('   1️⃣ Lugar:', datosPrueba.lugar);
    console.log('   2️⃣ Cantidad de personas:', datosPrueba.cantidadPersonas);
    console.log('   3️⃣ Fecha de viaje:', datosPrueba.fechaViaje);
    console.log('   4️⃣ Cantidad de días:', datosPrueba.cantidadDias);
    console.log('   • Nombre:', datosPrueba.nombre);
    console.log('   • Teléfono:', datosPrueba.telefono);
    console.log('   • Correo:', datosPrueba.correo);
    console.log('');

    const result = await agregarConsultaEmisivo(datosPrueba);
    
    console.log('✅ ¡TEST EXITOSO!');
    console.log('📊 Respuesta de Google Sheets:');
    console.log('   • Rango actualizado:', result.updates.updatedRange);
    console.log('   • Filas agregadas:', result.updates.updatedRows);
    console.log('   • Columnas actualizadas:', result.updates.updatedColumns);
    console.log('   • Celdas actualizadas:', result.updates.updatedCells);
    console.log('');
    console.log('🔗 Verificá en: https://docs.google.com/spreadsheets/d/1A5ge31_VCrP74eeUc-IUNQy3sZPcbaCR5dKU3xQL-zk/edit');
    console.log('📋 Pestaña: Emisivo');
    console.log('');
    console.log('✨ El flujo de cotización está listo para usar!');

} catch (error) {
    console.error('❌ TEST FALLIDO');
    console.error('Error:', error.message);
    console.error('');
    console.error('🔧 Verificá:');
    console.error('   1. Que el archivo config/google-credentials.json existe');
    console.error('   2. Que la hoja "Emisivo" existe en el spreadsheet');
    console.error('   3. Que el service account tiene permisos de Editor');
}
