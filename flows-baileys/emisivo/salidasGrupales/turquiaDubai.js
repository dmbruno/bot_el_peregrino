// ==========================================
// TURQUÍA Y DUBAI - Turismo Emisivo
// ==========================================
import { sendMessage, sendImage, getUserByPhone } from '../../../utils/utils.js';
import { agregarConsultaPaquete } from '../../../utils/googleSheets.js';

// URL de la imagen en Google Drive (formato directo de descarga)
const TURQUIA_DUBAI_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=1LCcN88mfeJ5mIKgjZIjYEi956tNY7oiC';

export async function showTurquiaDubaiInfo(sock, from, conversationState) {
    // 1. Enviar imagen primero
    await sendImage(sock, from, TURQUIA_DUBAI_IMAGE_URL, '🕌 Turquía y Dubai');
    
    // 2. Enviar información detallada
    const turquiaDubaiText = `🕌 *TURQUÍA Y DUBAI* 🌆

Un viaje fascinante entre Oriente y Medio Oriente, combinando historia milenaria, paisajes únicos y el lujo moderno de Dubái

✈️ *Salida grupal con Turkish Airlines*
📍 *Salida:* Buenos Aires
🗓 *Duración:* 15 días / 14 noches

📍 *Ciudades a visitar:*
Estambul – Ankara – Capadocia – Pamukkale – Kusadasi / Izmir – Canakkale – Dubái

🏨 *Alojamiento:*
14 noches con desayuno
• 4 Estambul
• 1 Ankara
• 2 Capadocia
• 1 Pamukkale
• 1 Kusadasi o Izmir
• 1 Canakkale
• 4 Dubái

💰 *Tarifas por persona:*
🔹 *Salida 04/04/2026*
• Doble: USD 2.410 + USD 1.290 de impuestos
• Single: USD 3.450 + USD 1.290 de impuestos

🔹 *Salidas 04/05/2026 y 08/06/2026*
• Doble: USD 2.430 + USD 1.290 de impuestos
• Single: USD 3.320 + USD 1.290 de impuestos

📌 Adicionar gastos administrativos e IVA (4,3%)

✨ *El paquete incluye:*
✔️ Aéreo internacional con Turkish Airlines desde Buenos Aires
✔️ Traslados y recorrido completo según programa
✔️ 14 noches de alojamiento con desayuno
✔️ 6 comidas incluidas
✔️ Guía de habla hispana durante todo el circuito
✔️ Entradas, visitas y comidas según itinerario
✔️ Coordinador permanente
✔️ Asistencia al viajero
 • Hasta 70 años incluida
 • 71 a 85 años: USD 55 adicionales
 • Desde 86 años: USD 100 adicionales
✔️ Kit de viaje (riñonera, marbete y guía)

📌 *Importante:*
• Cupos limitados
• Tarifas sujetas a modificación
• Salida grupal acompañada

✨ Viví Turquía y Dubái en un viaje inolvidable ✨`;

    await sendMessage(sock, from, turquiaDubaiText);
    
    // 3. Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir más información sobre este paquete?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_TURQUIA_DUBAI',
        data: {}
    };
}

export async function handleTurquiaDubaiResponse(sock, from, text, conversationState) {
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
                    paquete: 'Turquía y Dubai 2026'
                });
                console.log('✅ Interés en Turquía y Dubai guardado en Google Sheets (Paquetes)');
            } catch (error) {
                console.error('❌ Error al guardar interés en Google Sheets:', error.message);
            }

            const primerNombre = user.nombre.split(' ')[0];
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos a la brevedad al correo *${user.correo}* o al teléfono *${userId}* registrado con toda la información sobre el paquete a Turquía y Dubai.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *El Peregrino viajes y turismo*! 🕌✨`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

Si en algún momento te interesa viajar a Turquía y Dubai, no dudes en contactarnos.

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
