import makeWASocket, { 
    DisconnectReason, 
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcodeTerminal from 'qrcode-terminal';
import qrcodeImage from 'qrcode';
import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import db from './database.js';
import { handleMessage } from './handlers/messageHandler.js';

const execAsync = promisify(exec);

console.log('🚀 Iniciando El Peregrino viajes y turismo Bot con Baileys 7.x (Arquitectura Modular)...\n');

// ==========================================
// CONFIGURACIÓN DEL SERVIDOR WEB
// ==========================================
const app = express();
const PORT = process.env.PORT || 3000;

// Variables globales para el estado del bot
let currentQR = null;
let isConnected = false;
let connectionStatus = 'Iniciando...';
let botInfo = { phone: null, name: null };

// Middleware
app.use(express.json());

// Ruta principal - Mostrar QR o estado
app.get('/', (req, res) => {
    if (isConnected) {
        // Bot conectado
        res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bot El Peregrino - Conectado</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        padding: 20px;
                    }
                    .container {
                        background: white;
                        padding: 50px;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        text-align: center;
                        max-width: 500px;
                        width: 100%;
                    }
                    .emoji { font-size: 80px; margin-bottom: 20px; animation: bounce 2s infinite; }
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    h1 { color: #667eea; margin-bottom: 15px; font-size: 32px; }
                    .status {
                        background: #10b981;
                        color: white;
                        padding: 15px 30px;
                        border-radius: 50px;
                        font-size: 18px;
                        font-weight: bold;
                        display: inline-block;
                        margin: 20px 0;
                    }
                    p { color: #666; line-height: 1.6; margin-top: 15px; }
                    .info {
                        background: #f3f4f6;
                        padding: 20px;
                        border-radius: 10px;
                        margin-top: 20px;
                        text-align: left;
                    }
                    .info-item {
                        display: flex;
                        align-items: center;
                        margin: 10px 0;
                        color: #374151;
                    }
                    .info-item span {
                        margin-right: 10px;
                        font-size: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="emoji">✅</div>
                    <h1>Bot El Peregrino</h1>
                    <div class="status">🟢 Conectado y Activo</div>
                    <p>El bot está funcionando correctamente y listo para recibir mensajes por WhatsApp.</p>
                    <div class="info">
                        <div class="info-item">
                            <span>📱</span>
                            <div><strong>Estado:</strong> Conectado a WhatsApp</div>
                        </div>
                        ${botInfo.phone ? `<div class="info-item"><span>📞</span><div><strong>Número:</strong> ${botInfo.phone}</div></div>` : ''}
                        ${botInfo.name ? `<div class="info-item"><span>👤</span><div><strong>Nombre:</strong> ${botInfo.name}</div></div>` : ''}
                        <div class="info-item">
                            <span>🤖</span>
                            <div><strong>Versión:</strong> 1.0.0</div>
                        </div>
                        <div class="info-item">
                            <span>⏰</span>
                            <div><strong>Hora:</strong> ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    } else if (currentQR) {
        // Mostrar QR para escanear
        res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bot El Peregrino - Escanear QR</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        padding: 20px;
                    }
                    .container {
                        background: white;
                        padding: 40px;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        text-align: center;
                        max-width: 600px;
                        width: 100%;
                    }
                    h1 { color: #667eea; margin-bottom: 10px; font-size: 28px; }
                    .subtitle { color: #764ba2; font-size: 18px; font-weight: 600; margin-bottom: 30px; }
                    .qr-container {
                        background: white;
                        padding: 20px;
                        border-radius: 15px;
                        display: inline-block;
                        margin: 20px 0;
                        border: 3px solid #667eea;
                        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
                    }
                    img { max-width: 300px; width: 100%; height: auto; }
                    .instructions {
                        background: #f3f4f6;
                        padding: 25px;
                        border-radius: 15px;
                        margin-top: 25px;
                        text-align: left;
                    }
                    .instructions h3 {
                        color: #667eea;
                        margin-bottom: 15px;
                        font-size: 18px;
                    }
                    .step {
                        display: flex;
                        align-items: flex-start;
                        margin: 12px 0;
                        color: #374151;
                    }
                    .step-number {
                        background: #667eea;
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: 14px;
                        margin-right: 12px;
                        flex-shrink: 0;
                    }
                    .refresh-btn {
                        background: #667eea;
                        color: white;
                        border: none;
                        padding: 15px 40px;
                        border-radius: 25px;
                        font-size: 16px;
                        cursor: pointer;
                        margin-top: 25px;
                        transition: all 0.3s;
                        font-weight: 600;
                    }
                    .refresh-btn:hover {
                        background: #5568d3;
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                    }
                </style>
                <script>
                    // Auto-refresh cada 5 segundos
                    let countdown = 5;
                    setInterval(() => {
                        countdown--;
                        if (countdown <= 0) {
                            location.reload();
                        }
                        const btn = document.getElementById('refreshBtn');
                        if (btn) btn.textContent = '🔄 Actualizar (' + countdown + 's)';
                    }, 1000);
                </script>
            </head>
            <body>
                <div class="container">
                    <h1>🤖 Bot El Peregrino</h1>
                    <p class="subtitle">Escanea el código QR con WhatsApp</p>
                    <div class="qr-container">
                        <img src="${currentQR}" alt="Código QR">
                    </div>
                    <div class="instructions">
                        <h3>📱 Instrucciones:</h3>
                        <div class="step">
                            <div class="step-number">1</div>
                            <div>Abre WhatsApp en tu teléfono</div>
                        </div>
                        <div class="step">
                            <div class="step-number">2</div>
                            <div>Ve a <strong>Configuración → Dispositivos vinculados</strong></div>
                        </div>
                        <div class="step">
                            <div class="step-number">3</div>
                            <div>Toca en <strong>"Vincular un dispositivo"</strong></div>
                        </div>
                        <div class="step">
                            <div class="step-number">4</div>
                            <div>Escanea este código QR</div>
                        </div>
                    </div>
                    <button class="refresh-btn" id="refreshBtn" onclick="location.reload()">
                        🔄 Actualizar (5s)
                    </button>
                </div>
            </body>
            </html>
        `);
    } else {
        // Bot iniciando
        res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bot El Peregrino - Iniciando</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        padding: 20px;
                    }
                    .container {
                        background: white;
                        padding: 50px;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        text-align: center;
                        max-width: 500px;
                        width: 100%;
                    }
                    h1 { color: #667eea; margin-bottom: 30px; font-size: 28px; }
                    .loader {
                        border: 5px solid #f3f3f3;
                        border-top: 5px solid #667eea;
                        border-radius: 50%;
                        width: 60px;
                        height: 60px;
                        animation: spin 1s linear infinite;
                        margin: 30px auto;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    p { color: #666; line-height: 1.8; margin-top: 20px; font-size: 16px; }
                    .status-text {
                        background: #f3f4f6;
                        padding: 15px;
                        border-radius: 10px;
                        margin-top: 20px;
                        color: #374151;
                        font-weight: 600;
                    }
                </style>
                <script>
                    // Auto-refresh cada 3 segundos
                    setTimeout(() => location.reload(), 3000);
                </script>
            </head>
            <body>
                <div class="container">
                    <h1>🤖 Bot El Peregrino</h1>
                    <div class="loader"></div>
                    <div class="status-text">⏳ ${connectionStatus}</div>
                    <p>Iniciando conexión con WhatsApp...<br>Por favor espera un momento.</p>
                </div>
            </body>
            </html>
        `);
    }
});

// API: Estado del bot en formato JSON
app.get('/api/status', (req, res) => {
    res.json({
        connected: isConnected,
        hasQR: currentQR !== null,
        status: connectionStatus,
        botInfo: botInfo,
        timestamp: new Date().toISOString()
    });
});

// API: Health check para Railway
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        uptime: process.uptime(),
        connected: isConnected 
    });
});

