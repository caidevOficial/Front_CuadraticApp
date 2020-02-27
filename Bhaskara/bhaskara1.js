/*
Resolver una ecuacion de segundo grado mediante bhaskara.
By CaiDev.
*/
function bhaskara()
{
//import Math();

var terminoA = parseInt(document.getElementById('terminoA').value);
var terminoB = parseInt(document.getElementById('terminoB').value);
var terminoC = parseInt(document.getElementById('terminoC').value);

var determinante;

var formulaCuadratica_x1;
var formulaCuadratica_x2;

var solucion_x1;
var solucion_x2;

if (terminoA!=0){

	determinante = parseFloat(Math.sqrt(((terminoB*terminoB) - (4*terminoA*terminoC)));
	if (determinante >=0){
		formulaCuadratica_x1 = ((-(terminoB))+determinante)/(2*terminoA);
		formulaCuadratica_x2 =  ((-(terminoB))-determinante)/(2*terminoA);	
	}
	else{
		alert("No tiene solución");
	}
	
}
	solucion_x1 = formulaCuadratica_x1;
	solucion_x2 = formulaCuadratica_x2;

	function decimalToFraction(value, donly = true) {
  var tolerance = 1.0E-6; // a partir de cuantas decimales se hace el redondeo
  var h1 = 1;
  var h2 = 0;
  var k1 = 0;
  var k2 = 1;
  var negative = false;
  var i;

  if (parseInt(value) == value) { // si el valor es un número entero, detener el código
    return value;
  } else if (value < 0) {
    negative = true;
    value = -value;
  }

  if (donly) {
    i = parseInt(value);
    value -= i;
  }

  var b = value;

  do {
    var a = Math.floor(b);
    console.log(a)
    var aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(value - h1 / k1) > value * tolerance);

  return (negative ? "-" : '') + ((donly & (i != 0)) ? i + ' ' : '') + (h1 == 0 ? '' : h1 + "/" + k1);
}
	document.getElementById('x1').value = decimalToFraction(solucion_x1);
	document.getElementById('x2').value = decimalToFraction(solucion_x2);


}//FIN DE LA FUNCIÓN Bhaskara

/*function pooShenLoo(){


}*/
