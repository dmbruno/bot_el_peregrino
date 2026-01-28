// ==========================================
// MENU PRINCIPAL - División Receptivo/Emisivo
// ==========================================
import { sendMessage, sendImage } from '../utils/utils.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL de la imagen de guardería de equipaje
const GUARDERIA_IMAGE_URL = 'https://drive.google.com/uc?export=download&id=1lCp2I7Fri7_Upk6tj8mZvfSd3V4JJGjC';

export async function showMenuPrincipal(sock, from, conversationState) {
    const menuText = `🌍 *El Peregrino viajes y turismo* 🌍

¿Qué tipo de experiencia estás buscando?

🏔️ *1. Receptivo - Conocer el Norte Argentino*
   Descubre la magia de Salta, Jujuy y toda la región 🌄

✈️ *2. Emisivo - Viajes al Exterior*
   Explora el mundo con nuestros paquetes internacionales 🌎

🧳 *3. Guarda de Equipaje*
   Deja tu equipaje en nuestras manos 🔒

🏢 *4. Quiero ir por la oficina*
   Horarios y contacto para visitarnos 📍

📍 *5. Ubicación y Contacto*
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
            // Mostrar info de guarda de equipaje
            // 1. Enviar imagen primero
            await sendImage(sock, from, GUARDERIA_IMAGE_URL, '🧳 Guarda de Equipaje');
            
            // 2. Enviar texto informativo
            const guarderiaPath = path.join(__dirname, '../mensajes/guarderia.txt');
            const guarderiaText = fs.readFileSync(guarderiaPath, 'utf-8');
            await sendMessage(sock, from, guarderiaText);
            // Mantener el estado para que pueda volver
            conversationState[from] = {
                step: 'GUARDERIA',
                data: { previousMenu: 'MENU_PRINCIPAL' }
            };
            break;

        case '4':
            // Mostrar info de visita a la oficina
            const visitaPath = path.join(__dirname, '../mensajes/visita_oficina.txt');
            const visitaText = fs.readFileSync(visitaPath, 'utf-8');
            await sendMessage(sock, from, visitaText);
            // Mantener el estado para que pueda volver
            conversationState[from] = {
                step: 'VISITA_OFICINA',
                data: { previousMenu: 'MENU_PRINCIPAL' }
            };
            break;

        case '5':
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
            await sendMessage(sock, from, '⚠️ Respuesta no válida. Por favor selecciona una de las opciones (1-5).');
            await showMenuPrincipal(sock, from, conversationState);
            break;
    }
}
