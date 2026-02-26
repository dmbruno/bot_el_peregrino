// ==========================================
// COTIZACIÓN PERSONALIZADA - Emisivo
// ==========================================
import { sendMessage } from '../../utils/utils.js';
import { agregarConsultaEmisivo } from '../../utils/googleSheets.js';

export async function showCotizacionInfo(sock, from, conversationState) {
    const cotizacionText = `💰 *SOLICITAR COTIZACIÓN PERSONALIZADA* 💰

¡Armamos tu viaje soñado! ✈️

Te haremos unas preguntas para asesorarte mejor y crear la cotización perfecta para tu viaje. 🌍

🌍 *Primera pregunta:*

¿A dónde te gustaría viajar?

_Indicanos el destino o si tenés alguna otra opción._

_Ejemplo: Brasil, Cancún, Europa_`;

    await sendMessage(sock, from, cotizacionText);
    
    conversationState[from] = {
        step: 'COTIZACION_LUGAR',
        data: {}
    };
}

export async function handleCotizacionResponse(sock, from, text, conversationState, nombre, telefono, correo) {
    const state = conversationState[from];
    
    switch (state.step) {
        case 'COTIZACION_LUGAR':
            state.data.lugar = text.trim();
            state.step = 'COTIZACION_PERSONAS';
            
            await sendMessage(sock, from, `✅ Perfecto: ${state.data.lugar}

👥 *Segunda pregunta:*

¿Cuántas personas van a viajar?

_Indicá si hay menores, cuántos y de qué edades._

_Ejemplo: 2 adultos y 1 menor de 13 años_`);
            break;

        case 'COTIZACION_PERSONAS':
            state.data.personas = text.trim();
            state.step = 'COTIZACION_FECHA';
            
            await sendMessage(sock, from, `✅ Perfecto: ${state.data.personas}

📅 *Tercera pregunta:*

¿En qué *fecha aproximada* querés viajar?

_Ejemplo: Marzo, del 15 al 25_`);
            break;

        case 'COTIZACION_FECHA':
            state.data.fecha = text.trim();
            state.step = 'COTIZACION_DIAS';
            
            await sendMessage(sock, from, `✅ Perfecto: ${state.data.fecha}

📆 *Última pregunta:*

¿Cuántos días aproximados querés viajar?

_Ejemplo: 10 días o una semana_`);
            break;

        case 'COTIZACION_DIAS':
            state.data.dias = text.trim();
            
            // Guardar en Google Sheets
            try {
                await agregarConsultaEmisivo({
                    nombre: nombre,
                    telefono: telefono,
                    correo: correo,
                    cantidadPersonas: state.data.personas,
                    lugar: state.data.lugar,
                    fechaViaje: state.data.fecha,
                    cantidadDias: state.data.dias
                });
                console.log('✅ Consulta de cotización guardada en Google Sheets (Emisivo)');
            } catch (error) {
                console.error('❌ Error al guardar consulta de cotización en Google Sheets:', error.message);
            }
            
            // Mensaje final
            await sendMessage(sock, from, `✅ *¡Listo! Recibimos tu solicitud de cotización* ✈️

📝 *Resumen de tu consulta:*

🌍 Destino: ${state.data.lugar}
👥 Personas: ${state.data.personas}
📅 Fecha: ${state.data.fecha}
📆 Duración: ${state.data.dias}

🎯 Un asesor de *Agencia del Peregrino viajes y turismo* revisará tu solicitud y se comunicará contigo a la brevedad con la mejor cotización personalizada.

📞 También podés contactarnos directamente:
• WhatsApp: 3874029503
• Teléfono: 3884291903

¡Gracias por confiar en nosotros para tu próximo viaje! 🌟`);
            
            delete conversationState[from];
            break;
    }
}
