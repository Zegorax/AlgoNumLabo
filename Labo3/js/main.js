let iterationNb = 1000;

//Hide the loader

function compute(fileName)
{
	//Start loading
	document.getElementById("loader").removeAttribute("hidden");
	document.getElementById("result").innerHTML = 'X = <sup>t</sup>[...]';
	document.getElementById("time").innerHTML = '...';
	
		
    //Load data
    loadJSON(fileName, function(data){
		
        //Copy the data
        SIZE = 0;
        let A = [];
        let B = [];

	
        //Compute the mean of the execution time		
        let sum = 0;
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

            sum += (t1 - t0);
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
			document.getElementById("time").innerHTML = computeTime + ' ms en faisant la moyenne sur ' + iterationNb + ' iterations.';
		}
		else
		{
			document.getElementById("result").innerHTML = 'Impossible de trouver X, determinant null.	';
		}
    });
}

function X(A,B,SIZE)
{	
    let X = Array(SIZE);
	
	let tmpMatrix = transformMatrix(A, B, SIZE);
	
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

    return X;
}

function transformMatrix(A, B, SIZE)
{
	let tmpMatrix = [];
		
    for(let n = 0; n < SIZE; n++)
    {
        if(n > 0)
        {
            //let currentLine = A[n];
            let l = n * SIZE;
			let currentLine = A.slice(l, l + SIZE);

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
            tmpMatrix.push(A.slice(0,SIZE));
        }
		
		//If one 0 on the diagonal, the det of A is 0, so we cannot find the X solutions
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