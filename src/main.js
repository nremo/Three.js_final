import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// --- 1. 初始化场景、相机和渲染器 ---
const scene = new THREE.Scene();

// 加载背景图片，不拉伸
const textureLoader = new THREE.TextureLoader();
textureLoader.load('chaotic.jpg', (texture) => {
    // 设置纹理的映射方式，使其不拉伸
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    scene.background = texture;
});

// 使用正方形的纵横比
const aspectRatio = 1; // 正方形
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// 设置渲染器为正方形
const size = Math.min(window.innerWidth, window.innerHeight);
renderer.setSize(size, size);
renderer.domElement.style.display = 'block';
renderer.domElement.style.margin = '0 auto';
document.body.appendChild(renderer.domElement);

// --- 2. 添加光源 ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Brighter ambient light for even illumination
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Add fill light to illuminate from another angle
const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
fillLight.position.set(-5, 3, 5).normalize();
scene.add(fillLight);

// --- 3. 加载手部模型 ---
let handModel;
let secondModel;
let thirdModel;
let fourthModel;
let fifthModel;
let sixthModel;
let eighthModel;
let ninthModel;
let tenthModel;
let eleventhModel;
const loader = new GLTFLoader();

// 拖动切换相关变量
const allModels = [];
const modelInitialPositions = [
    { x: 0, y: -2, z: -1 },      // handModel - 中心
    { x: -4, y: -2, z: -1 },     // secondModel - 左边
    { x: 4, y: -2, z: -1 },      // thirdModel - 右边
    { x: 0, y: -2, z: -5 },      // fourthModel - 后边
    { x: 0, y: -2, z: 3 },       // fifthModel (mercury) - 前边
    { x: 0, y: 3, z: -1 },       // sixthModel (sculpture) - 上边
    { x: 0, y: -5, z: -1 },      // seventhModel (sculpture) - 下边
    { x: -4, y: 3, z: -1 },      // eighthModel - 左上
    { x: 4, y: 3, z: -1 },       // ninthModel - 右上
    { x: -4, y: -5, z: -1 },     // tenthModel - 左下
    { x: 4, y: -5, z: -1 }       // eleventhModel - 右下
];

let isDragging = false;
let dragStartX = 0;
let dragCurrentX = 0;
let dragOffset = 0;
const dragThreshold = 30; // 最小拖动距离
const swipeAnimationDuration = 500; // 动画时长
let isAnimating = false;
let currentCarouselIndex = 0; // 当前轮播位置索引

// 用于射线投射
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function loadHandModel() {
    const modelPath = 'hand_sculpture.glb';
    
    loader.load(
        modelPath,
        // Success callback
        (gltf) => {
            handModel = gltf.scene;
            
            // Configure model
            handModel.scale.set(2, 2, 2);
            handModel.position.set(0, -2, -1);
            
            // Add to scene
            scene.add(handModel);
            allModels.push(handModel);
            console.log('Model loaded successfully');
        },
        // Progress callback
        (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total * 100);
            console.log(percentComplete + '% loaded');
        },
        // Error callback
        (error) => {
            console.error('Error loading model:', error);
            console.error('Make sure the model file exists at:', modelPath);
        }
    );
}

// Load second model on the left side
function loadSecondModel() {
    const modelPath = 'pieta.glb'; // Change this to your model file name
    
    loader.load(
        modelPath,
        // Success callback
        (gltf) => {
            secondModel = gltf.scene;
            
            // Configure model - positioned on the left
            secondModel.scale.set(6, 6, 6);
            secondModel.position.set(-4, -2, -1); // Left side (negative X)
            
            // Add to scene
            scene.add(secondModel);
            allModels.push(secondModel);
            console.log('Second model loaded successfully');
        },
        // Progress callback
        (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total * 100);
            console.log('Second model: ' + percentComplete + '% loaded');
        },
        // Error callback
        (error) => {
            console.error('Error loading second model:', error);
            console.error('Make sure the model file exists at:', modelPath);
        }
    );
}

