const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');

const frameCount = 300;
const currentFrame = index => (
  `Result/ezgif-frame-${index.toString().padStart(3, '0')}_result.webp`
);

const images = new Array(frameCount + 1).fill(null);

const loadFrame = (index) => {
    if (!images[index]) {
        const img = new Image();
        img.src = currentFrame(index);
        images[index] = img;
    }
};

// Preload initial frames
for (let i = 1; i <= 20; i++) {
    loadFrame(i);
}

// Setup canvas on first image load
images[1].onload = function() {
  canvas.width = images[1].width;
  canvas.height = images[1].height;
  context.drawImage(images[1], 0, 0);
}

let isScrolling = false;
let scrollY = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            updateImage(scrollY);
            isScrolling = false;
        });
        isScrolling = true;
    }
}, { passive: true });

const updateImage = (scrollY) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    let scrollFraction = maxScroll > 0 ? scrollY / maxScroll : 0;
    scrollFraction = Math.max(0, Math.min(1, scrollFraction));
    
    // Calculate the current frame index (1 to 300)
    let frameIndex = Math.min(
        frameCount,
        Math.floor(scrollFraction * frameCount) + 1
    );
    
    // Preload upcoming frames
    for (let i = frameIndex; i <= Math.min(frameCount, frameIndex + 20); i++) {
        loadFrame(i);
    }
    
    let frameToDraw = frameIndex;
    if (!images[frameToDraw] || !images[frameToDraw].complete) {
        // Find closest loaded frame
        let minDiff = Infinity;
        for (let i = 1; i <= frameCount; i++) {
            if (images[i] && images[i].complete) {
                let diff = Math.abs(i - frameIndex);
                if (diff < minDiff) {
                    minDiff = diff;
                    frameToDraw = i;
                }
            }
        }
    }
    
    if (images[frameToDraw] && images[frameToDraw].complete) {
        context.clearRect(0, 0, canvas.width, canvas.height); // clear previous frame
        
        const img = images[frameToDraw];
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
};

// Handle resize events to recalculate max scroll if needed
window.addEventListener('resize', () => {
    // re-trigger update to ensure correct frame is shown
    updateImage(window.scrollY);
});
