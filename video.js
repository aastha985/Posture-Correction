let videofeed;
let posenet;
let poses = [];
let started = false;
//p5.js
function setup() {
    const canvas = createCanvas(500, 500);
    canvas.parent("video"); //div with id video in index.html

    //video
    videofeed = createCapture(VIDEO);
    videofeed.size(width, height);
    console.log("setup");
    posenet = ml5.poseNet(videofeed);

    posenet.on("pose", function (results) {
        poses = results;
    });

    videofeed.hide();
    noLoop();
}

function draw() {
    if (started) {
        image(videofeed, 0, 0, width, height);
        calEyes();
    }
}

function start() {
    select("#startstop").html("stop");
    document.getElementById("startstop").addEventListener("click", stop);
    started = true;
    loop();
}

function stop() {
    select("#startstop").html("start");
    document.getElementById("startstop").addEventListener("click", start);
    removeblur();
    started = false;
    noLoop();
}

var rightEye,
    leftEye,
    defaultRightEyePosition = [],
    defaultLeftEyePosition = [];

function calEyes() {
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            rightEye = pose.keypoints[2].position;
            leftEye = pose.keypoints[1].position;
            while (defaultRightEyePosition.length < 1) {
                defaultRightEyePosition.push(rightEye.y);
            }
            while (defaultLeftEyePosition.length < 1) {
                defaultLeftEyePosition.push(leftEye.y);
            }
            if (Math.abs(rightEye.y - defaultRightEyePosition[0]) > 20) {
                blur();
            }
            if (Math.abs(rightEye.y - defaultRightEyePosition[0]) <= 20) {
                removeblur();
            }
        }
    }
}

function blur() {
    document.getElementById("audioElement").play();
    document.body.style.filter = "blur(5px)";
    document.body.style.transition = "1s";
    console.log("Change");
}

function removeblur() {
    document.body.style.filter = "blur(0px)";
    var audio = document.getElementById("audioElement").pause();
}