// Iniciar servidor HTTP
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('🌐 ========================================');
    console.log(`🌐 Servidor HTTP iniciado correctamente`);
    console.log(`🌐 Puerto: ${PORT}`);
    console.log(`🌐 URL Local: http://localhost:${PORT}`);
    console.log('🌐 ========================================\n');
});

// Manejo de errores del servidor
server.on('error', (error) => {
    console.error('❌ Error en el servidor:', error);
});

// Función para restaurar sesión desde variable de entorno (Railway)
async function restoreSessionFromEnv() {
    if (process.env.WHATSAPP_SESSION_BASE64) {
        console.log('📦 Detectada sesión en variable de entorno, restaurando...');
        try {
            const authPath = './auth_info_baileys';
            
            // No sobrescribir si ya existe
            if (fs.existsSync(authPath) && fs.readdirSync(authPath).length > 0) {
                console.log('✅ Sesión local ya existe, usando esa.');
                return;
            }
            
            const sessionBase64 = process.env.WHATSAPP_SESSION_BASE64;
            
            // Crear directorio si no existe
            if (!fs.existsSync(authPath)) {
                fs.mkdirSync(authPath, { recursive: true });
            }
            
            // Decodificar y extraer
            const sessionBuffer = Buffer.from(sessionBase64, 'base64');
            fs.writeFileSync('./session.tar.gz', sessionBuffer);
            await execAsync('tar -xzf session.tar.gz');
            fs.unlinkSync('./session.tar.gz');
            
            console.log('✅ Sesión restaurada exitosamente desde variable de entorno');
        } catch (error) {
            console.error('❌ Error restaurando sesión:', error);
        }
    }
}

