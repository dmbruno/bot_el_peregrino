// ==========================================
// PERÚ LEGENDARIO - Turismo Emisivo
// ==========================================
import { sendMessage, sendImage, getUserByPhone } from '../../../utils/utils.js';
import { agregarConsultaPaquete } from '../../../utils/googleSheets.js';

// URL de la imagen en Google Drive (formato directo de descarga)
const PERU_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=1kDencZ6bfnKG-JaC5AVUPgdkZm4LEy5U';

export async function showPeruInfo(sock, from, conversationState) {
    // 1. Enviar imagen primero
    await sendImage(sock, from, PERU_IMAGE_URL, '🇵🇪 Perú Legendario');
    
    // 2. Enviar información detallada
    const peruText = `🇵🇪 *PERÚ LEGENDARIO* 🏔️

Un viaje inolvidable para descubrir la historia, cultura y paisajes más emblemáticos del Perú.
Desde el místico Valle Sagrado de los Incas hasta la imponente Machu Picchu, finalizando en la vibrante Lima, combinando arqueología, tradición y gastronomía.

📍 *Cusco & Valle Sagrado*
✔️ Chinchero y Museo Vivo de Yucay
✔️ Fortaleza de Ollantaytambo
✔️ Urubamba y experiencias culturales

📍 *Machu Picchu*
✔️ Visita guiada a la ciudadela
✔️ Tren turístico ida y vuelta

📍 *Cusco*
✔️ City tour y sitios arqueológicos: Coricancha, Catedral, Sacsayhuamán, Qenqo, Puca Pucara y Tambomachay

📍 *Lima*
✔️ Centro Histórico, Casa Aliaga y Museo Larco
✔️ Malecón de Miraflores y Barranco
✔️ Experiencia gastronómica peruana

🛫 *Salida:* 10/06/2026 – Desde Salta
🗓️ *Duración:* 8 días / 7 noches

🏨 *Alojamiento con desayuno:*
• 2 noches en Urubamba
• 1 noche en Machu Picchu
• 2 noches en Cusco
• 2 noches en Lima (con late check out)

🎟️ *Incluye:*
✔️ Aéreos Salta – Cusco – Lima – Salta (LATAM)
✔️ Equipaje de mano + equipaje en bodega
✔️ Traslados y excursiones con entradas
✔️ Guías locales
✔️ Comidas incluidas según itinerario
✔️ Acompañamiento garantizado
✔️ Asistencia al viajero hasta USD 150.000
✔️ Regalo de bienvenida y módem de internet para el grupo

💰 *Precio:* USD 2.499

👉 Consultar opciones de pago y disponibilidad
👉 Opción doble a compartir garantizada`;

    await sendMessage(sock, from, peruText);
    
    // 3. Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir más información sobre este paquete?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_PERU',
        data: {}
    };
}

export async function handlePeruResponse(sock, from, text, conversationState) {
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
                    paquete: 'Perú Legendario 2026'
                });
                console.log('✅ Interés en Perú Legendario guardado en Google Sheets (Paquetes)');
            } catch (error) {
                console.error('❌ Error al guardar interés en Google Sheets:', error.message);
            }

            const primerNombre = user.nombre.split(' ')[0];
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos a la brevedad al correo *${user.correo}* o al teléfono *${userId}* registrado con toda la información sobre el paquete a Perú Legendario.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *El Peregrino viajes y turismo*! 🇵🇪✨`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

Si en algún momento te interesa viajar a Perú, no dudes en contactarnos.

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
