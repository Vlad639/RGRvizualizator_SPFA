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

    tree;
    subTree;
    visited;
    comment = "";

    constructor(tree, subTree, visited) {
        this.tree = tree;
        this.subTree = subTree;
        this.visited = visited;
    }

    toString(){

        let result = "";

        result += "Размер поддеревьев: [";
        for (let i = 0; i < n; i++) {
            if (i < n - 1) {
                result += this.subTree[i] + ", ";
            }
            else {
                result += this.subTree[i] + "]";
            }
        }

        result += "\n";

        result += "Посещённые вершины: [";
        for (let i = 0; i < n; i++) {
            if (i < n - 1) {
                result += this.visited[i] + ", ";
            }
            else {
                result += this.visited[i] + "]";
            }
        }

        result += "\n";

        result += this.comment;

        return result;

    }

}

class Line {
    id = 0;
    coordinate1;
    coordinate2;
    vertex1;
    vertex2;
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
            this.textArea.scrollTop = this.textArea.scrollHeight;
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
        pauseButton.innerHTML = '<img src="pause_pause.png" />';
    else
        pauseButton.innerHTML = '<img src="pause_start.png" />';

    delayTime = document.getElementById("r1").value;

    if (!vizPause) {
        clearTimers();
    }
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

    vertexArray = [];
    linesArray = [];

    SPFASteps = [];
    SPFAStepsWeights = [];
    SPFAStepsStartWeighst = [];
    clearTimers();
    clearTimers();

    //n = getRandomInRange(5, 7);
    n = getRandomInRange(3, 4);
    levels = [];
    levels.push([1]);


    for (let i = 1; i < n; i++) {
        currentLevelContent = [];
        for (let j = 0; j < levels[i-1].length; j++) {
            for (let k = 0; k < levels[i-1][j]; k++) {
                numberOfChild = getRandomInRange(1, 3);
                currentLevelContent.push(numberOfChild);
            }
        }
        levels.push(currentLevelContent);
    }


    drawZoneWidth = 800;

    rootX = 500;
    rootY = 50;

    xOffset = 0;
    yOffset = 110;

    createVertexY = rootY;
    createVertexX = rootX;



    for (let i = 0; i < n; i++) {
        for (let j = 0; j < levels[i].length; j++) {
            for (let k = 0; k < levels[i][j]; k++) {
                vertexArray.push(new Vertex(createVertexX, createVertexY));
                createVertexX += xOffset;
            }
        }

        sumChildNumber = 0;

        if (i < n - 1)
            for (let j = 0; j < levels[i + 1].length; j++) {
                sumChildNumber += levels[i + 1][j];
            }


        xOffset = drawZoneWidth / (Number(sumChildNumber) + 1);
        createVertexX = rootX - drawZoneWidth / 2 + xOffset;

        createVertexY += yOffset;
    }
    recalculateVertexesIds();

    //прокладывание связей

    id = -1;

    sum = 0;
    start = 0;
    finish = 0;
    console.clear();
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < levels[i].length; j++) {
            start = sum;
            sum += levels[i][j];
            finish = sum - 1;

            if (id > -1) {
                console.log("parent: " + id);
                console.log(start + " - " + finish);
                parent = id;
                for (let k = start; k <= finish; k++) {
                    linesArray.push(new Line(
                        vertexArray[parent], vertexArray[k]
                    ))
                }

            }

            id++;
        }
    }



    test();
    draw();
}


function beginAuto(){

    clearAlgConsole();

    test();

    pauseButton = document.getElementById("pause_button");

    vizPause = true;

    delayTime = document.getElementById("r1").value;

    clearTimers();

    for (let i = 0; i < SPFASteps.length; i++) {
        timersArray[i] = setTimeout(() => {
            nextStep();
        }, delayTime * (i + 1));
    }
}
beginAuto();


function updateStepsStatusView(currentStep, allStep){
    text = currentStep + "/" + allStep
    document.getElementById("steps_status").innerText = text;
}


function nextStep(){

    if (stepNumber < allSteps) {

        logger.addTextLine(
            "Шаг " + Number(stepNumber) + '\n' +
            SPFASteps[stepNumber] + "\n----------------------------------------------");
        logger.printToLineNumber(stepNumber + 1);

        // changeVertexesDist(stepNumber);
        stepNumber ++;
    }

    updateStepsStatusView(stepNumber, SPFASteps.length);

}

