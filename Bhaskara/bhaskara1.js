/*
  Resolvente de Bhaskara y Ecuaciones Cuadráticas
  Actualizado con soporte para números flotantes/decimales, raíces complejas,
  ecuaciones lineales degeneradas y sin alertas intrusivas.
  Paleta y filosofía CuadraticApp Yaguareté.
  By CaiDev & Modernized Architecture.
*/

function parseValue(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  var str = String(val).trim().replace(',', '.');
  if (str === '' || str === '-' || str === '+') return 0;
  if (str.indexOf('/') !== -1) {
    var parts = str.split('/');
    var n = parseFloat(parts[0]);
    var d = parseFloat(parts[1]);
    if (!isNaN(n) && !isNaN(d) && d !== 0) return n / d;
  }
  var res = parseFloat(str);
  return isNaN(res) ? 0 : res;
}

function formatResult(num, dec) {
  dec = dec || 4;
  if (Number.isInteger(num)) return num.toString();
  return Number(num.toFixed(dec)).toString();
}

function bhaskara() {
  var elA = document.getElementById('terminoA');
  var elB = document.getElementById('terminoB');
  var elC = document.getElementById('terminoC');

  var terminoA = elA ? parseValue(elA.value) : 0;
  var terminoB = elB ? parseValue(elB.value) : 0;
  var terminoC = elC ? parseValue(elC.value) : 0;

  var solucion_x1 = "";
  var solucion_x2 = "";

  if (terminoA !== 0) {
    var discriminante = (terminoB * terminoB) - (4 * terminoA * terminoC);

    if (discriminante > 0) {
      var raizDelta = Math.sqrt(discriminante);
      var x1 = ((-terminoB) + raizDelta) / (2 * terminoA);
      var x2 = ((-terminoB) - raizDelta) / (2 * terminoA);
      solucion_x1 = formatResult(x1);
      solucion_x2 = formatResult(x2);
    } else if (Math.abs(discriminante) < 1e-12) {
      var xUnica = (-terminoB) / (2 * terminoA);
      solucion_x1 = formatResult(xUnica);
      solucion_x2 = formatResult(xUnica) + " (Raíz doble)";
    } else {
      var parteReal = (-terminoB) / (2 * terminoA);
      var parteImaginaria = Math.sqrt(-discriminante) / (2 * Math.abs(terminoA));
      var imagStr = (Math.abs(parteImaginaria - 1) < 1e-6) ? "i" : formatResult(parteImaginaria) + "i";
      solucion_x1 = formatResult(parteReal) + " + " + imagStr;
      solucion_x2 = formatResult(parteReal) + " - " + imagStr;
    }
  } else {
    if (terminoB !== 0) {
      var xLin = -terminoC / terminoB;
      solucion_x1 = formatResult(xLin) + " (Lineal, A=0)";
      solucion_x2 = "N/A (grado 1)";
    } else {
      if (terminoC === 0) {
        solucion_x1 = "Infinitas Soluciones (0=0)";
        solucion_x2 = "Identidad";
      } else {
        solucion_x1 = "Sin Solución";
        solucion_x2 = "Contradicción";
      }
    }
  }

  var outX1 = document.getElementById('x1');
  var outX2 = document.getElementById('x2');
  if (outX1) outX1.value = solucion_x1;
  if (outX2) outX2.value = solucion_x2;

  // Si existe el motor moderno global, sincronizar
  if (window.CuadraticApp && typeof window.CuadraticApp.calculate === 'function') {
    window.CuadraticApp.calculate();
  }
}
