vertexMaxId = -1;
lineMaxId = 0;
vertexRadius = 20;
liniSelectorRadius = 10;
vertexArray = [];
linesArray = [];
SPFASteps = [];
SPFAStepsWeights = [];
SPFAStepsStartWeighst = [];
timersArray = [];

selectedVertexesNumbers = 0;
vizPause = false;
timerId = null;

firstSelectedVertex = null;
secondSelectedVertex = null;
stepNumber = 0;
allSteps = 0;

class Point {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Vertex {
    id = 0;
    x = 0;
    y = 0;
    selected = false;
    light = false;
    dist = "";

    constructor(x, y) {
        this.id = vertexMaxId + 1;
        this.x = x;
        this.y = y;
        vertexMaxId ++;
    }
}

class Step {
    dis;
    vis;
    queue;
    comment = "";

    constructor(dis, vis, queue) {
        this.dis = dis;
        this.vis = vis;
        this.queue = queue;
    }

    toString(){

        let result = "";

        result += "Очередь: [";
        for (let i = 0; i < this.queue.length; i++) {
            result += this.queue[i] + "] [";
        }

        result = result.substring(0, result.length-2);

        result += '\n' + "Массив расстояний: [";
        for (let i = 0; i < this.dis.length - 1; i++) {
            if (this.dis[i] === Number.MAX_VALUE) {
                result += "INF] [";
            }
            else {
                result += this.dis[i] + "] [";
            }
        }

        result = result.substring(0, result.length-2);

        result += '\n' + "Массив с посещёнными вершинами: [";
        for (let i = 0; i < this.vis.length - 1; i++) {
            result += this.vis[i] + "] [";
        }

        result = result.substring(0, result.length-2);

        if (this.comment !== ""){
            result += '\n' + this.comment;
        }

        return result;

    }

}

class Line {
    id = 0;
    coordinate1;
    coordinate2;
    vertex1;
    vertex2;
    weight = Math.round(Math.random() * 20);
    light = false;

    constructor(vertex1, vertex2) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;

        this.coordinate1 = new Point(vertex1.x, vertex1.y);
        this.coordinate2 = new Point(vertex2.x, vertex2.y);

        this.id = lineMaxId;
        lineMaxId ++;

    }

}

class Log{
    textArea = document.getElementById("alg_console");
    textLines = [];

    addTextLine(message){
        this.textLines.push(message);
    }

    printToLineNumber(numb){
        this.textArea.value = "";
        for (let i = 0; i < numb; i++) {
            this.textArea.value += this.textLines[i] + '\n';
        }
    }

    clear(){
        this.textArea.value = "";
    }

}

logger = new Log();


var canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

operationType = 1; // 1 - создать, 2 - выбрать, 3 - удалить

function clearCanvas(){
    backgroudColor = 'aliceblue';
    ctx.clearRect(0 ,0 , canvas.width, canvas.height);
    ctx.fillStyle = backgroudColor;
    ctx.rect(0 ,0 , canvas.width, canvas.height);
    ctx.fill();
}

clearCanvas();


function clearAlgConsole(){
    logger.clear();
}


function clearTimers(){
    for (let i = 0; i < SPFASteps.length; i++)
        clearTimeout(timersArray[i]);

}

function pause(){

    pauseButton = document.getElementById("pause_button");

    if (vizPause)
        pauseButton.innerText = "Пауза";
    else
        pauseButton.innerText = "Продолжить";

    if (!vizPause)
        clearTimers();
    else {
        for (let i = 0; i < (SPFASteps.length - stepNumber); i++) {
            timersArray[i] = setTimeout(() => {
                nextStep();
            }, delayTime * (i + 1));
        }

    }
    vizPause = !vizPause;

}

