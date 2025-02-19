let warehouseCanvas = document.getElementById("WarehouseCanvas");
let fpsDisplay = document.getElementById("FPSDisplay");
let elementCountDisplay = document.getElementById("ElementCount");

let fpsMeterVisible = true;  // 默认显示 FPS
let lastFrameTime = 0;
let frameCount = 0;
let fps = 0;

let iphoneObjects = [];  // 存储所有 iPhone 图片的数组

let elementCount = 0;  // 用于记录元素数量

// 图片路径
const iphoneImages = ['pic.jpg', 'pic2.jpg', 'pic3.jpg', 'pic4.jpg'];

// 初始化画布和 FPS
function initialize() {
    const width = 719;  // 设置宽度为图片宽度
    const height = 539; // 设置高度为图片高度

    // 使画布适应图片大小
    warehouseCanvas.width = width;
    warehouseCanvas.height = height;

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
    drawMovingiPhones();

    // 更新页面元素数量
    updateElementCount();

    requestAnimationFrame(updateFPS);
}

// 绘制 iPhone 图片
function drawMovingiPhones() {
    let ctx = warehouseCanvas.getContext('2d');
    ctx.clearRect(0, 0, warehouseCanvas.width, warehouseCanvas.height);  // 清空画布

    // 从数组末尾开始绘制
    iphoneObjects.forEach((iphone) => {
        iphone.x += iphone.vx;
        iphone.y += iphone.vy;

        // 限制 iPhone 图片活动区域在画布内
        if (iphone.x < 0 || iphone.x > warehouseCanvas.width - iphone.width) iphone.vx = -iphone.vx;
        if (iphone.y < 0 || iphone.y > warehouseCanvas.height - iphone.height) iphone.vy = -iphone.vy;

        // 绘制图片
        ctx.drawImage(iphone.img, iphone.x, iphone.y, iphone.width, iphone.height);
    });
}

// 更新页面元素数量
function updateElementCount() {
    let totalElements = iphoneObjects.length;
    elementCountDisplay.innerText = `Total Elements: ${totalElements}`;
}

// iPhone进货按钮点击事件
function addiPhone() {
    // 随机选择一张图片
    let randomImagePath = iphoneImages[Math.floor(Math.random() * iphoneImages.length)];
    let iphoneImg = new Image();
    iphoneImg.src = randomImagePath;

    iphoneImg.onload = function() {
        // 获取图片的原始宽度和高度
        let originalWidth = iphoneImg.width;
        let originalHeight = iphoneImg.height;

        // 计算宽高比
        let aspectRatio = originalWidth / originalHeight;

        // 随机生成图片大小，范围为 1% 到 15% 原图尺寸
        let randomSize = (0.01 + Math.random() * 0.14) * Math.min(originalWidth, originalHeight); // 随机生成大小，范围为 1% 到 15%

        // 计算新的宽度和高度，确保等比例缩放
        let newWidth = randomSize;
        let newHeight = newWidth / aspectRatio; // 按照宽高比计算高度

        // 随机生成图片位置，确保图片不会超出画布
        let randomX = Math.random() * (warehouseCanvas.width - newWidth);
        let randomY = Math.random() * (warehouseCanvas.height - newHeight);

        // 随机生成速度，确保图片在画布内移动
        let randomVx = 2 + Math.random() * 3;
        let randomVy = 2 + Math.random() * 3;

        iphoneObjects.push({
            x: randomX,
            y: randomY,
            width: newWidth,    // 设置宽度
            height: newHeight,  // 设置高度
            vx: randomVx,      // 设置水平速度
            vy: randomVy,      // 设置垂直速度
            img: iphoneImg
        });

        elementCount++;  // 增加元素数量
    };
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