// ==========================================
// Test completo para todos los flujos RECEPTIVOS
// ==========================================
import { agregarConsultaReceptivo } from './utils/googleSheets.js';

console.log('🧪 TEST COMPLETO - TODOS LOS FLUJOS RECEPTIVOS\n');
console.log('=' .repeat(60));
console.log('Insertaremos 7 consultas (una por cada destino receptivo)\n');

const destinosReceptivo = [
    { nombre: 'Cafayate - Valles Calchaquíes', emoji: '🍷' },
    { nombre: 'Cachi - Valles Calchaquíes', emoji: '🌵' },
    { nombre: 'Humahuaca - Quebrada de Humahuaca', emoji: '🌈' },
    { nombre: 'Purmamarca + Salinas Grandes', emoji: '🗻' },
    { nombre: 'Humahuaca + Serranías de Hornocal', emoji: '🚵‍♀️' },
    { nombre: 'City Tour - Salta', emoji: '⛪️' },
    { nombre: 'Tren a las Nubes', emoji: '🚂' }
];

let exitosos = 0;
let fallidos = 0;

for (let i = 0; i < destinosReceptivo.length; i++) {
    const destino = destinosReceptivo[i];
    console.log(`\n${destino.emoji} [${i + 1}/7] Probando: ${destino.nombre}`);
    console.log('-'.repeat(60));
    
    try {
        await agregarConsultaReceptivo({
            nombre: `Test Usuario Receptivo ${i + 1}`,
            telefono: '5493875051112',
            correo: `test-receptivo-${i + 1}@ejemplo.com`,
            destino: destino.nombre
        });
        console.log(`   ✅ SUCCESS - ${destino.nombre}`);
        exitosos++;
    } catch (error) {
        console.error(`   ❌ ERROR - ${destino.nombre}:`, error.message);
        fallidos++;
    }
}

console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DEL TEST:');
console.log(`   ✅ Exitosos: ${exitosos}/7`);
console.log(`   ❌ Fallidos: ${fallidos}/7`);
console.log('='.repeat(60));

if (exitosos === 7) {
    console.log('\n🎉 ¡PERFECTO! Todos los flujos receptivos funcionan correctamente.');
    console.log('👉 Verifica tu Google Sheet en la pestaña "Receptivo"');
    console.log('   https://docs.google.com/spreadsheets/d/1A5ge31_VCrP74eeUc-IUNQy3sZPcbaCR5dKU3xQL-zk/edit');
    console.log('\n✅ Ya puedes probar manualmente con el bot!');
} else {
    console.log('\n⚠️  Algunos flujos fallaron. Revisa los errores arriba.');
}
