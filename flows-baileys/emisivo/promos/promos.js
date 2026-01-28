// ==========================================
// PROMOS ESPECIALES - Turismo Emisivo
// ==========================================
import { sendMessage, sendImage, getUserByPhone } from '../../../utils/utils.js';

// URL de la imagen en Google Drive (formato directo de descarga)
const PROMOS_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=1VTqWTBaSFgAsyROOwspPvQa_xTpbKq-j';

export async function showPromosInfo(sock, from, conversationState) {
    // 1. Enviar imagen primero
    await sendImage(sock, from, PROMOS_IMAGE_URL, '🎁 Promos Especiales');
    
    // 2. Enviar información detallada
    const promosText = `🎁 *PROMOS ESPECIALES - VIAJES AL EXTERIOR* ✈️

Próximamente tendremos ofertas exclusivas en destinos internacionales.

📍 Consultanos para conocer las promociones vigentes y aprovechar las mejores tarifas.

📞 *Contacto:*
• Fijo: 3884291903
• Celular: 3874029503
• Alvarado 511, Salta Capital

¡No te pierdas nuestras próximas ofertas! 🌟`;

    await sendMessage(sock, from, promosText);
    
    // 3. Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir información cuando tengamos nuevas promos?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_PROMOS',
        data: {}
    };
}

export async function handlePromosResponse(sock, from, text, conversationState) {
    const response = text.trim().toUpperCase();
    const userId = from.split('@')[0];

    if (response === 'SI' || response === 'SÍ' || response === 'SIP') {
        // Usuario interesado - obtener sus datos
        try {
            const user = await getUserByPhone(userId);
            
            if (!user) {
                await sendMessage(sock, from, '⚠️ No encontramos tu registro. Por favor, escribe *menu* para volver al menú principal.');
                delete conversationState[from];
                return;
            }

            const primerNombre = user.nombre.split(' ')[0];
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos cuando tengamos nuevas promociones disponibles al correo *${user.correo}* o al teléfono *${userId}* registrado.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *El Peregrino viajes y turismo*! 🎁✨`);
            
            // TODO: Aquí después agregaremos el guardado en Excel
            console.log(`📊 Lead generado - Promos: ${user.nombre} (${user.correo})`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
