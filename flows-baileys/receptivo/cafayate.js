// ==========================================
// VALLES CALCHAQUÍES - CAFAYATE - Turismo Receptivo
// ==========================================
import { sendMessage } from '../../utils/utils.js';

export async function showCafayateInfo(sock, from, conversationState) {
    const cafayateText = `🍷 *VALLES CALCHAQUÍES - CAFAYATE* 🍷

La ruta del vino y los paisajes más lindos del noroeste:

🏜️ *Quebrada de las Conchas (Cafayate)*
• Garganta del Diablo
• Anfiteatro
• El Sapo
• Los Castillos
• Casa de Loros

🍇 *Bodegas de Cafayate*
• Cata de vinos Torrontés
• Bodega Etchart
• Bodega El Porvenir
• Bodega El Esteco
• Bodega Nanni

🏔️ *Cachi*
• Recta del Tin Tin
• Parque Nacional Los Cardones
• Iglesia colonial
• Museo Arqueológico Pío Pablo Díaz

⛪ *Molinos*
• Iglesia San Pedro Nolasco (Momia de Nicolás Isasmendi)
• Ruinas de Hacienda
• Paisajes únicos

🌄 *Seclantas y Angastaco*
• Pueblos auténticos
• Gastronomía regional
• Artesanías locales

📸 *Duración recomendada:* 2-3 días

💰 ¿Querés recibir información de paquetes y precios?

✍️ Escribí *SÍ* para que un asesor te contacte con toda la información.`;

    await sendMessage(sock, from, cafayateText);
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_CAFAYATE',
        data: {}
    };
}

export async function handleCafayateResponse(sock, from, text, conversationState) {
    const response = text.trim().toUpperCase();

    if (response === 'SI' || response === 'SÍ' || response === 'SIP') {
        await sendMessage(sock, from, '✅ ¡Excelente elección! Un asesor de *El Peregrino viajes y turismo* se comunicará contigo con toda la información de los Valles Calchaquíes, paquetes disponibles y precios.\n\n📞 También podés llamarnos al 3884291903 o 3874029503.');
        delete conversationState[from];
    } else {
        await sendMessage(sock, from, 'Entendido. Si cambiás de opinión, podés volver a consultarnos cuando quieras. 😊');
        delete conversationState[from];
    }
}
