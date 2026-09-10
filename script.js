const canvas = document.getElementById('scroll-canvas');
const context = canvas.getContext('2d');

const frameCount = 300;
const currentFrame = index => (
  `Pic/ezgif-frame-${index.toString().padStart(3, '0')}.png`
);

// Preload images
const images = [];
const preloadImages = () => {
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }
};

preloadImages();

// Setup canvas on first image load
const img = new Image();
img.src = currentFrame(1);
img.onload = function() {
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);
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
});

const updateImage = (scrollY) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollY / maxScroll;
    
    // Calculate the current frame index
    let frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );
    
    if (images[frameIndex] && images[frameIndex].complete) {
        // Adjust canvas resolution to match the current frame's resolution
        canvas.width = images[frameIndex].width;
        canvas.height = images[frameIndex].height;
        
        context.clearRect(0, 0, canvas.width, canvas.height); // clear previous frame
        context.drawImage(images[frameIndex], 0, 0);
    }
};

// Handle resize events to recalculate max scroll if needed
window.addEventListener('resize', () => {
    // re-trigger update to ensure correct frame is shown
    updateImage(window.scrollY);
});
