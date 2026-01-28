// ==========================================
// MENU PROMOS ESPECIALES - Turismo Emisivo
// ==========================================
import { sendMessage } from '../../../utils/utils.js';

export async function showPromosInfo(sock, from, conversationState) {
    const promosText = `🎁 *PROMOS ESPECIALES - VIAJES AL EXTERIOR* ✈️

¡Aprovechá nuestras ofertas exclusivas!

🔥 *1. Camboriú en Bus*
   Salidas en febrero - Cupos limitados

📍 Consultanos para conocer más promociones vigentes.

📞 *Contacto:*
• Fijo: 3884291903
• Celular: 3874029503
• Alvarado 511, Salta Capital


✍️ Escribe el *número* de la opción que te interesa. Ó escribe *Volver* para regresar al menu anterior.`;

    await sendMessage(sock, from, promosText);
    
    conversationState[from] = {
        step: 'MENU_PROMOS',
        data: {}
    };
}

export async function handlePromosResponse(sock, from, text, conversationState) {
    const option = text.trim();

    switch (option) {
        case '1':
            // Importar y ejecutar flujo de Camboriú
            const { showCamboriuInfo } = await import('./camboriu.js');
            await showCamboriuInfo(sock, from, conversationState);
            break;

        case 'volver':
        case 'Volver':
        case 'VOLVER':
            // Volver al menú emisivo
            const { showMenuEmisivo } = await import('../../menuEmisivo.js');
            await showMenuEmisivo(sock, from, conversationState);
            break;

        default:
            await sendMessage(sock, from, '⚠️ Respuesta no válida. Por favor selecciona una de las opciones o escribe *Volver* para regresar.');
            await showPromosInfo(sock, from, conversationState);
            break;
    }
}
