
export default class LinearRegression {

    constructor(x, y, alpha, iterations){

        var linearAlgebra = require('linear-algebra')(),     // initialise it
        Vector = linearAlgebra.Vector,
        Matrix = linearAlgebra.Matrix;
        this.theta0 = this.generateRandomValue();
        this.theta1 = this.generateRandomValue();
        this.xValues = new Matrix(x);
        this.yValues = new Matrix(y);
        this.m = this.xValues.cols;
        this.alpha = alpha;
        this.iterations = iterations;  
        this.costValues = [];
        this.weights = [];
        

    }

    gradientDescent = () => {

        let prevCost = 0;
        let count = 0;

        

        for(var i = 0; i < this.iterations; i++){

            let hypothesis = this.xValues;
            hypothesis = hypothesis.mulEach(this.theta1).plusEach(this.theta0);
            let error = hypothesis.minus(this.yValues);
            this.theta1 = this.theta1 - this.alpha * (1/this.m) * (error.mul(this.xValues).getSum());
            this.theta0 = this.theta0 - this.alpha * (1/this.m) * (error.getSum());
            let cost = this.costFunction(count, hypothesis);

            if(Math.abs(cost - prevCost) <= 1*Math.pow(10, -4)){
                break;
            }

            prevCost = cost;
            count++;
            this.weights.push([this.theta0, this.theta1]);
            //console.log("Theta0: " + this.theta0 + ", Theta1: " + this.theta1);
        }
        
        
        return this.weights;

    }

    costFunction = (count, hypothesis) => {

        let error = this.yValues.minus(hypothesis)
        let cost = 0.5 * error.mul(error).getSum();
        this.costValues.push([count, cost]);    
        return cost;

    }

    
    coefficient_of_determination = () => {
        let ys_regression = this.xValues.mulEach(this.weights[this.weights.length-1][1]).plusEach(this.weights[this.weights.length-1][0]);
        let ys_orig = this.yValues;
    
        let ys_mean = ys_orig.getSum() / ys_orig.cols;
        
        
        let squared_regression_error = (ys_orig.minus(ys_regression));
        squared_regression_error = squared_regression_error.mul(squared_regression_error).getSum();
        
        let squared_mean_error = (ys_orig.plusEach(-1*ys_mean));
        squared_mean_error = squared_mean_error.mul(squared_mean_error).getSum();
        
        
        let r_squared = 1 - (squared_regression_error / squared_mean_error);

        return r_squared;


    }

    costHistory = () => {
        return this.costValues;
    }

    generateRandomValue = () => {
        
        return Math.random() * (1 - 0.1) + 0.1;
    }

}

