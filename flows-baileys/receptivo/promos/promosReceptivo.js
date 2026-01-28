// ==========================================
// MENU PROMOS RECEPTIVO - Norte Argentino
// ==========================================
import { sendMessage } from '../../../utils/utils.js';

export async function showPromosReceptivoInfo(sock, from, conversationState) {
    const promosText = `🎁 *PROMOS ESPECIALES - TURISMO RECEPTIVO* 🏔️

¡Aprovechá nuestros combos exclusivos!

🌟 *1. Combo Completo*
   Cafayate + Cachi + Humahuaca
   💰 $125.000 por persona

🌟 *2. Combo Express*
   Cafayate + Humahuaca
   💰 $85.000 por persona

📍 Conocé lo mejor del Norte Argentino con nuestras promos especiales.

📞 *Contacto:*
• Fijo: 3884291903
• Celular: 3874029503
• Alvarado 511, Salta Capital


✍️ Escribe el *número* de la opción que te interesa. Ó escribe *Volver* para regresar al menu anterior.`;

    await sendMessage(sock, from, promosText);
    
    conversationState[from] = {
        step: 'MENU_PROMOS_RECEPTIVO',
        data: {}
    };
}

export async function handlePromosReceptivoResponse(sock, from, text, conversationState) {
    const option = text.trim();

    switch (option) {
        case '1':
            // Importar y ejecutar flujo de Combo 1 (Completo)
            const { showCombo1Info } = await import('./combo1.js');
            await showCombo1Info(sock, from, conversationState);
            break;

        case '2':
            // Importar y ejecutar flujo de Combo 2 (Express)
            const { showCombo2Info } = await import('./combo2.js');
            await showCombo2Info(sock, from, conversationState);
            break;

        case 'volver':
        case 'Volver':
        case 'VOLVER':
            // Volver al menú receptivo
            const { showMenuReceptivo } = await import('../../menuReceptivo.js');
            await showMenuReceptivo(sock, from, conversationState);
            break;

        default:
            await sendMessage(sock, from, '⚠️ Respuesta no válida. Por favor selecciona una de las opciones (1-2) o escribe *Volver* para regresar.');
            await showPromosReceptivoInfo(sock, from, conversationState);
            break;
    }
}
