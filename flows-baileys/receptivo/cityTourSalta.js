// ==========================================
// CITY TOUR SALTA - Turismo Receptivo
// ==========================================
import { sendMessage, sendImage, getUserByPhone } from '../../utils/utils.js';
import { agregarConsultaReceptivo } from '../../utils/googleSheets.js';

// URL de la imagen en Google Drive (formato directo de descarga)
const CITY_TOUR_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=13d4_rkzjKgUhgJSzfcb5EFDzFOHNr2dr';

export async function showCityTourSaltaInfo(sock, from, conversationState) {
    // 1. Enviar imagen primero
    await sendImage(sock, from, CITY_TOUR_IMAGE_URL, '⛪️ City Tour - Salta');
    
    // 2. Enviar información detallada
    const cityTourText = `⛪️ *CITY TOUR – SALTA* 🏬

Salta enamora por su hospitalidad, su gente y la arquitectura colonial de sus edificios.

La excursión comienza en la Plaza 9 de Julio, rodeada por la Catedral Basílica de Salta, el Cabildo Histórico, el Museo de Arqueología de Alta Montaña (MAAM) y la ex Casa de Gobierno.

📍 Continuamos hacia el este para observar la imponente Iglesia San Francisco, con la torre más alta de Sudamérica (54 m) ⛪
📍 Visita al Convento San Bernardo
📍 Ascenso al Cerro San Bernardo, desde donde se obtienen las mejores vistas panorámicas del Valle de Lerma 🌄
📍 Monumentos al Gral. Martín Miguel de Güemes y al 20 de febrero
📍 Recorrido por San Lorenzo, villa veraniega y su quebrada 🌿
📍 Finalizamos en el Mercado Artesanal, ideal para compras y souvenirs 🛍️

🛣️ *Recorrido:* 100 km
⏱️ *Duración:* 4 horas
🕓 *Salida:* 16:00 hs

💰 *Precio por persona:* $35.000`;

    await sendMessage(sock, from, cityTourText);
    
    // 3. Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir más información sobre paquetes y precios?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_CITY_TOUR',
        data: {}
    };
}

export async function handleCityTourSaltaResponse(sock, from, text, conversationState) {
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
                    destino: 'City Tour - Salta'
                });
                console.log('✅ Consulta guardada en Google Sheets (City Tour Salta)');
            } catch (sheetError) {
                console.error('⚠️ Error guardando en Sheets, pero continuamos:', sheetError);
            }
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos a la brevedad al correo *${user.correo}* o al teléfono *${userId}* registrado con toda la información sobre el City Tour en Salta.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *El Peregrino viajes y turismo*! ⛪️✨`);
            
            console.log(`📊 Lead generado - City Tour Salta: ${user.nombre} (${user.correo})`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

Si en algún momento te interesa conocer Salta con nuestro City Tour, no dudes en contactarnos.

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
