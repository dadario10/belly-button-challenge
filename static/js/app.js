const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
// const dataPromise = d3.json(url);
// console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it


init();
function init(){

 d3.json(url).then((data) => callBackFunc(data));
    //build dropdown list
   
    function callBackFunc(data){
        let samplesNames = data.names;
        console.log(samplesNames);
        let dropdown = d3.select("#selDataset");

  // Bind data array to dropdown element
  dropdown
  .selectAll("option")
  .data(samplesNames)
  .enter()
  .append("option")
  .attr("value", (d) => d) // Set the value attribute to the data element
  .text((d) => d); // Set th
  let firstSample= samplesNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
    }  
}

// initialize the dashboard
init();

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }

// Demographics Panel 
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Using Object.entries, add each key and value pair
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${key}`);
      });
    });
  }

// Use buildCharts function
function buildCharts(sample) {
    d3.json("samples.json").then((data) => {

      // Set variables to hold sample and meta array
      var samples = data.samples;
      var metadata = data.metadata;
      
      // Filter and hold data
      var sampleArray = samples.filter(obj => obj.id == sample);
      var resultArray = sampleArray[0];

      var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var metaResult = metadataArray[0];

      // Pulling data for sample_values, otu_ids, otu_labels for charts
      var sampleValue = resultArray.sample_values;
      var otuID = resultArray.otu_ids;
      var otuLabel = resultArray.otu_labels;

      // Washing frequency of belly button
      var washFrequency = parseInt(metaResult.wfreq);

      // x and y  
      var xticks = sampleValue.slice(0,10).reverse();
      var yticks = otuID.slice(0,10).reverse().map(function (elem) {return `OTU ${elem}`});
      var labels = otuLabel.slice(0,10).reverse();

      // Bar chart data
      var barChartData = {
        x: xticks,
        y: yticks,
        type: 'bar',
        orientation: 'h',
        text: labels,
        marker: {color: "blue"}

      };

      // Bar chart layout
      var barChartLayout = {
        title: "Top 10 Bacteria Found",  
        paper_bgcolor: '#FFFFFF57'         
      };

 // Plot chart with plotly
 Plotly.newPlot("bar", [barChartData], barChartLayout);


 // Gauge chart data
 var gaugeChartData = {
   value: washFrequency,
   title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
   type: "indicator",
   mode: "gauge+number",
   gauge: {
     axis: {range: [0,10]},
     bar: {color: "blue"},
     bordercolor: "black",
     steps: [
        {range: [0, 2], color: "red"},
        {range: [2, 4], color: "orange"},
        {range: [4, 6], color: "yellow"},
        {range: [6, 8], color: "lightgreen"},
        {range: [8, 10], color: "green"}
      ] 
   }
 };

  // Gauge chart layout
  var gaugeChartLayout = {
    width: 600, 
    height: 450, 
    margin: {t: 0, b: 0},
    font: { color: "#black"},
    paper_bgcolor: "#FFFFFF57"
  };
  
  // Plot with plotly
  Plotly.newPlot("gauge", [gaugeChartData], gaugeChartLayout);

  // Bubble chart data
  var bubbleChartData = {
    x: otuID,
    y: sampleValue,
    text: otuLabel,
    mode: 'markers',
    marker: {
      size: sampleValue,
      color: otuID,
      colorscale: "Earth"
    }
  };
  
  // Bubble chart layout
  var bubbleChartLayout = {
    xaxis: {title: "OTU ID"},
    showlegend: false,
    font: { color: "black"},
    paper_bgcolor: "#FFFFFF57",
    marker: {
        size: sampleValue,
        color: otuID
      }
  };
  
  // Plot with plotly
  Plotly.newPlot("bubble", [bubbleChartData], bubbleChartLayout);   

});
};

function optionChanged(sampleName){
    console.log(sampleName);
    buildCharts(sampleName);
    writeMetadata(sampleName);

}