// Load third model on the right side
function loadThirdModel() {
    const modelPath = 'roman_broken_column_tk4tfgzfa_high.glb';
    
    loader.load(
        modelPath,
        // Success callback
        (gltf) => {
            thirdModel = gltf.scene;
            
            // Configure model - positioned on the right
            thirdModel.scale.set(1.5, 1.5, 1.5);
            thirdModel.position.set(4, -2, -1); // Right side (positive X)
            
            // Add to scene
            scene.add(thirdModel);
            allModels.push(thirdModel);
            console.log('Third model loaded successfully');
        },
        // Progress callback
        (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total * 100);
            console.log('Third model: ' + percentComplete + '% loaded');
        },
        // Error callback
        (error) => {
            console.error('Error loading third model:', error);
            console.error('Make sure the model file exists at:', modelPath);
        }
    );
}

// Load fourth model at the back
function loadFourthModel() {
    const modelPath = 'bison_licking_insect_bite_prehistoric_sculpture.glb';
    
    loader.load(
        modelPath,
        // Success callback
        (gltf) => {
            fourthModel = gltf.scene;
            
            // Configure model - positioned at the back
            fourthModel.scale.set(0.1, 0.1, 0.1);
            fourthModel.position.set(0, -2, -5); // Back side (negative Z)
            
            // Add to scene
            scene.add(fourthModel);
            allModels.push(fourthModel);
            console.log('Fourth model loaded successfully');
        },
        // Progress callback
        (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total * 100);
            console.log('Fourth model: ' + percentComplete + '% loaded');
        },
        // Error callback
        (error) => {
            console.error('Error loading fourth model:', error);
            console.error('Make sure the model file exists at:', modelPath);
        }
    );
}

// Load fifth model (mercury) in front
function loadFifthModel() {
    const modelPath = 'mercury_about_to_kill_argos_by_b._thorvaldsen.glb';
    
    loader.load(
        modelPath,
        // Success callback
        (gltf) => {
            fifthModel = gltf.scene;
            
            // Configure model - positioned in front
            fifthModel.scale.set(0.02, 0.02, 0.02);
            fifthModel.position.set(0, -2, 3); // Front side (positive Z)
            
            // Add to scene
            scene.add(fifthModel);
            allModels.push(fifthModel);
            console.log('Fifth model (mercury) loaded successfully');
        },
        // Progress callback
        (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total * 100);
            console.log('Fifth model: ' + percentComplete + '% loaded');
        },
        // Error callback
        (error) => {
            console.error('Error loading fifth model:', error);
            console.error('Make sure the model file exists at:', modelPath);
        }
    );
}

// Load sixth model (sculpture)
function loadSixthModel() {
    const modelPath = 'sculpture-freepoly.org.glb';
    
    loader.load(
        modelPath,
        // Success callback
        (gltf) => {
            sixthModel = gltf.scene;
            
            // Configure model - positioned on top
            sixthModel.scale.set(2.5, 2.5, 2.5);
            sixthModel.position.set(0, 3, -1); // Top side (positive Y)
            
            // Add to scene
            scene.add(sixthModel);
            allModels.push(sixthModel);
            console.log('Sixth model (sculpture) loaded successfully');
        },
        // Progress callback
        (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total * 100);
            console.log('Sixth model: ' + percentComplete + '% loaded');
        },
        // Error callback
        (error) => {
            console.error('Error loading sixth model:', error);
            console.error('Make sure the model file exists at:', modelPath);
        }
    );
}

// Load eighth model (mercury) on left top
function loadEighthModel() {
    const modelPath = 'the_thinker_by_auguste_rodin.glb';
    
    loader.load(
        modelPath,
        // Success callback
        (gltf) => {
            eighthModel = gltf.scene;
            
            // Configure model - positioned on left top
            eighthModel.scale.set(2.2, 2.2, 2.2);
            eighthModel.position.set(-4, 3, -1); // Left top side
            
            // Add to scene
            scene.add(eighthModel);
            allModels.push(eighthModel);
            console.log('Eighth model (the thinker) loaded successfully');
        },
        // Progress callback
        (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total * 100);
            console.log('Eighth model: ' + percentComplete + '% loaded');
        },
        // Error callback
        (error) => {
            console.error('Error loading eighth model:', error);
            console.error('Make sure the model file exists at:', modelPath);
        }
    );
}

