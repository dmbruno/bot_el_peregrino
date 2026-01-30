// ==========================================
// GOOGLE SHEETS INTEGRATION
// ==========================================
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ID de tu spreadsheet (leer desde variable de entorno)
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

if (!SPREADSHEET_ID) {
    console.error('❌ ERROR: Falta la variable de entorno GOOGLE_SHEET_ID');
    console.error('   Por favor, crea un archivo .env en la raíz del proyecto con:');
    console.error('   GOOGLE_SHEET_ID=tu_id_de_google_sheet');
    process.exit(1);
}

// Rangos para cada pestaña
const SHEETS = {
    RECEPTIVO: 'Receptivo!A:F',
    EMISIVO: 'Emisivo!A:H',
    PAQUETES: 'Paquetes!A:F',
    PROMOS: 'Promos!A:F'
};

// Función para autenticar con Google Sheets
async function getAuthClient() {
    try {
        // Lee las credenciales desde el archivo JSON
        const credentialsPath = path.join(__dirname, '../config/google-credentials.json');
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        return await auth.getClient();
    } catch (error) {
        console.error('❌ Error autenticando con Google Sheets:', error);
        throw error;
    }
}

// Función para agregar una fila a la hoja de Receptivo
export async function agregarConsultaReceptivo(datos) {
    try {
        const authClient = await getAuthClient();
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        const { nombre, telefono, correo, destino } = datos;

        // Generar fecha en formato dd/m/yyyy, hh:mm:ss como TEXTO
        const now = new Date();
        const dia = now.getDate();
        const mes = now.getMonth() + 1;
        const anio = now.getFullYear();
        const horas = now.getHours().toString().padStart(2, '0');
        const minutos = now.getMinutes().toString().padStart(2, '0');
        const segundos = now.getSeconds().toString().padStart(2, '0');
        const fechaFormateada = `${dia}/${mes}/${anio}, ${horas}:${minutos}:${segundos}`;

        // Datos a insertar: A, B, C, D, E, F
        // A=nombre, B=telefono, C=correo, D=destino, E=fecha_de_contacto, F=revisado
        const values = [
            [
                nombre || '',           // A: nombre_completo
                telefono || '',         // B: telefono
                correo || '',           // C: correo
                destino || '',          // D: destino
                fechaFormateada,        // E: fecha_de_contacto
                'pendiente'             // F: revisado
            ]
        ];

        const request = {
            spreadsheetId: SPREADSHEET_ID,
            range: SHEETS.RECEPTIVO,
            valueInputOption: 'RAW',  // RAW para que tome el texto tal cual
            insertDataOption: 'INSERT_ROWS',
            resource: { values }
        };

        const response = await sheets.spreadsheets.values.append(request);
        
        console.log('✅ Consulta agregada a Google Sheets (Receptivo):', response.data);
        return response.data;

    } catch (error) {
        console.error('❌ Error agregando consulta a Google Sheets:', error);
        throw error;
    }
}

// Función para agregar una fila a la hoja de Emisivo
export async function agregarConsultaEmisivo(datos) {
    try {
        const authClient = await getAuthClient();
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        const { nombre, telefono, correo, cantidadPersonas, lugar, fechaViaje, cantidadDias } = datos;

        // Generar fecha de contacto en formato dd/m/yyyy, hh:mm:ss como TEXTO
        const now = new Date();
        const dia = now.getDate();
        const mes = now.getMonth() + 1;
        const anio = now.getFullYear();
        const horas = now.getHours().toString().padStart(2, '0');
        const minutos = now.getMinutes().toString().padStart(2, '0');
        const segundos = now.getSeconds().toString().padStart(2, '0');
        const fechaContacto = `${dia}/${mes}/${anio}, ${horas}:${minutos}:${segundos}`;

        // Datos a insertar: A, B, C, D, E, F, G, H
        // A=nombre_completo, B=telefono, C=correo, D=cantidad_de_personas, 
        // E=lugar, F=fecha_aproximada_de_viaje, G=cantidad_de_dias, H=revisado
        const values = [
            [
                nombre || '',           // A: nombre_completo
                telefono || '',         // B: telefono
                correo || '',           // C: correo
                cantidadPersonas || '', // D: cantidad_de_personas
                lugar || '',            // E: lugar (destino)
                fechaViaje || '',       // F: fecha_aproximada_de_viaje
                cantidadDias || '',     // G: cantidad_de_dias
                'pendiente'             // H: revisado
            ]
        ];

        const request = {
            spreadsheetId: SPREADSHEET_ID,
            range: SHEETS.EMISIVO,
            valueInputOption: 'RAW',  // RAW para que tome el texto tal cual
            insertDataOption: 'INSERT_ROWS',
            resource: { values }
        };

        const response = await sheets.spreadsheets.values.append(request);
        
        console.log('✅ Consulta agregada a Google Sheets (Emisivo):', response.data);
        return response.data;

    } catch (error) {
        console.error('❌ Error agregando consulta a Google Sheets:', error);
        throw error;
    }
}

