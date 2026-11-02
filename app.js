/**
 * CuadraticApp - Motor Matemático y Controlador de Interfaz
 * Implementación de Resolvente de Bhaskara y Método de Po-Shen Loh
 * Diseñado con la paleta de colores de Yaguareté
 */

(function () {
  'use strict';

  // --- ESTADO GLOBAL DE LA APLICACIÓN ---
  const state = {
    a: 1,
    b: -5,
    c: 6,
    method: 'bhaskara', // 'bhaskara' | 'poshenloh'
    theme: localStorage.getItem('cuadraticapp_theme') || 'dark',
    zoomLevel: 1.0,
    panOffset: { x: 0, y: 0 },
    hoverPoint: null
  };

  // --- REFERENCIAS AL DOM ---
  const el = {
    inputA: document.getElementById('terminoA'),
    inputB: document.getElementById('terminoB'),
    inputC: document.getElementById('terminoC'),
    liveEquation: document.getElementById('liveEquation'),
    statusBadge: document.getElementById('statusBadge'),
    x1Val: document.getElementById('x1Val'),
    x2Val: document.getElementById('x2Val'),
    discVal: document.getElementById('discVal'),
    vertexVal: document.getElementById('vertexVal'),
    axisVal: document.getElementById('axisVal'),
    concavityVal: document.getElementById('concavityVal'),
    interceptVal: document.getElementById('interceptVal'),
    canonicalVal: document.getElementById('canonicalVal'),
    stepsContainer: document.getElementById('stepsContainer'),
    methodBhaskaraBtn: document.getElementById('tabBhaskara'),
    methodPoShenLohBtn: document.getElementById('tabPoShenLoh'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    toastNotice: document.getElementById('toastNotice'),
    toastMsg: document.getElementById('toastMsg'),
    canvas: document.getElementById('parabolaCanvas'),
    canvasContainer: document.getElementById('canvasContainer'),
    canvasTooltip: document.getElementById('canvasTooltip'),
    btnZoomIn: document.getElementById('btnZoomIn'),
    btnZoomOut: document.getElementById('btnZoomOut'),
    btnResetView: document.getElementById('btnResetView'),
    btnCalculate: document.getElementById('btnCalculate'),
    btnClear: document.getElementById('btnClear')
  };

  // --- UTILIDADES NUMÉRICAS Y DE FORMATO ---
  function parseCoeff(value) {
    if (typeof value === 'number') return isNaN(value) ? 0 : value;
    if (!value) return 0;
    const str = String(value).trim().replace(',', '.');
    if (str === '' || str === '-' || str === '+') return 0;
    if (str.includes('/')) {
      const parts = str.split('/');
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
    }
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  }

  function formatNum(num, decimals = 3) {
    if (Number.isInteger(num)) return num.toString();
    const rounded = Number(num.toFixed(decimals));
    return rounded.toString();
  }

  function formatSign(num, isLeading = false) {
    if (isLeading) {
      return num < 0 ? `-${formatNum(Math.abs(num))}` : formatNum(num);
    }
    return num < 0 ? `- ${formatNum(Math.abs(num))}` : `+ ${formatNum(num)}`;
  }

  // --- RENDERIZADO DE LA ECUACIÓN EN VIVO ---
  function updateLiveEquationPreview() {
    const { a, b, c } = state;
    let html = '';

    // Término cuadrático
    if (a !== 0) {
      if (a === 1) html += `<span class="term-a">x²</span>`;
      else if (a === -1) html += `<span class="term-a">-x²</span>`;
      else html += `<span class="term-a">${formatNum(a)}x²</span>`;
    }

    // Término lineal
    if (b !== 0) {
      const sign = b > 0 ? (a !== 0 ? '+ ' : '') : '- ';
      const absB = Math.abs(b);
      const bStr = absB === 1 ? 'x' : `${formatNum(absB)}x`;
      html += ` <span class="term-b">${sign}${bStr}</span>`;
    }

    // Término independiente
    if (c !== 0) {
      const sign = c > 0 ? (a !== 0 || b !== 0 ? '+ ' : '') : '- ';
      html += ` <span class="term-c">${sign}${formatNum(Math.abs(c))}</span>`;
    }

    if (a === 0 && b === 0 && c === 0) {
      html = '<span class="term-a">0</span>';
    }

    html += ' = 0';
    el.liveEquation.innerHTML = html;
  }

  // --- MOTOR MATEMÁTICO: RESOLVENTE Y ANÁLISIS ---
  function calculateAnalysis(a, b, c) {
    // Caso degenerate: a = 0 (Ecuación lineal o trivial)
    if (a === 0) {
      if (b === 0) {
        if (c === 0) {
          return {
            type: 'infinite',
            statusText: 'Identidad (Infinitas Soluciones)',
            statusClass: 'real-one',
            x1: 'Infinitas',
            x2: 'Infinitas',
            disc: 0,
            vertex: null,
            axis: null,
            concavity: 'No es cuadrática',
            intercept: `(0, ${formatNum(c)})`,
            canonical: 'N/A',
            factored: 'N/A'
          };
        } else {
          return {
            type: 'none',
            statusText: 'Sin Solución (Contradicción)',
            statusClass: 'invalid',
            x1: 'No existe',
            x2: 'No existe',
            disc: 0,
            vertex: null,
            axis: null,
            concavity: 'No es cuadrática',
            intercept: `(0, ${formatNum(c)})`,
            canonical: 'N/A',
            factored: 'N/A'
          };
        }
      }

      // Ecuación lineal: bx + c = 0 => x = -c/b
      const xLin = -c / b;
      return {
        type: 'linear',
        statusText: 'Ecuación Lineal (1 Raíz)',
        statusClass: 'real-one',
        x1: formatNum(xLin),
        x2: 'N/A (grado 1)',
        x1Raw: xLin,
        x2Raw: null,
        disc: 0,
        vertex: null,
        axis: null,
        concavity: 'Recta lineal',
        intercept: `(0, ${formatNum(c)})`,
        canonical: 'N/A',
        factored: `${formatNum(b)}(x ${c >= 0 ? '+ ' + formatNum(c / b) : '- ' + formatNum(Math.abs(c / b))})`
      };
    }

    // Discriminante Delta = b^2 - 4ac
    const disc = b * b - 4 * a * c;

    // Vértice V(h, k): h = -b / (2a), k = f(h)
    const h = -b / (2 * a);
    const k = a * h * h + b * h + c;

    // Eje de simetría: x = h
    const axis = `x = ${formatNum(h)}`;

    // Concavidad
    const concavity = a > 0 ? 'Cóncava hacia arriba (Mínimo)' : 'Cóncava hacia abajo (Máximo)';

    // Ordenada al origen: (0, c)
    const intercept = `(0, ${formatNum(c)})`;

    // Forma canónica: y = a(x - h)^2 + k
    const hSign = h >= 0 ? `- ${formatNum(h)}` : `+ ${formatNum(Math.abs(h))}`;
    const kSign = k >= 0 ? `+ ${formatNum(k)}` : `- ${formatNum(Math.abs(k))}`;
    const canonical = `${a === 1 ? '' : (a === -1 ? '-' : formatNum(a))}(x ${hSign})² ${kSign}`;

    let result = {
      a, b, c,
      disc,
      vertex: { x: h, y: k },
      axis,
      concavity,
      intercept,
      canonical
    };

    if (disc > 0) {
      const sqrtD = Math.sqrt(disc);
      const x1 = (-b + sqrtD) / (2 * a);
      const x2 = (-b - sqrtD) / (2 * a);

      result.type = 'real_two';
      result.statusText = 'Dos Raíces Reales Distintas (Δ > 0)';
      result.statusClass = 'real-two';
      result.x1 = formatNum(x1);
      result.x2 = formatNum(x2);
      result.x1Raw = x1;
      result.x2Raw = x2;
      result.factored = `${a === 1 ? '' : formatNum(a) + ' '}(x ${x1 >= 0 ? '- ' + formatNum(x1) : '+ ' + formatNum(Math.abs(x1))})(x ${x2 >= 0 ? '- ' + formatNum(x2) : '+ ' + formatNum(Math.abs(x2))})`;
    } else if (Math.abs(disc) < 1e-12) {
      const x = -b / (2 * a);
      result.type = 'real_one';
      result.statusText = 'Raíz Real Doble (Δ = 0)';
      result.statusClass = 'real-one';
      result.x1 = formatNum(x);
      result.x2 = formatNum(x);
      result.x1Raw = x;
      result.x2Raw = x;
      result.factored = `${a === 1 ? '' : formatNum(a) + ' '}(x ${x >= 0 ? '- ' + formatNum(x) : '+ ' + formatNum(Math.abs(x))})²`;
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-disc) / (2 * Math.abs(a));
      result.type = 'complex';
      result.statusText = 'Raíces Complejas Conjugadas (Δ < 0)';
      result.statusClass = 'complex';
      const realStr = formatNum(realPart);
      const imagStr = imagPart === 1 ? 'i' : `${formatNum(imagPart)}i`;

      result.x1 = `${realStr} + ${imagStr}`;
      result.x2 = `${realStr} - ${imagStr}`;
      result.x1Raw = null;
      result.x2Raw = null;
      result.realPart = realPart;
      result.imagPart = imagPart;
      result.factored = 'No factorizable en números reales';
    }

    return result;
  }

  // --- GENERACIÓN DEL PASO A PASO DIDÁCTICO ---
  function renderStepByStep(analysis) {
    const { a, b, c, disc, type } = analysis;
    let html = '';

    if (type === 'linear' || type === 'infinite' || type === 'none') {
      html = `
        <div class="step-card">
          <div class="step-badge">!</div>
          <div class="step-content">
            <h4 class="step-title">Ecuación con Coeficiente Cuadrático A = 0</h4>
            <p class="step-explanation">
              Al ser <strong>A = 0</strong>, no existe término cuadrático (x²), por lo que no es una parábola de segundo grado sino una ecuación lineal de primer grado:
            </p>
            <div class="step-formula-box">
              ${b !== 0 ? `${formatNum(b)}x + (${formatNum(c)}) = 0 &rArr; x = -(${formatNum(c)}) / ${formatNum(b)} = ${analysis.x1}` : `${formatNum(c)} = 0`}
            </div>
          </div>
        </div>
      `;
      el.stepsContainer.innerHTML = html;
      return;
    }

    if (state.method === 'bhaskara') {
      // MÉTODO DE BHASKARA (Fórmula Resolvente General)
      html += `
        <!-- Paso 1 -->
        <div class="step-card">
          <div class="step-badge">1</div>
          <div class="step-content">
            <h4 class="step-title">Identificación de Coeficientes</h4>
            <p class="step-explanation">Dada la forma canónica polinómica <strong>ax² + bx + c = 0</strong>, extraemos los valores numéricos:</p>
            <div class="step-formula-box">
              a = ${formatNum(a)}, &nbsp; b = ${formatNum(b)}, &nbsp; c = ${formatNum(c)}
            </div>
          </div>
        </div>

        <!-- Paso 2 -->
        <div class="step-card">
          <div class="step-badge">2</div>
          <div class="step-content">
            <h4 class="step-title">Cálculo del Discriminante (Δ)</h4>
            <p class="step-explanation">
              El discriminante bajo la raíz determina la cantidad y naturaleza de las soluciones (reales o complejas):
            </p>
            <div class="step-formula-box">
              &Delta; = b² - 4ac <br>
              &Delta; = (${formatNum(b)})² - 4 &middot; (${formatNum(a)}) &middot; (${formatNum(c)}) <br>
              &Delta; = ${formatNum(b * b)} - (${formatNum(4 * a * c)}) = <strong>${formatNum(disc)}</strong>
            </div>
          </div>
        </div>

        <!-- Paso 3 -->
        <div class="step-card">
          <div class="step-badge">3</div>
          <div class="step-content">
            <h4 class="step-title">Sustitución en la Fórmula Resolvente de Bhaskara</h4>
            <p class="step-explanation">
              Aplicamos la resolvente general: <strong>x = (-b &plusmn; &radic;&Delta;) / (2a)</strong>:
            </p>
            <div class="step-formula-box">
              x = [-(${formatNum(b)}) &plusmn; &radic;(${formatNum(disc)})] / [2 &middot; (${formatNum(a)})] <br>
              x = [${formatNum(-b)} &plusmn; ${disc >= 0 ? formatNum(Math.sqrt(disc)) : `&radic;(${formatNum(Math.abs(disc))})i`}] / ${formatNum(2 * a)}
            </div>
          </div>
        </div>

        <!-- Paso 4 -->
        <div class="step-card">
          <div class="step-badge">4</div>
          <div class="step-content">
            <h4 class="step-title">Obtención de Soluciones Finales</h4>
            <p class="step-explanation">
              ${disc > 0 
                ? 'El discriminante es positivo (&Delta; > 0), por lo que bifurcamos en dos raíces reales:' 
                : (disc === 0 
                  ? 'El discriminante es cero (&Delta; = 0), por lo que ambas raíces coinciden en una raíz doble:' 
                  : 'El discriminante es negativo (&Delta; < 0), produciendo un par de raíces complejas conjugadas en el plano imaginario:')}
            </p>
            <div class="step-formula-box">
              <strong>x₁ = ${analysis.x1}</strong> <br>
              <strong>x₂ = ${analysis.x2}</strong>
            </div>
          </div>
        </div>
      `;
    } else {
      // MÉTODO DE PO-SHEN LOH
      const B = b / a;
      const C = c / a;
      const m = -B / 2;
      const u2 = m * m - C;

      html += `
        <!-- Paso 1 -->
        <div class="step-card">
          <div class="step-badge">1</div>
          <div class="step-content">
            <h4 class="step-title">Normalización de la Ecuación Cuadrática</h4>
            <p class="step-explanation">
              Si a &ne; 1, dividimos toda la ecuación por el coeficiente principal <strong>a = ${formatNum(a)}</strong> para obtener x² + Bx + C = 0:
            </p>
            <div class="step-formula-box">
              x² ${B >= 0 ? '+ ' + formatNum(B) : '- ' + formatNum(Math.abs(B))}x ${C >= 0 ? '+ ' + formatNum(C) : '- ' + formatNum(Math.abs(C))} = 0
              <br><small style="color:var(--yag-muted)">donde B = b/a = ${formatNum(B)}, &nbsp; C = c/a = ${formatNum(C)}</small>
            </div>
          </div>
        </div>

        <!-- Paso 2 -->
        <div class="step-card">
          <div class="step-badge">2</div>
          <div class="step-content">
            <h4 class="step-title">Cálculo del Promedio de las Raíces (Centro de Simetría)</h4>
            <p class="step-explanation">
              Por las relaciones de Cardano-Vieta, la suma de las raíces es -B. Por lo tanto, el punto medio o promedio entre ambas raíces es:
            </p>
            <div class="step-formula-box">
              m = -B / 2 = -(${formatNum(B)}) / 2 = <strong>${formatNum(m)}</strong>
            </div>
          </div>
        </div>

        <!-- Paso 3 -->
        <div class="step-card">
          <div class="step-badge">3</div>
          <div class="step-content">
            <h4 class="step-title">Despeje de la Distancia 'u'</h4>
            <p class="step-explanation">
              Las dos raíces son equidistantes del promedio: <strong>(m + u)</strong> y <strong>(m - u)</strong>. Su producto debe ser igual a C:
            </p>
            <div class="step-formula-box">
              (m + u)(m - u) = C &rArr; m² - u² = C &rArr; u² = m² - C <br>
              u² = (${formatNum(m)})² - (${formatNum(C)}) = ${formatNum(m * m)} - (${formatNum(C)}) = <strong>${formatNum(u2)}</strong> <br>
              u = &radic;(${formatNum(u2)}) ${u2 >= 0 ? `= ${formatNum(Math.sqrt(u2))}` : `= ${formatNum(Math.sqrt(-u2))}i`}
            </div>
          </div>
        </div>

        <!-- Paso 4 -->
        <div class="step-card">
          <div class="step-badge">4</div>
          <div class="step-content">
            <h4 class="step-title">Soluciones Finales Simétricas</h4>
            <p class="step-explanation">
              Sumamos y restamos la distancia calculada 'u' al promedio 'm':
            </p>
            <div class="step-formula-box">
              <strong>x₁ = m + u = ${analysis.x1}</strong> <br>
              <strong>x₂ = m - u = ${analysis.x2}</strong>
            </div>
          </div>
        </div>
      `;
    }

    el.stepsContainer.innerHTML = html;
  }

  // --- RENDERIZADO DEL GRÁFICO INTERACTIVO (CANVAS) ---
  let canvasState = {
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    isHovering: false,
    hoverX: 0
  };

  function computeGraphBounds(analysis) {
    const { a, b, c, vertex, x1Raw, x2Raw } = analysis;
    if (a === 0 || !vertex) {
      return { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
    }

    let pointsX = [vertex.x, 0];
    let pointsY = [vertex.y, c, 0];

    if (x1Raw !== null && !isNaN(x1Raw)) pointsX.push(x1Raw);
    if (x2Raw !== null && !isNaN(x2Raw)) pointsX.push(x2Raw);

    let minX = Math.min(...pointsX);
    let maxX = Math.max(...pointsX);
    let spanX = Math.max(maxX - minX, 4);

    let minY = Math.min(...pointsY);
    let maxY = Math.max(...pointsY);
    let spanY = Math.max(maxY - minY, 6);

    const padX = spanX * 0.45;
    const padY = spanY * 0.45;

    // Ajustar por nivel de zoom
    const zoom = state.zoomLevel;
    const centerX = vertex.x + state.panOffset.x;
    const centerY = (vertex.y + c) / 2 + state.panOffset.y;

    const halfSpanX = (spanX / 2 + padX) / zoom;
    const halfSpanY = (spanY / 2 + padY) / zoom;

    return {
      xMin: centerX - halfSpanX,
      xMax: centerX + halfSpanX,
      yMin: centerY - halfSpanY,
      yMax: centerY + halfSpanY
    };
  }

  function drawParabolaGraph(analysis) {
    const canvas = el.canvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Adaptar a alta resolución (Retina Displays)
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const bounds = computeGraphBounds(analysis);
    canvasState.xMin = bounds.xMin;
    canvasState.xMax = bounds.xMax;
    canvasState.yMin = bounds.yMin;
    canvasState.yMax = bounds.yMax;

    // Funciones de transformación de coordenadas (Mundo a Píxeles)
    const toPxX = (x) => ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * width;
    const toPxY = (y) => height - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * height;
    const toWorldX = (px) => bounds.xMin + (px / width) * (bounds.xMax - bounds.xMin);

    const isDark = state.theme === 'dark';

    // 1. Limpiar fondo
    ctx.fillStyle = isDark ? '#080c14' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // 2. Cuadrícula secundaria y primaria
    const stepX = chooseGridStep(bounds.xMax - bounds.xMin);
    const stepY = chooseGridStep(bounds.yMax - bounds.yMin);

    ctx.lineWidth = 1;
    ctx.strokeStyle = isDark ? 'rgba(30, 41, 59, 0.65)' : 'rgba(226, 232, 240, 0.85)';

    // Líneas verticales
    const firstX = Math.floor(bounds.xMin / stepX) * stepX;
    for (let x = firstX; x <= bounds.xMax; x += stepX) {
      const px = toPxX(x);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }

    // Líneas horizontales
    const firstY = Math.floor(bounds.yMin / stepY) * stepY;
    for (let y = firstY; y <= bounds.yMax; y += stepY) {
      const py = toPxY(y);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }

    // 3. Ejes Cartesianos (X e Y)
    const axisY = toPxY(0);
    const axisX = toPxX(0);

    ctx.strokeStyle = isDark ? 'rgba(0, 212, 255, 0.45)' : 'rgba(0, 85, 212, 0.45)';
    ctx.lineWidth = 1.5;

    // Eje X
    if (axisY >= 0 && axisY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, axisY);
      ctx.lineTo(width, axisY);
      ctx.stroke();
    }

    // Eje Y
    if (axisX >= 0 && axisX <= width) {
      ctx.beginPath();
      ctx.moveTo(axisX, 0);
      ctx.lineTo(axisX, height);
      ctx.stroke();
    }

    // Etiquetas numéricas en ejes
    ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.85)' : 'rgba(71, 85, 105, 0.85)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let x = firstX; x <= bounds.xMax; x += stepX) {
      if (Math.abs(x) < 1e-6) continue;
      const px = toPxX(x);
      const py = Math.min(Math.max(axisY + 4, 12), height - 16);
      ctx.fillText(formatNum(x, 1), px, py);
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = firstY; y <= bounds.yMax; y += stepY) {
      if (Math.abs(y) < 1e-6) continue;
      const py = toPxY(y);
      const px = Math.min(Math.max(axisX - 4, 24), width - 8);
      ctx.fillText(formatNum(y, 1), px, py);
    }

    // 4. Eje de Simetría (Línea punteada)
    if (analysis.vertex) {
      const vx = toPxX(analysis.vertex.x);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(0, 102, 255, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(vx, 0);
      ctx.lineTo(vx, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 5. Curva de la Parábola y = ax² + bx + c
    const { a, b, c } = state;
    ctx.save();
    ctx.beginPath();

    const sampleSteps = 240;
    let started = false;
    for (let i = 0; i <= sampleSteps; i++) {
      const px = (i / sampleSteps) * width;
      const x = toWorldX(px);
      const y = a * x * x + b * x + c;
      const py = toPxY(y);

      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }

    // Estilo Cyber Cyan & Electric Blue de la curva
    ctx.strokeStyle = isDark ? '#00d4ff' : '#0066ff';
    ctx.lineWidth = 2.8;
    ctx.shadowColor = isDark ? 'rgba(0, 212, 255, 0.5)' : 'rgba(0, 102, 255, 0.4)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();

    // 6. Puntos Notables: Vértice, Raíces y Ordenada
    // Ordenada al origen (0, c)
    drawHighlightDot(ctx, toPxX(0), toPxY(c), '#a855f7', `(0, ${formatNum(c)})`);

    // Vértice
    if (analysis.vertex) {
      drawHighlightDot(
        ctx,
        toPxX(analysis.vertex.x),
        toPxY(analysis.vertex.y),
        '#00d4ff',
        `V(${formatNum(analysis.vertex.x)}, ${formatNum(analysis.vertex.y)})`
      );
    }

    // Raíces reales
    if (analysis.x1Raw !== null && !isNaN(analysis.x1Raw)) {
      drawHighlightDot(ctx, toPxX(analysis.x1Raw), toPxY(0), '#10b981', `x₁=${formatNum(analysis.x1Raw)}`);
    }
    if (analysis.x2Raw !== null && !isNaN(analysis.x2Raw) && Math.abs(analysis.x1Raw - analysis.x2Raw) > 1e-4) {
      drawHighlightDot(ctx, toPxX(analysis.x2Raw), toPxY(0), '#10b981', `x₂=${formatNum(analysis.x2Raw)}`);
    }

    // 7. Cursor interactivo hover
    if (canvasState.isHovering) {
      const hx = canvasState.hoverX;
      const x = toWorldX(hx);
      const y = a * x * x + b * x + c;
      const hy = toPxY(y);

      // Línea de mira hacia los ejes
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx, axisY);
      ctx.moveTo(hx, hy);
      ctx.lineTo(axisX, hy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Punto sobre la curva
      ctx.beginPath();
      ctx.arc(hx, hy, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 8;
      ctx.fill();

      // Tooltip informativo flotante
      el.canvasTooltip.style.display = 'block';
      el.canvasTooltip.innerHTML = `x: <strong>${formatNum(x, 2)}</strong>, &nbsp; y: <strong>${formatNum(y, 2)}</strong>`;
    } else {
      el.canvasTooltip.style.display = 'none';
    }
  }

  function drawHighlightDot(ctx, px, py, color, label) {
    if (px < -10 || px > el.canvas.width + 10 || py < -10 || py > el.canvas.height + 10) return;

    ctx.save();
    // Halo exterior
    ctx.beginPath();
    ctx.arc(px, py, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.fill();

    // Centro brillante
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fill();

    // Etiqueta
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = state.theme === 'dark' ? '#FBF8F3' : '#1A1815';
    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';
    ctx.fillText(label, px + 7, py - 6);

    ctx.restore();
  }

  function chooseGridStep(span) {
    const rawStep = span / 8;
    const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const rel = rawStep / mag;
    if (rel < 1.5) return mag;
    if (rel < 3.5) return 2 * mag;
    if (rel < 7.5) return 5 * mag;
    return 10 * mag;
  }

  // --- ACTUALIZACIÓN INTEGRAL DE LA APLICACIÓN ---
  function updateAll() {
    state.a = parseCoeff(el.inputA.value);
    state.b = parseCoeff(el.inputB.value);
    state.c = parseCoeff(el.inputC.value);

    updateLiveEquationPreview();

    const analysis = calculateAnalysis(state.a, state.b, state.c);

    // Actualizar Badge de Estado
    el.statusBadge.className = `status-badge ${analysis.statusClass}`;
    el.statusBadge.textContent = analysis.statusText;

    // Actualizar Raíces Principales
    el.x1Val.textContent = analysis.x1;
    el.x2Val.textContent = analysis.x2;

    // Actualizar Propiedades
    el.discVal.textContent = formatNum(analysis.disc);
    el.vertexVal.textContent = analysis.vertex ? `(${formatNum(analysis.vertex.x)}, ${formatNum(analysis.vertex.y)})` : 'N/A';
    el.axisVal.textContent = analysis.axis || 'N/A';
    el.concavityVal.textContent = analysis.concavity;
    el.interceptVal.textContent = analysis.intercept;
    el.canonicalVal.textContent = analysis.canonical;

    // Renderizar Paso a Paso
    renderStepByStep(analysis);

    // Renderizar Gráfico
    drawParabolaGraph(analysis);
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message) {
    el.toastMsg.textContent = message;
    el.toastNotice.classList.add('show');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
      el.toastNotice.classList.remove('show');
    }, 2400);
  }

  // --- PORTAPAPELES (CLIPBOARD) ---
  function copyToClipboard(text, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`¡${label} copiado al portapapeles!`);
      }).catch(() => fallbackCopy(text, label));
    } else {
      fallbackCopy(text, label);
    }
  }

  function fallbackCopy(text, label) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(`¡${label} copiado!`);
    } catch (e) {
      showToast('Error al copiar');
    }
    document.body.removeChild(ta);
  }

  // --- GESTIÓN DEL TEMA (OSCURO / CLARO) ---
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cuadraticapp_theme', theme);
    el.themeToggleBtn.innerHTML = theme === 'dark'
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    drawParabolaGraph(calculateAnalysis(state.a, state.b, state.c));
  }

  // --- EVENT LISTENERS ---
  function initEvents() {
    // Inputs interactivos con cálculo en vivo
    [el.inputA, el.inputB, el.inputC].forEach(input => {
      input.addEventListener('input', () => {
        state.zoomLevel = 1.0;
        state.panOffset = { x: 0, y: 0 };
        updateAll();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') updateAll();
      });
    });

    // Botones Stepper (+ y -)
    document.querySelectorAll('.btn-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const step = parseFloat(btn.getAttribute('data-step')) || 1;
        const targetInput = document.getElementById(targetId);
        if (targetInput) {
          const current = parseCoeff(targetInput.value);
          targetInput.value = formatNum(current + step);
          updateAll();
        }
      });
    });

    // Botón de cálculo explícito
    if (el.btnCalculate) {
      el.btnCalculate.addEventListener('click', () => {
        updateAll();
        showToast('Ecuación resuelta');
      });
    }

    // Botón de limpiar
    if (el.btnClear) {
      el.btnClear.addEventListener('click', () => {
        el.inputA.value = '1';
        el.inputB.value = '0';
        el.inputC.value = '0';
        state.zoomLevel = 1.0;
        state.panOffset = { x: 0, y: 0 };
        updateAll();
        showToast('Valores reiniciados');
      });
    }

    // Botones de presets (ejemplos rápidos)
    document.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        el.inputA.value = btn.getAttribute('data-a');
        el.inputB.value = btn.getAttribute('data-b');
        el.inputC.value = btn.getAttribute('data-c');
        state.zoomLevel = 1.0;
        state.panOffset = { x: 0, y: 0 };
        updateAll();
        showToast(`Cargado: ${btn.textContent}`);
      });
    });

    // Cambio de Método (Bhaskara / Po-Shen Loh)
    if (el.methodBhaskaraBtn && el.methodPoShenLohBtn) {
      el.methodBhaskaraBtn.addEventListener('click', () => {
        state.method = 'bhaskara';
        el.methodBhaskaraBtn.classList.add('active');
        el.methodPoShenLohBtn.classList.remove('active');
        updateAll();
      });

      el.methodPoShenLohBtn.addEventListener('click', () => {
        state.method = 'poshenloh';
        el.methodPoShenLohBtn.classList.add('active');
        el.methodBhaskaraBtn.classList.remove('active');
        updateAll();
      });
    }

    // Copiar resultados de raíces
    document.querySelectorAll('.btn-copy-root').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-copy');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          copyToClipboard(targetEl.textContent, targetId.toUpperCase());
        }
      });
    });

    // Cambio de Tema Oscuro/Claro
    if (el.themeToggleBtn) {
      el.themeToggleBtn.addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      });
    }

    // Controles de Zoom del Canvas
    if (el.btnZoomIn) {
      el.btnZoomIn.addEventListener('click', () => {
        state.zoomLevel = Math.min(state.zoomLevel * 1.35, 5.0);
        drawParabolaGraph(calculateAnalysis(state.a, state.b, state.c));
      });
    }

    if (el.btnZoomOut) {
      el.btnZoomOut.addEventListener('click', () => {
        state.zoomLevel = Math.max(state.zoomLevel / 1.35, 0.2);
        drawParabolaGraph(calculateAnalysis(state.a, state.b, state.c));
      });
    }

    if (el.btnResetView) {
      el.btnResetView.addEventListener('click', () => {
        state.zoomLevel = 1.0;
        state.panOffset = { x: 0, y: 0 };
        drawParabolaGraph(calculateAnalysis(state.a, state.b, state.c));
      });
    }

    // Eventos de Mouse sobre el Canvas (Interactividad)
    if (el.canvas) {
      el.canvas.addEventListener('mousemove', (e) => {
        const rect = el.canvas.getBoundingClientRect();
        canvasState.isHovering = true;
        canvasState.hoverX = e.clientX - rect.left;
        drawParabolaGraph(calculateAnalysis(state.a, state.b, state.c));
      });

      el.canvas.addEventListener('mouseleave', () => {
        canvasState.isHovering = false;
        drawParabolaGraph(calculateAnalysis(state.a, state.b, state.c));
      });
    }

    // Redimensionamiento responsivo de la ventana
    window.addEventListener('resize', () => {
      drawParabolaGraph(calculateAnalysis(state.a, state.b, state.c));
    });
  }

  // --- INICIALIZACIÓN ---
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(state.theme);
    initEvents();
    updateAll();
  });

  // Exportar al ámbito global para compatibilidad con scripts históricos
  window.CuadraticApp = {
    calculate: updateAll,
    state: state
  };

})();
