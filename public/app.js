// Initialize socket connection
let socket = io();
socket.on('connect', function () {
    console.log("Connected");
});

let rows;
let cols;
let spacing = 20; // Adjusted for better visibility of circles
let detectionSpacing = 40
let handpose;
let video;
let hands = [];

let gridPoints = [];
let gridStart = true;

let points;

function preload() {
    handPose = ml5.handPose();
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    rows = height / spacing;
    cols = width / spacing;

    // Create the video and hide it
    video = createCapture(VIDEO);
    video.size(windowWidth, windowHeight);
    frameRate(5);
    spacing = 40;
    video.hide();

    // Start detecting hands from the webcam video
    handPose.detectStart(video, gotHands);

    // Add this line to flip the coordinates for hand detection
    handPose.flipHorizontal = true;  // This ensures hand tracking works correctly with flipped video

    //create the grid and save the points
    drawGrid();
}

function draw() {
    // Save the current transformation state
    push();
    // Move to the right edge of the canvas
    translate(width, 0);
    // Scale -1 in the x-direction to flip horizontally
    scale(-1, 1);
    background(255);
    drawGrid();
    if (hands.length > 0) {
        checkHandKeyPoints();
        socket.emit('hand', true);
    }
    // Restore the transformation state
    pop();

    // if (points != null) {
    //     fill(0, 255, 0);
    //     ellipse(points.x, points.y, spacing, spacing);
    // }
}

// Callback function for when handPose outputs data
function gotHands(results) {
    // Save the output to the hands variable
    if (results.length > 0) {
        //console.log(results[0]);
        hands = results;
    }
}

function checkHandKeyPoints() {
    // Draw all the tracked hand points
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        for (let j = 0; j < hand.keypoints.length; j++) {
            let keypoint = hand.keypoints[j];
            // console.log(keypoint);
            for (let k = 0; k < gridPoints.length; k++) {
                // console.log(gridPoints[k]);
                let d = dist(keypoint.x, keypoint.y, gridPoints[k].x, gridPoints[k].y);
                //console.log(d);
                if (d < detectionSpacing) {
                    fill(255, 0, 0);
                    ellipse(gridPoints[k].x, gridPoints[k].y, spacing, spacing);
                    let points = {
                        x: gridPoints[k].x,
                        y: gridPoints[k].y,
                    }
                    socket.emit('guest-hand-points', points);
                }
            }
        }
    }
}

function drawGrid() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            // Calculate the position of each circle
            let x = spacing / 2 + i * spacing;
            let y = spacing / 2 + j * spacing;

            noStroke();
            fill(0, 0, 255); // Initial color: Blue
            ellipse(x, y, spacing, spacing);
            let curEllipse = { x: x, y: y, spacing: spacing };

            //save points on start
            if (gridStart) {
                gridPoints.push(curEllipse);
            }
        }
    }
    gridStart = false;
}

socket.on('guest-hand-points', function (points) {
    // points = data
    //     console.log("guest hand found");
        fill(128, 0, 128);
        ellipse(points.x, points.y, spacing, spacing);
})

function hideIntro() {
    document.getElementById('intro-bubble').classList.add('hidden');
}