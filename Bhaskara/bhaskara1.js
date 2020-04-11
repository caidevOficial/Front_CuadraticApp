/*
Resolver una ecuacion de segundo grado mediante resolvente de bhaskara.
Funciones:
  1 - Si el coeficiente del termino cuadratico es 0, denotara un mensaje de error advirtiendo que la division principal sera por 0, por lo tanto no se puede efectuar.
  2 - Si la determinante da un numero negativo ( antes de efectuar su raiz cuadrada) dara un mensaje de error advirtiendo que las raices no son reales, sino imaginarias.
  3 - en caso de no cumplirse los puntos antes mencionados, la ecuacion se resolvera sin problemas, denotando sus dos soluciones!
By CaiDev.
*/

function bhaskara()
{

var terminoA = parseInt(document.getElementById('terminoA').value);
var terminoB = parseInt(document.getElementById('terminoB').value);
var terminoC = parseInt(document.getElementById('terminoC').value);

var determinante;

var formulaCuadratica_x1;
var formulaCuadratica_x2;

var solucion_x1;
var solucion_x2;

if (terminoA!=0){

	determinante = parseFloat(Math.sqrt(((terminoB*terminoB) - (4*terminoA*terminoC))));
	if (determinante >= 0){
		formulaCuadratica_x1 = ((-(terminoB))+determinante)/(2*terminoA);
		formulaCuadratica_x2 =  ((-(terminoB))-determinante)/(2*terminoA);	
	}
	else{
      formulaCuadratica_x1 = "Raíz imaginaria";
      formulaCuadratica_x2 = "Raíz imaginaria";
      alert("No tiene soluciónes reales - raices imaginarias");
	}
	
}
else {
      formulaCuadratica_x1 = "Ecuación Inválida";
      formulaCuadratica_x2 = "Ecuación Inválida";
    	alert("Si el termino A es 0, pretenderas dividir tambien por 0 y eso NO SE PUEDE!");
}
solucion_x1 = formulaCuadratica_x1;
solucion_x2 = formulaCuadratica_x2;

	
document.getElementById('x1').value = solucion_x1;
document.getElementById('x2').value = solucion_x2;


}//FIN DE LA FUNCIÓN Bhaskara