function prevStep() {

    if (stepNumber > 0) {


        logger.addTextLine(
            "Шаг " + Number(stepNumber) + '\n' +
            SPFASteps[stepNumber] + "\n----------------------------------------------");

        logger.printToLineNumber(stepNumber - 1);

        stepNumber --;

    }

    updateStepsStatusView(stepNumber, SPFASteps.length);

}


function addStep(tree, subTree, visited, comment){
    newStep = new Step(tree.slice(), subTree.slice(), visited.slice());
    newStep.comment = comment;

    SPFASteps.push(newStep);

}

//---------------------------------


function graphFromVertexes(){
    for (let i = 0; i < linesArray.length; i++) {
        tree[linesArray[i].vertex1.id].push(linesArray[i].vertex2.id);
        tree[linesArray[i].vertex2.id].push(linesArray[i].vertex1.id);
    }

}



function dfs(node)
{
    // Mark visited
    vis[node] = 1;
    subtree_size[node] = 1;

    // For every adjacent node
    for(let child=0;child<tree[node].length;child++)
    {

        // If not already visited
        if (vis[tree[node][child]] === 0)
        {

            // Recursive call for the child
            addStep(tree.slice(), subtree_size.slice(), vis.slice(), "dfs");
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
        if (vis[tree[node][child]] === 0)
        {
            ans += (subtree_size[tree[node][child]] *
                (n - subtree_size[tree[node][child]]));


            addStep(tree.slice(), subtree_size.slice(), vis.slice(), "contribution, ans += "+ Number(subtree_size[tree[node][child]]) + "*" +
            Number((n - subtree_size[tree[node][child]])) + ", ans = " + ans);

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

function workWithRange(){
    //document.getElementById("delay_time").innerHTML = document.getElementById("r1").value;
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




    n = vertexArray.length;
    graphFromVertexes();
    console.log("Результат: " + getSum());

    stepNumber = 0;
    allSteps = SPFASteps.length;
    clearTimers();
    clearAlgConsole();
    updateStepsStatusView(0, SPFASteps.length);

}

function drawAllLines(){

    if (linesArray !== null)
        linesArray.forEach(function(line) {

            arrowColor = 'black';

            ctx.beginPath();
            ctx.strokeStyle = arrowColor;
            ctx.moveTo(line.vertex1.x, line.vertex1.y);
            ctx.lineTo(line.vertex2.x, line.vertex2.y);

            ctx.stroke();


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


function draw() {
    clearCanvas();
    drawAllLines();
    drawAllVertexes();
}



function deleteLinesWhenContainVertexWithId(deletedVertexId){

    for (let k = 0; k < linesArray.length; k++) {
        for (let i = 0; i < linesArray.length; i++) {
            if (linesArray[i].vertex1.id === deletedVertexId || linesArray[i].vertex2.id === deletedVertexId) {
                linesArray.splice(i, 1);
                i = 0;
            }
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

        wasClickOnVertex = false;

        if (vertexArray !== null)
            vertexArray.forEach(function(vertex) {
                if (((vertex.x - x) * (vertex.x - x) + (vertex.y - y) * (vertex.y - y)) <= vertexRadius * vertexRadius) {

                    wasClickOnVertex = true;

                    if (firstSelectedVertex === null){
                        firstSelectedVertex = vertex;
                        //alert(1);
                        return "break";
                    }

                    if (secondSelectedVertex === null){
                        secondSelectedVertex = vertex;
                        linesArray.push(new Line(firstSelectedVertex, secondSelectedVertex));

                        firstSelectedVertex = secondSelectedVertex;
                        secondSelectedVertex = null;
                    }

                    return "break";
                }
            })

        if (!wasClickOnVertex) {
            firstSelectedVertex = null;
            secondSelectedVertex = null;
        }

        draw();

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
                deleteLinesWhenContainVertexWithId(deletedVertex.id);

                let i = vertexArray.indexOf(deletedVertex);
                vertexArray.splice(i, 1);

                recalculateVertexesIds();
                draw();


        }
    }

    test();
    draw();
}

document.querySelector("#canvas").addEventListener("click", clickOnPaintArea);