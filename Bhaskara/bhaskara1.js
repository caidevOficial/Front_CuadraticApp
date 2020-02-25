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

if ((terminoA && terminoB && terminoC) !=0){

	determinante = parseFloat(Math.sqrt(((terminoB)**2) - 4*terminoA*terminoC));
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

	document.getElementById('x1').value = solucion_x1;
	document.getElementById('x2').value = solucion_x2;


}//FIN DE LA FUNCIÓN Bhaskara

/*function pooShenLoo(){


}*/