// ==========================================
// MENU PRINCIPAL - División Receptivo/Emisivo
// ==========================================
import { sendMessage } from '../utils/utils.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function showMenuPrincipal(sock, from, conversationState) {
    const menuText = `🌍 *El Peregrino viajes y turismo* 🌍

¿Qué tipo de experiencia estás buscando?

🏔️ *1. Receptivo - Conocer el Norte Argentino*
   Descubre la magia de Salta, Jujuy y toda la región 🌄

✈️ *2. Emisivo - Viajes al Exterior*
   Explora el mundo con nuestros paquetes internacionales 🌎

📍 *3. Ubicación y Contacto*
   Encuentra nuestra agencia 📞

✍️ Escribe el *número* de la opción que te interesa. Ó escribe *Volver* para regresar al menu anterior.`;

    await sendMessage(sock, from, menuText);
    
    conversationState[from] = {
        step: 'MENU_PRINCIPAL',
        data: {}
    };
}

export async function handleMenuPrincipalSelection(sock, from, text, conversationState) {
    const option = text.trim();

    switch (option) {
        case '1':
            // Ir a menú RECEPTIVO
            const { showMenuReceptivo } = await import('./menuReceptivo.js');
            await showMenuReceptivo(sock, from, conversationState);
            break;

        case '2':
            // Ir a menú EMISIVO
            const { showMenuEmisivo } = await import('./menuEmisivo.js');
            await showMenuEmisivo(sock, from, conversationState);
            break;

        case '3':
            // Mostrar ubicación
            const ubicacionPath = path.join(__dirname, '../mensajes/ubicacion.txt');
            const ubicacionText = fs.readFileSync(ubicacionPath, 'utf-8');
            await sendMessage(sock, from, ubicacionText);
            // Mantener el estado para que pueda volver
            conversationState[from] = {
                step: 'UBICACION',
                data: { previousMenu: 'MENU_PRINCIPAL' }
            };
            break;

        default:
            await sendMessage(sock, from, '⚠️ Respuesta no válida. Por favor selecciona una de las opciones (1-3).');
            await showMenuPrincipal(sock, from, conversationState);
            break;
    }
}
