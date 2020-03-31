// realValue = S M 2^(e'*-d)
// realValue = valeur réelle
// s = le bit de signe
// S = le signe (Si s=1, S=-1 || Si s=0, S=1)
// e' = valeur en entier de l'exposant
// e  = valeur de l'exposant en binaire
// m = mantisse en bits
// M = valeur entre 0.0 et 1.0 (ou 0.5 et 1.0)
// n = nombre bits mantisse
// d = 2^(E-1)-1 avec E = nb bits pour e

// M = m/(2^n)

//ZERO 32 bits value ...
let ZERO = []
for(i = 0; i < 32; i++)
{
  ZERO.push(false)
}

window.addEventListener('load', function() {
    generateCheckBox(ZERO, "mainCheckboxTable")
    generateCheckBox(ZERO, "aCheckboxTable")
    generateCheckBox(ZERO, "bCheckboxTable")
    generateCheckBox(ZERO, "resultCheckboxTable")
})

function transformInput(){
  let number = document.getElementById("inputNumber").value;
  let binvalue = RealToBinary(parseFloat(number))

  //Update ...
  resetCheckBox("mainCheckboxTable")
  generateCheckBox(binvalue, "mainCheckboxTable")
}

function computeInput(){
  let a = document.getElementById("firstNumber").value;
  let b = document.getElementById("secondNumber").value;

  let aBin = RealToBinary(parseFloat(a))
  let bBin = RealToBinary(parseFloat(b))

  let cBin = sumOfRealBinaryValues(aBin,bBin)

  //Update ...
  resetCheckBox("aCheckboxTable")
  generateCheckBox(aBin, "aCheckboxTable")

  resetCheckBox("bCheckboxTable")
  generateCheckBox(bBin, "bCheckboxTable")

  resetCheckBox("resultCheckboxTable")
  generateCheckBox(cBin, "resultCheckboxTable")

  let result = document.getElementById("result")
  let sum = parseFloat(a) + parseFloat(b)
  result.innerHTML = "Result : " + sum
}

function generateCheckBox(value, tableName, nbBitsExponent = BITS_EXP, nbBitsMantisse = BITS_MANTISSA){
  let table = document.getElementById(tableName)
  let row = table.insertRow()
  let cell1 = row.insertCell(0)
  let cell2 = row.insertCell(1)
  let cell3 = row.insertCell(2)

  for(let i = 0; i <= nbBitsExponent + nbBitsMantisse + 1; i++)
  {
    if(i  == 0)
    {
      cell1.innerHTML = "<input type='checkbox' "+ (value[i] ? 'checked' : '' )+">"
    }
    else if(i < nbBitsExponent + 1)
    {
      cell2.innerHTML += "<input type='checkbox' "+ (value[i] ? 'checked' : '' )+">"
    }
    else
    {
      cell3.innerHTML += "<input type='checkbox' "+ (value[i] ? 'checked' : '' )+">"
    }
  }
}

function resetCheckBox(tableName){
  var table = document.getElementById(tableName);
  table.deleteRow(1)
}
