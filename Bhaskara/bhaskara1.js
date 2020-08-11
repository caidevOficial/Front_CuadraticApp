/*
Resolver una ecuacion de segundo grado mediante resolvente de bhaskara.
Funciones:
  1 - Si el coeficiente del termino cuadratico es 0, denotara un mensaje de error advirtiendo que el termino cuadratico 0, por lo tanto pierde su condicion de polinomio de segundo grado.
  2 - Si la determinante da un numero negativo ( antes de efectuar su raiz cuadrada) dara un mensaje de error advirtiendo que las raices no son reales, sino imaginarias.
  3 - en caso de no cumplirse los puntos antes mencionados, la ecuacion se resolvera sin problemas, denotando sus dos soluciones!
By CaiDev.
*/

function bhaskara() {

  //Tomo datos del form:
  var terminoA = parseInt(document.getElementById('terminoA').value);
  var terminoB = parseInt(document.getElementById('terminoB').value);
  var terminoC = parseInt(document.getElementById('terminoC').value);


  var determinante;

  // Por default las inicializo con mensaje de error.
  var formulaCuadratica_x1 = "Ecuación Inválida";
  var formulaCuadratica_x2 = "Ecuación Inválida";
  var Xvertice = "Error al hallar";
  var Yvertice = "Error al hallar";

  if (terminoA == 0) {
    // Si A = 0, doy mensajes de error e imprimo resultados default.
    alert("Si el termino A es 0, perdera el termino cuadratico quedandote una ecuacion lineal.");
  }
  else {
    // Calculo el determinante
    determinante = parseFloat(Math.sqrt(((terminoB * terminoB) - (4 * terminoA * terminoC))));

    // Si el determinante es 0 o positivo:
    if (determinante >= 0) {
      //Obtengo X1 y X2
      formulaCuadratica_x1 = ((-(terminoB)) + determinante) / (2 * terminoA);
      formulaCuadratica_x2 = ((-(terminoB)) - determinante) / (2 * terminoA);
      //Obtengo los vertices.
      Xvertice = (-(terminoB)) / (2 * (terminoA));
      Yvertice = (terminoA * (Math.pow(Xvertice, 2))) + (terminoB * Xvertice) + terminoC;

      //Caracteristicas de las parabolas, Imprimo un alert segun Termino Cuadratico.
      if (terminoA > 0) {
        alert("La parabola tiende a +Infinito");
      } else {
        alert("La parabola tiende a -Infinito");
      }
    }
    // si el determinante es negativo, imprimo mensaje de error.
    else {
      formulaCuadratica_x1 = "Raíz imaginaria";
      formulaCuadratica_x2 = "Raíz imaginaria";
      Xvertice = "Error al hallar";
      Yvertice = "Error al hallar";
      alert("No tiene soluciónes reales - raices imaginarias");
    }
  }

  //Imprimo resultados de X1, X2, Vertice X y Vertice Y.
  document.getElementById('x1').value = formulaCuadratica_x1;
  document.getElementById('x2').value = formulaCuadratica_x2;
  document.getElementById('Xvertice').value = Xvertice;
  document.getElementById('Yvertice').value = Yvertice;
}//FIN DE LA FUNCIÓN Bhaskara
