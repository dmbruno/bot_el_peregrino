// ==========================================
// TEST: Promos Receptivo - Google Sheets
// ==========================================
import { agregarConsultaReceptivo } from './utils/googleSheets.js';

async function testPromosReceptivo() {
    console.log('🧪 Iniciando test de Promos Receptivo...\n');

    try {
        // Test Combo 1
        console.log('📋 Test 1: Combo Completo (Cafayate + Cachi + Humahuaca)');
        const testCombo1 = {
            nombre: 'Test Usuario Combo 1',
            telefono: '5493874029503',
            correo: 'test.combo1@example.com',
            destino: 'PROMO: Cafayate + Cachi + Humahuaca'
        };
        console.log('   Datos:', testCombo1);
        console.log('   📤 Enviando a Google Sheets (pestaña Receptivo)...');
        await agregarConsultaReceptivo(testCombo1);
        console.log('   ✅ Combo 1 guardado exitosamente!\n');

        // Test Combo 2
        console.log('📋 Test 2: Combo Express (Cafayate + Humahuaca)');
        const testCombo2 = {
            nombre: 'Test Usuario Combo 2',
            telefono: '5493875051112',
            correo: 'test.combo2@example.com',
            destino: 'PROMO: Cafayate + Humahuaca'
        };
        console.log('   Datos:', testCombo2);
        console.log('   📤 Enviando a Google Sheets (pestaña Receptivo)...');
        await agregarConsultaReceptivo(testCombo2);
        console.log('   ✅ Combo 2 guardado exitosamente!\n');

        console.log('✅ Todos los tests completados exitosamente!');
        console.log('💡 Revisa la pestaña "Receptivo" en Google Sheets para verificar que se guardaron correctamente.');
        console.log('   Los registros deben aparecer con "PROMO:" en la columna de destino.');

    } catch (error) {
        console.error('❌ Error en el test:', error);
        process.exit(1);
    }
}

testPromosReceptivo();
