// ==========================================
// JUJUY Y QUEBRADA DE HUMAHUACA - Turismo Receptivo
// ==========================================
import { sendMessage } from '../../utils/utils.js';

export async function showJujuyInfo(sock, from, conversationState) {
    const jujuyText = `⛰️ *JUJUY Y QUEBRADA DE HUMAHUACA* ⛰️

Patrimonio de la Humanidad UNESCO 🌍

🎨 *Purmamarca*
• Cerro de los 7 Colores
• Mercado artesanal
• Iglesia histórica
• Paseo de los Colorados

🏔️ *Tilcara*
• Pucará (fortaleza precolombina)
• Museo Arqueológico
• Garganta del Diablo
• Jardín Botánico de Altura

✨ *Salinas Grandes*
• Extensión de 12.000 hectáreas
• Paisaje lunar único
• Fotos espectaculares

🌈 *Humahuaca*
• Monumento al Indio
• Iglesia colonial
• Cabildo con reloj
• Serenata al Medio Día

🎭 *Otros atractivos:*
• Maimará (Paleta del Pintor)
• Uquía (Ángeles Arcabuceros)
• Hornillos

📸 *Duración recomendada:* Full day o 2 días

💰 ¿Querés recibir información de paquetes y precios?

✍️ Escribí *SÍ* para que un asesor te contacte con toda la información.`;

    await sendMessage(sock, from, jujuyText);
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_JUJUY',
        data: {}
    };
}

export async function handleJujuyResponse(sock, from, text, conversationState) {
    const response = text.trim().toUpperCase();

    if (response === 'SI' || response === 'SÍ' || response === 'SIP') {
        await sendMessage(sock, from, '✅ ¡Excelente elección! Un asesor de *El Peregrino viajes y turismo* se comunicará contigo con toda la información de Jujuy, paquetes disponibles y precios.\n\n📞 También podés llamarnos al 3884291903 o 3874029503.');
        delete conversationState[from];
    } else {
        await sendMessage(sock, from, 'Entendido. Si cambiás de opinión, podés volver a consultarnos cuando quieras. 😊');
        delete conversationState[from];
    }
}
