// ==========================================
// CACHI - Turismo Receptivo
// ==========================================
import { sendMessage, sendImage, getUserByPhone } from '../../utils/utils.js';
import { agregarConsultaReceptivo } from '../../utils/googleSheets.js';

// URL de la imagen en Google Drive (formato directo de descarga)
const CACHI_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=1JlAelMQNVCJgL8OI2fjTT23wfWS-lvWi';

export async function showCachiInfo(sock, from, conversationState) {
    // 1. Enviar imagen primero
    await sendImage(sock, from, CACHI_IMAGE_URL, '🌵 Cachi - Valles Calchaquíes');
    
    // 2. Enviar información detallada
    const cachiText = `🌵 *CACHI* 🌵

La excursión comienza en Salta, atravesando el Valle de Lerma por la R.N. 68 hasta empalmar con la R.P. 33, disfrutando de paisajes de bosques, quebradas, ríos y montañas.

Ascendemos por la imponente Cuesta del Obispo hasta los 3.348 m s. n. m., continuando por la histórica Recta de Tin Tin y el Parque Nacional Los Cardones, con vistas al Nevado de Cachi.

📍 Llegamos a Cachi, encantadora ciudad colonial de los Valles Calchaquíes.

✔️ Recorrido por la plaza central
✔️ Visita al Museo Arqueológico y a la iglesia de adobe
✔️ 2 horas libres para almorzar 🍽️ y recorrer el pueblo

🛣️ *Recorrido:* 320 km
⏱️ *Duración:* 12 horas
🕖 *Salida:* 7:00 a.m.
🕕 *Regreso:* aprox. 18:00 hs

💰 *Precio por persona:* $49.000`;

    await sendMessage(sock, from, cachiText);
    
    // 3. Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir más información sobre paquetes y precios?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_CACHI',
        data: {}
    };
}

export async function handleCachiResponse(sock, from, text, conversationState) {
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
                    destino: 'Cachi - Valles Calchaquíes'
                });
                console.log('✅ Consulta guardada en Google Sheets (Cachi)');
            } catch (sheetError) {
                console.error('⚠️ Error guardando en Sheets, pero continuamos:', sheetError);
            }
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos a la brevedad al correo *${user.correo}* o al teléfono *${userId}* registrado con toda la información sobre Cachi.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *Agencia del Peregrino viajes y turismo*! 🌵✨`);
            
            console.log(`📊 Lead generado - Cachi: ${user.nombre} (${user.correo})`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

Si en algún momento te interesa conocer Cachi, no dudes en contactarnos.

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
