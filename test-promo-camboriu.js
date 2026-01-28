// ==========================================
// TEST: Promo Camboriú - Google Sheets
// ==========================================
import { agregarConsultaPromo } from './utils/googleSheets.js';

async function testCamboriuPromo() {
    console.log('🧪 Iniciando test de promo Camboriú...\n');

    try {
        const testData = {
            nombre: 'Test Usuario Promo',
            telefono: '5493874029503',
            correo: 'test.promo@example.com',
            promo: 'Camboriú en Bus - Febrero 2026'
        };

        console.log('📋 Datos de prueba:', testData);
        console.log('\n📤 Enviando a Google Sheets (pestaña Promos)...');

        const result = await agregarConsultaPromo(testData);

        console.log('✅ Test completado exitosamente!');
        console.log('📊 Resultado:', result);
        console.log('\n💡 Revisa la pestaña "Promos" en Google Sheets para verificar que se guardó correctamente.');

    } catch (error) {
        console.error('❌ Error en el test:', error);
        process.exit(1);
    }
}

testCamboriuPromo();
