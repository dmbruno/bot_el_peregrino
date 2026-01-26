// ==========================================
// SALTA LA LINDA - Turismo Receptivo
// ==========================================
import { sendMessage } from '../../utils/utils.js';

export async function showSaltaInfo(sock, from, conversationState) {
    const saltaText = `🌄 *SALTA LA LINDA* 🌄

Descubre la capital del Norte Argentino:

✨ *City Tour Salta*
• Plaza 9 de Julio
• Catedral Basílica
• Cabildo Histórico
• Iglesia San Francisco
• Museo de Arqueología de Alta Montaña (MAAM)

🚡 *Cerro San Bernardo*
• Teleférico o escalinata
• Vista panorámica de la ciudad
• Artesanías locales

🏛️ *Museos y Cultura*
• Museo Güemes
• Casa Arias Rengel
• Mercado Artesanal

🍷 *Gastronomía*
• Empanadas salteñas
• Locro
• Humitas
• Tamales

📸 *Duración recomendada:* 1-2 días

💰 ¿Querés recibir información de paquetes y precios?

✍️ Escribí *SÍ* para que un asesor te contacte con toda la información.`;

    await sendMessage(sock, from, saltaText);
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_SALTA',
        data: {}
    };
}

export async function handleSaltaResponse(sock, from, text, conversationState) {
    const response = text.trim().toUpperCase();

    if (response === 'SI' || response === 'SÍ' || response === 'SIP') {
        await sendMessage(sock, from, '✅ ¡Excelente elección! Un asesor de *El Peregrino viajes y turismo* se comunicará contigo con toda la información de Salta, paquetes disponibles y precios.\n\n📞 También podés llamarnos al 3884291903 o 3874029503.');
        delete conversationState[from];
    } else {
        await sendMessage(sock, from, 'Entendido. Si cambiás de opinión, podés volver a consultarnos cuando quieras. 😊');
        delete conversationState[from];
    }
}
