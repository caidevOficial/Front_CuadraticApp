# #CuadraticApp 🐆 (Edición Yaguareté Lang)

> **Gestor y visualizador interactivo de ecuaciones cuadráticas**  
> Desarrollado con una GUI moderna, paleta de colores oficial de **Yaguareté Lang Web** (`E:\Python_d\Yaguarete_Lang_Web`), soporte para **Bhaskara** y el **Método de Po-Shen Loh**, y gráfico 2D interactivo en tiempo real.

---

## 🎨 Paleta de Colores Oficial Yaguareté Lang

El rediseño adopta la identidad visual cyber y tecnológica de **Yaguareté Lang**:
- **Electric Blue Principal (`#0066ff` / `#0055d4`)**: Tono primario enérgico, presente en botones de acción con gradiente, bordes destacados y eje de simetría.
- **Cyber Cyan & Sky (`#00d4ff` / `#38bdf8`)**: Acentos lumínicos de la curva de la parábola, vértice, insignias y resaltados interactivos.
- **Fondos Cyber Nocturnos (`#080c14` / `#0f172a` / `#162038`)**: Superficies oscuras de alto contraste inspiradas en terminales de desarrollo y REPL de Yaguareté Lang.
- **Bordes Sutiles (`#1e293b` / `#cbd5e1`)**: Delimitación limpia de tarjetas *cyber-card*.
- **Verde Esmeralda (`#10b981`)**: Para raíces reales y estados de éxito (idéntico a las salidas de consola de Yaguareté Lang).
- **Tipografías Oficiales**: `Space Grotesk` para títulos, `Inter` para texto base y `JetBrains Mono` para fórmulas y matemáticas.

---

## 🚀 Características y Mejoras Implementadas

### 1. Motor Matemático Avanzado (JavaScript ES6+)
- **Soporte Completo de Coeficientes**: Admite números enteros, decimales (`0.5`, `-2.3`) y fracciones (`1/2`, `-3/4`).
- **Raíces Reales y Complejas**: 
  - $\Delta > 0$: Dos raíces reales distintas ($x_1 \neq x_2$).
  - $\Delta = 0$: Raíz real doble ($x_1 = x_2$).
  - $\Delta < 0$: Raíces complejas conjugadas en el plano imaginario ($x = \alpha \pm \beta i$).
- **Casos Degenerados**: Manejo transparente de ecuaciones lineales cuando $a = 0$ ($bx + c = 0 \implies x = -c/b$), identidades ($0=0$) e inconsistencias.
- **Sin Alertas Intrusivas**: Reemplazo de los molestos `alert()` por insignias de estado visuales y tarjetas informativas.

### 2. Dos Métodos de Resolución
- **Fórmula de Bhaskara**: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
- **Método de Po-Shen Loh**: Deducción intuitiva por promedio de raíces $m = -B/2$ y distancia simétrica $u = \sqrt{m^2 - C}$.

### 3. Gráfico Interactivo de la Parábola (HTML5 Canvas HiDPI)
- Renderizado adaptado a pantallas Retina/4K.
- Ejes cartesianos graduados y cuadrícula dinámica.
- Marcado visual de **Vértice** $V(h, k)$, **Raíces** $(x_1, 0), (x_2, 0)$, **Ordenada al origen** $(0, c)$ y **Eje de simetría** vertical punteado.
- Inspección interactiva con el mouse (hover crosshair) y cálculo de coordenadas instantáneas.
- Controles de **Zoom In**, **Zoom Out** y **Restablecer Vista**.

### 4. Propiedades y Análisis Completo
- Discriminante $\Delta = b^2 - 4ac$
- Vértice $V(h, k)$
- Eje de simetría $x = h$
- Concavidad (hacia arriba o hacia abajo)
- Ordenada al origen $(0, c)$
- Forma canónica: $y = a(x - h)^2 + k$
- Forma factorizada: $y = a(x - x_1)(x - x_2)$

### 5. Experiencia de Usuario Moderna (UX/UI)
- **Vista Previa en Tiempo Real**: La ecuación $f(x) = 0$ se actualiza a medida que escribes o usas los botones incrementales (+ / -).
- **Ejemplos Rápidos (Presets)**: Casos típicos listos para probar con un clic.
- **Copiado al Portapapeles**: Copia $x_1$ o $x_2$ con feedback inmediato tipo Toast.
- **Modo Oscuro / Modo Claro**: Conmutador accesible persistente en `localStorage`.
- **Compatibilidad**: Estructura compatible con GitHub Pages y retrocompatibilidad con las URLs históricas `/Bhaskara/`.

---

## 📂 Estructura del Proyecto

```
Front_CuadraticApp/
├── index.html            # Aplicación principal moderna
├── estilo.css            # Sistema de diseño con tokens Yaguareté
├── animacion.css         # Micro-animaciones GPU optimizadas (<2KB)
├── app.js                # Motor matemático, canvas y eventos
├── formulaCuadratica.jpg # Referencia gráfica
├── yaguarete_icon.ico    # Ícono de la aplicación
├── README.md             # Documentación del proyecto
└── Bhaskara/
    ├── index.html        # Portal didáctico Bhaskara
    ├── bhaskara1.html    # Calculadora de 3 términos
    ├── bhaskara1.js      # Lógica matemática actualizada
    └── formulaCuadratica.jpg
```

---

## 🛠️ Tecnologías
- **HTML5 Semántico**: Accesible (WCAG AA/AAA).
- **CSS3 Moderno**: CSS Custom Properties (Variables), Flexbox, CSS Grid, Glassmorphism.
- **Vanilla JavaScript (ES6+)**: Cero dependencias pesadas, carga instantánea y funcionamiento offline garantizado.
- **HTML5 Canvas API**: Gráficos vectoriales de alta precisión matemática.

---
*Original por CaiDev - FacuFalcone &bull; Rediseñado con GUI moderna y paleta Yaguareté.*
