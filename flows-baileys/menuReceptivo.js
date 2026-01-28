// ==========================================
// MENU RECEPTIVO - Turismo Norte Argentino
// ==========================================
import { sendMessage } from '../utils/utils.js';

export async function showMenuReceptivo(sock, from, conversationState) {
    const menuText = `🏔️ *TURISMO RECEPTIVO - Norte Argentino* 🏔️

Conoce las maravillas del noroeste argentino:

🍷 *1. Valles Calchaquíes - Cafayate*
   Quebrada de las Conchas, bodegas y vinos

🌵 *2. Cachi*
   Cuesta del Obispo, Recta Tin Tin, Los Cardones

🌈 *3. Quebrada de Humahuaca*
   Purmamarca, Tilcara, Cerro de 7 Colores

🗻 *4. Purmamarca + Salinas Grandes*
   Cerro de 7 Colores, Cuesta del Lipán

🚵‍♀️ *5. Humahuaca + Serranías de Hornocal*
   Quebrada, Hornocal multicolor

⛪️ *6. City Tour - Salta*
   Centro histórico, Cerro San Bernardo

🚂 *7. Tren a las Nubes*
   Quebrada del Toro, Viaducto La Polvorilla

🏔️ *8. Iruya*
   Pueblito andino, Abra del Cóndor

🎁 *9. Promos Especiales*
   Combos con descuento


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
            // Importar y ejecutar flujo de Cafayate
            const { showCafayateInfo } = await import('./receptivo/cafayate.js');
            await showCafayateInfo(sock, from, conversationState);
            break;

        case '2':
            // Importar y ejecutar flujo de Cachi
            const { showCachiInfo } = await import('./receptivo/cachi.js');
            await showCachiInfo(sock, from, conversationState);
            break;

        case '3':
            // Importar y ejecutar flujo de Humahuaca
            const { showHumahuacaInfo } = await import('./receptivo/humahuaca.js');
            await showHumahuacaInfo(sock, from, conversationState);
            break;

        case '4':
            // Importar y ejecutar flujo de Purmamarca
            const { showPurmamarcaInfo } = await import('./receptivo/purmamarca.js');
            await showPurmamarcaInfo(sock, from, conversationState);
            break;

        case '5':
            // Importar y ejecutar flujo de Hornocal
            const { showHornocalInfo } = await import('./receptivo/hornocal.js');
            await showHornocalInfo(sock, from, conversationState);
            break;

        case '6':
            // Importar y ejecutar flujo de City Tour Salta
            const { showCityTourSaltaInfo } = await import('./receptivo/cityTourSalta.js');
            await showCityTourSaltaInfo(sock, from, conversationState);
            break;

        case '7':
            // Importar y ejecutar flujo de Tren a las Nubes
            const { showTrenNubesInfo } = await import('./receptivo/trenNubes.js');
            await showTrenNubesInfo(sock, from, conversationState);
            break;

        case '8':
            // Importar y ejecutar flujo de Iruya
            const { showIruyaInfo } = await import('./receptivo/iruya.js');
            await showIruyaInfo(sock, from, conversationState);
            break;

        case '9':
            // Importar y mostrar menú de Promos Receptivo
            const { showPromosReceptivoInfo } = await import('./receptivo/promos/promosReceptivo.js');
            await showPromosReceptivoInfo(sock, from, conversationState);
            break;

        case 'volver':
        case 'Volver':
        case 'VOLVER':
            // Volver al menú principal
            const { showMenuPrincipal } = await import('./menuPrincipal.js');
            await showMenuPrincipal(sock, from, conversationState);
            break;

        default:
            await sendMessage(sock, from, '⚠️ Respuesta no válida. Por favor selecciona una de las opciones (1-9) o escribe *Volver* para regresar.');
            await showMenuReceptivo(sock, from, conversationState);
            break;
    }
}
