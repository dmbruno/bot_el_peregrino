// ==========================================
// HUMAHUACA - Turismo Receptivo
// ==========================================
import { sendMessage, sendImage, getUserByPhone } from '../../utils/utils.js';
import { agregarConsultaReceptivo } from '../../utils/googleSheets.js';

// URL de la imagen en Google Drive (formato directo de descarga)
const HUMAHUACA_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=1hVKJlpFXxdhMteJY-v73j--qhQ29UHCC';

export async function showHumahuacaInfo(sock, from, conversationState) {
    // 1. Enviar imagen primero
    await sendImage(sock, from, HUMAHUACA_IMAGE_URL, '🌈 Quebrada de Humahuaca');
    
    // 2. Enviar información detallada
    const humahuacaText = `🌈 *HUMAHUACA* ⛰️

La excursión comienza en Salta y, tras pasar por San Salvador de Jujuy, ingresamos a la Quebrada de Humahuaca, declarada Patrimonio de la Humanidad por la UNESCO (2003).

📍 Purmamarca, con el Cerro de los Siete Colores
📍 Maimará, con la Paleta del Pintor
📍 Tilcara, visita al pueblo
📍 Uquía, con su histórica iglesia y los Ángeles Arcabuceros
📍 Humahuaca, ciudad de calles angostas y tradiciones del pueblo coya

Finalizamos el recorrido regresando a Salta.

🛣️ *Recorrido:* 520 km
⏱️ *Duración:* 12 horas
🕖 *Salida:* 7:00 a.m.

💰 *Precio por persona:* $59.000`;

    await sendMessage(sock, from, humahuacaText);
    
    // 3. Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir más información sobre paquetes y precios?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_HUMAHUACA',
        data: {}
    };
}

export async function handleHumahuacaResponse(sock, from, text, conversationState) {
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
                await agregarConsultaReceptivo({
                    nombre: user.nombre,
                    telefono: userId,
                    correo: user.correo,
                    destino: 'Humahuaca - Quebrada de Humahuaca'
                });
                console.log('✅ Consulta guardada en Google Sheets (Humahuaca)');
            } catch (sheetError) {
                console.error('⚠️ Error guardando en Sheets, pero continuamos:', sheetError);
            }
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos a la brevedad al correo *${user.correo}* o al teléfono *${userId}* registrado con toda la información sobre Humahuaca y la Quebrada.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *Agencia del Peregrino viajes y turismo*! 🌈✨`);
            
            console.log(`📊 Lead generado - Humahuaca: ${user.nombre} (${user.correo})`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

Si en algún momento te interesa conocer la Quebrada de Humahuaca, no dudes en contactarnos.

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
