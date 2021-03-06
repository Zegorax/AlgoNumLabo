/*
Algorithmes Numériques
Laboratoire #4 : Dérivation numérique
Equipe 1 : Verardo Luca, Portmann Alexis, Marty Mathias
Date de développement : 25.04.2020
*/

//-------TEST---------
/*
let f = math.parse('sin(x)');
let n = 7;
let h = 0.001;
let a = 0;
let I = {"a": -6.14, "b": 6.14};
let dx = 0.01;
let finitediff = false;
*/
//--------------------
//-------GRAPH--------
var mainGraph;
var needsRebuild = false;
//--------------------

window.onload = function () {
    this.document.getElementById("mainComputeButton").click();
}

//Create cosinus from the mac laurin
//n is the degree of the mac laurin series
//I is the interval to compute and draw the functions
//dx is the step between 2 computed points
// finitediff : if true, dont use the version from the polynomial of degree 4
function computeCosinus(n, h, I, dx, finitediff)
{
    //Monomial list
    let E = [];

    for(let i = 0; i < n; i++)
    {
        //Add each monomial into a the expression tree array
        E.push(math.parse(" (( -1 ) ^ " + i + ") * x ^ ( 2 * " + i + ") / ((2 * " + i + ")!)"));
    }

    //Taylor polinomial
    let cos = math.parse("0");

    E.forEach(e => {
        cos = new math.expression.node.OperatorNode('+', 'add', [cos, e]);
    });

    //Compute it's 2 first derivates
    let cosder = null;
    let cosderder = null;
    if(finitediff)
    {
        cosder = naiveDerivate(cos, 1);
        cosderder = naiveDerivate(cosder, 1);
    }
    else {
        cosder = derivateFromNOrderFiniteCentralDifference(cos, 1);
        cosderder = derivateFromNOrderFiniteCentralDifference(cos, 2);
    }


    //Compile them to gain som ( a lot ) perf
    cos = cos.compile();
    cosder = cosder.compile();
    cosderder = cosderder.compile();

    //Data to draw
    let Dcos = [];
    let Dcosder = [];
	let Dcosderder = [];
	let X = [];

    //Compute them
    for(let x = I.a; x < I.b; x += dx)
    {
		X.push(x);
        Dcos.push(cos.evaluate({x: x}));
        Dcosder.push(cosder.evaluate({x: x, h: h}));
        Dcosderder.push(cosderder.evaluate({x: x, h: h}));
    }
    draw(X, Dcos, "cosinus from mac laurin (degree : " + n + ")", I);
    draw(X, Dcosder, "first derivative of cosinus", I);
    draw(X, Dcosderder, "second derivative of cosinus", I);
}

//f is the function, n = taylor pol. degree, h = h, a = where's the taylor pol. is centered,
// I is the interval where to compute and dx is the step between 2 values
// D isArray of degree of derivatives to draw
// finitediff : if true, dont use the version from the polynomial of degree 4
function compute(f, n, h, a, I, dx, D, finitediff)
{
    //Succecive derivatives at a
    let d = [f.evaluate({x: a})];

    //Stock the current derivative
    let tmp = f;

    //Compute them
    for(let i = 0; i < n; i++) //The 0 derivate is f, already in the array
    {
        if(finitediff)
        {
            tmp = naiveDerivate(tmp, 1); //Use the same method over and over...
        }
        else {
            tmp = derivateFromNOrderFiniteCentralDifference(f, i + 1);
        }
        d.push(tmp.evaluate({x: a, h: h})); //Push a js compiled function, not a string
    }

    //Draw the first 2 derivatives
    drawDerivatives(f, h ,I, dx, D, finitediff);

    //Draw taylor polynom
    drawTaylor(d, a, I, dx);

    //Draw the function (without taylor approximation)
    drawFunction(f, I, dx)
}

//Function called via the "Show" button to draw a user-entered function
function mainCompute()
{
	let expr = document.getElementById("inputSpecificFunction").value;
	let optionF
	if(expr != "")
	{
		try {
			optionF = math.parse(expr)
		} catch (e) {
			console.log("Wrong syntax")
			alert("The entered function has a syntax error")
		}

		let latex = optionF.toTex()
		document.getElementById("labelSpecificFunction").innerHTML = "\\(f(x) = " + latex + "\\)"
		MathJax.typeset()
	}
	else{
		optionF = f;
	}

    let optionN = parseFloat(document.getElementById("optionN").value);
	let optionH = parseFloat(document.getElementById("optionH").value);
	let optionA = parseFloat(document.getElementById("optionA").value);
	let optionI = {"a": parseFloat(document.getElementById("optionRangeStart").value), "b": parseFloat(document.getElementById("optionRangeEnd").value)};
	let optionDX = parseFloat(document.getElementById("optionDX").value);
	let optionNaive = document.getElementById("checkOldMethod").checked;
    let tmp = document.getElementById("optionDerivatives").value.split(",");
    let optionDerivative = [];
    tmp.forEach( i => {
        optionDerivative.push(parseInt(i)); //Transform to int
    });

	needsRebuild = true;

	compute(optionF, optionN, optionH, optionA, optionI, optionDX, optionDerivative, optionNaive);
	mainGraph.update();
}

