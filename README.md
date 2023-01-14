# Puzzle Creator

This is an app for creating puzzles. Its in its very early stages of development, but it is still functional and you can create puzzle pieces for 3d puzzles with it. There isn't yet a way to visualize the puzzle in 3d.



# Getting Started with Create React App and Redux

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


## TODO
* Implement the ability to create selection boxes with "negative" width and height
* Implement snap to grid, and snap to axis functionality
    * How to:
        - When you access align a line, you make it so the second point of the line is always on the same 
        axis as the first point. For instance, if you want to y-align a line wherever you move the second point 
        it will only change the x point of it.

* Implement the ability to move a free form piece
    * How to:
        Each point on the free form piece moves relative to the cursor

* Add the ability to edit the vertices that make up the free form pieces as well as other pieces
    * How to:
        - When you enter edit mode all the vertices on the currently selected pieces turn to boxes. 
        You can then move these boxes in order to edit the vertices 
        - For the sided piece there is a box in the middle, and a box on the edge. When you move the 
        box on edge you adjust the radius, and rotation of the sided peice. When you move the box in the center
        you adjust the radius and the position of the piece.

* Add the ability to edit the width and height of the canvas
* Add the ability to combine different shapes together (requires multiple selection)
    * How to:
        - you can create a list of sides that includes the sides of both shapes
* Add the ability to change the color of each piece, both the fill and the border (you can change the fill)
* Add the ability to show or display labels on the pieces themselves 
* Add the ability to select multiple pieces and change the constraints on all the selected pieces
    * How to:
        - store an array of pieces then in the constraints panel only show the constraints that are common to all selected pieces
* Add the ability to move the canvas around
    - Only move the canvas when the scroll wheel is clicked down

* Create a log that allows you to debug any errors that occur in the app
* Create a function that allows you to join two edges.
    * How to:
        Click one edge, then the other, and join the end points of those edges/sides together

* Create an undo feature that allows you to undo your last action
* Create an edit feature that allow you to edit the vertices in any shape 
* Evaluate mathamatical expressions in the text boxes
* Make edges and vertices clickable