// Función principal para iniciar el bot
async function startBot() {
    // Restaurar sesión si existe en variable de entorno
    await restoreSessionFromEnv();
    
    connectionStatus = 'Cargando credenciales...';
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    connectionStatus = 'Obteniendo versión de WhatsApp...';
    const { version, isLatest } = await fetchLatestBaileysVersion();
    
    console.log(`📱 Usando WhatsApp Web v${version.join('.')}, ${isLatest ? 'última versión' : 'versión antigua'}`);

    connectionStatus = 'Conectando con WhatsApp...';
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        browser: ['El Peregrino viajes y turismo Bot', 'Chrome', '120.0.0'],
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            return { conversation: '' };
        },
    });

    // Manejar actualización de credenciales
    sock.ev.on('creds.update', saveCreds);

    // Manejar conexión/desconexión
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // Manejar QR
        if (qr) {
            try {
                // Generar QR como imagen base64 para la web
                currentQR = await qrcodeImage.toDataURL(qr);
                isConnected = false;
                connectionStatus = 'Esperando escaneo de QR...';
                
                console.log('\n📱 ========================================');
                console.log('📱 ¡ESCANEA ESTE CÓDIGO QR CON WHATSAPP!');
                console.log('📱 ========================================\n');
                
                // Mostrar QR en terminal también
                qrcodeTerminal.generate(qr, { small: true, errorCorrectionLevel: 'L' });
                
                console.log('\n⏳ Esperando escaneo del QR...');
                console.log('💡 Abre WhatsApp → Dispositivos vinculados → Vincular dispositivo');
                console.log(`🌐 O abre en tu navegador: http://localhost:${PORT}`);
                console.log('📱 ========================================\n');
            } catch (error) {
                console.error('❌ Error generando QR:', error);
            }
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                : true;

            console.log('❌ Conexión cerrada.');
            isConnected = false;
            currentQR = null;
            connectionStatus = 'Conexión cerrada';
            
            if (lastDisconnect?.error) {
                const statusCode = (lastDisconnect.error instanceof Boom) 
                    ? lastDisconnect.error.output.statusCode 
                    : 500;
                console.log(`🔍 Código de error: ${statusCode}`);
                console.log(`📋 Razón: ${DisconnectReason[statusCode] || 'Desconocida'}`);
            }

            if (shouldReconnect) {
                console.log('🔄 Reconectando en 5 segundos...');
                connectionStatus = 'Reconectando...';
                setTimeout(() => startBot(), 5000);
            } else {
                console.log('🚪 Sesión cerrada por WhatsApp.');
                console.log('💡 Ejecuta: rm -rf auth_info_baileys/ && npm start');
                connectionStatus = 'Sesión cerrada';
                process.exit(0);
            }
        } else if (connection === 'open') {
            console.log('\n✅ ========================================');
            console.log('✅ ¡BOT CONECTADO EXITOSAMENTE!');
            console.log('✅ ========================================\n');
            console.log('📞 Número:', sock.user?.id);
            console.log('👤 Nombre:', sock.user?.name || 'Sin nombre');
            console.log(`🌐 Panel web: http://localhost:${PORT}`);
            console.log('\n🤖 Bot listo para recibir mensajes...\n');
            
            isConnected = true;
            currentQR = null;
            connectionStatus = 'Conectado y funcionando';
            botInfo = {
                phone: sock.user?.id || null,
                name: sock.user?.name || null
            };
        } else if (connection === 'connecting') {
            console.log('🔌 Conectando a WhatsApp...');
            connectionStatus = 'Conectando...';
        }
    });

    // Manejar mensajes entrantes
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const message of messages) {
            // Ignorar mensajes propios
            if (message.key.fromMe) continue;

            // Ignorar mensajes de grupos por ahora (opcional)
            // if (message.key.remoteJid.endsWith('@g.us')) continue;

            try {
                await handleMessage(sock, message);
            } catch (error) {
                console.error('❌ Error procesando mensaje:', error);
            }
        }
    });

    // Manejar actualizaciones de presencia (opcional)
    sock.ev.on('presence.update', ({ id, presences }) => {
        // console.log(`👁️ Presencia: ${id}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n\n🛑 Cerrando bot gracefully...');
        isConnected = false;
        connectionStatus = 'Apagando...';
        await sock?.logout();
        await sock?.end();
        server.close(() => {
            console.log('✅ Servidor HTTP cerrado');
            process.exit(0);
        });
    });

    process.on('SIGTERM', async () => {
        console.log('\n\n🛑 Cerrando bot gracefully...');
        isConnected = false;
        connectionStatus = 'Apagando...';
        await sock?.logout();
        await sock?.end();
        server.close(() => {
            console.log('✅ Servidor HTTP cerrado');
            process.exit(0);
        });
    });

    return sock;
}

// Iniciar el bot
startBot().catch(err => {
    console.error('💥 Error fatal al iniciar el bot:', err);
    process.exit(1);
});