import makeWASocket, { 
    DisconnectReason, 
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import db from './database.js';
import { handleMessage } from './handlers/messageHandler.js';

const execAsync = promisify(exec);

console.log('🚀 Iniciando UBM Viajes Bot con Baileys 7.x (Arquitectura Modular)...\n');

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
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version, isLatest } = await fetchLatestBaileysVersion();
    
    console.log(`📱 Usando WhatsApp Web v${version.join('.')}, ${isLatest ? 'última versión' : 'versión antigua'}`);

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        browser: ['UBM Viajes Bot', 'Chrome', '120.0.0'],
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

        // Manejar QR manualmente (ya que printQRInTerminal está deprecado)
        if (qr) {
            console.log('\n📱 ¡ESCANEA ESTE CÓDIGO QR CON WHATSAPP!\n');
            qrcode.generate(qr, { small: true, errorCorrectionLevel: 'L' });
            console.log('\n⏳ Esperando escaneo del QR...');
            console.log('💡 Abre WhatsApp → Dispositivos vinculados → Vincular dispositivo\n');
            
            // URL alternativa para móviles (opcional)
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`;
            console.log(`🔗 O abre este link desde tu móvil: ${qrUrl}\n`);
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                : true;

            console.log('❌ Conexión cerrada.');
            
            if (lastDisconnect?.error) {
                const statusCode = (lastDisconnect.error instanceof Boom) 
                    ? lastDisconnect.error.output.statusCode 
                    : 500;
                console.log(`🔍 Código de error: ${statusCode}`);
                console.log(`📋 Razón: ${DisconnectReason[statusCode] || 'Desconocida'}`);
            }

            if (shouldReconnect) {
                console.log('🔄 Reconectando en 5 segundos...');
                setTimeout(() => startBot(), 5000);
            } else {
                console.log('🚪 Sesión cerrada por WhatsApp.');
                console.log('💡 Ejecuta: rm -rf auth_info_baileys/ && npm start');
                process.exit(0);
            }
        } else if (connection === 'open') {
            console.log('\n✅ ¡BOT CONECTADO EXITOSAMENTE!\n');
            console.log('📞 Número:', sock.user?.id);
            console.log('👤 Nombre:', sock.user?.name || 'Sin nombre');
            console.log('\n🤖 Bot listo para recibir mensajes...\n');
        } else if (connection === 'connecting') {
            console.log('🔌 Conectando a WhatsApp...');
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
        await sock?.logout();
        await sock?.end();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('\n\n🛑 Cerrando bot gracefully...');
        await sock?.logout();
        await sock?.end();
        process.exit(0);
    });

    return sock;
}

// Iniciar el bot
startBot().catch(err => {
    console.error('💥 Error fatal al iniciar el bot:', err);
    process.exit(1);
});