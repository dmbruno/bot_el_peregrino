// ==========================================
// CONVERSATION HANDLER - Manejo de estados de conversación
// ==========================================
import { getUserByPhone, saveUser, saveConsulta, sendMessage } from '../utils/utils.js';
import { showMenuPrincipal, handleMenuPrincipalSelection } from '../flows-baileys/menuPrincipal.js';
import { handleMenuReceptivoSelection } from '../flows-baileys/menuReceptivo.js';
import { handleMenuEmisivoSelection } from '../flows-baileys/menuEmisivo.js';
import { handleSalidasGrupalesSelection } from '../flows-baileys/emisivo/salidasGrupales/salidasGrupales.js';
import { handleAdminSelection } from './adminHandler.js';
import { handleCafayateResponse } from '../flows-baileys/receptivo/cafayate.js';
import { handleCachiResponse } from '../flows-baileys/receptivo/cachi.js';
import { handleIruyaResponse } from '../flows-baileys/receptivo/iruya.js';
import { handleHumahuacaResponse } from '../flows-baileys/receptivo/humahuaca.js';
import { handlePurmamarcaResponse } from '../flows-baileys/receptivo/purmamarca.js';
import { handleHornocalResponse } from '../flows-baileys/receptivo/hornocal.js';
import { handleCityTourSaltaResponse } from '../flows-baileys/receptivo/cityTourSalta.js';
import { handleTrenNubesResponse } from '../flows-baileys/receptivo/trenNubes.js';
import { handlePromosReceptivoResponse } from '../flows-baileys/receptivo/promos/promosReceptivo.js';
import { handleCombo1Response } from '../flows-baileys/receptivo/promos/combo1.js';
import { handleCombo2Response } from '../flows-baileys/receptivo/promos/combo2.js';
import { handleCotizacionResponse } from '../flows-baileys/emisivo/cotizacion.js';
import { handlePromosResponse } from '../flows-baileys/emisivo/promos/promos.js';
import { handleCamboriuResponse } from '../flows-baileys/emisivo/promos/camboriu.js';
import { handlePeruResponse } from '../flows-baileys/emisivo/salidasGrupales/peru.js';
import { handleEuropaResponse } from '../flows-baileys/emisivo/salidasGrupales/europa.js';
import { handleTurquiaDubaiResponse } from '../flows-baileys/emisivo/salidasGrupales/turquiaDubai.js';