// Función para agregar una fila a la hoja de Paquetes
export async function agregarConsultaPaquete(datos) {
    try {
        const authClient = await getAuthClient();
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        const { nombre, telefono, correo, paquete } = datos;

        // Generar fecha de contacto en formato dd/m/yyyy, hh:mm:ss como TEXTO
        const now = new Date();
        const dia = now.getDate();
        const mes = now.getMonth() + 1;
        const anio = now.getFullYear();
        const horas = now.getHours().toString().padStart(2, '0');
        const minutos = now.getMinutes().toString().padStart(2, '0');
        const segundos = now.getSeconds().toString().padStart(2, '0');
        const fechaContacto = `${dia}/${mes}/${anio}, ${horas}:${minutos}:${segundos}`;

        // Datos a insertar: A, B, C, D, E, F
        // A=nombre_completo, B=telefono, C=correo, D=paquete_interes, E=fecha_contacto, F=revisado
        const values = [
            [
                nombre || '',           // A: nombre_completo
                telefono || '',         // B: telefono
                correo || '',           // C: correo
                paquete || '',          // D: paquete_interes
                fechaContacto,          // E: fecha_contacto
                'pendiente'             // F: revisado
            ]
        ];

        const request = {
            spreadsheetId: SPREADSHEET_ID,
            range: SHEETS.PAQUETES,
            valueInputOption: 'RAW',  // RAW para que tome el texto tal cual
            insertDataOption: 'INSERT_ROWS',
            resource: { values }
        };

        const response = await sheets.spreadsheets.values.append(request);
        
        console.log('✅ Consulta agregada a Google Sheets (Paquetes):', response.data);
        return response.data;

    } catch (error) {
        console.error('❌ Error agregando consulta a Google Sheets:', error);
        throw error;
    }
}

// Función para agregar una fila a la hoja de Promos
export async function agregarConsultaPromo(datos) {
    try {
        const authClient = await getAuthClient();
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        const { nombre, telefono, correo, promo } = datos;

        // Generar fecha de contacto en formato dd/m/yyyy, hh:mm:ss como TEXTO
        const now = new Date();
        const dia = now.getDate();
        const mes = now.getMonth() + 1;
        const anio = now.getFullYear();
        const horas = now.getHours().toString().padStart(2, '0');
        const minutos = now.getMinutes().toString().padStart(2, '0');
        const segundos = now.getSeconds().toString().padStart(2, '0');
        const fechaContacto = `${dia}/${mes}/${anio}, ${horas}:${minutos}:${segundos}`;

        // Datos a insertar: A, B, C, D, E, F
        // A=nombre_completo, B=telefono, C=correo, D=promo_interes, E=fecha_contacto, F=revisado
        const values = [
            [
                nombre || '',           // A: nombre_completo
                telefono || '',         // B: telefono
                correo || '',           // C: correo
                promo || '',            // D: promo_interes
                fechaContacto,          // E: fecha_contacto
                'pendiente'             // F: revisado
            ]
        ];

        const request = {
            spreadsheetId: SPREADSHEET_ID,
            range: SHEETS.PROMOS,
            valueInputOption: 'RAW',  // RAW para que tome el texto tal cual
            insertDataOption: 'INSERT_ROWS',
            resource: { values }
        };

        const response = await sheets.spreadsheets.values.append(request);
        
        console.log('✅ Consulta agregada a Google Sheets (Promos):', response.data);
        return response.data;

    } catch (error) {
        console.error('❌ Error agregando consulta a Google Sheets:', error);
        throw error;
    }
}
