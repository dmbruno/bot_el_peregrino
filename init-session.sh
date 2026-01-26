#!/bin/bash

echo "🧹 Limpiando sesión anterior de WhatsApp..."
rm -rf auth_info_baileys/

echo "🗑️  Limpiando base de datos..."
rm -f database.db

echo "✅ Sesión y base de datos limpiadas"
echo ""
echo "🚀 Iniciando bot (prepárate para escanear el QR)..."
echo ""

npm start
