// ==========================================
// TEST - Paquetes (Google Sheets)
// ==========================================
import { agregarConsultaPaquete } from './utils/googleSheets.js';

console.log('🧪 Iniciando test de Paquetes...\n');

// Datos de prueba
const datosPrueba = {
    nombre: 'Test Usuario Paquetes',
    telefono: '5493875051112',
    correo: 'dmbruno61@gmail.com',
    paquete: 'Europa Clásica 2026'
};

try {
    console.log('📝 Datos a insertar:');
    console.log('   • Nombre:', datosPrueba.nombre);
    console.log('   • Teléfono:', datosPrueba.telefono);
    console.log('   • Correo:', datosPrueba.correo);
    console.log('   • Paquete:', datosPrueba.paquete);
    console.log('');

    const result = await agregarConsultaPaquete(datosPrueba);
    
    console.log('✅ ¡TEST EXITOSO!');
    console.log('📊 Respuesta de Google Sheets:');
    console.log('   • Rango actualizado:', result.updates.updatedRange);
    console.log('   • Filas agregadas:', result.updates.updatedRows);
    console.log('   • Columnas actualizadas:', result.updates.updatedColumns);
    console.log('   • Celdas actualizadas:', result.updates.updatedCells);
    console.log('');
    console.log('🔗 Verificá en: https://docs.google.com/spreadsheets/d/1A5ge31_VCrP74eeUc-IUNQy3sZPcbaCR5dKU3xQL-zk/edit');
    console.log('📋 Pestaña: Paquetes');
    console.log('');
    console.log('✨ El flujo de paquetes está listo para usar!');

} catch (error) {
    console.error('❌ TEST FALLIDO');
    console.error('Error:', error.message);
    console.error('');
    console.error('🔧 Verificá:');
    console.error('   1. Que el archivo config/google-credentials.json existe');
    console.error('   2. Que la hoja "Paquetes" existe en el spreadsheet');
    console.error('   3. Que el service account tiene permisos de Editor');
    console.error('   4. Que la estructura de columnas sea: A=nombre, B=telefono, C=correo, D=paquete, E=fecha, F=revisado');
}
