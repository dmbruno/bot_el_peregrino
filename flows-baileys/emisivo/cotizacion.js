// ==========================================
// COTIZACIÓN PERSONALIZADA - Emisivo
// ==========================================
import { sendMessage } from '../../utils/utils.js';

export async function showCotizacionInfo(sock, from, conversationState) {
    const cotizacionText = `💰 *SOLICITAR COTIZACIÓN PERSONALIZADA* 💰

¡Armamos tu viaje soñado!

Para cotizarte necesitamos saber:

📅 *¿Cuándo querés viajar?* (mes/año)
🧳 *¿Cuántos días tenés disponibles?*
👥 *¿Cuántas personas viajan?*
🌍 *¿Qué destino te interesa?*
💵 *¿Presupuesto aproximado?* (opcional)

Por favor, respondé con todos estos datos o escribí *"ASESOR"* para que un agente te contacte personalmente y te ayude a planificar tu viaje.`;

    await sendMessage(sock, from, cotizacionText);
    
    conversationState[from] = {
        step: 'ESPERANDO_COTIZACION',
        data: {}
    };
}

export async function handleCotizacionResponse(sock, from, text, conversationState) {
    const response = text.trim().toUpperCase();

    if (response === 'ASESOR') {
        await sendMessage(sock, from, '✅ Perfecto! Un asesor de *El Peregrino viajes y turismo* se comunicará contigo a la brevedad para ayudarte a planificar tu viaje.\n\n📞 También podés contactarnos al:\n• WhatsApp: 3874029503\n• Teléfono: 3884291903');
        delete conversationState[from];
    } else {
        // Guardar la consulta en la base de datos o reenviar al asesor
        await sendMessage(sock, from, `📝 *Recibimos tu consulta:*\n\n${text}\n\n✅ Un asesor la revisará y se comunicará contigo a la brevedad para brindarte la mejor cotización.\n\n¡Gracias por elegir *El Peregrino viajes y turismo*! 🌍`);
        delete conversationState[from];
    }
}
