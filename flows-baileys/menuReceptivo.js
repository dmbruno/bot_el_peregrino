// ==========================================
// MENU RECEPTIVO - Turismo Norte Argentino
// ==========================================
import { sendMessage } from '../utils/utils.js';

export async function showMenuReceptivo(sock, from, conversationState) {
    const menuText = `🏔️ *TURISMO RECEPTIVO - Norte Argentino* 🏔️

Conoce las maravillas del noroeste argentino:

🌄 *1. Salta la Linda*
   City tours, cerro San Bernardo, museos y más

⛰️ *2. Jujuy y la Quebrada de Humahuaca*
   Purmamarca, Tilcara, Salinas Grandes

🍷 *3. Valles Calchaquíes - Cafayate*
   Bodegas, Cachi, Molinos, paisajes únicos

📦 *4. Paquetes Completos*
   Combina varios destinos en un viaje inolvidable


✍️ Escribe el *número* de la opción que te interesa. Ó escribe *Volver* para regresar al menu anterior.`;

    await sendMessage(sock, from, menuText);
    
    conversationState[from] = {
        step: 'MENU_RECEPTIVO',
        data: {}
    };
}

export async function handleMenuReceptivoSelection(sock, from, text, conversationState) {
    const option = text.trim();

    switch (option) {
        case '1':
            // Importar y ejecutar flujo de Salta
            const { showSaltaInfo } = await import('./receptivo/salta.js');
            await showSaltaInfo(sock, from, conversationState);
            break;

        case '2':
            // Importar y ejecutar flujo de Jujuy
            const { showJujuyInfo } = await import('./receptivo/jujuy.js');
            await showJujuyInfo(sock, from, conversationState);
            break;

        case '3':
            // Importar y ejecutar flujo de Cafayate
            const { showCafayateInfo } = await import('./receptivo/cafayate.js');
            await showCafayateInfo(sock, from, conversationState);
            break;

        case '4':
            // Importar y ejecutar flujo de paquetes completos
            const { showPaquetesCompletos } = await import('./receptivo/paquetesCompletos.js');
            await showPaquetesCompletos(sock, from, conversationState);
            break;

        case 'volver':
        case 'Volver':
        case 'VOLVER':
            // Volver al menú principal
            const { showMenuPrincipal } = await import('./menuPrincipal.js');
            await showMenuPrincipal(sock, from, conversationState);
            break;

        default:
            await sendMessage(sock, from, '⚠️ Respuesta no válida. Por favor selecciona una de las opciones (1-4) o escribe *Volver* para regresar.');
            await showMenuReceptivo(sock, from, conversationState);
            break;
    }
}
