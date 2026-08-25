/*
Resolver una ecuacion de segundo grado mediante resolvente de bhaskara.
Funciones:
  1 - Si el coeficiente del termino cuadratico es 0, denotara un mensaje de error advirtiendo que el termino cuadratico 0, por lo tanto pierde su condicion de polinomio de segundo grado.
  2 - Si la determinante da un numero negativo ( antes de efectuar su raiz cuadrada) dara un mensaje de error advirtiendo que las raices no son reales, sino imaginarias.
  3 - en caso de no cumplirse los puntos antes mencionados, la ecuacion se resolvera sin problemas, denotando sus dos soluciones!
By CaiDev.
*/

function bhaskara() {
  var coeficientes = obtenerCoeficientes();
  var resultados;

  if (coeficientes.a === 0) {
    alert("Si el termino A es 0, perdera el termino cuadratico quedandote una ecuacion lineal.");
    resultados = resultadosInvalidos("Ecuación Inválida", "Error al hallar");
  } else {
    resultados = calcularResultados(coeficientes);
  }

  mostrarResultados(resultados);
  dibujarGrafico(coeficientes, resultados);
}

function obtenerCoeficientes() {
  return {
    a: Number(document.getElementById('terminoA').value),
    b: Number(document.getElementById('terminoB').value),
    c: Number(document.getElementById('terminoC').value)
  };
}

function calcularResultados(coeficientes) {
  var a = coeficientes.a;
  var b = coeficientes.b;
  var c = coeficientes.c;
  var discriminante = (b * b) - (4 * a * c);

  if (discriminante < 0) {
    alert("No tiene soluciónes reales - raices imaginarias");
    return resultadosInvalidos("Raíz imaginaria", "Error al hallar", "No disponible");
  }

  var raizDiscriminante = Math.sqrt(discriminante);
  var x1 = (-b + raizDiscriminante) / (2 * a);
  var x2 = (-b - raizDiscriminante) / (2 * a);
  var xVertice = -b / (2 * a);
  var yVertice = (a * Math.pow(xVertice, 2)) + (b * xVertice) + c;

  alert(a > 0 ? "La parabola tiende a +Infinito" : "La parabola tiende a -Infinito");

  return {
    x1: x1,
    x2: x2,
    xVertice: xVertice,
    yVertice: yVertice,
    formulaCanonica: "y = " + a + "(" + formatoResta(xVertice) + ")^2" + formatoSuma(yVertice),
    formulaFactorizada: "y = " + a + "(" + formatoResta(x1) + ")("
      + formatoResta(x2) + ")"
  };
}

function resultadosInvalidos(valorRaiz, valorVertice, valorFormula) {
  return {
    x1: valorRaiz,
    x2: valorRaiz,
    xVertice: valorVertice,
    yVertice: valorVertice,
    formulaCanonica: valorFormula || "Ecuación Inválida",
    formulaFactorizada: valorFormula || "Ecuación Inválida"
  };
}

function mostrarResultados(resultados) {
  document.getElementById('x1').value = resultados.x1;
  document.getElementById('x2').value = resultados.x2;
  document.getElementById('Xvertice').value = resultados.xVertice;
  document.getElementById('Yvertice').value = resultados.yVertice;
  document.getElementById('formulaCanonica').value = resultados.formulaCanonica;
  document.getElementById('formulaFactorizada').value = resultados.formulaFactorizada;
}

