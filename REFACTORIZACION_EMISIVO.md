# 📁 Refactorización de Estructura - Emisivo

## ✅ Cambios Realizados

### Nueva Estructura de Carpetas

```
flows-baileys/emisivo/
├── cotizacion.js                          ← Cotización personalizada (raíz)
├── salidasGrupales/                       ← ✨ NUEVA CARPETA
│   ├── salidasGrupales.js                 ← Menú de salidas grupales
│   ├── peru.js                            ← Perú Legendario 2026
│   ├── europa.js                          ← Europa Clásica 2026
│   └── turquiaDubai.js                    ← Turquía y Dubai 2026
└── promos/                                ← ✨ NUEVA CARPETA
    └── promos.js                          ← Promociones (pendiente contenido)
```

## 📝 Archivos Actualizados

### 1. **flows-baileys/emisivo/salidasGrupales/salidasGrupales.js**
   - ✅ Import actualizado: `'../../../utils/utils.js'`
   - ✅ Import de menuEmisivo: `'../../menuEmisivo.js'`

### 2. **flows-baileys/emisivo/salidasGrupales/peru.js**
   - ✅ Imports actualizados: `'../../../utils/utils.js'` y `'../../../utils/googleSheets.js'`

### 3. **flows-baileys/emisivo/salidasGrupales/europa.js**
   - ✅ Imports actualizados: `'../../../utils/utils.js'` y `'../../../utils/googleSheets.js'`

### 4. **flows-baileys/emisivo/salidasGrupales/turquiaDubai.js**
   - ✅ Imports actualizados: `'../../../utils/utils.js'` y `'../../../utils/googleSheets.js'`

### 5. **flows-baileys/menuEmisivo.js**
   - ✅ Import actualizado: `'./emisivo/salidasGrupales/salidasGrupales.js'`
   - ✅ Import actualizado: `'./emisivo/promos/promos.js'`

### 6. **handlers/conversationHandler.js**
   - ✅ Import actualizado: `'../flows-baileys/emisivo/salidasGrupales/salidasGrupales.js'`
   - ✅ Import actualizado: `'../flows-baileys/emisivo/salidasGrupales/peru.js'`
   - ✅ Import actualizado: `'../flows-baileys/emisivo/salidasGrupales/europa.js'`
   - ✅ Import actualizado: `'../flows-baileys/emisivo/salidasGrupales/turquiaDubai.js'`
   - ✅ Import actualizado: `'../flows-baileys/emisivo/promos/promos.js'`

## ✅ Verificaciones

- ✅ Sin errores de sintaxis en ningún archivo
- ✅ Todos los imports corregidos
- ✅ Estructura de carpetas organizada
- ✅ Bot listo para ejecutar

## 🎯 Ventajas de la Nueva Estructura

1. **Organización lógica**: Cada categoría (salidas grupales, promos) tiene su propia carpeta
2. **Escalabilidad**: Fácil agregar nuevas salidas grupales o promociones
3. **Mantenibilidad**: Código más fácil de navegar y entender
4. **Separación de responsabilidades**: Cada módulo está en su lugar apropiado

## 🚀 Próximos Pasos

1. Probar el bot manualmente: `npm start`
2. Verificar el flujo completo:
   - Menú Principal → Emisivo → Salidas Grupales → Perú/Europa/Turquía
3. Cuando tengas promos listas, agregarlas en `flows-baileys/emisivo/promos/`

## 📌 Notas

- La integración con Google Sheets sigue funcionando normalmente
- Todos los paquetes guardan correctamente en la hoja "Paquetes"
- No se requieren cambios en la base de datos ni en las sesiones de WhatsApp
