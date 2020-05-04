let t0 = performance.now();

for(let n = 1; n < 1000; n++)
{
/*
console.log(Simpson(98985));
console.log("changin method");
console.log(Simpson128bits(98985).toExponential(20));
console.log(Simpson128bits(49493).toExponential(20));
console.log(Simpson128bits(30000).toExponential(20));
console.log(Simpson128bits(463).toExponential(20));
console.log(Simpson128bits(464).toExponential(20));¨*/
Simpson128bits(1000);
}
let t1 = performance.now();
console.log("Call to Simpson took " + (t1 - t0)/1000);
console.log(Simpson128bits(1000).toExponential(20));

//Compute the Simpson approximation
// n : divide the interval [0;1] by n
function Simpson(n)
{
	//Step size
	let h = 1/n;

	//Half
	let h2 = h/2;

	//Sum of f(xn)
	let sum = 0;

	//Sum of even n
	for(let i = 1; i <= 2*n - 1; i++)
	{
		//sum += (i%2 + 1)/(1 + Math.pow(X[i], 2))
		sum += (i%2 + 1)/(1 + Math.pow(i*h2, 2))
	}


	//Return the restult
	return 1/(3*n) *( 3 + 4 * sum);
}

function Simpson128bits(n)
{
	//Step size
	let one128 = new Double.Double('1');
	let n128 = new Double.Double(n.toString());

	//Step size
	let h2128 = one128.div(n128).div(2);

	//Sum of f(xn)
	let sum = new Double.Double('0');

	//Sum of even n
	for(let i = 1; i <= 2*n - 1; i++)
	{
		let num128 = new Double.Double(i%2 == 0 ? '1' : '2');
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