// Load ninth model (scene) on right top
function loadNinthModel() {
    const modelPath = 'scene.glb';
    
    loader.load(
        modelPath,
        // Success callback
        (gltf) => {
            ninthModel = gltf.scene;
            
            // Configure model - positioned on right top
            ninthModel.scale.set(10, 10, 10);
            ninthModel.position.set(0, 3, -1); // Right top side
            
            // Add to scene
            scene.add(ninthModel);
            allModels.push(ninthModel);
            console.log('Ninth model (scene) loaded successfully');
        },
        // Progress callback
        (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total * 100);
            console.log('Ninth model: ' + percentComplete + '% loaded');
        },
        // Error callback
        (error) => {
            console.error('Error loading ninth model:', error);
            console.error('Make sure the model file exists at:', modelPath);
        }
    );
}

// Load tenth model (angel) on left bottom
function loadTenthModel() {
    const modelPath = 'angel_sculpture.glb';
    
    loader.load(
        modelPath,
        // Success callback
        (gltf) => {
            tenthModel = gltf.scene;
            
            // Configure model - positioned on left bottom
            tenthModel.scale.set(2, 2, 2);
            tenthModel.position.set(-4, -5, -1); // Left bottom side
            
            // Add to scene
            scene.add(tenthModel);
            allModels.push(tenthModel);
            console.log('Tenth model (angel) loaded successfully');
        },
        // Progress callback
        (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total * 100);
            console.log('Tenth model: ' + percentComplete + '% loaded');
        },
        // Error callback
        (error) => {
            console.error('Error loading tenth model:', error);
            console.error('Make sure the model file exists at:', modelPath);
        }
    );
}

// Load eleventh model (scene) on right bottom
function loadEleventhModel() {
    const modelPath = 'scene.glb';
    
    loader.load(
        modelPath,
        // Success callback
        (gltf) => {
            eleventhModel = gltf.scene;
            
            // Configure model - positioned on right bottom
            eleventhModel.scale.set(10, 10, 10);
            eleventhModel.position.set(0, 0, -1); // Right bottom side
            
            // Add to scene
            scene.add(eleventhModel);
            allModels.push(eleventhModel);
            console.log('Eleventh model (scene) loaded successfully');
        },
        // Progress callback
        (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total * 100);
            console.log('Eleventh model: ' + percentComplete + '% loaded');
        },
        // Error callback
        (error) => {
            console.error('Error loading eleventh model:', error);
            console.error('Make sure the model file exists at:', modelPath);
        }
    );
}





// Load the models
loadHandModel();
loadSecondModel();
loadThirdModel();
loadFourthModel();
loadFifthModel();
loadSixthModel();
loadEighthModel();
loadNinthModel();
loadTenthModel();
loadEleventhModel();

// --- 4. 设置相机位置和动画循环 ---
camera.position.z = 8;

// 拖动事件处理
document.addEventListener('mousedown', (event) => {
    isDragging = true;
    dragStartX = event.clientX;
    dragCurrentX = event.clientX;
    dragOffset = 0;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging && !isAnimating) {
        dragCurrentX = event.clientX;
        dragOffset = dragCurrentX - dragStartX;
        
        // 实时更新所有模型位置
        allModels.forEach((model, index) => {
            const basePos = modelInitialPositions[index];
            model.position.x = basePos.x + dragOffset * 0.01; // 缩放因子
        });
    }
});

document.addEventListener('mouseup', (event) => {
    if (!isDragging) return;
    
    isDragging = false;
    const totalDrag = dragCurrentX - dragStartX;
    
    // 判断拖动方向和距离
    if (Math.abs(totalDrag) > dragThreshold) {
        if (totalDrag < 0) {
            // 向左拖动，切换到下一个
            switchToNextCarousel();
        } else {
            // 向右拖动，切换到上一个
            switchToPreviousCarousel();
        }
    } else {
        // 拖动距离不足，回弹到原位置
        snapBackToPosition();
    }
});

// Touch事件处理（移动设备）
document.addEventListener('touchstart', (event) => {
    isDragging = true;
    dragStartX = event.touches[0].clientX;
    dragCurrentX = event.touches[0].clientX;
    dragOffset = 0;
});

document.addEventListener('touchmove', (event) => {
    if (isDragging && !isAnimating) {
        dragCurrentX = event.touches[0].clientX;
        dragOffset = dragCurrentX - dragStartX;
        
        // 实时更新所有模型位置
        allModels.forEach((model, index) => {
            const basePos = modelInitialPositions[index];
            model.position.x = basePos.x + dragOffset * 0.01;
        });
    }
});

