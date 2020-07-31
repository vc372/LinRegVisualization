# Linear Regression Visualization 

A project that [visualizes linear regression](https://lin-reg-visualization.herokuapp.com/) using the [Ames Housing Dataset from Kaggle](https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data). 

## Motivation 

The purpose of this project was to better visualize single variable linear regression with [gradient descent](https://en.wikipedia.org/wiki/Gradient_descent). This process is depicted by showing the transition from a random line to the line of best fit, while simultaneously graphing the associated cost of the current state of the line. Cost is defined by [mean squared error](https://en.wikipedia.org/wiki/Mean_squared_error). 

## Features 

This project features an interactive heat map that maps the top ten most coorelated variables with sales price. Clicking on a cell of the heat map graphs the associated x and y variables, and runs the linear regression animation by running the gradient descent algorithm, and graphs the associated weights after each iteration. The data has been scaled to improve performance. 

![linreg_vis_demo](https://user-images.githubusercontent.com/62442387/89074805-0a7a0c00-d34b-11ea-8dd9-ca5e7f189e97.gif)

The project also features sliders for parameter tuning. The user can toggle the learning rate of the model, and the max allowable iterations. Execution time of the program, and R-squared of the line is provided to help a user determine the optimal learning rate and max allowable iterations. In this way, users are able to decide tradeoffs between accuracy (R-squared), and performance (execution time).

![linreg_vis_par_demo](https://user-images.githubusercontent.com/62442387/89076624-aa856480-d34e-11ea-945d-4d14a83bf2fc.gif)

## Libraries 

**Built With:**
  * [React](https://reactjs.org/)
  * [D3.js](https://d3js.org/)

## Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
