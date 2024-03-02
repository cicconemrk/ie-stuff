let canvas = document.getElementById("graphCanvas"); //Establish the interactive canvas in the UI
let ctx = canvas.getContext("2d"); //Establish the canvas is 2-dimensional
let nodes = []; //(x, y)
let edges = []; //[Start Node _, End Node _, Weight _]
let placingNodes = true; //Boolean variable for being in the Node Placement Mode
let creatingEdges = false; //^ for Edge Creation Mode
let startNode = null; //Used in connecting nodes
let endNode = null; //^
let firstClickConnection = false; //^, used in recoloring the starting node of a connection
// poop
canvas.addEventListener("click", handleCanvasClick); //When a "click" event occurs on the canvas, the handleCanvasClick function is executed

function handleCanvasClick(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left; //Horizontal position of the click relative to the left edge of the canvas
    const mouseY = event.clientY - canvas.getBoundingClientRect().top; //Vertical position of the click relative to the top edge of the canvas

    //This updates the display of the nodes and edges arrays
    //Remove this once testing isn't needed anymore
    updateNodesList(); // Call the function to update nodes list

    //This updates the display of the nodes and edges arrays
    //Remove this once testing isn't needed anymore
    updateEdgesList(); // Call the function to update edges list

    if (placingNodes) {
        nodes.push({ x: mouseX, y: mouseY }); //Adds the coordinates of the current click to the end of the "nodes" array
        drawNode();
    } else if (creatingEdges) {
        const clickedNode = findClickedNode(mouseX, mouseY);
        if (clickedNode !== null) {
            if (startNode === null) {
                startNode = clickedNode;
                firstClickConnection = true;
                recolorNode(startNode, firstClickConnection)
            } else if (endNode === null && startNode !== clickedNode) {
                endNode = clickedNode;
                showPopup(function (parsedWeight) {
                    edges.push({ start: startNode, end: endNode, weight: parsedWeight });
                    drawEdge(); // Draw the edge after adding it to the array and receiving the weight
                    startNode = null;
                    endNode = null;
                    firstClickConnection = false;
                });
            }
        }
    }
}

/* For a click made while in Connect Mode, each node is evaluated. The distance between the clicked location and the center each of the placed nodes 
is determined to find the closest node to the click. If the clicked location is less than 20, that means it is within the radius of a node, which implies
that the user clicked on a placed node. The purpose of this function is to allow users to click on the circle of a node and not the exact center coordinate 
for the function to work*/
function findClickedNode(x, y) {
    let closestNodeIndex = null;
    let minDistance = Number.MAX_VALUE;

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);

        if (distance < minDistance) {
            minDistance = distance;
            closestNodeIndex = i;
        }
    }

    // Check if the closest node is within a certain radius
    if (minDistance < 20) {  // Assuming the radius of the node is 20 pixels
        return closestNodeIndex;  // Return the index of the closest node
    }

    return null;  // Return null if no node is clicked
}

function findClickedEdge(x, y) {
    return edges.find(edge => {
        const startX = nodes[edge.start].x;
        const startY = nodes[edge.start].y;
        const endX = nodes[edge.end].x;
        const endY = nodes[edge.end].y;

        const d = distanceToLine(x, y, startX, startY, endX, endY);
        return d < 10;
    });
}

function distanceToLine(x, y, x1, y1, x2, y2) {
    const numerator = Math.abs((x2 - x1) * (y1 - y) - (x1 - x) * (y2 - y1));
    const denominator = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return numerator / denominator;
}

function drawNode() {
    const nodeCount = nodes.length;
    const newNode = nodes[nodes.length - 1];
    ctx.beginPath(); //Starts path for drawing node
    ctx.arc(newNode.x, newNode.y, 20, 0, 2 * Math.PI); //Draws a circle of radius 20 pixels around the position of the node
    ctx.fillStyle = "blue"; //For the node being drawn: green if start, red if end, blue else
    ctx.fill();
    ctx.stroke(); //Draws an outline for the circle
    ctx.fillStyle = "white"; //Fill color for text is white
    ctx.fillText(nodeCount, newNode.x - 4, newNode.y + 4); //Places the index number at the center of the node
}

