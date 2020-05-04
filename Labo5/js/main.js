function mainCompute() {
    let vanillaT0 = performance.now();
    for (let n = 1; n < 1000; n++) {
        Simpson(1000);
    }
    let vanillaT1 = performance.now();
    let vanillaTime = (vanillaT1 - vanillaT0) / 1000;

    let libT0 = performance.now();
    for (let n = 1; n < 1000; n++) {
        Simpson128bits(1000);
    }
    let libT1 = performance.now();
    let libTime = (libT1 - libT0) / 1000;

    let vanillaResult = Simpson(1000);
    let libResult = Simpson128bits(1000).toExponential(80);

    document.getElementById("vanillaResult").innerHTML = "Résultat du calcul : " + vanillaResult;
    document.getElementById("libResult").innerHTML = "Résultat du calcul : " + libResult;

    document.getElementById("vanillaTime").innerHTML = "Temps de calcul : " + vanillaTime + " millisecondes";
    document.getElementById("libTime").innerHTML = "Temps de calcul : " + libTime + " millisecondes";

}

//Compute the Simpson approximation
// n : divide the interval [0;1] by n
function Simpson(n) {
    //Step size
    let h = 1 / n;

    //Half
    let h2 = h / 2;

    //Sum of f(xn)
    let sum = 0;

    //Sum of even n
    for (let i = 1; i <= 2 * n - 1; i++) {
        //sum += (i%2 + 1)/(1 + Math.pow(X[i], 2))
        sum += (i % 2 + 1) / (1 + Math.pow(i * h2, 2))
    }


    //Return the restult
    return 1 / (3 * n) * (3 + 4 * sum);
}

function Simpson128bits(n) {
    //Step size
    let one128 = new Double.Double('1');
    let n128 = new Double.Double(n.toString());

    //Step size
    let h2128 = one128.div(n128).div(2);

    //Sum of f(xn)
    let sum = new Double.Double('0');

    //Sum of even n
    for (let i = 1; i <= 2 * n - 1; i++) {
        let num128 = new Double.Double(i % 2 == 0 ? '1' : '2');
        let i128 = new Double.Double(i.toString());
        Double.Double.mul22(i128, h2128);
        Double.Double.pow2n(i128, 2);
        Double.Double.add21(i128, 1);
        sum = sum.add(num128.div(i128));
    }

    let three128 = new Double.Double('3');
    let four128 = new Double.Double('4');

    //Return the restult
    //return 1/(3*n) *( 3 + 4 * sum);
    return one128.div(three128.mul(n128)).mul(three128.add(four128.mul(sum)));
}