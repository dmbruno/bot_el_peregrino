import db from './database.js';

console.log('Limpiando base de datos...');

// Limpiar todas las tablas
db.serialize(() => {
    db.run('DELETE FROM interacciones', (err) => {
        if (err) {
            console.error('Error al limpiar interacciones:', err.message);
        } else {
            console.log('✓ Tabla interacciones limpiada');
        }
    });

    db.run('DELETE FROM consultas', (err) => {
        if (err) {
            console.error('Error al limpiar consultas:', err.message);
        } else {
            console.log('✓ Tabla consultas limpiada');
        }
    });

    db.run('DELETE FROM usuarios', (err) => {
        if (err) {
            console.error('Error al limpiar usuarios:', err.message);
        } else {
            console.log('✓ Tabla usuarios limpiada');
        }
    });

    // Resetear los contadores de autoincremento
    db.run('DELETE FROM sqlite_sequence', (err) => {
        if (err) {
            console.error('Error al resetear contadores:', err.message);
        } else {
            console.log('✓ Contadores de ID reseteados');
        }
    });
});

// Cerrar la conexión después de un momento
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('Error al cerrar la base de datos:', err.message);
        } else {
            console.log('\n✅ Base de datos limpiada exitosamente');
        }
    });
}, 1000);
