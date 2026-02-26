// ==========================================
// PROMO CAMBORIÚ - Turismo Emisivo
// ==========================================
import { sendMessage, sendImage, getUserByPhone } from '../../../utils/utils.js';
import { agregarConsultaPromo } from '../../../utils/googleSheets.js';

// URL de la imagen en Google Drive (formato directo de descarga)
const CAMBORIU_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=1p9FasGM3FfwvxirZ-rwkE2G1WAc9pSV7';

export async function showCamboriuInfo(sock, from, conversationState) {
    // 1. Enviar imagen primero
    await sendImage(sock, from, CAMBORIU_IMAGE_URL, '🔥 Promo Camboriú en Bus');
    
    // 2. Enviar información detallada
    const camboriuText = `🔥 *PROMO EN BUS* 🔥

🗓️ *Salidas – Febrero:*
• 01/02
• 15/02

✨ *Incluye:*
🚍 Bus Mix última generación
🥤 Snack a bordo
🏨 7 noches de alojamiento
✨ Brasil Express
🍳 Desayuno buffet
🩺 Asistencia médica
🕺🏻 Coordinador permanente

(*) Adicionar 3,5% de gastos administrativos.

📲 Consultanos disponibilidad y asegurá tu lugar. ¡Cupos limitados!`;

    await sendMessage(sock, from, camboriuText);
    
    // 3. Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir más información sobre esta promo?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_CAMBORIU',
        data: {}
    };
}

export async function handleCamboriuResponse(sock, from, text, conversationState) {
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
            
            // Guardar en Google Sheets
            try {
                await agregarConsultaPromo({
                    nombre: user.nombre,
                    telefono: userId,
                    correo: user.correo,
                    promo: 'Camboriú en Bus - Febrero 2026'
                });
                console.log('✅ Consulta guardada en Google Sheets (Promos - Camboriú)');
            } catch (sheetError) {
                console.error('⚠️ Error guardando en Sheets, pero continuamos:', sheetError);
            }
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos a la brevedad al correo *${user.correo}* o al teléfono *${userId}* registrado con toda la información sobre la promo de Camboriú.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *Agencia del Peregrino viajes y turismo*! 🔥✨`);
            
            console.log(`📊 Lead generado - Promo Camboriú: ${user.nombre} (${user.correo})`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

Si en algún momento te interesa esta u otra promo, no dudes en contactarnos.

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