document.addEventListener('touchend', (event) => {
    if (!isDragging) return;
    
    isDragging = false;
    const totalDrag = dragCurrentX - dragStartX;
    
    // 判断拖动方向和距离
    if (Math.abs(totalDrag) > dragThreshold) {
        if (totalDrag < 0) {
            // 向左拖动，切换到下一个
            switchToNextCarousel();
        } else {
            // 向右拖动，切换到上一个
            switchToPreviousCarousel();
        }
    } else {
        // 拖动距离不足，回弹到原位置
        snapBackToPosition();
    }
});

// 切换到下一个位置
function switchToNextCarousel() {
    currentCarouselIndex = (currentCarouselIndex + 1) % 11;
    animateToCarouselPosition();
}

// 切换到上一个位置
function switchToPreviousCarousel() {
    currentCarouselIndex = (currentCarouselIndex - 1 + 11) % 11;
    animateToCarouselPosition();
}

// 回弹到原位置
function snapBackToPosition() {
    animateToCarouselPosition();
}

// 动画移动到轮播位置
function animateToCarouselPosition() {
    isAnimating = true;
    const startTime = Date.now();
    
    // 计算每个模型应该移动到的位置
    const targetPositions = [];
    for (let i = 0; i < 11; i++) {
        const modelIndex = (i - currentCarouselIndex + 11) % 11;
        targetPositions.push(modelInitialPositions[modelIndex]);
    }
    
    // 记录开始位置
    const startPositions = allModels.map(model => ({
        x: model.position.x,
        y: model.position.y,
        z: model.position.z
    }));
    
    function update() {
        const now = Date.now();
        const progress = Math.min((now - startTime) / swipeAnimationDuration, 1);
        
        // 使用缓动函数使动画更平滑
        const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        
        allModels.forEach((model, index) => {
            model.position.x = startPositions[index].x + (targetPositions[index].x - startPositions[index].x) * easeProgress;
            model.position.y = startPositions[index].y + (targetPositions[index].y - startPositions[index].y) * easeProgress;
            model.position.z = startPositions[index].z + (targetPositions[index].z - startPositions[index].z) * easeProgress;
        });
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // 确保位置精确
            allModels.forEach((model, index) => {
                model.position.x = targetPositions[index].x;
                model.position.y = targetPositions[index].y;
                model.position.z = targetPositions[index].z;
            });
            isAnimating = false;
        }
    }
    
    update();
}

function animate() {
    requestAnimationFrame(animate);

    // 旋转模型以展示其3D效果 - 每个模型有不同的旋转轴和方向
    if (handModel) {
        handModel.rotation.y += 0.005;  // 绕Y轴旋转
    }
    
    if (secondModel) {
        secondModel.rotation.x += 0.005;  // 绕X轴旋转
    }
    
    if (thirdModel) {
        thirdModel.rotation.z += 0.005;  // 绕Z轴旋转
    }
    
    if (fourthModel) {
        fourthModel.rotation.y -= 0.005;  // 绕Y轴反向旋转
    }
    
    if (fifthModel) {
        fifthModel.rotation.x -= 0.005;  // 绕X轴反向旋转
    }
    
    if (sixthModel) {
        sixthModel.rotation.z -= 0.005;  // 绕Z轴反向旋转
    }

    if (eighthModel) {
        eighthModel.rotation.z += 0.005;  // 绕Z轴旋转
    }

    if (ninthModel) {
        ninthModel.rotation.x += 0.008;  // 绕X轴旋转，速度更快
    }

    if (tenthModel) {
        tenthModel.rotation.y -= 0.006;  // 绕Y轴反向旋转，中途速度
    }

    if (eleventhModel) {
        eleventhModel.rotation.z += 0.007;  // 绕Z轴旋转，稍快速度
    }

    renderer.render(scene, camera);
}

animate();
// --- 5. 处理窗口调整大小 ---
window.addEventListener('resize', () => {
    // 保持正方形纵横比
    const size = Math.min(window.innerWidth, window.innerHeight);
    camera.aspect = 1; // 正方形
    camera.updateProjectionMatrix();
    renderer.setSize(size, size);
});