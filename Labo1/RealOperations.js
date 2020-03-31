BITS_EXP = 8
BITS_MANTISSA = 23

function subOfRealBinaryValues(a, b, nbBitsExponent = BITS_EXP, nbBitsMantisse = BITS_MANTISSA)
{
  //Copy
  b = Array.from(b)

  //Change the sign of b
  b[0] = !b[0]

  //Compute
  return sumOfRealBinaryValues(a,b,nbBitsExponent, nbBitsMantisse)
}

function sumOfRealBinaryValues(a, b, nbBitsExponent = BITS_EXP, nbBitsMantisse = BITS_MANTISSA)
{
  //copy
  a = Array.from(a)
  b = Array.from(b)

  let a_sgn = a[0]
  let b_sgn = b[0]

  let a_e = a.slice(1, 1 + nbBitsExponent)
  let b_e = b.slice(1, 1 + nbBitsExponent)

  let a_m = a.slice(1 + nbBitsExponent, 1 + nbBitsMantisse + nbBitsExponent + 1)
  let b_m = b.slice(1 + nbBitsExponent, 1 + nbBitsMantisse + nbBitsExponent + 1)

  let c_e
  let c_m

  if(BinToDecimal(a_m) == 0) //if a = 0 ...
  {
    return b
  }
  else if(BinToDecimal(b_m) == 0) //if b = 0 ...
  {
    return a
  }
  else
  {
      //Not not the same exponent
      while(!compare(a_e,b_e))
      {
        //Increment smaller expo and shift its mantissa
        if(BinToDecimal(a_e) < BinToDecimal(b_e)) //a_e < b_e
        {
          a_e = DecimalToBin(BinToDecimal(a_e) + 1, nbBitsExponent)
          a_m = DecimalToBin(parseInt(BinToDecimal(a_m)/2), nbBitsMantisse)

          if(BinToDecimal(a_m) == 0)// if a << b
          {
            return b
          }
        }
        else //b_e < a_e
        {
          b_e = DecimalToBin(BinToDecimal(a_e) + 1, nbBitsExponent)
          b_m = DecimalToBin(parseInt(BinToDecimal(a_m)/2), nbBitsMantisse)

          if(BinToDecimal(b_m) == 0) //if b << a
          {
            return a
          }
        }
      }

      //Add mantissa

      //Signed them
      a_m.unshift(false)
      a_m.unshift(false)
      b_m.unshift(false)
      b_m.unshift(false)

      //Set expo
      c_e = a_e

      if(a_sgn)
      {
        a_m = TwoSComplement(a_m)
      }

      if(b_sgn)
      {
        b_m = TwoSComplement(b_m)
      }

      c_m = sumOfSignedIntegerBinaryValues(a_m, b_m)['res']

      if(SignedBinToDecimal(c_m) == 0) //zero...
      {
        let zero = []
        for(let i = 0; i < c_m.length; i++)
        {
          zero.push(false)
        }
        return zero
      }
      else if(Math.abs(SignedBinToDecimal(c_m)) > Math.pow(2.0, nbBitsMantisse)) //Overflow...
      {
        //Divide mantissa by 2 and inc expo
        c_m = DecimalToSignedBin(parseInt(SignedBinToDecimal(c_m)/2), nbBitsMantisse + 2)
        c_e = DecimalToBin(BinToDecimal(c_e) + 1, nbBitsExponent)

        //TODO REPORT EXPONENET Overflow
      }

      let c_sgn = [false]

      //Set the sign
      if(SignedBinToDecimal(c_m) < 0)
      {
        c_sgn[0] = true
        c_m = DecimalToBin(Math.abs(SignedBinToDecimal(c_m)), nbBitsMantisse + 2)
      }

      //Reduce mantissa
      c_m.shift()
      c_m.shift()

      return c_sgn.concat(c_e).concat(c_m)
  }
}


//FINAL VERSION
function RealToBinary(realValue, nbBitsExponent = BITS_EXP, nbBitsMantisse = BITS_MANTISSA){
  let sign = realValue < 0
  realValue = Math.abs(realValue)

  let shift = 0
  realMantissaValue = realValue

  while(realMantissaValue <= 1.0 && realValue != 0){
    realMantissaValue *= 2.0
    shift -= 1
  }

  while(realMantissaValue > 2.0 && realValue != 0){
    realMantissaValue /= 2.0
    shift += 1
  }

  let mantissaValue = parseInt(realMantissaValue * Math.pow(2.0, nbBitsMantisse))
  let exponentValue = shift + Math.pow(2, nbBitsExponent-1) - 1


  let shiftBoolValue =  DecimalToSignedBin(exponentValue, nbBitsExponent)
  let mantissaBoolValue = []

  realMantissaValue -= 1 //Remove the constant 1 ...
  for(i = 1; i <=nbBitsMantisse; i++) //Mantissa bin value....
  {
    /*
    console.log(realMantissaValue)
    console.log(">")
    console.log(Math.pow(2.0, -i))*/
    if(realMantissaValue >= Math.pow(2.0, -i))
    {
      realMantissaValue -= Math.pow(2.0, -i)
      mantissaBoolValue.push(true)
    }
    else {
      mantissaBoolValue.push(false)
    }
  }

  let signArray = [sign]

  return signArray.concat(shiftBoolValue).concat(mantissaBoolValue)
}