function mainComputeCosinus()
{
    let optionN = parseFloat(document.getElementById("optionN").value);
    let optionH = parseFloat(document.getElementById("optionH").value);
    let optionI = {"a": parseFloat(document.getElementById("optionRangeStart").value), "b": parseFloat(document.getElementById("optionRangeEnd").value)};
    let optionDX = parseFloat(document.getElementById("optionDX").value);
    let optionNaive = document.getElementById("checkOldMethod").checked;

	needsRebuild = true;
	computeCosinus(optionN, optionH, optionI, optionDX, optionNaive);
	mainGraph.update();
}

//https://en.wikipedia.org/wiki/Finite_difference
//Generalized the methods seen in classes (we chose the central version, because it's O(n^2))
//f function to derivate
//n degree of the derivate
function derivateFromNOrderFiniteCentralDifference(f, n)
{
    //If degree = 0, return the function
    if(n == 0)
    {
        return f;
    }
    else
    {
        //Compute delta
        let delta = math.parse("0");

        //Binomial coef to use
        let binomialCoefA = math.factorial(n); //Numerator
        let binomialCoefB = 0; //Denumerator
        let binomialCoef = 0; //A is a contant part ( = n ! )

        //Compute each element of the sum as an expression tree
        let F = [];
        for(let i = 0; i <= n; i++)
        {
            //Compute next binomial coef
            binomialCoefB = math.factorial(i)* math.factorial(n - i); // new B
            binomialCoef = binomialCoefA / binomialCoefB; // new coef

            //Sign to use
            let sign = ( i % 2 == 0 ? 1 : -1);

            //Evaluate the function at the expression below
            let e = math.parse("x + (" + n + " / 2 - " + i + ") * h");

            //subsitute function expression
            let Fe = subby(f, 'x', e);

            //Create the node
            F.push(subby(math.parse(sign + " * " + binomialCoef + " * f"), 'f', Fe));
        }

        //delta is te sum of of the element of F
        F.forEach(e => {
            delta = new math.expression.node.OperatorNode('+', 'add', [delta, e]);
        });

        //Divide delta by h to the power of n
        let tmp = new math.expression.node.OperatorNode('/', 'divide', [delta, math.parse("h^" + n)]);

        //Return the derivative
        return tmp;
    }
}

//Naive way to compute a derivative (call multiple time the first derivate method....)
//f function to derivate
//n degree of the derivate
function naiveDerivate(f, n)
{
    let tmp = f;

    for(let i = 0; i < n; i++) //The 0 derivate is f, already in the array
    {
        tmp = derivateFirstOrder(tmp);
    }

    //Return the new function
    return tmp;
}

//f is function to derivate and h is h
function derivateFirstOrder(f)
{
    //Expression tree of f(x + h/2), f(x-h/2), f(x + h), f(x - h)
    let e1 = math.parse("(x + h/2)");
    let e2 = math.parse("(x - h/2)");
    let e3 = math.parse("(x + h)");
    let e4 = math.parse("(x - h)");

    let f1 = subby(f, 'x', e1);
    let f2 = subby(f, 'x', e2);
    let f3 = subby(f, 'x', e3);
    let f4 = subby(f, 'x', e4);

    //Return the derivative as an expression tree
    return subby(subby(subby(subby(math.parse("( 8 * ( a - b ) - c + d ) / ( 6 * h )"), 'a', f1), 'b', f2), 'c', f3), 'd', f4);
}

//f : function where to subsitute x
//x : value to change
//e : expression to subsitute
function subby(f, x, e)
{
    return f.transform(function (node, path, parent) {
        if (node.isSymbolNode && node.name === x) { //Substitude x by
            return e;
        }
        else {
            return node
        }
    });
}