function dibujarGrafico(coeficientes, resultados) {
  var canvas = document.getElementById('graficoParabola');
  var contexto = canvas.getContext('2d');
  var ancho = canvas.clientWidth;
  var alto = canvas.clientHeight;
  var margen = { superior: 24, derecho: 20, inferior: 34, izquierdo: 46 };
  var xMinimo;
  var xMaximo;
  var yMinimo;
  var yMaximo;
  var rangoX;
  var rangoY;

  canvas.width = ancho * window.devicePixelRatio;
  canvas.height = alto * window.devicePixelRatio;
  contexto.scale(window.devicePixelRatio, window.devicePixelRatio);
  contexto.clearRect(0, 0, ancho, alto);

  if (!Number.isFinite(resultados.x1) || !Number.isFinite(resultados.x2)) {
    contexto.fillStyle = '#666';
    contexto.font = '16px sans-serif';
    contexto.textAlign = 'center';
    contexto.fillText('No hay gráfico para mostrar', ancho / 2, alto / 2);
    return;
  }

  xMinimo = Math.min(resultados.x1, resultados.x2, resultados.xVertice);
  xMaximo = Math.max(resultados.x1, resultados.x2, resultados.xVertice);
  rangoX = Math.max(xMaximo - xMinimo, 4);
  xMinimo -= rangoX * 0.3;
  xMaximo += rangoX * 0.3;

  yMinimo = 0;
  yMaximo = 0;
  for (var indice = 0; indice <= 100; indice++) {
    var x = xMinimo + ((xMaximo - xMinimo) * indice / 100);
    var y = (coeficientes.a * Math.pow(x, 2)) + (coeficientes.b * x) + coeficientes.c;
    yMinimo = Math.min(yMinimo, y);
    yMaximo = Math.max(yMaximo, y);
  }

  rangoY = Math.max(yMaximo - yMinimo, 4);
  yMinimo -= rangoY * 0.15;
  yMaximo += rangoY * 0.15;

  var graficoAncho = ancho - margen.izquierdo - margen.derecho;
  var graficoAlto = alto - margen.superior - margen.inferior;
  var convertirX = function(valor) {
    return margen.izquierdo + ((valor - xMinimo) / (xMaximo - xMinimo)) * graficoAncho;
  };
  var convertirY = function(valor) {
    return margen.superior + ((yMaximo - valor) / (yMaximo - yMinimo)) * graficoAlto;
  };

  contexto.fillStyle = '#ffffff';
  contexto.fillRect(0, 0, ancho, alto);
  contexto.strokeStyle = '#e2e2e2';
  contexto.lineWidth = 1;
  contexto.font = '11px sans-serif';
  contexto.fillStyle = '#555';
  contexto.textAlign = 'center';

  for (var linea = 0; linea <= 10; linea++) {
    var posicionX = margen.izquierdo + (graficoAncho * linea / 10);
    var valorX = xMinimo + ((xMaximo - xMinimo) * linea / 10);
    contexto.beginPath();
    contexto.moveTo(posicionX, margen.superior);
    contexto.lineTo(posicionX, alto - margen.inferior);
    contexto.stroke();
    contexto.fillText(formatoNumero(valorX), posicionX, alto - 12);
  }

  for (var fila = 0; fila <= 8; fila++) {
    var posicionY = margen.superior + (graficoAlto * fila / 8);
    var valorY = yMaximo - ((yMaximo - yMinimo) * fila / 8);
    contexto.beginPath();
    contexto.moveTo(margen.izquierdo, posicionY);
    contexto.lineTo(ancho - margen.derecho, posicionY);
    contexto.stroke();
    contexto.textAlign = 'right';
    contexto.fillText(formatoNumero(valorY), margen.izquierdo - 7, posicionY + 4);
  }

  contexto.strokeStyle = '#555';
  contexto.lineWidth = 1.5;
  if (yMinimo <= 0 && yMaximo >= 0) {
    contexto.beginPath();
    contexto.moveTo(margen.izquierdo, convertirY(0));
    contexto.lineTo(ancho - margen.derecho, convertirY(0));
    contexto.stroke();
  }
  if (xMinimo <= 0 && xMaximo >= 0) {
    contexto.beginPath();
    contexto.moveTo(convertirX(0), margen.superior);
    contexto.lineTo(convertirX(0), alto - margen.inferior);
    contexto.stroke();
  }

  contexto.strokeStyle = '#00a1f5';
  contexto.lineWidth = 3;
  contexto.beginPath();
  for (var punto = 0; punto <= 240; punto++) {
    var puntoX = xMinimo + ((xMaximo - xMinimo) * punto / 240);
    var puntoY = (coeficientes.a * Math.pow(puntoX, 2)) + (coeficientes.b * puntoX) + coeficientes.c;
    if (punto === 0) {
      contexto.moveTo(convertirX(puntoX), convertirY(puntoY));
    } else {
      contexto.lineTo(convertirX(puntoX), convertirY(puntoY));
    }
  }
  contexto.stroke();

  dibujarPunto(contexto, convertirX(resultados.xVertice), convertirY(resultados.yVertice), '#e85d04', 'V');
  dibujarPunto(contexto, convertirX(resultados.x1), convertirY(0), '#2a9d8f', 'x1');
  dibujarPunto(contexto, convertirX(resultados.x2), convertirY(0), '#2a9d8f', 'x2');
}

function dibujarPunto(contexto, x, y, color, etiqueta) {
  contexto.fillStyle = color;
  contexto.beginPath();
  contexto.arc(x, y, 5, 0, 2 * Math.PI);
  contexto.fill();
  contexto.font = 'bold 12px sans-serif';
  contexto.textAlign = 'left';
  contexto.fillText(etiqueta, x + 7, y - 7);
}

function formatoNumero(valor) {
  return Number(valor.toFixed(2));
}

function formatoResta(valor) {
  return valor < 0 ? "x + " + Math.abs(valor) : "x - " + valor;
}

function formatoSuma(valor) {
  return valor < 0 ? " - " + Math.abs(valor) : " + " + valor;
}