export async function handleConversationState(sock, from, text, conversationState) {
    const state = conversationState[from];
    const userId = from.split('@')[0];
    const normalizedText = text.toLowerCase().trim();

    // Permitir salir al menú en cualquier momento
    if (normalizedText === 'menu' || normalizedText === 'menú') {
        await sendMessage(sock, from, '🔄 Entendido, volvamos al menú principal...');
        delete conversationState[from];
        await showMenuPrincipal(sock, from, conversationState);
        return;
    }

    switch (state.step) {
        case 'ESPERANDO_NOMBRE':
            const nombre = text.trim();
            
            if (nombre.length < 2) {
                await sendMessage(sock, from, '⚠️ Ingresa un nombre válido:');
                return;
            }

            state.data.nombre = nombre;
            state.step = 'ESPERANDO_CORREO';
            
            await sendMessage(sock, from, 'Perfecto! Ahora tu *correo electrónico*:');
            break;

        case 'ESPERANDO_CORREO':
            const correo = text.trim();
            
            if (!correo.includes('@')) {
                await sendMessage(sock, from, '⚠️ Ingresa un correo válido:');
                return;
            }

            // Guardar en base de datos
            try {
                await saveUser(userId, state.data.nombre, correo);
                
                const primerNombre = state.data.nombre.split(' ')[0];
                await sendMessage(sock, from, `✅ ¡Gracias *${primerNombre}*! Te has registrado exitosamente.`);
                
                // Limpiar estado
                delete conversationState[from];
                
                // Mostrar menú
                await showMenuPrincipal(sock, from, conversationState);
                
            } catch (error) {
                console.error('Error guardando usuario:', error);
                await sendMessage(sock, from, '⚠️ Hubo un error al registrar tus datos. Intenta nuevamente escribiendo *hola*.');
                delete conversationState[from];
            }
            break;

        case 'MENU_PRINCIPAL':
            await handleMenuPrincipalSelection(sock, from, text, conversationState);
            break;

        case 'MENU_RECEPTIVO':
            await handleMenuReceptivoSelection(sock, from, text, conversationState);
            break;

        case 'MENU_EMISIVO':
            await handleMenuEmisivoSelection(sock, from, text, conversationState);
            break;

        case 'MENU_SALIDAS_GRUPALES':
            await handleSalidasGrupalesSelection(sock, from, text, conversationState);
            break;

        case 'UBICACION':
            // Si escribe "volver" desde ubicación, regresar al menú principal
            if (normalizedText === 'volver') {
                await showMenuPrincipal(sock, from, conversationState);
            } else {
                await sendMessage(sock, from, '⚠️ Escribe *Volver* para regresar al menú anterior.');
            }
            break;

        case 'GUARDERIA':
            // Si escribe "volver" desde guardería, regresar al menú principal
            if (normalizedText === 'volver') {
                await showMenuPrincipal(sock, from, conversationState);
            } else {
                await sendMessage(sock, from, '⚠️ Escribe *Volver* para regresar al menú anterior.');
            }
            break;

        case 'VISITA_OFICINA':
            // Si escribe "volver" desde visita oficina, regresar al menú principal
            if (normalizedText === 'volver') {
                await showMenuPrincipal(sock, from, conversationState);
            } else {
                await sendMessage(sock, from, '⚠️ Escribe *Volver* para regresar al menú anterior.');
            }
            break;

        // Estados RECEPTIVO
        case 'ESPERANDO_CONFIRMACION_CAFAYATE':
            await handleCafayateResponse(sock, from, text, conversationState);
            break;

        case 'ESPERANDO_CONFIRMACION_CACHI':
            await handleCachiResponse(sock, from, text, conversationState);
            break;

        case 'ESPERANDO_CONFIRMACION_IRUYA':
            await handleIruyaResponse(sock, from, text, conversationState);
            break;

        case 'MENU_PROMOS_RECEPTIVO':
            await handlePromosReceptivoResponse(sock, from, text, conversationState);
            break;

        case 'ESPERANDO_CONFIRMACION_COMBO1':
            await handleCombo1Response(sock, from, text, conversationState);
            break;

        case 'ESPERANDO_CONFIRMACION_COMBO2':
            await handleCombo2Response(sock, from, text, conversationState);
            break;

        case 'ESPERANDO_CONFIRMACION_HUMAHUACA':
            await handleHumahuacaResponse(sock, from, text, conversationState);
            break;

        case 'ESPERANDO_CONFIRMACION_PURMAMARCA':
            await handlePurmamarcaResponse(sock, from, text, conversationState);
            break;

        case 'ESPERANDO_CONFIRMACION_HORNOCAL':
            await handleHornocalResponse(sock, from, text, conversationState);
            break;

        case 'ESPERANDO_CONFIRMACION_CITY_TOUR':
            await handleCityTourSaltaResponse(sock, from, text, conversationState);
            break;

        case 'ESPERANDO_CONFIRMACION_TREN_NUBES':
            await handleTrenNubesResponse(sock, from, text, conversationState);
            break;

        // Estados EMISIVO
        case 'COTIZACION_LUGAR':
        case 'COTIZACION_PERSONAS':
        case 'COTIZACION_FECHA':
        case 'COTIZACION_DIAS':
            try {
                const user = await getUserByPhone(userId);
                
                if (!user) {
                    await sendMessage(sock, from, '⚠️ No encontramos tu registro. Por favor, escribe *menu* para volver al menú principal.');
                    delete conversationState[from];
                    return;
                }

                await handleCotizacionResponse(sock, from, text, conversationState, user.nombre, userId, user.correo);
            } catch (error) {
                console.error('❌ Error obteniendo datos de usuario para cotización:', error);
                await sendMessage(sock, from, '⚠️ Ocurrió un problema. Por favor, intenta nuevamente escribiendo *menu*.');
                delete conversationState[from];
            }
            break;

        case 'MENU_PROMOS':
            await handlePromosResponse(sock, from, text, conversationState);
            break;

        case 'ESPERANDO_CONFIRMACION_CAMBORIU':
            await handleCamboriuResponse(sock, from, text, conversationState);
            break;

        case 'ESPERANDO_CONFIRMACION_PERU':
            await handlePeruResponse(sock, from, text, conversationState);
            break;

        case 'ESPERANDO_CONFIRMACION_EUROPA':
            await handleEuropaResponse(sock, from, text, conversationState);
            break;

        case 'ESPERANDO_CONFIRMACION_TURQUIA_DUBAI':
            await handleTurquiaDubaiResponse(sock, from, text, conversationState);
            break;

        case 'MENU':
            // Mantener por compatibilidad con flujos antiguos
            await handleMenuPrincipalSelection(sock, from, text, conversationState);
            break;

        case 'CONSULTA_PASAJEROS':
            state.data.pasajeros = text.trim();
            state.data.resumen += `👥 *Pasajeros:* ${text.trim()}\n`;
            state.step = 'CONSULTA_MESES';
            await sendMessage(sock, from, '📅 Perfecto, ¿en qué mes o meses estarías disponible para viajar? (Ejemplo: Enero, Febrero, etc.)\n\n💡 _Escribe *menu* en cualquier momento para volver al inicio._');
            break;

        case 'CONSULTA_MESES':
            state.data.meses_disponibles = text.trim();
            state.data.resumen += `📅 *Meses disponibles:* ${text.trim()}\n`;
            state.step = 'CONSULTA_DURACION';
            await sendMessage(sock, from, '⏳ ¿Cuántos días te gustaría viajar aproximadamente?\n\n💡 _Escribe *menu* en cualquier momento para volver al inicio._');
            break;

        case 'CONSULTA_DURACION':
            state.data.duracion = text.trim();
            state.data.resumen += `⏳ *Duración:* ${text.trim()} días\n`;
            state.step = 'CONSULTA_DESTINO';
            await sendMessage(sock, from, '🌍 ¿Cuál es tu destino preferido? ¿Tienes una segunda opción?\n\n💡 _Escribe *menu* en cualquier momento para volver al inicio._');
            break;

        case 'CONSULTA_DESTINO':
            state.data.destino = text.trim();
            state.data.resumen += `🌍 *Destino preferido:* ${text.trim()}\n`;
            
            try {
                const user = await getUserByPhone(userId);
                
                if (!user) {
                    await sendMessage(sock, from, '⚠️ No encontramos tu registro. Por favor, escribe *menu* para volver al menú principal.');
                    delete conversationState[from];
                    return;
                }

                const primerNombre = user.nombre.split(' ')[0];
                const resumenCompleto = `📄 Gracias por toda la información, *${primerNombre}*.

📝 Resumen de tu consulta:
${state.data.resumen}

✨ Nuestros agentes se comunicarán contigo pronto a tu correo: *${user.correo}*. ¡Gracias por elegirnos!`;

                await sendMessage(sock, from, resumenCompleto);
                await sendMessage(sock, from, '✨ Si necesitas algo más, escribe *menu* para volver al inicio.');

                await saveConsulta(user.id, state.data.pasajeros, state.data.meses_disponibles, state.data.duracion, state.data.destino);
                
                console.log('✅ Consulta guardada correctamente');
                delete conversationState[from];
                
            } catch (error) {
                console.error('❌ Error guardando consulta:', error);
                await sendMessage(sock, from, '⚠️ Ocurrió un problema guardando tu consulta. Por favor, inténtalo más tarde.');
                delete conversationState[from];
            }
            break;

        case 'ADMIN':
            await handleAdminSelection(sock, from, text, conversationState);
            break;

        default:
            delete conversationState[from];
            break;
    }
}
