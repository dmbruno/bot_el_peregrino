// ==========================================
// SALIDAS GRUPALES - Turismo Emisivo
// ==========================================
import { sendMessage } from '../../../utils/utils.js';

export async function showMenuSalidasGrupales(sock, from, conversationState) {
    const menuText = `✈️ *SALIDAS GRUPALES* ✈️

Viajes organizados con todo incluido:

🇵🇪 *1. Perú Legendario*
   Cusco, Machu Picchu, Lima - 8 días

🌍 *2. Europa Clásica*
   Desde Salta - 17 días por Europa

🕌 *3. Turquía y Dubai*
   15 días entre Oriente y Medio Oriente


✍️ Escribe el *número* de la opción que te interesa. Ó escribe *Volver* para regresar al menu anterior.`;

    await sendMessage(sock, from, menuText);
    
    conversationState[from] = {
        step: 'MENU_SALIDAS_GRUPALES',
        data: {}
    };
}

export async function handleSalidasGrupalesSelection(sock, from, text, conversationState) {
    const option = text.trim();

    switch (option) {
        case '1':
            // Importar y ejecutar flujo de Perú
            const { showPeruInfo } = await import('./peru.js');
            await showPeruInfo(sock, from, conversationState);
            break;

        case '2':
            // Importar y ejecutar flujo de Europa
            const { showEuropaInfo } = await import('./europa.js');
            await showEuropaInfo(sock, from, conversationState);
            break;

        case '3':
            // Importar y ejecutar flujo de Turquía y Dubai
            const { showTurquiaDubaiInfo } = await import('./turquiaDubai.js');
            await showTurquiaDubaiInfo(sock, from, conversationState);
            break;

        case 'volver':
        case 'Volver':
        case 'VOLVER':
            // Volver al menú emisivo
            const { showMenuEmisivo } = await import('../../menuEmisivo.js');
            await showMenuEmisivo(sock, from, conversationState);
            break;

        default:
            await sendMessage(sock, from, '⚠️ Respuesta no válida. Por favor selecciona una de las opciones (1-3) o escribe *Volver* para regresar.');
            await showMenuSalidasGrupales(sock, from, conversationState);
            break;
    }
}
