// ==========================================
// TREN A LAS NUBES - Turismo Receptivo
// ==========================================
import { sendMessage, sendImage, getUserByPhone } from '../../utils/utils.js';
import { agregarConsultaReceptivo } from '../../utils/googleSheets.js';

// URL de la imagen en Google Drive (formato directo de descarga)
const TREN_NUBES_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=19fndfJSSEnzR0Pi3PU0dZ5qPJVH20Rsv';

export async function showTrenNubesInfo(sock, from, conversationState) {
    // 1. Enviar imagen primero
    await sendImage(sock, from, TREN_NUBES_IMAGE_URL, '🚂 Tren a las Nubes');
    
    // 2. Enviar información detallada
    const trenNubesText = `🚂 *TREN A LAS NUBES (modalidad bus + tren)* ⛰️

La excursión comienza muy temprano desde la ciudad de Salta, viajando en vehículo turístico hacia el norte, recorriendo la imponente Quebrada del Toro, entre paisajes precordilleranos y paradas culturales.

📍 Campo Quijano, primer pueblo ferroviario
📍 El Alfarcito, parada para desayuno regional y feria de productos locales 🥐
📍 Quebrada del Toro, con vistas del Viaducto El Toro
📍 Santa Rosa de Tastil (parada opcional, según operador)
📍 Llegada a San Antonio de los Cobres (aprox. 10:30 / 11:00 hs)

🚂 *Tramo ferroviario – Tren a las Nubes*
✔️ Embarque en San Antonio de los Cobres
✔️ Recorrido de aprox. 18 km hasta el Viaducto La Polvorilla
✔️ Parada a 4.200 m s. n. m., tiempo para bajar, sacar fotos 📸 y disfrutar de una experiencia única en altura

Luego se emprende el regreso a Salta por el mismo camino, finalizando la excursión por la tarde/noche.

🛣️ *Recorrido:* 320 km
⏱️ *Duración:* día completo
🕕 *Salida:* entre 6:00 y 7:00 a.m.

💰 *Precio por persona:* Consultar disponibilidad`;

    await sendMessage(sock, from, trenNubesText);
    
    // 3. Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir más información sobre paquetes y precios?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_TREN_NUBES',
        data: {}
    };
}

export async function handleTrenNubesResponse(sock, from, text, conversationState) {
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
                    destino: 'Tren a las Nubes'
                });
                console.log('✅ Consulta guardada en Google Sheets (Tren a las Nubes)');
            } catch (sheetError) {
                console.error('⚠️ Error guardando en Sheets, pero continuamos:', sheetError);
            }
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos a la brevedad al correo *${user.correo}* o al teléfono *${userId}* registrado con toda la información sobre el Tren a las Nubes.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *Agencia del Peregrino viajes y turismo*! 🚂✨`);
            
            console.log(`📊 Lead generado - Tren a las Nubes: ${user.nombre} (${user.correo})`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

Si en algún momento te interesa vivir la experiencia del Tren a las Nubes, no dudes en contactarnos.

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
