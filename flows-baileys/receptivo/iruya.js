// ==========================================
// IRUYA - Turismo Receptivo
// ==========================================
import { sendMessage, sendImage, getUserByPhone } from '../../utils/utils.js';
import { agregarConsultaReceptivo } from '../../utils/googleSheets.js';

// URL de la imagen en Google Drive (formato directo de descarga)
const IRUYA_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=1rmwDlW3OFTEflwPqS5hbnZu0nx2E787l';

export async function showIruyaInfo(sock, from, conversationState) {
    // 1. Enviar imagen primero
    await sendImage(sock, from, IRUYA_IMAGE_URL, '🏔️ Iruya - Pueblito Andino');
    
    // 2. Enviar información detallada
    const iruyaText = `🏔️ *IRUYA* 🏔️

Partimos desde Purmamarca para vivir una de las travesías más impactantes del norte argentino. Durante el recorrido disfrutamos de increíbles panorámicas de los paisajes andinos, combinadas con la riqueza cultural y natural de la región.

📍 *Recorrido:*
• Purmamarca y el imponente Cerro de los 7 Colores
• Humahuaca, ciudad representativa de la cultura del Pueblo Coya
• Paso por Iturbe
• Abra del Cóndor (4.180 msnm)
• Llegada a Iruya, pueblito andino de belleza única, donde el silencio y la tranquilidad son protagonistas

En Iruya recorremos la plaza principal y sus edificios más destacados. Finalizamos la excursión regresando por la Quebrada hasta la Ciudad de Salta.

⏱️ *Duración:* 1 día
🕡 *Salida:* 6:30 a.m.

💰 *Iruya en un Día:* $300.000 (mínimo 2 personas)`;

    await sendMessage(sock, from, iruyaText);
    
    // 3. Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir más información sobre paquetes y precios?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_IRUYA',
        data: {}
    };
}

export async function handleIruyaResponse(sock, from, text, conversationState) {
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
                    destino: 'Iruya - Pueblito Andino'
                });
                console.log('✅ Consulta guardada en Google Sheets (Iruya)');
            } catch (sheetError) {
                console.error('⚠️ Error guardando en Sheets, pero continuamos:', sheetError);
            }
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos a la brevedad al correo *${user.correo}* o al teléfono *${userId}* registrado con toda la información sobre Iruya.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *El Peregrino viajes y turismo*! 🏔️✨`);
            
            console.log(`📊 Lead generado - Iruya: ${user.nombre} (${user.correo})`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

Si en algún momento te interesa conocer Iruya, no dudes en contactarnos.

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
