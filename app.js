let squareCanvas = document.getElementById("SquareCanvas");
let circleCanvas = document.getElementById("CircleCanvas");
let imageCanvas = document.getElementById("ImageCanvas");
let fpsDisplay = document.getElementById("FPSDisplay");
let elementCountDisplay = document.getElementById("ElementCount");

let fpsMeterVisible = true;  // 默认显示 FPS
let lastFrameTime = 0;
let frameCount = 0;
let fps = 0;

let squareObjects = [];  // 方块
let circleObjects = [];  // 圆形
let imageObjects = [];   // 图片

let uploadedImage = null;  // 用来存储上传的图片

let testMode = false;  // 控制自动测试模式
let autoAddInterval = null;  // 自动添加元素的定时器
let elementCount = 0;  // 用于记录元素数量
let manualElementCount = 0; // 手动生成的元素数量
let autoElementCount = 0;   // 自动生成的元素数量
let startTime = 0;  // 自动测试开始时间
let endTime = 0;    // 自动测试结束时间

// 初始化画布和 FPS
function initialize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 使画布适应屏幕大小
    squareCanvas.width = width * 0.8;  // 画布宽度为屏幕宽度的 80%
    squareCanvas.height = height * 0.5; // 画布高度为屏幕高度的 50%

    circleCanvas.width = width * 0.8;
    circleCanvas.height = height * 0.5;

    imageCanvas.width = width * 0.8;
    imageCanvas.height = height * 0.5;

    requestAnimationFrame(updateFPS);
}

function updateFPS(timestamp) {
    if (lastFrameTime) {
        let deltaTime = (timestamp - lastFrameTime) / 1000;  // 秒
        frameCount++;
        if (deltaTime >= 1) {
            fps = frameCount;
            frameCount = 0;
            lastFrameTime = timestamp;

            // 更新 FPS 显示
            fpsDisplay.innerText = `FPS: ${fps}`;
        }
    } else {
        lastFrameTime = timestamp;
    }

    // 动态绘制
    drawMovingSquares();
    drawMovingCircles();
    drawMovingImages();

    // 更新页面元素数量
    updateElementCount();

    requestAnimationFrame(updateFPS);
}

// 绘制方块
function drawMovingSquares() {
    let ctx = squareCanvas.getContext('2d');
    ctx.clearRect(0, 0, squareCanvas.width, squareCanvas.height);  // 清空画布

    // 从数组末尾开始绘制
    squareObjects.forEach((square) => {
        square.x += square.vx;
        square.y += square.vy;

        // 限制方块活动区域在画布内
        if (square.x < 0 || square.x > squareCanvas.width - square.size) square.vx = -square.vx;
        if (square.y < 0 || square.y > squareCanvas.height - square.size) square.vy = -square.vy;

        // 绘制方块并加描边
        ctx.fillStyle = '#ff0000';
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000'; // 边界描边颜色
        ctx.fillRect(square.x, square.y, square.size, square.size);
        ctx.strokeRect(square.x, square.y, square.size, square.size);  // 描边
    });
}

// 绘制圆形
function drawMovingCircles() {
    let ctx = circleCanvas.getContext('2d');
    ctx.clearRect(0, 0, circleCanvas.width, circleCanvas.height);  // 清空画布

    // 从数组末尾开始绘制
    circleObjects.forEach((circle) => {
        circle.x += circle.vx;
        circle.y += circle.vy;

        // 限制圆形活动区域在画布内
        if (circle.x < 0 || circle.x > circleCanvas.width - circle.radius) circle.vx = -circle.vx;
        if (circle.y < 0 || circle.y > circleCanvas.height - circle.radius) circle.vy = -circle.vy;

        // 绘制圆形并加描边
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#00ff00';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000'; // 边界描边颜色
        ctx.stroke();  // 描边
    });
}

// 绘制图片
function drawMovingImages() {
    let ctx = imageCanvas.getContext('2d');
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);  // 清空画布

    // 从数组末尾开始绘制
    imageObjects.forEach((imgObj) => {
        imgObj.x += imgObj.vx;
        imgObj.y += imgObj.vy;

        // 限制图像活动区域在画布内
        if (imgObj.x < 0 || imgObj.x > imageCanvas.width - imgObj.size) imgObj.vx = -imgObj.vx;
        if (imgObj.y < 0 || imgObj.y > imageCanvas.height - imgObj.size) imgObj.vy = -imgObj.vy;

        ctx.drawImage(imgObj.img, imgObj.x, imgObj.y, imgObj.size, imgObj.size);
    });
}

// 更新页面元素数量
function updateElementCount() {
    let totalElements = squareObjects.length + circleObjects.length + imageObjects.length;
    elementCountDisplay.innerText = `Total Elements: ${totalElements}`;
    // 自动记录测试数据
    logTestData(totalElements);
}