function getRandomInRange(min, max) { //включительно
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMinusOrPlusOne(){
    if(Math.random() > Math.random()){
        return 1;
    }
    else {
        return -1;
    }
}

function generateRandomGraph() {
    n = getRandomInRange(5, 7);
    minWeight = -5;
    maxWeight = 15;
    pathMatrix = new Array(n);
    p = 0.45; //'Вероятность' существования пути

    for (let i = 0; i < n; i++){
        pathMatrix[i] = new Array(n);
        for (let j = 0; j < n; j++){
            if (Math.random()  > (1 - p)){
                pathMatrix[i][j] = getRandomInRange(minWeight, maxWeight);
            }
            else {
                pathMatrix[i][j] = 0;
            }

            if (i === j) {
                pathMatrix[i][j] = 0;
            }


        }
    }

    vertexArray = [];
    linesArray = [];

    SPFASteps = [];
    SPFAStepsWeights = [];
    SPFAStepsStartWeighst = [];
    clearTimers();
    clearTimers();

    //Вершины расставляются по окружности

    centerX = 500;
    centerY = 275;
    radius = 230;

    angleOffset = 360 / n;

    for(let angle = 0; angle < 360; angle += angleOffset){
        angleInRad = angle * Math.PI / 180;

        x = centerX + radius * Math.cos(angleInRad);
        y = centerY - radius * Math.sin(angleInRad);


        xOffset = Math.random() * 20 * getMinusOrPlusOne();
        yOffset = Math.random() * 20 * getMinusOrPlusOne();

        vertexArray.push(new Vertex(x + xOffset, y + yOffset));
    }

    recalculateVertexesIds();

    for (let i = 0; i < n; i++){
        for (let j = 0; j < n; j++){
            if (pathMatrix[i][j] !== 0 && pathMatrix[j][i] !== 0){
                if (Math.random() > Math.random()){
                    pathMatrix[i][j] = 0;
                }
                else {
                    pathMatrix[j][i] = 0;
                }
            }
        }
    }

    // console.clear();
    // for (let i = 0; i < n; i++){
    //     console.log(pathMatrix[i]);
    // }
    // console.log("---------")

    for (let i = 0; i < n; i++){
        for (let j = 0; j < n; j++){
            if (pathMatrix[i][j] !== 0){
                createdLine = new Line(vertexArray[i], vertexArray[j]);
                createdLine.weight = pathMatrix[i][j];

                linesArray.push(createdLine);
            }
        }
    }

    draw();
}


function beginAuto(){

    clearAlgConsole();

    test();

    pauseButton = document.getElementById("pause_button");
    pauseButton.innerText = "Пауза";

    vizPause = false;

    delayTime = document.getElementById("delay_time").value;

    clearTimers();

    for (let i = 0; i < SPFASteps.length; i++) {
        timersArray[i] = setTimeout(() => {
            nextStep();
        }, delayTime * (i + 1));
    }
}

function findLineFromVertexesIds(vertex1Id, vertex2Id) {
    let result = null;
    if (linesArray !== null) {
        linesArray.forEach(function (line) {
            if (line.vertex1.id === vertex1Id && line.vertex2.id === vertex2Id) {
                result = line;
                return "break";
            }
        })
        return result;

    }
}

function updateStepsStatusView(currentStep, allStep){
    text = currentStep + "/" + allStep
    document.getElementById("steps_status").innerText = text;
}

function changeVertexesDist(stepNumber){

    dis = SPFASteps[stepNumber].dis;

    for (let i = 0; i < vertexArray.length; i++){
        for (let j = 0; j < dis.length; j++) {
            if (vertexArray[i].id === j) {
                if (dis[j] === Number.MAX_VALUE){
                    vertexArray[i].dist = "INF";
                }
                else {
                    vertexArray[i].dist = dis[j];
                }
            }
        }
    }

    draw();

}

function nextStep(){

    if (stepNumber < allSteps) {

        logger.addTextLine(
            "Шаг " + stepNumber + '\n' +
            SPFASteps[stepNumber] + "\n----------------------------------------------");
        logger.printToLineNumber(stepNumber + 1);

        changeVertexesDist(stepNumber);
        stepNumber ++;
    }

    updateStepsStatusView(stepNumber, SPFASteps.length);

}

function prevStep() {

    if (stepNumber > 0) {

        logger.addTextLine(
            "Шаг " + stepNumber + '\n' +
            SPFASteps[stepNumber] + "\n----------------------------------------------");
        logger.printToLineNumber(stepNumber - 1);

        stepNumber --;

        if (stepNumber >= 1) {
            changeVertexesDist(stepNumber - 1);
        }
        else {
            for (let i = 0; i < vertexArray.length; i++) {
                vertexArray[i].dist = "";
            }

            draw();
        }
    }

    updateStepsStatusView(stepNumber, SPFASteps.length);

}


function addStep(dis, vis, q, v, u, w){
    newStep = new Step(dis.slice(), vis.slice(), q.slice());

    if (v !== -1 && v !== undefined){ //d[v] = d[u] + weight;
        newStep.comment = "Обновлён вес: [" + v + "] = [" + u + "] + " + w;
    }

    SPFASteps.push(newStep);

}

//---------------------------------

function shortestPathFaster(graph, S, V) {
    // Create array d to store shortest distance
    let d = new Array(V + 1);

    // Boolean array to check if vertex
    // is present in queue or not
    let inQueue = new Array(V + 1);

    // Initialize the distance from source to
    // other vertex as Integer.MAX_VALUE(infinite)
    for (let i = 0; i <= V; i++)
    {
        d[i] = Number.MAX_VALUE;
    }
    d[S] = 0;

    let q = [];
    q.push(S);
    inQueue[S] = true;

    addStep(d.slice(), inQueue.slice(), q.slice());

    while (q.length !== 0) {

        // Take the front vertex from Queue
        let u = q[0];
        q.shift();
        inQueue[u] = false;

        //addStep(d, inQueue, q);

        // Relaxing all the adjacent edges of
        // vertex taken from the Queue

        stepV = -1;
        stepU = -1;
        stepWeight = -1;
        for (let i = 0; i < graph[u].length; i++) {

            let v = graph[u][i][0];
            let weight = graph[u][i][1];

            if (d[v] > d[u] + weight) {
                d[v] = d[u] + weight;

                stepV = v;
                stepU = u;
                stepWeight = weight;

                if (!inQueue[v]) {
                    q.push(v);
                    inQueue[v] = true;
                }
            }
            addStep(d.slice(), inQueue.slice(), q.slice(), stepV, stepU, stepWeight);
        }

    }
}

function graphFromVertexes(){
    // graph = [];
    // for (let i = 0; i < 100; i++)
    // {
    //     graph[i] = [];
    // }
    //
    for (let i = 0; i < linesArray.length; i++) {
        //graph[linesArray[i].vertex1.id].push([linesArray[i].vertex2.id, linesArray[i].weight]);
        tree[linesArray[i].vertex1.id].push(linesArray[i].vertex2.id);

        // Add b to a's list
        tree[linesArray[i].vertex2.id].push(linesArray[i].vertex1.id);
    }

}

let sz = 100005;

// Number of vertices
let  n;
// Adjacency list representation
// of the tree
let tree = new Array(sz);
// Array that stores the subtree size
let subtree_size = new Array(sz);
// Array to mark all the
// vertices which are visited
let vis = new Array(sz);

function dfs(node)
{
    // Mark visited
    vis[node] = 1;
    subtree_size[node] = 1;

    // For every adjacent node
    for(let child=0;child<tree[node].length;child++)
    {

        // If not already visited
        if (vis[tree[node][child]] == 0)
        {

            // Recursive call for the child
            subtree_size[node] += dfs(tree[node][child]);
        }
    }
    return subtree_size[node];
}

// Function to calculate the
// contribution of each edge
function contribution(node,ans)
{
    // Mark current node as visited
    vis[node] = 1;

    // For every adjacent node
    for(let child=0;child<tree[node].length;child++)
    {

        // If it is not already visited
        if (vis[tree[node][child]] == 0)
        {
            ans += (subtree_size[tree[node][child]] *
                (n - subtree_size[tree[node][child]]));
            ans = contribution(tree[node][child], ans);
        }
    }
    return ans;
}

// Function to return the required sum
function getSum()
{
    // First pass of the dfs
    for(let i=0;i<vis.length;i++)
    {
        vis[i]=0;
    }
    dfs(0);

    // Second pass
    let ans = 0;
    for(let i=0;i<vis.length;i++)
    {
        vis[i]=0;
    }
    ans = contribution(0, ans);

    return ans;
}



function test(){

    SPFASteps = [];
    SPFAStepsWeights = [];
    SPFAStepsStartWeighst = [];

    draw();

    for(let i = 0; i < sz; i++)
    {
        tree[i] = [];
    }



    // let S = Number(document.getElementById("start_vertex").value);
    // var V = vertexArray.length; // Number of vertices in graph
    //
    n = vertexArray.length;
    graphFromVertexes();
    alert(getSum());
    //
    //
    // shortestPathFaster(graph, S, V);
    // stepNumber = 0;
    // allSteps = SPFASteps.length;
    // clearTimers();
    // clearAlgConsole();
    // updateStepsStatusView(0, SPFASteps.length);

}

function drawAllLines(){

    if (linesArray !== null)
        linesArray.forEach(function(line) {

            arrowColor = 'black';
            headLen = 22; // Длина головы стрелки

            if (line.light)
                arrowColor = 'red';

            deltaX = Math.abs(line.coordinate2.x - line.coordinate1.x);
            deltaY = Math.abs(line.coordinate1.y - line.coordinate2.y);

            tg = deltaX / deltaY;
            angle = Math.atan(tg);

            vertex1X = line.coordinate1.x;
            vertex1Y = line.coordinate1.y;

            vertex2X = line.coordinate2.x;
            vertex2Y = line.coordinate2.y;

            if (vertex1X < vertex2X)
                x = vertex2X + vertexRadius * Math.cos(1.5 * Math.PI - angle);
            else
                x = vertex2X + vertexRadius * Math.cos(1.5 * Math.PI + angle);

            if (vertex1Y < vertex2Y)
                y = vertex2Y + vertexRadius * Math.sin(1.5 * Math.PI - angle);
            else
                y = vertex2Y - vertexRadius * Math.sin(1.5 * Math.PI + angle);

            dx = x - vertex1X;
            dy = y - vertex1Y;
            angle = Math.atan2(dy, dx);

            ctx.beginPath();
            ctx.strokeStyle = arrowColor;
            ctx.moveTo(vertex1X, vertex1Y);
            ctx.lineTo(x, y);
            ctx.lineTo(x - headLen * Math.cos(angle - Math.PI / 6), y - headLen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(x, y);
            ctx.lineTo(x - headLen * Math.cos(angle + Math.PI / 6), y - headLen * Math.sin(angle + Math.PI / 6));

            ctx.stroke();

            //вычисление середины стрелки
            x = (line.vertex1.x + line.vertex2.x) / 2;
            y = (line.vertex1.y + line.vertex2.y) / 2;

            x = (line.vertex1.x + line.vertex2.x) / 2;
            y = (line.vertex1.y + line.vertex2.y) / 2;

            ctx.font = "14px serif";
            ctx.fillStyle = 'black';
            ctx.fillText(line.weight, x, y);

        })

}


function drawAllVertexes(){

    if (vertexArray !== null)
        vertexArray.forEach(function(vertex) {

            if (vertex.selected)
                ctx.fillStyle = 'blueviolet';
            else
                ctx.fillStyle = 'green';

            if (vertex.light)
                ctx.fillStyle = 'red';

            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, vertexRadius, 0, 2 * Math.PI, false);

            ctx.strokeStyle = 'black';
            ctx.stroke();
            ctx.fill();

            ctx.font = "14px serif";
            ctx.fillStyle = 'white';
            ctx.fillText(vertex.id, vertex.x, vertex.y);

            ctx.font = "14px serif";
            ctx.fillStyle = 'black';
            ctx.fillText(vertex.dist, vertex.x + vertexRadius, vertex.y);

        })


}

function setSelectedFalseForAllVertexes(){
    if (vertexArray !== null)
        vertexArray.forEach(function(vertex) {
            vertex.selected = false;
        })
}

function draw() {
    clearCanvas();
    drawAllLines();
    drawAllVertexes();
}

function deleteLineBetweenSelectedVertexes(){
    if (selectedVertexesNumbers !== 2) {
        alert("Выбрано не 2 вершины!");
        firstSelectedVertex = null;
        secondSelectedVertex = null;
        setSelectedFalseForAllVertexes();
        selectedVertexesNumbers = 0;
        draw();
    }
    else {
        confirmResult = confirm("Удалить ребро между " + firstSelectedVertex.id + " и " + secondSelectedVertex.id + " вершинами?");

        if (confirmResult) {
            foundLine = findLineFromVertexesIds(firstSelectedVertex.id, secondSelectedVertex.id);

            let i = linesArray.indexOf(foundLine);
            linesArray.splice(i, 1);
        }

        firstSelectedVertex = null;
        secondSelectedVertex = null;
        setSelectedFalseForAllVertexes();
        selectedVertexesNumbers = 0;
        draw();
    }

}

function connectVertexes(){
    if (selectedVertexesNumbers !== 2) {
        alert("Выбрано не 2 вершины!");
        firstSelectedVertex = null;
        secondSelectedVertex = null;
        setSelectedFalseForAllVertexes();
        selectedVertexesNumbers = 0;
        draw();
    }
    else {
        promptResult = prompt("Соединить вершины " + firstSelectedVertex.id + " и " + secondSelectedVertex.id + "?"
            +"\nВес ребра:");

        if (promptResult !== null) {
            newLine = new Line(firstSelectedVertex, secondSelectedVertex);
            newLine.weight = Number(promptResult);

            linesArray.push(newLine);
        }

        firstSelectedVertex = null;
        secondSelectedVertex = null;
        setSelectedFalseForAllVertexes();
        selectedVertexesNumbers = 0;
        draw();
    }

}

function deleteLinesWhenContainVertexWithId(deletedVertexId){

    for (let i = 0; i < linesArray.length; i++) {
        if (linesArray[i].vertex1.id === deletedVertexId || linesArray[i].vertex2.id === deletedVertexId){
            linesArray.splice(i, 1);
            i = 0;
        }
    }

    if (linesArray.length === 1)
        if (linesArray[0].vertex1.id === deletedVertexId || linesArray[0].vertex2.id === deletedVertexId)
            linesArray = [];

}

function recalculateVertexesIds(){
    for (let i = 0; i < vertexArray.length; i++)
        vertexArray[i].id = i;

    vertexMaxId = vertexArray.length - 1;

}

function clickOnPaintArea(event){
    x = event.offsetX;
    y = event.offsetY;

    if (operationType === 1) {
        vertexArray.push(new Vertex(x, y));
    }

    if (operationType === 2) {

        if (vertexArray !== null)
            vertexArray.forEach(function(vertex) {
                if (((vertex.x - x) * (vertex.x - x) + (vertex.y - y) * (vertex.y - y)) <= vertexRadius * vertexRadius) {
                    if (vertex.selected) {
                        selectedVertexesNumbers --;
                        vertex.selected = false;
                    }
                    else {
                        selectedVertexesNumbers ++;
                        vertex.selected = true;

                        if (firstSelectedVertex !== null)
                            secondSelectedVertex = vertex;

                        if (firstSelectedVertex === null)
                            firstSelectedVertex = vertex;
                    }
                }

            })
    }

    if (operationType === 3) {

        firstSelectedVertex = null;
        secondSelectedVertex = null;

        deletedVertex = null;

        if (vertexArray !== null)
            vertexArray.forEach(function(vertex) {
                if (((vertex.x - x) * (vertex.x - x) + (vertex.y - y) * (vertex.y - y)) <= vertexRadius * vertexRadius) {
                    deletedVertex = vertex;
                    return "break";
                }
            })

        if (deletedVertex !== null){
            confirmResult = confirm("Удалить вершину " + deletedVertex.id + "?");

            if (confirmResult) {
                let i = vertexArray.indexOf(deletedVertex);
                vertexArray.splice(i, 1);

                deleteLinesWhenContainVertexWithId(deletedVertex.id);
                recalculateVertexesIds();
                draw();
            }
        }
    }

    draw();
}

document.querySelector("#canvas").addEventListener("click", clickOnPaintArea);