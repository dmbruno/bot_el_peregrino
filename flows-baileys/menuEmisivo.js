// ==========================================
// MENU EMISIVO - Viajes Internacionales
// ==========================================
import { sendMessage } from '../utils/utils.js';

export async function showMenuEmisivo(sock, from, conversationState) {
    const menuText = `✈️ *TURISMO EMISIVO - Viajes al Exterior* ✈️

Explora el mundo con nuestros paquetes internacionales:

💰 *1. Solicitar Cotización*
   Arma tu viaje personalizado a cualquier destino

🇹🇷 *2. Turquía en 15 días*
   Paquete completo por Turquía

🇪🇺 *3. Europa*
   Circuitos por países europeos


✍️ Escribe el *número* de la opción que te interesa. Ó escribe *Volver* para regresar al menu anterior.`;

    await sendMessage(sock, from, menuText);
    
    conversationState[from] = {
        step: 'MENU_EMISIVO',
        data: {}
    };
}

export async function handleMenuEmisivoSelection(sock, from, text, conversationState) {
    const option = text.trim();

    switch (option) {
        case '1':
            // Importar y ejecutar flujo de cotización
            const { showCotizacionInfo } = await import('./emisivo/cotizacion.js');
            await showCotizacionInfo(sock, from, conversationState);
            break;

        case '2':
            // Importar y ejecutar flujo de Turquía 15 días
            const { startTUS15Flow } = await import('./emisivo/tus15/tus15.js');
            await startTUS15Flow(sock, from, conversationState);
            break;

        case '3':
            // Importar y ejecutar flujo de Europa
            const { startEuropaFlow } = await import('./emisivo/europa/europa.js');
            await startEuropaFlow(sock, from, conversationState);
            break;

        case 'volver':
        case 'Volver':
        case 'VOLVER':
            // Volver al menú principal
            const { showMenuPrincipal } = await import('./menuPrincipal.js');
            await showMenuPrincipal(sock, from, conversationState);
            break;

        default:
            await sendMessage(sock, from, '⚠️ Respuesta no válida. Por favor selecciona una de las opciones (1-3) o escribe *Volver* para regresar.');
            await showMenuEmisivo(sock, from, conversationState);
            break;
    }
}
