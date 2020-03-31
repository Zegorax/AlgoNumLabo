
var chart;
var xTab;
var yTab;


var currentDerivative;
var currentFunction;
var currentFunctionText;

const STEP = 0.01
const MAX = 10000000000
const MIN = -10000000000

window.onload = function()
{
  updateGraphData();
};

  //Generic call
function updateGraphData(){
  if(isZoomCheckboxChecked()){
    var startRange = -10;
    var endRange = 10;
  }
  else{
    var startRange = -100;
    var endRange = 100;
  }

  var pointsTab = getDataTab(startRange, endRange, STEP);
  xTab = pointsTab[0];
  yTab = pointsTab[1];

  if(chart == null){
    var ctx = document.getElementById('chart').getContext('2d');
    var config = generateGraphConfig(xTab, yTab);
    chart = new Chart(ctx, config);
  }

  minTicks = Math.min.apply(this, yTab);
  maxTicks = Math.max.apply(this, yTab);

  if(maxTicks > 50){ maxTicks = 50;}
  if(minTicks < -50){ minTicks = -50;}

  chart.data.labels = xTab;
  chart.data.datasets[0].data = yTab;
  chart.config.data.datasets[0].label = currentFunctionText;
  chart.options.title.text = "Courbe : " + currentFunctionText;
  chart.options.scales.yAxes[0].ticks.min = minTicks;
  chart.options.scales.yAxes[0].ticks.max = maxTicks;
  chart.update(0);

  //Compute the zeroes
  calculateZeros()
}

function getDataTab(start, end, steps)
{
  var xTab = [];
  var yTab = [];
  let currentIndex = 0;
  let value;

  parseFunction();

  for (var i = start; i <= end; i+=steps) {
    xTab[currentIndex] = Math.round(10000*i)/10000;

    value = currentFunction(i);

    if(value > MAX){
      value = Infinity;
    } else if (value < MIN){
      value = -Infinity;
    }

    yTab[currentIndex] = value;
    currentIndex++;
  }

  return [xTab, yTab];
}

function newtonZeroSearch(x0, e){
  //Newton calculation for f1
  delta = Math.abs(0-currentFunction(x0));
  while(delta > e){
    x0 = x0 - currentFunction(x0)/currentDerivative(x0);
    delta = Math.abs(0-currentFunction(x0));
  }
  return x0;
}


function calculateZeros(){
  //Clears the zeros annotations
  chart.config.options.annotation.annotations = [];

  //Add default axis
  defaultAnnotations = {
    type: 'line',
    mode: 'horizontal',
    scaleID: 'y-axis-0',
    value: 0,
    borderColor: 'rgb(75, 192, 192)',
    borderWidth: 2,
  },
  {
    type: 'line',
    mode: 'vertical',
    scaleID: 'x-axis-0',
    value: 0,
    borderColor: 'rgb(75, 192, 192)',
    borderWidth: 2
  };
  chart.config.options.annotation.annotations.push(defaultAnnotations);

  //Search in the array where the function changes from negative to positive and vice-versa
  let signChangeIndexesTab = []
  //lastSign = true means it was positive. If lastSign = false, the sign was negative.
  if(yTab[0] < 0){
    var lastSign = false;
  }
  else{
    var lastSign = true;
  }
  for (var i = 0; i < yTab.length; i++) {
    if(yTab[i] > 0 != lastSign){
      lastSign = !lastSign;
      signChangeIndexesTab.push(i);
    }
  }

  zeroTab = [];
  signChangeIndexesTab.forEach(function(element){
    zero = newtonZeroSearch(xTab[element], 0.00000001);
    zero = Math.round(10000*zero)/10000;

    //If value is too high, it has a high probability to be an asymptote.
    if(zero > MAX) {zero = Infinity};

    zeroForGraph = Math.round(100*zero)/100;
    //console.log(zero);

    if(zero != Infinity){
      zeroTab.push(zero);
      var newAnnotation = {
        type: 'line',
        mode: 'vertical',
        scaleID: 'x-axis-0',
        value: zeroForGraph,
        borderColor: 'RGBA(255,6,181,0.4)',
        borderWidth: 8
      }
      chart.config.options.annotation.annotations.push(newAnnotation);
    }

  });
  chart.update();

  //displays the function zeros in a list
  var zerosList = document.getElementById('zeros-list');
  //removes existing children elements
  while (zerosList.hasChildNodes())
  {
      zerosList.removeChild(zerosList.lastChild);
  }

  //appends the zeros to the zeros list
  for (let i = 0; i < zeroTab.length; i++)
  {
      if (!isNaN(zeroTab[i]))
      {
          var node = document.createElement('li');
          var textNode = document.createTextNode(zeroTab[i].toFixed(7));
          node.appendChild(textNode);
          zerosList.appendChild(node);
      }
  }
}

function addFunctionToSelector()
{
  let expr = document.getElementById("addFunctionBox");
  let selector = document.getElementById("functionSelector")

  let opt = document.createElement("option")
  opt.appendChild(document.createTextNode(expr.value))
  opt.value = expr.value
  selector.appendChild(opt)

  selector.value = expr
  expr.value = ""
}

function parseFunction()
{
  //Get the expression
  let sel = document.getElementById("functionSelector")
  let expr = sel.options[sel.selectedIndex].text
  let f

  try {
    f = math.parse(expr)
  } catch (e) {
    console.log("Wrong syntax")
    alert("The entered function has a syntax error")
  }

  let latex = f.toTex()

  //Set the title, and update mathjax
  document.getElementById("graphTitle").innerHTML = "\\(y = " + latex + "\\)"
  MathJax.typeset()

  //Set the new current function
  currentFunction = function(value){return f.evaluate({x:value})}
  currentFunctionText = expr

  //Set the new derivative
  currentDerivative = function(value){return computeDerivativeAt(f, value)}
}

function computeDerivativeAt(f, val)
{
    /*
  let m = math.derivative(f, 'x').evaluate({x: val})

  return m*/
  let dx = STEP
  let dy = f.evaluate({x:val+dx}) - f.evaluate({x:val})

  console.log(dy)

  return dy/dx
}

function isZoomCheckboxChecked(){
  var functionSelect = document.getElementById('functionSelector');
  var selectedFunction = functionSelect.options[functionSelect.selectedIndex].value;
  var zoomCheckbox = document.getElementById('zoomCheckbox');

  return zoomCheckbox.checked;
}

function generateGraphConfig(xTab, yTab) {
  var config = {
    type: 'line',
    data: {
      labels: xTab,
      datasets: [{
        label: 'sin(x) - x/13',
        data: yTab,
        backgroundColor: 'rgba(255,0,0,0.8)',
        borderColor: 'rgba(255,0,0,0.8)',
        pointRadius: 0,
        fill: false,
      }]
    },
    options: {
      interaction:{
        intersect: false
      },
      responsive: true,
      title: {
        display: true,
        text: 'Courbe : sin(x) - x / 13'
      },
      tooltips: {
        mode: 'nearest',
        intersect: false
      },
      hover: {
        mode: 'nearest',
        intersect: false
      },
      scales: {
        xAxes: [{
          display: true,
          color: 'blue',
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true
          }
        }],
        yAxes: [{
          display: true,
          color: 'blue',
          scaleLabel: {
            display: true,
            labelString: 'Value'
          }
        }]
      },
      annotation: {
        annotations: [{
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 0,
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 2,
        },
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 0,
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 2
        }]
      }
    }
  };
  return config;
}
