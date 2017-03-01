/*
  Code to setup example data synthesis
*/

var n_bins = 200,
    millis_per_frame = 10,
    mean_random_walk_step = 0.05,
    std_random_walk_step = 0.05;

var mean = 0,
    std = 0.2,
    ys = linspace(-1,1,n_bins);

function linspace(a,b,n) {
  // From numeric.js: https://github.com/sloisel/numeric/blob/master/src/numeric.js#L922
  if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
  if(n<2) { return n===1?[a]:[]; }
  var i,ret = Array(n);
  n--;
  for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
  return ret;
}

function updateParams() {
  // modify mean and std according to (uniform) random walk for data synthesis
  mean = mean + (Math.random()-0.5)*2*mean_random_walk_step;
  if(mean > 1){mean = mean-2;}
  if(mean < -1){mean = mean+2;}
  std = Math.exp(Math.log(std) + (Math.random()-0.5)*2*std_random_walk_step);
}

function getData() {
  // Return gaussian with mean and std. Duplicate for rgb
  return ys.map(function(y){return Math.exp(-Math.pow(((y-mean)/std),2));})
           .map(function(d){return [d,d,d];});
}

/*
  Actual usage example:
*/
function loop() {
  setTimeout(function () {
    updateParams();
    series.append(new Date().getTime(), getData());
    loop();
  }, millis_per_frame);
}

var series = new TimeSeries();
series.append(new Date().getTime(), getData());

document.addEventListener("DOMContentLoaded", function(event){
  var chartDOM = document.getElementById('chart')
  chartDOM.width = chartDOM.offsetWidth;
  chartDOM.height = chartDOM.offsetHeight;

  graph = new SmoothieHeatmap({
                  grid: { strokeStyle:'rgba(255, 255, 255, 0.3)', fillStyle:'rgb(0, 0, 0)',
                          lineWidth: 1, millisPerLine: 250, verticalSections: 10, },
                  labels: { fillStyle:'rgb(255, 255, 255)' },
                  millisPerPixel: 10
                });
  graph.addTimeSeries(series);
  graph.streamTo(chartDOM,500);

  loop()
});