function recolorNode(nodeIndex, firstClick) {
    const nodeToRecolor = nodes[nodeIndex];
    let nodeColor;

    if (firstClick = true) {
        nodeColor = green;
    } else {
        nodeColor = blue;
    }

    ctx.beginPath(); //Starts path for drawing node
    ctx.arc(nodeToRecolor.x, nodeToRecolor.y, 20, 0, 2 * Math.PI); //Draws a circle of radius 20 pixels around the position of the node
    ctx.fillStyle = nodeColor; //For the node being drawn: green if start, red if end, blue else
    ctx.fill();
    ctx.stroke(); //Draws an outline for the circle
    ctx.fillStyle = "white"; //Fill color for text is white
    ctx.fillText(nodeIndex + 1, nodeToRecolor.x - 4, nodeToRecolor.y + 4); //Places the index number at the center of the node
}

function drawEdge() {
    const newestEdge = edges[edges.length - 1];
    const startNode = nodes[newestEdge.start];
    const endNode = nodes[newestEdge.end];

    if (startNode && endNode) {
        const startX = startNode.x;
        const startY = startNode.y;
        const endX = endNode.x;
        const endY = endNode.y;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.fillStyle = "black";

        const weightX = (startX + endX) / 2;
        const weightY = (startY + endY) / 2;

        // Draw the weight on the canvas
        ctx.fillText(newestEdge.weight, weightX, weightY);
    }

    ctx.lineWidth = 1; // Reset the line width to its default value
}

// Function to handle weight input
function handleWeightInput(callback) {
    const weight = document.getElementById("weightInput").value;
    const inputAccepted = null;

    do {
        if (weight.trim() === "") {
            alert("Please enter a weight.");
            return;
        }

        const parsedWeight = parseFloat(weight);
        if (parsedWeight <= 0) {
            //Clear the input field
            document.getElementById("weightInput").value = "";
            alert("Weights must have a positive value.")
            return;
        } else if (isNaN(parsedWeight)) {
            //Clear the input field
            document.getElementById("weightInput").value = "";
            alert("Weights must have a numerical value.")
            return;
        } else {
            // Invoke the callback function with the parsed weight value
            callback(parsedWeight);

            // Close the popup window
            hidePopup();
            inputAccepted = true;
        }
    }
    while (inputAccepted != true);
}

function toggleNodePlacement() {
    placingNodes = true;
    creatingEdges = false;
    assigningWeights = false;
}

function toggleEdgeCreation() {
    placingNodes = false;
    creatingEdges = true;
    assigningWeights = false;
}

function runDijkstra() {
    // Implement Dijkstra's algorithm here
    // You can use the 'nodes' array and 'edges' array to perform the algorithm
    // Update the UI as needed to show the results
    alert("Dijkstra's algorithm will run here!");
}


// Function to show the popup and handle weight input
function showPopup(callback) {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.display = "block";
    // Pass the callback function to the handleWeightInput function
    document.getElementById("submitBtn").onclick = function () {
        handleWeightInput(callback);
    };

    callback(parsedWeight);
}

// Function to hide the popup
function hidePopup() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";

    //Clear the input field
    document.getElementById("weightInput").value = "";
}

//Code to display the edges and nodes arrays as they update. This code is all copied/pasted from GPT
//START-------------------------------------------------------------------------------------------------
function updateNodesList() {
    const nodesList = document.getElementById("nodesList");
    nodesList.innerHTML = ""; // Clear previous content

    nodes.forEach((node, index) => {
        const li = document.createElement("li");
        li.textContent = `Node ${index}: (${node.x}, ${node.y})`;
        nodesList.appendChild(li);
    });
}

function updateEdgesList() {
    const edgesList = document.getElementById("edgesList");
    edgesList.innerHTML = ""; // Clear previous content

    edges.forEach((edge, index) => {
        const li = document.createElement("li");
        li.textContent = `Edge ${index}: Start Node ${edge.start}, End Node ${edge.end}, Weight ${edge.weight}`;
        edgesList.appendChild(li);
    });
}

window.addEventListener("load", () => {
    updateNodesList();
    updateEdgesList();
});
//END------------------------------------------------------------------------------------------------------------