// 记录测试数据
function logTestData(totalElements) {
    let fps = calculateFPS();
    console.log(`FPS: ${fps}, Total Elements: ${totalElements}`);
    // 在此处添加更多性能数据记录逻辑（例如：渲染时间、内存占用等）
}

// 模拟 FPS 计算
function calculateFPS() {
    // 在这里模拟一个 FPS 计算逻辑（实际中需要用真实的渲染时间计算）
    return Math.max(30, 60 - (squareObjects.length + circleObjects.length) / 100);
}

// 自动测试开始
function startAutoTest() {
    if (!testMode) {
        testMode = true;
        startTime = Date.now();  // 记录开始时间
        autoAddInterval = setInterval(() => {
            // 每隔一定时间自动添加元素
            if (elementCount < 1000) {  // 设置最大元素数量为1000
                addSquare();
                addCircle();
                autoElementCount += 2; // 每次添加两个元素（方块和圆形）
                elementCount += 2;
                updateElementCount();
            }
        }, 1000); // 每秒添加两个元素
    }
}

// 停止自动测试
function stopAutoTest() {
    testMode = false;
    endTime = Date.now();  // 记录结束时间
    clearInterval(autoAddInterval);
    console.log(`Test completed. Total Time: ${(endTime - startTime) / 1000} seconds.`);
    logTestResults();
}

// 记录测试结果
function logTestResults() {
    let resultText = `
        Total Time: ${(endTime - startTime) / 1000} seconds
        Auto Generated Elements: ${autoElementCount}
        Manual Generated Elements: ${manualElementCount}
        Total Elements: ${squareObjects.length + circleObjects.length + imageObjects.length}
    `;
    console.log(resultText);
    document.getElementById("testResults").innerText = resultText;
}

// 导出测试结果（CSV）
function downloadTestResults() {
    let results = `Time (seconds),Auto Generated Elements,Manual Generated Elements,Total Elements\n${(endTime - startTime) / 1000},${autoElementCount},${manualElementCount},${squareObjects.length + circleObjects.length + imageObjects.length}\n`;
    
    // Create a blob and initiate download
    let blob = new Blob([results], { type: 'text/csv' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'test_results.csv';
    link.click();
}

// 上传图片功能
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage = new Image();
            uploadedImage.src = e.target.result;
            uploadedImage.onload = function() {
                alert('图片上传成功！');
            }
        };
        reader.readAsDataURL(file);
    }
}

// 点击 "Add Image" 后，只有上传了图片才显示，否则提示上传图片
function addImage() {
    if (uploadedImage) {
        imageObjects.push({
            x: Math.random() * imageCanvas.width,
            y: Math.random() * imageCanvas.height,
            size: 30 + Math.random() * 50,
            vx: 2 + Math.random() * 3,
            vy: 2 + Math.random() * 3,
            img: uploadedImage
        });
        manualElementCount++;  // 手动生成的元素数量
    } else {
        alert("请先上传图片！");
    }
}

// 添加方块
function addSquare() {
    const size = 30 + Math.random() * 40;  // 方块的大小
    const x = Math.random() * (squareCanvas.width - size);  // 确保不会生成在画布边缘
    const y = Math.random() * (squareCanvas.height - size);  // 确保不会生成在画布边缘

    squareObjects.push({
        x: x,
        y: y,
        size: size,
        vx: 2 + Math.random() * 3,
        vy: 2 + Math.random() * 3
    });
    manualElementCount++;  // 手动生成的元素数量
}

// 添加圆形
function addCircle() {
    const radius = 20 + Math.random() * 30;  // 圆形的半径
    const x = Math.random() * (circleCanvas.width - radius * 2);  // 确保不会生成在画布边缘
    const y = Math.random() * (circleCanvas.height - radius * 2);  // 确保不会生成在画布边缘

    circleObjects.push({
        x: x,
        y: y,
        radius: radius,
        vx: 2 + Math.random() * 3,
        vy: 2 + Math.random() * 3
    });
    manualElementCount++;  // 手动生成的元素数量
}

// 批量添加元素（随机生成方块或圆形）
function addMultipleElements() {
    let count = parseInt(document.getElementById('randomCount').value);
    if (isNaN(count) || count <= 0) {
        alert("请输入有效的数字！");
        return;
    }
    for (let i = 0; i < count; i++) {
        let randomElementType = Math.floor(Math.random() * 2);
        if (randomElementType === 0) {
            addSquare();
        } else {
            addCircle();
        }
    }
}

// 菜单折叠功能
function toggleMenu() {
    const menu = document.getElementById("menuContainer");
    const arrow = document.getElementById("toggleMenu");

    if (menu.style.display === "none") {
        menu.style.display = "block";
        arrow.innerHTML = "&#x25BC;"; // Down arrow
    } else {
        menu.style.display = "none";
        arrow.innerHTML = "&#x25B2;"; // Up arrow
    }
}