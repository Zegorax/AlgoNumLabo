BITS_EXP = 8
BITS_MANTISSA = 23

function SignedBinToDecimal(number)
{
    let result = 0
    for(let i = 1; i < number.length; ++i)
        result += number[i] ? Math.pow(2,number.length - i - 1) : 0

    //Test sign
    if(number[0])
        result -= Math.pow(2, number.length - 1)

    return result
}

function BinToDecimal(number)
{
  //copy
  number = Array.from(number)
  number.unshift(false)

  return SignedBinToDecimal(number)
}

//Convert Integer number decimal to bin !
function DecimalToSignedBin(number, nbBits)
{
    absNumber = Math.abs(number)
    result = Array(nbBits)

    for(let i = nbBits -1; i >= 0; --i)
    {
        if(absNumber >= Math.pow(2,i))
        {
            //Sub the value and set the correct bit to one
            absNumber -= Math.pow(2,i)
            result[i] = true;
        }
        else
        {
            result[i] = false;
        }
    }

    //Reverse !
    result = result.reverse()

    //Set the sgn if neg
    if(number < 0)
    {
        result = TwoSComplement(result)
    }

    return result
}

function DecimalToBin(number, nbBits)
{
  if (number < 0)
  {
    throw new Error("Try converting neg number into unsigned integer")
  }

  return DecimalToSignedBin(number, nbBits)
}

//compare two bin number
//supposed : size(a) == size(b)
function compare(a, b)
{
    if(a.length != b.length){
      return false
    }
    //copy
    a = Array.from(a)
    b = Array.from(b)

    for(let i = 0; i < a.length; i++)
    {
        if(a[i] != b[i])
        {
            return false
        }
    }

    return true
}

//supposed : size(a) == size(b)
function sumOfSignedIntegerBinaryValues(a, b)
{
  //copy
  a = Array.from(a)
  b = Array.from(b)

  //lsb fisrt
  a = a.reverse()
  b = b.reverse()

  c = []
  carry = false
  for(let i = 0; i < a.length; i++)
  {
      if(carry)
      {
          c[i] = a[i] == b[i]
          carry = a[i] || b[i]
      }
      else
      {
          c[i] = a[i] != b[i]
          carry = a[i] && b[i]
      }
}

//Msb first
c = c.reverse()

//Return carry and sum
return {"res" : c, "carry" : carry }
}

//supposed : size(a) == size(b)
function subOfSignedIntegerBinaryValues(a, b)
{
    //copy
    a = Array.from(a)
    b = Array.from(b)

    //Sum a with the two's complement of b
    return sumOfSignedIntegerBinaryValues(a, TwoSComplement(b))
}


//supposed : size(a) == size(b)
function subOfIntegerBinaryValues(a, b)
{
  //copy
  b = Array.from(b)
  a = Array.from(a)

  let size = a.length

  //Create a size + 1 array to compute, with two's complement, the subs
  a.unshift(false)
  b.unshift(false)

  let sub = subOfSignedIntegerBinaryValues(a,b)
  let c_tmp = sub['res']
  let carry = sub['carry']
  let isNeg = c_tmp.slice(0,1)[0]
  let c = c_tmp.slice(1,c_tmp.length)

  //if neg, get real value
  if(isNeg)
  {
    c = DecimalToBin(Math.abs(SignedBinToDecimal(c)), size)
  }

  //Return ...
  return {"isNeg" : isNeg, "carry" : carry, "res" : c}
}

function sumOfIntegerBinaryValues(a,b)
{
    return sumOfSignedIntegerBinaryValues(a,b) //Same...
}


//Get second complement of a number
function TwoSComplement(a)
{
  //copy
  a = Array.from(a)

  //If zero, return 0 ..
  if(SignedBinToDecimal(a) == 0)
  {
    return a;
  }
  else
  {
    //NON
    let c = []
    for(i = 0; i < a.length; i++)
    {
        c[i] = !a[i]
    }

    //+1
    let one = Array(c.length)
    for(i = 0; i < one.length; i++)
    {
        one[i] = (i == 0 ? true : false)
    }

    //revserse it
    one = one.reverse()

    c = sumOfSignedIntegerBinaryValues(c, one)['res']
    return c
  }
}
