import React from 'react'
import * as d3 from 'd3'
import styles from './ScatterPlot.css';
import * as jz from 'jeezy';
import * as feature_scaling from 'feature-scaling';
import LinearRegression from '../Algorithms/LinearRegression';
import {AppBar, Toolbar, Slider, Grid,  Typography, } from '@material-ui/core';


class ScatterPlot extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
          alpha: 0.1,
          iterations: 10000
        };
    }

    componentDidMount(){

        var dataset = this.props.data;
        var numericalDataLabels = new Set();
        var numericalDataLabelsArr = [];
        var topCorrelationLabels = [];
        var topCorrelationValues = [];

        //Spacing convention
        var margin = { top: 0, left: 100, right: 30, bottom: 130 }
        var height = window.innerHeight- margin.top - margin.bottom
        var width = window.innerWidth - margin.left - margin.right
       
        
        //Append svg canvas to main div
        var svg = d3
          .select('#chartSpace')
          .append('svg')
          .attr('height', height + margin.top + margin.bottom)
          .attr('width', width + margin.left + margin.right)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        //Feature scale dataset to be in between -1 and 1
        dataset = feature_scaling(dataset);

        //Convert string values to numbers, remove non-numerical data, store labels that hold numerical values
        dataset.forEach(element => Object.keys(element).forEach(function(key, index){
            if(isNaN(+element[key])){
                delete element[key];
            } else{
                element[key] = +element[key];
                numericalDataLabels.add(key);
            }
            
        }));

        //Convert to data labels from set to array
        numericalDataLabelsArr = Array.from(numericalDataLabels);

        //Create coorelation matrix with filtered labels, replace missing values with -1 
         var correlationMatrix = jz.arr.correlationMatrix(dataset, numericalDataLabelsArr);
         correlationMatrix.forEach(element => element.correlation = isNaN(element.correlation)? -1:element.correlation);
    
         //Sort correlation matrix from highest coorelation to lowers
         correlationMatrix.sort((a,b) => b.correlation - a.correlation);
       
         //Store the labels of the top 10 correlated variables to SalesPrice 
         var counter = 0;
         while(topCorrelationLabels.length <= 10){
            if(correlationMatrix[counter].column_x === "SalePrice"){
                topCorrelationLabels.push(correlationMatrix[counter].column_y);
            }
            counter++;
         }
         
       
         //Store the correlation object(column_x, column_y, and correlation) of the top 10 correlated variables to sales price
         correlationMatrix.forEach(function(element){
            if(topCorrelationLabels.includes(element.column_y) && topCorrelationLabels.includes(element.column_x)){
                topCorrelationValues.push(element);
            }
         });

        //Scale for heat map: maps datalabels evenly between pixel range
        var xScaleHeatMap = d3.scaleBand()
            .range([0, width/2])
            .domain(topCorrelationLabels);

        //X axis for heat map
        svg.append('g')
            .attr("transform", "translate(" + 0 +  "," + height +")")
            .call(d3.axisBottom(xScaleHeatMap));
        
        //Scale for heat map: maps datalabels evenly between pixel range
        var yScaleHeatMap = d3.scaleBand()
            .range([height/8, height])
            .domain(topCorrelationLabels);

        //Y axis for heat map
        svg.append('g')
            .call(d3.axisLeft(yScaleHeatMap));
        
        //Color Scale for heat map
        var heatMapColorScale = d3.scaleLinear()
            .range(["#4a90ce","#284764", "#edf6f9", "#83c5be", "#006d77"])
            .domain([-1, -0.5, 0, 0.5, 1]);

        // Define the div for the tooltip
        var div = d3.select("#chartSpace")
            .append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);

        //Draw Heat Map to canvas
        svg.append("g")
            .selectAll(".heatmap_rect")
            .data(topCorrelationValues)
            .enter()
            .append("rect")
            .attr("x", function(d) { return xScaleHeatMap(d.column_x) })
            .attr("y", function(d) { return yScaleHeatMap(d.column_y) })
            .attr("width", xScaleHeatMap.bandwidth() )
            .attr("height", yScaleHeatMap.bandwidth() )
            .style("fill", function(d) { return heatMapColorScale(d.correlation)})
            .on("mouseover", function(){
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.85');
                
                div.transition()		
                    .duration(200)		
                    .style("opacity", .5);

                div.style("left", this.x)
                    .style("top", this.y);
            })
            .on("mouseout", function(){
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1')
            })
            .on("click", (function(selectedVariables){

            //Remove previously drawn elements
            svg.selectAll(".home_data").remove();
            svg.selectAll("g").filter(".axis_y-axis").remove();
            svg.selectAll("g").filter(".axis_x-axis").remove();
            svg.selectAll("text").filter(".y_label").remove();
            svg.selectAll("text").filter(".x_label").remove();
            svg.selectAll("g").filter(".axis_y-axis_cost").remove();
            svg.selectAll("g").filter(".axis_x-axis_cost").remove();
            svg.selectAll("path").remove();
            svg.selectAll("text").filter(".time").remove();
            var dataWidthStart = width/2 + 80;
            var dataWidthEnd = width - 30
            var dataHeightStart = height/2;
            var dataHeightEnd = height/8
            //Set up scales to map domain to pixels (scatterplot)
            let xDataSetScale = d3.scaleLinear().range([dataWidthStart, dataWidthEnd]);   
            let yDataSetScale = d3.scaleLinear().range([dataHeightStart, dataHeightEnd]);
            
            //Determine max value to set domain for xDataSetScale (scatterplot)
            let maxIndependentVar = d3.max(this.props.data, function(dataset){
                return +dataset[selectedVariables.column_x];
            });
            xDataSetScale.domain([0, maxIndependentVar]);

            //Determine max value to set domain for yDataSetScale (scatterplot)
            let maxDependentVar = d3.max(this.props.data, function(dataset){
                return +dataset[selectedVariables.column_y];
            });
            yDataSetScale.domain([0, maxDependentVar]);

            //Append dots to svg, mapping selected data to each dot (scatterplot)
            svg.selectAll(".home_data")
                .data(dataset)
                .enter().append("circle")
                .attr("class", "home_data")
                .attr("r", 2)
                .attr("cx" , function(d){
                    return dataWidthStart;
                })
                    
                .attr("cy", function(d){
                    return yDataSetScale(d[selectedVariables.column_y]);
                })
                .attr("opacity", 0.7)
                .style("fill", "#69b3a2");

            //Apply transition for data
            svg.selectAll(".home_data")
                .transition()
                .duration(250)
                .attr("cx", function (d) { return xDataSetScale(d[selectedVariables.column_x]) })
                .attr("cy", function (d) { return yDataSetScale(d[selectedVariables.column_y]) });

            //Set up y-axis for dataset
            var yAxis = d3.axisLeft(yDataSetScale)
            svg
                .append('g')
                .attr('class', 'axis_y-axis')
                .attr('transform', 'translate( ' + dataWidthStart + ',' + 0 + ')')
                .call(yAxis)

            //y-axis label
            svg.append("text")
                .attr("class", "y_label")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("x", -dataHeightEnd)
                .attr("y", dataWidthStart - 40)
                .text(selectedVariables.column_y);

            //Set up x-axis for dataset
            var xAxis = d3.axisBottom(xDataSetScale)
            svg
                .append('g')
                .attr('class', 'axis_x-axis')
                .attr('transform', 'translate(0,' + dataHeightStart + ')')
                .call(xAxis);

            //x-axis label
            svg.append("text")
                .attr("class", "x_label")
                .attr("text-anchor", "end")
                .attr("x", 1.75*dataWidthStart)
                .attr("y", dataHeightStart + 50)
                .text(selectedVariables.column_x);


            let x = dataset.map(element => element[selectedVariables.column_x]);
            let y = dataset.map(element => element[selectedVariables.column_y]);
            let alpha = this.state.alpha;
            let iterations = this.state.iterations;
            let lin_reg = new LinearRegression(x,y,alpha,iterations);
            let startTime = window.performance.now();
            let weights = lin_reg.gradientDescent();
            let endTime = window.performance.now();
            let r_squared = lin_reg.coefficient_of_determination();
            svg.selectAll("line").remove();

           
            svg.selectAll("line")
                .data(weights)
                .enter().append("line")
                .attr("x1", xDataSetScale(0))
                .attr("y1", function(d){
                    return yDataSetScale(d[0]);
                })
                .attr("x2", xDataSetScale(1))
                .attr("y2", function(d){
                    return yDataSetScale(d[0] + d[1]);
                })
                .transition()
                .delay(function(d,i){
                    return i*(3000/weights.length);
                })
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2.5)
                .transition()
                .remove();
                
            svg.append("line")
                .attr("x1", xDataSetScale(0))
                .attr("y1", yDataSetScale(weights[weights.length-1][0]))
                .attr("x2", xDataSetScale(1))
                .attr("y2", yDataSetScale(weights[weights.length-1][0] + weights[weights.length-1][1]))
                .attr("stroke", "#FA7921")
                .attr("stroke-width", 2.5);
                
            let cost = lin_reg.costHistory();
            let costWidthStart = dataWidthStart;
            let costWidthEnd = dataWidthEnd;
            let costHeightStart = 2*dataHeightStart;
            let costHeightEnd = dataHeightStart + 40

            //Set up scales to map domain to pixels (scatterplot)
            let xCostScale = d3.scaleLinear().range([costWidthStart, costWidthEnd]).domain([0, cost.length]);   
            let yCostScale = d3.scaleLinear().range([costHeightStart, costHeightEnd]).domain([0, cost[0][1]]);

            const path = svg
                .append("path")
                .datum(cost)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function(d) { return xCostScale(d[0]) })
                    .y(function(d) { return yCostScale(d[1]) })
                )

            const pathLength = path.node().getTotalLength();

            svg.append("path")
                .datum(cost)
                .attr("fill", "none")
                .attr("stroke", "#FA7921")
                .attr("stroke-width", 3)
                .attr("d", d3.line()
                    .x(function(d) { return xCostScale(d[0]) })
                    .y(function(d) { return yCostScale(d[1]) })
                )
                .attr("stroke-dashoffset", pathLength)
                .attr("stroke-dasharray", pathLength)
                .transition()
                .duration(3000)
                .attr("stroke-dashoffset", 0);

            //Set up y-axis
            var yAxis = d3.axisLeft(yCostScale)
            svg
                .append('g')
                .attr('class', 'axis_y-axis_cost')
                .attr('transform', 'translate(' + costWidthStart + ',' + 0 + ')')
                .call(yAxis);

            //y-axis label
            svg.append("text")
                .attr("class", "y_label")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("x", -dataHeightStart - 40)
                .attr("y", costWidthStart - 40)
                .text("Cost");

            //Set up x-axis
            var xAxis = d3.axisBottom(xCostScale)
            svg
                .append('g')
                .attr('class', 'axis_x-axis_cost')
                .attr('transform', 'translate(0,' + costHeightStart + ')')
                .call(xAxis);

            //x-axis label
            svg.append("text")
                .attr("class", "x_label")
                .attr("text-anchor", "end")
                .attr("x", 1.75*dataWidthStart)
                .attr("y", costHeightStart + 40)
                .text("Iterations");

            svg.append("text")
                .attr("class", "time")
                .attr("y", dataHeightEnd - 30)
                .attr("x", dataWidthStart)
                .text("Execution Time: " + Math.round((endTime-startTime)*100)/100 + "ms");
            
            svg.append("text")
                .attr("class", "time")
                .attr("text-anchor", "end")
                .attr("y", dataHeightEnd - 30)
                .attr("x", 1.75*dataWidthStart)
                .text("R-Squared: " + Math.round((r_squared)*1000)/1000);


            }).bind(this));
            
    }

    setAlpha = (event, value) => {
        
        this.setState({alpha: 10 ** value});
    }

    setIterations = (event, value) => {
        
        this.setState({iterations: 10 ** value});
    }

    render() {

       

        return(
            <div id="chartSpace" style={styles}>
                <AppBar position="static" style={{backgroundColor: "#34495e"}}>
                    <Toolbar>
                    <div style={{width: window.innerWidth}}>
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <Typography id="discrete-slider" style={{"paddingTop":"20px", "fontSize":"22px"}}>
                                Linear Regression Visualization
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography id="discrete-slider" gutterBottom style={{"paddingTop":"10px"}}>
                                Learning Rate Alpha
                            </Typography>
                            <Slider
                                defaultValue={-1}
                                getAriaValueText={this.valuetext}
                                valueLabelFormat={this.valueLabelFormat}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="auto"
                                step={0.5}
                                marks
                                min={-3}
                                max={1}
                                scale={(x) => 10 ** x}
                                style={{color:"#69b3a2"}}
                                onChangeCommitted={this.setAlpha}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Typography id="discrete-slider" gutterBottom style={{"paddingTop":"10px"}}>
                                Max Iterations
                            </Typography>
                            <Slider
                                defaultValue={5}
                                getAriaValueText={this.valuetext}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={1}
                                max={4}
                                scale={(x) => 10 ** x}
                                onChangeCommitted={this.setIterations}
                                style={{color:"#69b3a2"}}
                            />
                        </Grid>
                        </Grid>
                    </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }

    valuetext = (value) => {
        return `${value}`;
      }

    valueLabelFormat = (value) => {
    const [coefficient, exponent] = value
        .toExponential()
        .split('e')
        .map((item) => Number(item));
    return `${Math.round(coefficient)}e^${exponent}`;
    }
}






export default ScatterPlot;