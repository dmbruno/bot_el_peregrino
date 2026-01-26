// ==========================================
// PAQUETES COMPLETOS NORTE ARGENTINO - Turismo Receptivo
// ==========================================
import { sendMessage } from '../../utils/utils.js';

export async function showPaquetesCompletos(sock, from, conversationState) {
    const paquetesText = `📦 *PAQUETES COMPLETOS - NORTE ARGENTINO* 📦

Combiná varios destinos en un solo viaje:

🌟 *PAQUETE CLÁSICO (4-5 días)*
• Salta City Tour
• Quebrada de Humahuaca + Salinas Grandes
• Cafayate + Quebrada de las Conchas
• Traslados incluidos

🌟 *PAQUETE PREMIUM (7-8 días)*
• Todo del Paquete Clásico +
• Cachi y Ruta de los Vinos
• Termas de Rosario de la Frontera
• Tren a las Nubes (opcional)

🌟 *PAQUETE AVENTURA (6-7 días)*
• Trekking en Quebrada del Río Las Conchas
• Ascenso Cerro San Bernardo
• Cabalgatas en Valles Calchaquíes
• Rafting en Río Juramento

🌟 *PAQUETE CULTURAL (5-6 días)*
• Museos de Salta
• Ruinas de Quilmes
• Pucará de Tilcara
• Cachi y Molinos (iglesias coloniales)

✨ *Todos los paquetes incluyen:*
✅ Traslados
✅ Alojamiento con desayuno
✅ Guías especializados
✅ Entradas a sitios turísticos

💰 *Precios personalizados según:*
• Cantidad de personas
• Temporada
• Categoría de alojamiento
• Servicios adicionales

📞 ¿Querés recibir información personalizada de algún paquete?

✍️ Escribí *SÍ* para que un asesor te contacte con cotizaciones y disponibilidad.`;

    await sendMessage(sock, from, paquetesText);
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_PAQUETES',
        data: {}
    };
}

export async function handlePaquetesResponse(sock, from, text, conversationState) {
    const response = text.trim().toUpperCase();

    if (response === 'SI' || response === 'SÍ' || response === 'SIP') {
        await sendMessage(sock, from, '✅ ¡Perfecto! Un asesor de *El Peregrino viajes y turismo* se comunicará contigo con información detallada de nuestros paquetes, precios y disponibilidad.\n\n📞 También podés llamarnos al 3884291903 o 3874029503.\n\n📍 Visitanos en Alvarado 511, Salta.');
        delete conversationState[from];
    } else {
        await sendMessage(sock, from, 'Entendido. Si cambiás de opinión, podés volver a consultarnos cuando quieras. 😊');
        delete conversationState[from];
    }
}
