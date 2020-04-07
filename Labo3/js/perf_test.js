//Test matrix
testMathMartrix();
testJSMatrix();
testJSConstMatrix();

function testMathMartrix()
{
    const type = "Math :"
    const SIZE = 12;

    //INIT
    let t0 = performance.now();

    const matrix = math.matrix([[101,103,107,109,113,127,131,137,139,149,151,157],
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
    [919,929,937,941,947,953,967,971,977,983,991,997]]);

    const array = [[2, 0], [-1, 3]]

    let t1 = performance.now();
    console.log(type + " init " + (t1 - t0) + " milliseconds.");

    //READ ALL ELEMENT WITH FOREACH
    t0 = performance.now();

    matrix.forEach((line) => {
        let i = line
    });

    t1 = performance.now();

    console.log(type + " read with foreach " + (t1 - t0) + " milliseconds.");

    //READ ALL ELEMENT WITH FOR
    console.log(type + " read with for : not implemented");

    //ADD 42 TO EACH ELEMENT
    t0 = performance.now();
    math.map(matrix, function(value) {
      return 42 + value
    });
    t1 = performance.now();
    console.log(type + " add 42 " + (t1 - t0) + " milliseconds.");

    //MUTLIPAY BY PI TO EACH ELEMENT
    t0 = performance.now();
    math.map(matrix, function(value) {
      return 42 + value
    });
    t1 = performance.now();
    console.log(type + " multiply by pi " + (t1 - t0) + " milliseconds.");
}

function testJSMatrix()
{
    const type = "JS let :"
    const SIZE = 12;

    //INIT
    let t0 = performance.now();

    let matrix = [[101,103,107,109,113,127,131,137,139,149,151,157],
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

    let t1 = performance.now();

    console.log(type + " init " + (t1 - t0) + " milliseconds.");

    //READ ALL ELEMENT WITH FOR
    t0 = performance.now();

    for(let i = 0; i < SIZE; i++)
    {
        for(i2 = 0; i2 < SIZE; i2++)
        {
            let i3 = matrix[i][i2];
        }
    }

    t1 = performance.now();

    console.log(type + " read with for " + (t1 - t0) + " milliseconds.");

    //READ ALL ELEMENT WITH FOREACH
    t0 = performance.now();

    matrix.forEach((line) => {
        line.forEach((i) => {
            let test = i;
        });

    });

    t1 = performance.now();

    console.log(type + " read with foreach " + (t1 - t0) + " milliseconds.");

    //ADD 42 TO EACH ELEMENT
    t0 = performance.now();
    matrix.map(line => {
        line.map(i =>
        {
            i += 42;
        });
    })
    t1 = performance.now();
    console.log(type + " add 42 " + (t1 - t0) + " milliseconds.");

    //MUTLIPAY BY PI TO EACH ELEMENT
    t0 = performance.now();
    matrix.map(line => {
        line.map(i =>
        {
            i *= 3.14;
        });
    })
    t1 = performance.now();
    console.log(type + " multiply by pi " + (t1 - t0) + " milliseconds.");

}

function testJSConstMatrix()
{
    const type = "JS const :"
    const SIZE = 12;

    //INIT
    let t0 = performance.now();

    const matrix = [[101,103,107,109,113,127,131,137,139,149,151,157],
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

    let t1 = performance.now();
    console.log(type + " init " + (t1 - t0) + " milliseconds.");

    //READ ALL ELEMENT WITH FOR
    t0 = performance.now();

    for(let i = 0; i < SIZE; i++)
    {
        for(i2 = 0; i2 < SIZE; i2++)
        {
            let i3 = matrix[i][i2];
        }
    }

    t1 = performance.now();

    console.log(type + " read with for " + (t1 - t0) + " milliseconds.");

    //READ ALL ELEMENT WITH FOREACH
    t0 = performance.now();

    matrix.forEach((line) => {
        line.forEach((i) => {
            let test = i;
        });

    });

    t1 = performance.now();

    console.log(type + " read with foreach " + (t1 - t0) + " milliseconds.");

    //ADD 42 TO EACH ELEMENT
    t0 = performance.now();
    matrix.map(line => {
        line.map(i =>
        {
            i += 42;
        });
    })
    t1 = performance.now();
    console.log(type + " add 42 " + (t1 - t0) + " milliseconds.");


    //MUTLIPAY BY PI TO EACH ELEMENT
    t0 = performance.now();
    matrix.map(line => {
        line.map(i =>
        {
            i *= 3.14;
        });
    })
    t1 = performance.now();
    console.log(type + " multiply by pi " + (t1 - t0) + " milliseconds.");

}