//f is the function to derivate and drow, h = h,
// I is the interval where to compute and dx is the step between 2 values
// D isArray of degree of derivatives to draw
// finitediff : if true, dont use the version from the polynomial of degree 4
function drawDerivatives(f, h, I, dx, D, finitediff)
{
    //Array containing label and function itself
    let F = [];

    //h as a node
    let nodeH = new math.expression.node.ConstantNode(h);

    D.forEach( d => {
        let data = {l : d + " nt derivative", f : null, Y : []};
        if(finitediff)
        {
            data.f = subby(naiveDerivate(f,d), 'h', nodeH);
        }
        else {
            data.f = subby(derivateFromNOrderFiniteCentralDifference(f,d), 'h', nodeH);
        }

        F.push(data);
    });

    //Computes their values in I
    let X = [];
    for(let x = I.a; x < I.b; x += dx)
    {
        X.push(x);

        for(let i = 0; i < F.length; i++)
            F[i].Y.push(F[i].f.evaluate({x:x}));
    }

    //Draw them with the right label
    F.forEach( data => {
        draw(X, data.Y, data.l, I);
    });
}

//d is an array of all needed consecutive derivatives, a is where the tylor polynomial is centered
// and I is the interval where to compute and dx is the step between 2 values
function drawTaylor(d, a, I, dx)
{
    //Transform all derivatives value into taylor series coefs
    let c = [d[0]]; //First value
    let fact = 1; //Store the current factorial term here, for optimization
    for(let k = 1; k < d.length; k++) //Start at 1 for math purpose...
    {
        //Compute new factorial term
        fact *= k;
        c.push(d[k]/(fact));
    }

	//Values to draw
	let X = [];
    let Y = [];

    //Foreach x to compute, compute the polynomial at the current pos, using horner method to optimize
    for(let x = I.a; x < I.b; x += dx)
    {
		X.push(x);
        Y.push(horner(c, x - a));
    }

    //Draw the taylor polynomial
    draw(X, Y, "Taylor polynomial of degree " + (d.length - 1) + " centerd at " + a, I);
}

// f is the function to draw, I is the interval where to draw the function and dx is the step
function drawFunction(f, I, dx)
{
	//Values to draw
	let X = [];
    let Y = [];

    //Compute them
    for(let x = I.a; x < I.b; x += dx)
    {
		X.push(x);
        Y.push(f.evaluate({x:x}));
    }

    //Draw them
    draw(X, Y, "real function", I);
}

// c is an array of the taylor polynomial coefs and dx is (x - a)
function horner(c, dx)
{
    //Value
    let tmp = c[c.length - 1];

    //For each degree n
    for(let n = c.length - 1; n > 0; n--)
    {
        //Multiply the old value by dx and add it the next coef
        tmp = tmp * dx + c[n - 1];
    }

    //Return the value
    return tmp;
}

//Main function updating the graph with correct values
function draw(X, Y, label, I)
{
	if(needsRebuild == true && mainGraph != undefined)
	{
		mainGraph.stop();
		mainGraph.destroy();
		mainGraph.destroy;
		needsRebuild = false;
		mainGraph = undefined;
	}

	if(mainGraph == undefined)
	{
		var ctx = document.getElementById("chart").getContext("2d");
		mainGraph = new Chart(ctx, generateGraphConfig(X));
		mainGraph.options.scales.yAxes[0].ticks.min = I.a;
		mainGraph.options.scales.yAxes[0].ticks.max = I.b;
	}

	let color = random_rgba();

	let data = {
        label: label,
        data: Y,
        backgroundColor: color,
        borderColor: color,
        pointRadius: 0,
        fill: false,
	  }

	mainGraph.data.datasets.push(data);
}

// Function generating a config for ChartJS
function generateGraphConfig(xTab) {
  var config = {
    type: 'line',
    data: {
      labels: xTab
    },
    options: {
      interaction:{
        intersect: false
      },
      responsive: true,
      tooltips: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'point',
        intersect: false
      },
      scales: {
        xAxes: [{
          display: true,
          color: 'blue',
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true
          }
        }],
        yAxes: [{
          display: true,
          color: 'blue',
          scaleLabel: {
            display: true,
            labelString: 'Value'
          }
        }]
      },
      annotation: {
        annotations: [{
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0,
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 2,
        },
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: xTab[closest(xTab, 0)],
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 2
        }]
      }
    }
  };
  return config;
}

// Function for generating a random RGBA color
function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}

// https://stackoverflow.com/questions/31877795/find-the-closest-index-to-given-value
function closest(list, x) {
    var min,
        chosen = 0;
    for (var i in list) {
        min = Math.abs(list[chosen] - x);
        if (Math.abs(list[i] - x) < min) {
            chosen = i;
        }
    }
    return chosen;
}
