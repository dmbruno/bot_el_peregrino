// ==========================================
// PURMAMARCA + SALINAS GRANDES - Turismo Receptivo
// ==========================================
import { sendMessage, sendImage, getUserByPhone } from '../../utils/utils.js';
import { agregarConsultaReceptivo } from '../../utils/googleSheets.js';

// URL de la imagen en Google Drive (formato directo de descarga)
const PURMAMARCA_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=1GMWnzG9_AMLwpcHGunUG0jgi82tMfaxw';

export async function showPurmamarcaInfo(sock, from, conversationState) {
    // 1. Enviar imagen primero
    await sendImage(sock, from, PURMAMARCA_IMAGE_URL, '🗻 Purmamarca + Salinas Grandes');
    
    // 2. Enviar información detallada
    const purmamarcaText = `🗻 *PURMAMARCA + SALINAS GRANDES (JUJUY)* 🏔️

La excursión comienza en Salta y, tras pasar por San Salvador de Jujuy, ingresamos a la Quebrada, disfrutando de sus paisajes únicos.

📍 Purmamarca, visita al pintoresco pueblo y al icónico Cerro de los Siete Colores 🌈
📍 Ascenso por la imponente Cuesta del Lipán, alcanzando los 4.170 m s. n. m. ⛰️
📍 Salinas Grandes de Jujuy, donde se recorren los piletones y se aprecia la inmensa extensión blanca de sal, creando paisajes inolvidables 🤍✨

Luego regresamos a Purmamarca, con tiempo libre para almorzar 🍽️ y recorrer el pueblo a tu ritmo.

Finalizamos la excursión con regreso a la ciudad de Salta.

🛣️ *Recorrido:* 450 km
⏱️ *Duración:* 10 horas
🕖 *Salida:* 7:00 a.m.

💰 *Precio por persona:* $59.000`;

    await sendMessage(sock, from, purmamarcaText);
    
    // 3. Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir más información sobre paquetes y precios?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_PURMAMARCA',
        data: {}
    };
}

export async function handlePurmamarcaResponse(sock, from, text, conversationState) {
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
                    destino: 'Purmamarca + Salinas Grandes'
                });
                console.log('✅ Consulta guardada en Google Sheets (Purmamarca)');
            } catch (sheetError) {
                console.error('⚠️ Error guardando en Sheets, pero continuamos:', sheetError);
            }
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos a la brevedad al correo *${user.correo}* o al teléfono *${userId}* registrado con toda la información sobre Purmamarca y Salinas Grandes.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *Agencia del Peregrino viajes y turismo*! 🗻✨`);

            console.log(`📊 Lead generado - Purmamarca: ${user.nombre} (${user.correo})`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

Si en algún momento te interesa conocer Purmamarca y las Salinas Grandes, no dudes en contactarnos.

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
