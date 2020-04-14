let L_tilde_mem = [];

main();

function main()
{
    /*
    let M = [
        [5,3,2],
        [0,4,1],
        [5,7,4]
    ];
    const SIZE = 3;
    */
    /*
    let M = [
        [101,103,107,113,127],
        [163,167,173,179,181],
        [229,233,239,241,257],
        [751,103,107,113,127],
        [101,929,107,953,127]];
    const SIZE = 5;
    */
    /*
    let M = [[101,103,107,109,113,127,131,137,139,149,151,157],
    [163,167,173,179,181,191,193,197,199,211,223,227],
    [229,233,239,241,251,257,263,269,271,277,281,283],
    [293,307,311,313,317,331,337,347,349,353,359,367],
    [373,379,383,389,397,401,409,419,421,431,433,439],
    [443,449,457,461,463,467,479,487,491,499,503,509],
    [521,523,541,547,57,57,563,569,571,577,587,593],
    [599,601,607,613,617,619,631,641,643,647,653,659],
    [661,673,677,683,691,701,709,719,727,733,739,743],
    [751,757,761,769,773,787,797,809,811,821,823,827],
    [829,839,853,857,859,863,877,881,883,887,907,911],
    [919,929,937,941,947,953,967,971,977,983,991,997]];
    const SIZE = 12;
*/




loadJSON("Matrice_210x210.json", function(obj){
    const SIZE = (obj.n)[0];
    let A = obj.A;
    let B = obj.B;

    let M = [];
    for(let i = 0; i < SIZE; i++)
    {
        M.push([]);

        for(let i2 = 0; i2 < SIZE; i2++)
        {
            M[i].push(A[i*SIZE + i2]);
        }
    }

/*
    let M = [[101,103,107,109,113,127,131,137,139,149,151,157],
    [163,167,173,179,181,191,193,197,199,211,223,227],
    [229,233,239,241,251,257,263,269,271,277,281,283],
    [293,307,311,313,317,331,337,347,349,353,359,367],
    [373,379,383,389,397,401,409,419,421,431,433,439],
    [443,449,457,461,463,467,479,487,491,499,503,509],
    [521,523,541,547,57,57,563,569,571,577,587,593],
    [599,601,607,613,617,619,631,641,643,647,653,659],
    [661,673,677,683,691,701,709,719,727,733,739,743],
    [751,757,761,769,773,787,797,809,811,821,823,827],
    [829,839,853,857,859,863,877,881,883,887,907,911],
    [919,929,937,941,947,953,967,971,977,983,991,997]];
    let B = [919,929,937,941,947,953,967,971,97,98,99,69];
    const SIZE = 12;*/
    console.log(M);

    let sum = 0;
    for(let i = 0; i < 1000; i++)
    {
        let t0 = performance.now();

        //console.log(determinant(M, SIZE));
        X(M, B, SIZE);

        let t1 = performance.now();

        sum += (t1 - t0);
    }

    console.log(X(M, B, SIZE));
    console.log("determinant " + sum / 1000 + " milliseconds.");
});

    /*
    const SIZE = 10000;
    var A = [];
    var B = [];
    var C = [];

    for(let i = 0; i < SIZE; i++)
    {
        A.push(Math.random() * 100000);
        B.push(Math.random() * 100000);
    }

    let t0 = performance.now();

    for (i = 0; i < SIZE; i++)
    {
      C[i] = A[i] + B[i];
    }
    //var x = SIMD.float32x4.load(A, 0);

    let t1 = performance.now();


    console.log("determinant " + (t1 - t0) + " milliseconds.");
    console.log(C);
*/
}

function X(A,B,SIZE)
{
    let sum = 0;
    let X = Array(SIZE);

    determinant(A, SIZE);

    for(let n = SIZE - 1; n >= 0; n--)
    {
        sum = 0;

        for(let k = n + 1; k < SIZE; k++)
        {
            sum += L_tilde_mem[n][k] * X[k];
        }

        X[n] = ((B[n] - sum) / L_tilde_mem[n][n]);
    }

    return X;
}

function determinant(M, SIZE)
{
    let sum = 1;
    for(let n = 0; n < SIZE; n++)
    {
        if(n > 0)
        {
            let L_tilde_n = M[n];

            for(let s = 1; s <= n; s++)
            {
                let L_n_s_1 = L_tilde_mem[s-1];
                let factor = L_tilde_n[s - 1] / L_n_s_1[s-1] ;
                //console.log(L_n_s_1[s-1], L_tilde_n[s - 1]);

                for(let i = 0; i < n; i++)
                {
                    L_tilde_n[i] = 0;
                }

                for(let i = n; i < 12; i++)
                {
                    L_tilde_n[i] = L_tilde_n[i] -  factor*L_n_s_1[i];
                }
                /*
                L_tilde_n =  L_tilde_n.map((e, i) => {
                    return e - factor*L_n_s_1[i];
                });*/
            }

            L_tilde_mem.push(L_tilde_n);
        }
        else
        {
            L_tilde_mem.push(M[0]);
        }

        //Finaly
        if(L_tilde_mem[n][n] == 0)
        {
            return 0;
        }
    }


/*
    for(let i = 0; i < SIZE; i++)
    {
        sum *= L_tilde_mem[i][i];
        console.log(L_tilde_mem[i]);
    }
*/
    return 0    ;
}
/*
function L_tilde(M,n)
{
    if(n > 0)
    {
        let L_tilde_n = M[n];

            for(let s = 1; s <= n; s++)
            {
                let L_n_s_1 = L_tilde_mem[s-1];
                let factor = L_tilde_n[s - 1] / L_n_s_1[s-1] ;
                console.log(L_n_s_1[s-1], L_tilde_n[s - 1]);

                L_tilde_n =  L_tilde_n.map((e, i) => {
                    return e - factor*L_n_s_1[i];
                });


                for(let i = 0; i < n; i++)
                {
                    L_tilde_n[i] = 0;
                }

                for(let i = n; i < 12; i++)
                {
                    L_tilde_n[i] = L_tilde_n[i] -  factor*L_n_s_1[i];
                }

            }

            return L_tilde_n;
    }
    else
    {
        return M[0];
    }
}*/

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

/*
function L(M,n,s)
{
    if(s > 0)
    {
    let L_n_s_1 = L(M,n,s-1);
    //let m_tilde_ss = L_tilde(M,s-1)[s-1]
    let L_tilde_s_1 = L_tilde(M,s-1); //
    let m_tilde_ss = L_tilde_s_1[s-1]; //
    let factor = L_n_s_1[s - 1] / m_tilde_ss ;

        return L_n_s_1.map( (e, i) => {
            //return e  - factor * L_tilde(M,s - 1)[i];
            return e - factor * L_tilde_s_1[i];
        });
    }
    else
    {
        return M[n];
    }
}
*/
