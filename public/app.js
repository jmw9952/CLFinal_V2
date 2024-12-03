// let rows;
// let cols;
// let spacing = 20;
// let circleColor; // Variable to hold the circle color
// let size = [];

// function preload() {
//     // handPose = ml5.handPose();
// }
// function setup() {
//     createCanvas(windowWidth, windowHeight);

//     //   handPose.detectStart(video, gotHands);
//     rows = height / spacing;
//     cols = width / spacing;

//     //   for (let i=0; i<cols; i++){
//     //     // size[i] = [];
//     //     for (let j=0; j<rows; j++){
//     //       // size[i][j] = (spacing-2)*((i+1)/cols);
//     //       size[i][j] = (spacing)*((j+1)/rows);
//     //       // size[i][j] = (spacing-2)*((rows-j)/rows);
//     //     }
//     //   }
// }

// function draw() {
//     background(255);
//     // Set the fill color to circleColor
//     circleColor = color(0, 0, 255); // Initial color: Blue

//     fill(circleColor);
//     noStroke();
//     for (let i = 0; i < cols; i++) {
//         for (let j = 0; j < rows; j++) {
//             ellipse(spacing / 2 + i * spacing, spacing / 2 + j * spacing, spacing, spacing);

//             let d = dist(mouseX, mouseY, width / 2, height / 2);
//             if (d < 20) {
//                 circleColor = color(255, 0, 0); // Change color to red on mouseover
//             } else {
//                 circleColor = color(0, 0, 255); // Reset to blue if mouse is not over the circle
//             }
//         }
//     }
// }

//chatgpt help with getting the circle color to change on mouseover

let rows;
let cols;
let spacing = 20; // Adjusted for better visibility of circles
let handpose;
let video;
let hands = [];


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
    video.hide();

    // Start detecting hands from the webcam video
    handPose.detectStart(video, gotHands);

}

function draw() {
    background(255);

    // Loop through the grid to draw each circle
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            // Calculate the position of each circle
            let x = spacing / 2 + i * spacing;
            let y = spacing / 2 + j * spacing;


            // Draw all the tracked hand points
            for (let hi = 0; hi < hands.length; hi++) {
                let hand = hands[hi];
                for (let hj = 0; hj < hand.keypoints.length; hj++) {
                    let keypoint = hand.keypoints[hj];
                    // Check if the mouse is over the current circle
                    let d = dist(keypoint.x, keypoint.y, x, y);
                    if (d < spacing / 2) {
                        fill(255, 0, 0); // Change color to red on mouseover
                    } else {
                        fill(0, 0, 255); // Default color (blue)
                    }

                    // Draw the circle
                    noStroke();
                    ellipse(x, y, spacing, spacing);
                }
            }

        }
    }
}

// Callback function for when handPose outputs data
function gotHands(results) {
    // Save the output to the hands variable
    hands = results;
}