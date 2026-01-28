// ==========================================
// Test para Google Sheets - SOLO RECEPTIVO
// ==========================================
import { agregarConsultaReceptivo } from './utils/googleSheets.js';

console.log('🧪 Probando integración con Google Sheets - RECEPTIVO\n');
console.log('📋 Insertaremos 7 consultas de prueba (una por cada destino)\n');

const destinosReceptivo = [
    'Cafayate - Valles Calchaquíes',
    'Cachi - Valles Calchaquíes',
    'Humahuaca - Quebrada de Humahuaca',
    'Purmamarca + Salinas Grandes',
    'Humahuaca + Serranías de Hornocal',
    'City Tour - Salta',
    'Tren a las Nubes'
];

// Insertar un registro de prueba por cada destino
for (let i = 0; i < destinosReceptivo.length; i++) {
    const destino = destinosReceptivo[i];
    console.log(`📝 [${i + 1}/7] Insertando: ${destino}...`);
    
    try {
        await agregarConsultaReceptivo({
            nombre: `Test Usuario ${i + 1}`,
            telefono: '5493875051112',
            correo: `test${i + 1}@ejemplo.com`,
            destino: destino,
            interes: 'SÍ',
            fecha: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Salta' })
        });
        console.log(`✅ ${destino} - Insertado correctamente\n`);
    } catch (error) {
        console.error(`❌ Error insertando ${destino}:`, error.message, '\n');
    }
}

console.log('🎉 Prueba completada!');
console.log('👉 Verifica tu Google Sheet en la pestaña "Receptivo":');
console.log('   https://docs.google.com/spreadsheets/d/1A5ge31_VCrP74eeUc-IUNQy3sZPcbaCR5dKU3xQL-zk/edit#gid=0');
