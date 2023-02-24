/**
 * Created by gilbert on 24-03-16.
 */

import p5 from "p5";

/**
 * @param {p5} s
 */
const sketch = function (s) {
    // Buildings
    let numForegroundBuildings = 7;
    let imgForegroundBuildings = [];
    let indexBuilding;

    // Mozaiks
    let numMozaiks = 2;
    let imgMozaiks = [];
    let indexMozaik;
    let mozaikStepX;
    let mozaikStepY;

    // Color palet
    let colors = [];

    // birds
    let numBirds = 6;
    let birds = [];
    let colorBird;
    let indexBird;

    // text
    let indexMessage;
    let messages = [];
    let colorMessage;
    let messageFont;

    // brush s.strokes
    let numBrushes = 7;
    let brushes = [];
    let colorBrush;
    let indexBrush;

    // rendered boxes
    let boxes = [];
    let boxItems = 100;
    let boxSize;

    s.preload = function () {
        console.log("preload");
        let i;
        messageFont = s.loadFont("assets/fonts/UrbanJungle.otf");
        for (i = 1; i < numForegroundBuildings + 1; i++) {
            imgForegroundBuildings.push({
                img: s.loadImage("assets/images/buildings/fg0" + i + ".png"),
                align: "bottom",
            });
        }
        for (i = 1; i < numMozaiks + 1; i++) {
            imgMozaiks.push({
                img: s.loadImage("assets/images/buildings/bg0" + i + ".jpg"),
            });
        }
        for (i = 1; i < numBrushes + 1; i++) {
            brushes.push({
                img: s.loadImage("assets/images/brush/verf" + i + ".png"),
            });
        }
        for (i = 1; i < numBirds + 1; i++) {
            birds.push({
                img: s.loadImage("assets/images/birds/bird" + i + ".png"),
                align: "top",
            });
        }
        messages.push({ text: "BlzblT" });
        messages.push({ text: "Birds" });
        messages.push({ text: "NYC" });
    };

    s.setup = function () {
        console.log("setup");
        s.createCanvas(s.windowWidth, s.windowHeight);
        s.init();
        s.noLoop();
        window.addEventListener("resize", s.on_resize);
    };

    s.draw = function () {
        s.background(240);
        s.renderMozaik(imgMozaiks[indexMozaik]);
        s.renderBrush(brushes[indexBrush]);
        s.drawBoxes();
        s.drawlines();
        s.renderBuilding(birds[indexBird], colorBird);
        s.renderBuilding(imgForegroundBuildings[indexBuilding], s.color(255));
        s.renderText(messages[indexMessage]);
    };

    s.mousePressed = function () {
        s.init();
        s.redraw();
    };

    s.windowResized = function() {
        s.width = s.windowWidth;
        s.height = s.windowHeight;
        s.draw();
    };

    s.init = function () {
        // boxes
        if (boxes.length == 0) {
            boxSize = s.width / boxItems;
            for (let i = 0; i < s.width; i += boxSize) {
                for (let j = 0; j < s.height; j += boxSize) {
                    if (s.random(8) <= 1) {
                        boxes.push({
                            x1: i,
                            y1: j,
                            x2: boxSize,
                            y2: boxSize,
                            alpha: s.random(100),
                        });
                    }
                }
            }
        }
        // Mozaik
        mozaikStepX = s.floor(s.width / s.random(5, 10));
        mozaikStepY = s.floor(s.width / s.random(5, 10));
        // Set colour palette
        if (colors.length == 0) {
            colors.push({ r: 101, g: 109, b: 110 }); // grey
            colors.push({ r: 217, g: 191, b: 176 }); // skin
            colors.push({ r: 217, g: 71, b: 17 }); // orange
            colors.push({ r: 107, g: 128, b: 113 }); // green
            colors.push({ r: 108, g: 92, b: 41 }); // army
        }
        // Choose the building, bird and mozaik
        indexBuilding = s.floor(s.random(0, imgForegroundBuildings.length));
        indexBird = s.floor(s.random(0, birds.length));
        indexMozaik = s.floor(s.random(0, imgMozaiks.length));
        indexBrush = s.floor(s.random(0, brushes.length));
        indexMessage = s.floor(s.random(0, messages.length));
        // Pick a color for the bird from the palette
        let indexColorBird = s.floor(s.random(0, colors.length));
        colorBird = s.color(colors[indexColorBird].r, colors[indexColorBird].g, colors[indexColorBird].b);
        // Pick a color for the brush s.strokes from the palette
        let indexColorBrush = s.floor(s.random(0, colors.length));
        while (indexColorBrush == indexColorBird) {
            indexColorBrush = s.floor(s.random(0, colors.length));
        }
        colorBrush = s.color(colors[indexColorBrush].r, colors[indexColorBrush].g, colors[indexColorBrush].b);
        let indexColorText = s.floor(s.random(0, colors.length));
        while (indexColorText == indexColorBrush || indexColorText == indexColorBird) {
            indexColorText = s.floor(s.random(0, colors.length));
        }
        colorMessage = s.color(colors[indexColorText].r, colors[indexColorText].g, colors[indexColorText].b, 192);
    };

    s.renderBrush = function (brush) {
        s.tint(colorBrush);
        s.image(brush.img, 0, 0, s.width, s.height);
    };

    s.renderMozaik = function (mozaik) {
        let x, y, x0, y0;
        let maxX = s.floor(mozaik.img.width - mozaikStepX);
        let maxY = s.floor(mozaik.img.height - mozaikStepY);
        for (x = 0; x < s.width; x += mozaikStepX) {
            for (y = 0; y < s.height; y += mozaikStepY) {
                x0 = s.random(0, maxX);
                y0 = s.random(0, maxY);
                s.copy(mozaik.img, x0, y0, mozaikStepX, mozaikStepY, x, y, mozaikStepX, mozaikStepY);
            }
        }
        s.noStroke();
        s.fill(255, 255, 255, 60);
        s.rect(0, 0, s.width, s.height);
    };

    s.renderBuilding = function (building, tintColor) {
        let img = building.img;
        let ratio = img.width / img.height;
        let scaledWidth;
        let scaledHeight;
        s.tint(tintColor);
        // landscape viewport
        if (s.width > s.height) {
            scaledWidth = s.width;
            scaledHeight = s.width / ratio;
        }
        // portrait viewport
        else {
            scaledHeight = s.height;
            scaledWidth = ratio * s.height;
        }
        switch (building.align) {
            case "top":
                s.image(building.img, 0, 0, scaledWidth, scaledHeight);
                break;
            case "bottom":
                s.image(building.img, 0, s.height - scaledHeight, scaledWidth, scaledHeight);
                break;
            case "left":
                s.image(building.img, 0, 0, scaledWidth, scaledHeight);
                break;
            case "right":
                break;
        }
    };

    s.drawBoxes = function () {
        s.strokeWeight(1);
        for (let i = 0; i < boxes.length; i++) {
            s.fill(255, 255, 255, boxes[i].alpha);
            s.stroke(255, 255, 255, 2 * boxes[i].alpha);
            s.rect(boxes[i].x1, boxes[i].y1, boxes[i].x2, boxes[i].y2);
        }
    };

    s.drawlines = function () {
        for (let i = 0; i < s.width; i += 3) {
            s.strokeWeight(9);
            s.stroke(0, 0, 0, s.random(20));
            s.line(i, 0, i, s.height);
        }
        for (let j = 0; j < s.height; j += 3) {
            s.strokeWeight(9);
            s.stroke(0, 0, 0, s.random(50));
            s.line(0, j, s.width, j);
        }
    };

    s.renderText = function (message) {
        let textColor = s.color(colorMessage);
        s.stroke(textColor);
        s.noStroke();
        s.fill(textColor);
        s.textFont(messageFont, s.width / 3);
        s.textAlign(s.CENTER, s.CENTER);
        s.text(message.text, s.width / 2, s.height / 2 + s.height / 4);
    };
};

const sketchInstance = new p5(sketch, document.getElementById("sketch"));
