// ==========================================
// HUMAHUACA + SERRANÍAS DE HORNOCAL - Turismo Receptivo
// ==========================================
import { sendMessage, sendImage, getUserByPhone } from '../../utils/utils.js';
import { agregarConsultaReceptivo } from '../../utils/googleSheets.js';

// URL de la imagen en Google Drive (formato directo de descarga)
const HORNOCAL_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=140hcVM1W2pulFeyY34XlCBepdWtIS_dx';

export async function showHornocalInfo(sock, from, conversationState) {
    // 1. Enviar imagen primero
    await sendImage(sock, from, HORNOCAL_IMAGE_URL, '🚵‍♀️ Humahuaca + Serranías de Hornocal');
    
    // 2. Enviar información detallada
    const hornocalText = `🚵‍♀️ *HUMAHUACA + SERRANÍAS DE HORNOCAL* 🌈

La excursión comienza en Salta, viajando hacia Purmamarca y continuando por Huacalera y Uquía, hasta llegar a Humahuaca (2.600 m s. n. m.).

Durante el recorrido, contamos con el acompañamiento de guías locales, quienes comparten la historia y cultura del pueblo con gran detalle.

📍 Desde Humahuaca, partimos por la Ruta Provincial 73 (camino de ripio consolidado), pasando por El Cementerio y Coctaca, antiguas terrazas de cultivo sobre los cerros 🌾
📍 Ascendemos hasta Aparzo (4.000 m s. n. m.), tomando un tramo de camino comunal
📍 Llegada al imponente Hornocal, una cadena montañosa de múltiples colores 🌈, visible en su máximo esplendor cuando el sol la ilumina de frente, creando un cuadro natural único

Luego emprendemos el regreso por el mismo camino, recorriendo nuevamente la Quebrada de Humahuaca, declarada Patrimonio Histórico y Cultural de la Humanidad por la UNESCO (2003).

🛣️ *Recorrido:* 570 km
⏱️ *Duración:* 13 horas
🕖 *Salida:* 6 am

💰 *Precio por persona:* $99.000`;

    await sendMessage(sock, from, hornocalText);
    
    // 3. Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir más información sobre paquetes y precios?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_HORNOCAL',
        data: {}
    };
}

export async function handleHornocalResponse(sock, from, text, conversationState) {
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
                    destino: 'Humahuaca + Serranías de Hornocal'
                });
                console.log('✅ Consulta guardada en Google Sheets (Hornocal)');
            } catch (sheetError) {
                console.error('⚠️ Error guardando en Sheets, pero continuamos:', sheetError);
            }
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos a la brevedad al correo *${user.correo}* o al teléfono *${userId}* registrado con toda la información sobre Humahuaca y Hornocal.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *Agencia del Peregrino viajes y turismo*! 🌈✨`);
            
            console.log(`📊 Lead generado - Hornocal: ${user.nombre} (${user.correo})`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

Si en algún momento te interesa conocer las Serranías de Hornocal, no dudes en contactarnos.

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
