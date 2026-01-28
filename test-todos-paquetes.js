// ==========================================
// TEST - Todos los Paquetes (Google Sheets)
// ==========================================
import { agregarConsultaPaquete } from './utils/googleSheets.js';

console.log('🧪 Iniciando test de TODOS los Paquetes...\n');
console.log('📦 Paquetes a probar: Europa, Perú, Turquía y Dubai\n');

// Array de paquetes para probar
const paquetes = [
    {
        emoji: '🌍',
        nombre: 'Europa Clásica 2026',
        usuario: 'Test Usuario Europa'
    },
    {
        emoji: '🇵🇪',
        nombre: 'Perú Legendario 2026',
        usuario: 'Test Usuario Perú'
    },
    {
        emoji: '🕌',
        nombre: 'Turquía y Dubai 2026',
        usuario: 'Test Usuario Turquía'
    }
];

let exitosos = 0;
let fallidos = 0;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

for (const paquete of paquetes) {
    try {
        console.log(`${paquete.emoji} Testeando: ${paquete.nombre}...`);
        
        const datosPrueba = {
            nombre: paquete.usuario,
            telefono: '5493875051112',
            correo: 'dmbruno61@gmail.com',
            paquete: paquete.nombre
        };

        const result = await agregarConsultaPaquete(datosPrueba);
        
        console.log(`   ✅ SUCCESS - Rango: ${result.updates.updatedRange}`);
        console.log(`   📊 Columnas: ${result.updates.updatedColumns} | Filas: ${result.updates.updatedRows}`);
        exitosos++;
        
    } catch (error) {
        console.log(`   ❌ FAILED - Error: ${error.message}`);
        fallidos++;
    }
    
    console.log('');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📊 RESUMEN DEL TEST:\n');
console.log(`   ✅ Exitosos: ${exitosos}/${paquetes.length}`);
console.log(`   ❌ Fallidos: ${fallidos}/${paquetes.length}`);
console.log('');

if (fallidos === 0) {
    console.log('🎉 ¡PERFECTO! Todos los paquetes funcionan correctamente\n');
    console.log('🔗 Verificá en: https://docs.google.com/spreadsheets/d/1A5ge31_VCrP74eeUc-IUNQy3sZPcbaCR5dKU3xQL-zk/edit');
    console.log('📋 Pestaña: Paquetes\n');
    console.log('✨ Ya podés probar manualmente con el bot!');
} else {
    console.log('⚠️ Algunos tests fallaron. Revisá los errores arriba.');
}
