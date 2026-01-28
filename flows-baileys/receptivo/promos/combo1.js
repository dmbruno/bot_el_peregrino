// ==========================================
// COMBO 1: Cafayate + Cachi + Humahuaca
// ==========================================
import { sendMessage, getUserByPhone } from '../../../utils/utils.js';
import { agregarConsultaReceptivo } from '../../../utils/googleSheets.js';

export async function showCombo1Info(sock, from, conversationState) {
    const combo1Text = `🌟 *PROMO COMBO COMPLETO* 🌟

📍 *Destinos incluidos:*
🍷 Valles Calchaquíes - Cafayate
   • Quebrada de las Conchas
   • Bodegas y degustación de vinos

🌵 Cachi
   • Cuesta del Obispo
   • Recta Tin Tin
   • Parque Nacional Los Cardones

🌈 Quebrada de Humahuaca
   • Purmamarca y Cerro de 7 Colores
   • Tilcara
   • Humahuaca

✨ *Incluye:*
• 3 excursiones de día completo
• Transporte en cada excursión
• Guías especializados

💰 *Precio por persona:* $125.000

⏱️ *Duración sugerida:* 3-4 días en Salta

📌 *Nota:* No incluye alojamiento ni comidas. Cada excursión se realiza en días diferentes.`;

    await sendMessage(sock, from, combo1Text);
    
    // Preguntar si está interesado
    await sendMessage(sock, from, '💰 ¿Te interesa recibir más información sobre este combo?\n\n✍️ Escribí *SÍ* o *NO*');
    
    conversationState[from] = {
        step: 'ESPERANDO_CONFIRMACION_COMBO1',
        data: {}
    };
}

export async function handleCombo1Response(sock, from, text, conversationState) {
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
            
            // Guardar en Google Sheets (pestaña Receptivo)
            try {
                await agregarConsultaReceptivo({
                    nombre: user.nombre,
                    telefono: userId,
                    correo: user.correo,
                    destino: 'PROMO: Cafayate + Cachi + Humahuaca'
                });
                console.log('✅ Consulta guardada en Google Sheets (Combo 1)');
            } catch (sheetError) {
                console.error('⚠️ Error guardando en Sheets, pero continuamos:', sheetError);
            }
            
            await sendMessage(sock, from, `✅ ¡Perfecto *${primerNombre}*! 

Te contactaremos a la brevedad al correo *${user.correo}* o al teléfono *${userId}* registrado con toda la información sobre el combo Cafayate + Cachi + Humahuaca.

📞 También podés llamarnos directamente:
• Fijo: 3884291903
• Celular: 3874029503

¡Muchas gracias por confiar en *El Peregrino viajes y turismo*! 🌟✨`);
            
            console.log(`📊 Lead generado - Combo 1: ${user.nombre} (${user.correo})`);
            
            delete conversationState[from];
            
        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            await sendMessage(sock, from, '⚠️ Hubo un error. Por favor, intenta nuevamente más tarde.');
            delete conversationState[from];
        }
        
    } else if (response === 'NO') {
        // Usuario no interesado - despedida amable
        await sendMessage(sock, from, `Entendido, gracias por tu tiempo. 😊

Si en algún momento te interesa este combo u otras opciones, no dudes en contactarnos.

✍️ Escribí *menu* o *hola* cuando quieras volver a interactuar con nosotros.

¡Que tengas un excelente día! 🌟`);
        
        delete conversationState[from];
        
    } else {
        // Respuesta no válida
        await sendMessage(sock, from, '⚠️ Por favor, escribí *SÍ* o *NO* para continuar.');
    }
}
