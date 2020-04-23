let iterationNb = 1000;

//Hide the loader

function compute(fileName)
{
	//Start loading
	document.getElementById("loader").removeAttribute("hidden");
	document.getElementById("result").innerHTML = 'X = <sup>t</sup>[...]';
	document.getElementById("time").innerHTML = '...';


    //Load data
    loadJSON("json/" + fileName, function(data){

        //Copy the data
        SIZE = 0;
        let A = [];
        let B = [];


        //Compute the mean of the execution time
		let sum = 0;
		let allTimes = [];
        for(let i = 0; i < iterationNb; i++)
        {
            //Copy the data
            SIZE = (data.n)[0];
            A = data.A.slice();
            B = data.B.slice();

            //Perform
            let t0 = performance.now();

            X(A, B, SIZE);

            let t1 = performance.now();

			let time = t1 - t0;
			sum += time;
			allTimes.push(time);
        }

        let computeTime = sum / iterationNb;

        A = data.A.slice();
        B = data.B.slice();
        SIZE = (data.n)[0];

        //Last perfom to compute the result
        let result = X(A, B, SIZE);

		//Stop loading
		document.getElementById("loader").setAttribute("hidden","");

		//If result exists
		if(result != null)
		{
			//Result string
			let str = "";
			result.forEach(x => {
				str += x + ',';
			});

			//Remove the last ','
			str = str.slice(0,-1);

			//Show the result
			document.getElementById("result").innerHTML = 'X = <sup>t</sup>[' + str + ']';

			//Show the compute time
			document.getElementById("time").innerHTML = computeTime + ' ms en faisant la moyenne sur ' + iterationNb + ' iterations. <br>';
			document.getElementById("time").innerHTML += 'Le temps le plus court était de ' + Math.min.apply(Math, allTimes) + ' ms';
		}
		else
		{
			document.getElementById("result").innerHTML = 'Impossible de trouver X, determinant null.	';
		}
    });
}

//Main compute function
function X(A,B,SIZE)
{
    let X = Array(SIZE);

	//Get the triangular matrix
	let tmpMatrix = transformMatrix(A, B, SIZE);

	//Det = 0 case ....
    if(tmpMatrix == null)
		return null;

    for(let n = SIZE - 1; n >= 0; n--)
    {
        let sum = 0;

        for(let k = n + 1; k < SIZE; k++)
        {
            sum += tmpMatrix[n][k] * X[k];
        }

        X[n] = ((B[n] - sum) / tmpMatrix[n][n]);
    }

	//If there is swap, change the X matrix

    return X;
}

function transformMatrix(A, B, SIZE)
{
	let tmpMatrix = [];
	let swapedLines = [];

    for(let n = 0; n < SIZE; n++)
    {
		let l = n * SIZE;
		let currentLine = A.slice(l, l + SIZE);
		//IF the element on the diagonal equals 0, swap with another line !
		if(currentLine[n] == 0)
		{
			//Find the first non null element on the same colomn
			let find = false;
			for(let i = n + 1; i < SIZE; i++)
			{
				if(A[i*SIZE + n] != 0) // [i,n] element of A
				{
					find = true;

					//Copy current line in tmp
					let tmp = currentLine.slice();

					//Swap the current lign
					currentLine = A.slice(i*SIZE, i*SIZE + SIZE);

					//Change in the matrice A (with the old current line)
					for(let j = 0; j < SIZE; j++)
					{
						A[i*SIZE + j ] = tmp[j];
					}

					//Change the matrice B
					tmp = B[i];
					B[i] = B[n];
					B[n] = tmp;

					//Add to the swap lines array
					swapedLines.push([n,i]);

					//Leave the for loop
					break;
				}
			}

			//If no swap (so one colomn is filled with 0 <=> det(A) = 0 <=> cannot find X <=> return null)
			if(!find)
			{
				return null;
			}
		}

        if(n > 0)
        {
            //let currentLine = A[n];

            for(let s = 1; s <= n; s++)
            {
                let L_n_s_1 = tmpMatrix[s-1];

                let factor = currentLine[s - 1] / L_n_s_1[s-1] ;

                //Should be 0
                for(let i = 0; i < s; i++)
                {
                    currentLine[i] = 0;
                }

                for(let i = s; i < SIZE; i++)
                {
                    currentLine[i] = currentLine[i] -  factor*L_n_s_1[i];
                }

                //Change B
                B[n] = B[n] - factor*B[s-1];
            }

            tmpMatrix.push(currentLine);
        }
        else
        {
            tmpMatrix.push(currentLine);
        }

		//If one 0 on the diagonal of the final matric, the det of A is 0, so we cannot find the X solutions
        if(tmpMatrix[n][n] == 0)
        {
            return null;
        }
    }

	return tmpMatrix;
}

//From : https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript
function loadJSON(fileName, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', fileName, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
}
