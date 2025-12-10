const carouselContainer = document.querySelector('.carousel-container');
const carouselInner = document.querySelector('.carousel-inner');
const prevButton = document.querySelector('.carousel-control.prev');
const nextButton = document.querySelector('.carousel-control.next');
const indicatorContainer = document.querySelector('.indicator-container');
let indicators = null;

const images = [
  './images/01.jpg',
  './images/02.jpg',
  './images/03.jpg',
  './images/04.jpg',
];

let currentIndex = 1;
let isAnimating = false;
let autoplayInterval = null;
const autoplayDelay = 3000; // ms

const renderImages = function () {
  // 把原始图片数组首尾各添加一张图片用于无缝衔接
  const total = images.length;
  const srcList = [];
  // 添加最后一张图片到最前面
  srcList.push(images[total - 1]);
  for (let i = 0; i < total; i++) srcList.push(images[i]);
  // 添加第一张图片到最后面
  srcList.push(images[0]);

  srcList.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Carousel Image ${index}`;
    img.classList.add('carousel-img');
    carouselInner.appendChild(img);
  });
};

// 渲染指示器
const renderIndicators = function () {
  images.forEach((_, index) => {
    const indicator = document.createElement('span');
    indicator.classList.add('indicator');
    indicator.dataset.index = index; // 保存索引，方便事件委托时读取
    if (index === 0) indicator.classList.add('active');
    indicatorContainer.appendChild(indicator);
  });
  indicators = indicatorContainer.querySelectorAll('.indicator');
};

const updateCarousel = function () {
  // DOM中的第一个图片其实是最后一张图片，所以这里-100%正好对应正确的第一张图片
  carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
  if (indicators) {
    indicators.forEach((indicator, index) => {
      if (index === currentIndex - 1) indicator.classList.add('active');
      else indicator.classList.remove('active');
    });
  }
};

const indicatorEventDelegate = function () {
  indicatorContainer.addEventListener('click', (event) => {
    const ind = event.target.closest('.indicator');
    if (!ind || !indicatorContainer.contains(ind)) return;
    if (isAnimating) return; // 如果当前在动画中，忽略点击
    const idx = +ind.dataset.index;
    if (Number.isNaN(idx)) return;
    isAnimating = true;
    currentIndex = idx + 1; // 因为 DOM 中第一个真实图片是索引 1
    updateCarousel();
  });
}

const playNext = function () {
  if (isAnimating) return;
  // 加锁，防止多次点击
  isAnimating = true;
  currentIndex++;
  updateCarousel();
};

const playPrev = function () {
  if (isAnimating) return;
  isAnimating = true;
  currentIndex--;
  updateCarousel();
};

nextButton.addEventListener('click', playNext);
prevButton.addEventListener('click', playPrev);

const jumpToRealLast = function () {
  carouselInner.style.transition = 'none';
  currentIndex = images.length;
  carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
  // 强制回流，确保上一步的 transform 已经被浏览器应用
  carouselInner.offsetHeight;
  carouselInner.style.transition = 'transform 0.4s ease';
}

const jumpToRealFirst = function () {
  carouselInner.style.transition = 'none';
  currentIndex = 1;
  carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
  carouselInner.offsetHeight;
  carouselInner.style.transition = 'transform 0.4s ease';
}

const carouselInnerTransitionEndHandler = function () {
  carouselInner.addEventListener('transitionend', () => {
    if (currentIndex === 0) {
      jumpToRealLast();
    } else if (currentIndex === images.length + 1) {
      jumpToRealFirst();
    }
    if (indicators) {
      indicators.forEach((indicator, index) => {
        if (index === currentIndex - 1) indicator.classList.add('active');
        else indicator.classList.remove('active');
      });
    }
    // 解锁，允许下一次交互
    isAnimating = false;
  });
}

const startAutoplay = function () {
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    if (!isAnimating) playNext();
  }, autoplayDelay);
};

const stopAutoplay = function () {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  renderImages();
  renderIndicators();
  updateCarousel();
  indicatorEventDelegate();
  carouselInnerTransitionEndHandler();

  startAutoplay();
  carouselContainer.addEventListener('mouseenter', () => stopAutoplay());
  carouselContainer.addEventListener('mouseleave', () => startAutoplay());
});