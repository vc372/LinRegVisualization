import React from 'react';
import './App.css';
import ScatterPlot from './Charts/ScatterPlot';
import HousingData from './Data/house-prices-advanced-regression-techniques/train.csv';
import Fish from './Data/Fish.csv';
import * as d3 from 'd3';


class App extends React.Component {

  constructor(props){

    super(props);

    this.state = {
      data: [

      ]
    };
    
  }

  componentDidMount() {
    
    d3.csv(HousingData)
      .then(this.ready);
    console.log("mounted");
  }

  ready = (datapoints) => {

    this.setState({data: datapoints});
  
  }

  ScatterPlot = () => {
    return (
      <ScatterPlot data={this.state.data}/>
    );
  }
    
  render(){

    return (
      <div className="Main">
        {this.state.data.length === 0 ? null:this.ScatterPlot()}
      </div>
    );

  }

}

export default App;
