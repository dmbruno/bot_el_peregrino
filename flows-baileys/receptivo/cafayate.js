// ==========================================
// VALLES CALCHAQUÍES - CAFAYATE - Turismo Receptivo
// ==========================================
import { sendMessage, sendImage, getUserByPhone } from '../../utils/utils.js';
import { agregarConsultaReceptivo } from '../../utils/googleSheets.js';

// URL de la imagen en Google Drive (formato directo de descarga)
const CAFAYATE_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=1eqV0R_dcPJgCs-4pAMfsx-_kkeFcZMpI';

export async function showCafayateInfo(sock, from, conversationState) {
    // 1. Enviar imagen primero
    await sendImage(sock, from, CAFAYATE_IMAGE_URL, '🍷 Valles Calchaquíes - Cafayate');
    
    // 2. Enviar información detallada
    const cafayateText = `� *CAFAYATE* 🍷

La excursión comienza en Salta, recorriendo la Ruta Nacional 68 y atravesando el Valle de Lerma, con localidades como Cerrillos, La Merced, El Carril y La Viña.

Luego ingresamos a la impactante Quebrada de las Conchas, donde el agua y el viento esculpieron formaciones naturales como La Garganta del Diablo, El Anfiteatro, El Sapo, El Fraile, Los Castillos y Las Ventanas.

📍 Llegamos a Cafayate, en los Valles Calchaquíes, tierra del sol y del buen vino.

✔️ Visita a la Bodega Vasija Secreta con degustación 🍷
✔️ 2 horas libres para almorzar 🍽️ y recorrer la ciudad

🛣️ *Recorrido:* 390 km
⏱️ *Duración:* 12 horas
🕖 *Salida:* 7:00 a.m.

� *Precio por persona:* $49.000`;

    await sendMessage(sock, from, cafayateText);
    
    // 3. Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir más información sobre paquetes y precios?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_CAFAYATE',
        data: {}
    };
}

export async function handleCafayateResponse(sock, from, text, conversationState) {
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
                    destino: 'Cafayate - Valles Calchaquíes'
                });
                console.log('✅ Consulta guardada en Google Sheets (Cafayate)');
            } catch (sheetError) {
                console.error('⚠️ Error guardando en Sheets, pero continuamos:', sheetError);
            }
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos a la brevedad al correo *${user.correo}* o al teléfono *${userId}* registrado con toda la información sobre los Valles Calchaquíes.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *Agencia del Peregrino viajes y turismo*! 🍷✨`);
            
            console.log(`📊 Lead generado - Cafayate: ${user.nombre} (${user.correo})`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

Si en algún momento te interesa conocer los Valles Calchaquíes, no dudes en contactarnos.

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
