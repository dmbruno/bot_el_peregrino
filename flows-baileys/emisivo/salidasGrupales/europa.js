// ==========================================
// EUROPA CLÁSICA - Turismo Emisivo
// ==========================================
import { sendMessage, sendImage, getUserByPhone } from '../../../utils/utils.js';
import { agregarConsultaPaquete } from '../../../utils/googleSheets.js';

// URL de la imagen en Google Drive (formato directo de descarga)
const EUROPA_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=1GhwWmw6yKcdCBvxf8pFg6bq9vI6kLARn';

export async function showEuropaInfo(sock, from, conversationState) {
    // 1. Enviar imagen primero
    await sendImage(sock, from, EUROPA_IMAGE_URL, '🌍 Europa Clásica');
    
    // 2. Enviar información detallada
    const europaText = `🌍 *VIVÍ EUROPA COMO SIEMPRE LA SOÑASTE* ✨

Te invitamos a recorrer las ciudades más icónicas del continente en una salida grupal desde Salta, con todo organizado para que solo te dediques a disfrutar 💫

✈️ *EUROPA CLÁSICA DESDE SALTA – 2026*

📅 *Salida:* 26 de abril de 2026
📅 *Regreso:* 12 de mayo de 2026
🗓 *Duración:* 17 días / 14 noches

📍 *Itinerario:*
Madrid – Zaragoza – Barcelona – Costa Azul – Pisa – Roma – Florencia – Venecia – Annemasse – París – Lourdes – San Sebastián – Madrid

🏨 *El paquete incluye:*
✔️ Pasaje aéreo internacional desde Salta (Latam + Iberia)
✔️ Equipaje en bodega 23 kg + equipaje de mano
✔️ Traslados aeropuerto / hotel / aeropuerto
✔️ 14 noches de alojamiento con desayuno
✔️ Guía acompañante en español durante todo el recorrido
✔️ Visitas panorámicas en las principales ciudades
✔️ Seguro de asistencia médica

⚠️ Consultar suplemento para mayores de 75 años

💰 *Precio por persona:*
🔹 Base doble: USD 5.100 + USD 163 de impuestos
🔹 Single: USD 6.100 + USD 210 de impuestos

💳 *Formas de pago:*
🔐 Seña: USD 500
💵 Refuerzo: USD 2.000 (26/01/2026)
✅ Saldo: 45 días antes de la salida

👉 Posibilidad de abonar en pesos argentinos (con percepciones vigentes)

📌 *Importante:*
Cupos limitados · Salida garantizada · Tarifas sujetas a modificación hasta el momento de la emisión

✨ Europa te espera ✨`;

    await sendMessage(sock, from, europaText);
    
    // 3. Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir más información sobre este paquete?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_EUROPA',
        data: {}
    };
}

export async function handleEuropaResponse(sock, from, text, conversationState) {
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

            // Guardar en Google Sheets (Paquetes)
            try {
                await agregarConsultaPaquete({
                    nombre: user.nombre,
                    telefono: userId,
                    correo: user.correo,
                    paquete: 'Europa Clásica 2026'
                });
                console.log('✅ Interés en Europa guardado en Google Sheets (Paquetes)');
            } catch (error) {
                console.error('❌ Error al guardar interés en Google Sheets:', error.message);
            }

            const primerNombre = user.nombre.split(' ')[0];
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos a la brevedad al correo *${user.correo}* o al teléfono *${userId}* registrado con toda la información sobre el paquete a Europa Clásica.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *El Peregrino viajes y turismo*! 🌍✨`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

Si en algún momento te interesa viajar a Europa, no dudes en contactarnos.

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
