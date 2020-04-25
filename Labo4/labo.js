/*
Algorithmes Numériques
Laboratoire #4 : Dérivation numérique
Equipe 1 : Verardo Luca, Portmann Alexis, Marty Mathias
Date de développement :
*/

//-------TEST---------
let _f = function(x){ return x; };
let _n = 3;
let _h = 0.0001;
let _a = 0;
let _I = {"a": -3.14, "b": 3.14};
let _dx = 0.001;

let i = 0;

compute(_f, _n, _h, _a, _I, _dx)

//f is the function, n = taylor pol. degree, h = h, a = where's the taylor pol. is centered,
// I is the interval where to compute and dx is the step between 2 values
function compute(f, n, h, a, I, dx)
{
    //Succecive derivatives at a
    let d = [f];

    //Stock the current derivative
    let tmp = f;

    //Compute them
    for(let i = 0; i < n; i++) //The 0 derivate is f, already in the array
    {        //tmp = derivate(tmp.clone(), h);
        tmp = derivate(function(x) {return i*x;}, h);
        d.push(tmp);
    }

    //Draw the first 2 derivatives
    drawFirstAndSecondDerivative(f, h, I, dx);

    //Draw taylor polynoms
    drawTaylor(d, a, I, dx);

    //Draw the function (without taylor approximation)
    drawFunction(f, I, dx)
}

//f is function to derivate and h is h
function derivate(f, h)
{
    console.log("f(1) = " + f(1));

    let F = function(x) {return this.f(x);};
    F.f = function(x){return 100*i++;}

    //return function(x){return (8*(f(x + h/2) - f(x - h/2)) - f(x + h) + f(x - h))/(6*h);};
    //return new Function()
}

//f is the function to derivate and drow, h = h,
// I is the interval where to compute and dx is the step between 2 values
function drawFirstAndSecondDerivative(f, h, I, dx)
{
    //First and seconds derivates values
    let d = [];
    let dd = [];

    //Derivate !
    let fder = derivate(f, h);
    let fderder = derivate(fder, h); //(pas le joueur de tennis hihihi)

    //Computes their values in I
    for(let x = I.a; x < I.b; x += dx)
    {
        d.push(fder(x));
        dd.push(fderder(x));
    }

    //Draw them with a label
    draw(d, "first derivate");
    draw(d, "second derivate");
}

//d is an array of all needed consecutive derivatives, a is where the tylor polynomial is centered
// and I is the interval where to compute and dx is the step between 2 values
function drawTaylor(d, a, I, dx)
{
    //Transform all derivatives value into taylor series coefs
    let c = [];
    let fact = 1; //Store the current factorial term here, for optimization
    for(let k = 1; k <= d.length; k++) //Start at 1 for math purpose...
    {
        //Compute new factorial term
        fact *= k;
        c.push((d[k-1])(a)/(fact));
    }

    //Values to draw
    let Y = [];

    //Foreach x to compute, compute the polynomial at the current pos, using horner method to optimize
    for(let x = I.a; x < I.b; x += dx)
    {
        Y.push(horner(c, x - a));
    }

    //Draw the taylor polynomial
    draw(Y, "Taylor polynomial");
}

// f is the function to draw, I is the interval where to draw the function and dx is the step
function drawFunction(f, I, dx)
{
    //Values to draw
    let Y = [];

    //Compute them
    for(let x = I.a; x < I.b; x += dx)
    {
        Y.push(f(x));
    }

    //Draw them
    draw(Y, "real function");
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

//TODO
function draw(Y, label)
{
    console.log(label, Y);
}
