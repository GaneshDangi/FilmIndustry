/** Initialize Lenis for Smooth Scrolling */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate GSAP with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);

// ─── CURSOR ───
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  gsap.to(cursor, { x: e.clientX - 6, y: e.clientY - 6, duration: .010 });
  gsap.to(ring, { x: e.clientX - 18, y: e.clientY - 18, duration: .25 });
});
document.querySelectorAll('a, button, .faq-item, .gallery-card, .video-card, .tree-node').forEach(el => {
  el.addEventListener('mouseenter', () => gsap.to(ring, { scale: 1.8, duration: .3 }));
  el.addEventListener('mouseleave', () => gsap.to(ring, { scale: 1, duration: .3 }));
});

// ─── STARS ───
function makeStars(n) {
  const hero = document.getElementById('hero');
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 3 + 1;
    Object.assign(s.style, {
      width: size + 'px', height: size + 'px',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      opacity: Math.random() * .6 + .1,
    });
    hero.appendChild(s);
    gsap.to(s, {
      opacity: Math.random() * .2,
      duration: Math.random() * 3 + 2,
      repeat: -1, yoyo: true,
      delay: Math.random() * 4,
      ease: 'sine.inOut'
    });
  }
}
makeStars(80);

// ─── PETALS ───
function spawnPetals() {
  const canvas = document.getElementById('petalCanvas');
  const colors = ['#E8A4B4', '#F5D5DC', '#D4AF6B', '#C4607A', '#FDDDE6'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = Math.random() * 110 - 5 + '%';
    canvas.appendChild(p);
    animatePetal(p);
  }
}
function animatePetal(p) {
  const startX = parseFloat(p.style.left);
  gsap.set(p, { y: -30, x: 0, rotation: Math.random() * 360, opacity: 0 });
  gsap.to(p, {
    y: window.innerHeight + 60,
    x: (Math.random() - .5) * 300,
    rotation: '+=' + (Math.random() * 720 - 360),
    opacity: Math.random() * .5 + .1,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 6,
    ease: 'none',
    onComplete: () => animatePetal(p)
  });
}
spawnPetals();

// ─── PRELOADER ───
let counter = { val: 0 };

gsap.set('.pre-bar', { width: 0, opacity: 0 });
gsap.set('#preText', { opacity: 0, y: 20 });
gsap.set('#prePercent', { opacity: 0, y: 10 });

const tl = gsap.timeline({ onComplete: initAnimations });

tl.to('.pre-bar', { width: 300, opacity: 1, duration: 1.2, ease: 'expo.out' })
  .to('#preText', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', letterSpacing: '8px' }, "-=0.8")
  .to('#prePercent', { opacity: 1, y: 0, duration: 0.5 }, "-=0.6")
  .to('#preBarFill', { width: "100%", duration: 2.5, ease: "power2.inOut" }, "-=0.2")
  .to(counter, {
    val: 100,
    duration: 2.5,
    ease: "power2.inOut",
    onUpdate: () => {
      document.getElementById('prePercent').innerText = Math.round(counter.val) + "%";
    }
  }, "-=2.5")
  .to('#preBarFill', { 
    boxShadow: "0 0 30px rgba(232, 164, 180, 1)", 
    duration: 0.5, 
    yoyo: true, 
    repeat: 3 
  }, "-=2.5")
  .to('.pre-bar', { width: 0, opacity: 0, duration: 0.8, ease: 'expo.inOut' }, "+=0.2")
  .to(['#preText', '#prePercent'], { opacity: 0, y: -20, duration: 0.6, ease: 'power3.in', stagger: 0.1 }, "-=0.6")
  .to('#preloader', { opacity: 0, duration: 0.8, ease: 'power2.inOut' })
  .set('#preloader', { display: 'none' });

// ─── CONFETTI ───
function burstConfetti(x, y, n = 30, customColors = null, isLarge = false) {
  const defaultColors = ['#E8A4B4', '#D4AF6B', '#F5D5DC', '#C4607A', '#FDDDE6', '#F0D5A0'];
  const colors = customColors || defaultColors;
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    const color = colors[i % colors.length];
    c.style.background = color;
    
    // Position via absolute left/top once, but animate with x/y
    c.style.left = x + 'px'; c.style.top = y + 'px';
    c.style.willChange = 'transform, opacity';
    
    if (isLarge) {
      c.style.width = (Math.random() * 6 + 4) + 'px';
      c.style.height = (Math.random() * 12 + 6) + 'px';
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    }
    document.body.appendChild(c);
    
    // Removed expensive dynamic box-shadow and filter: blur to prevent lagging
    gsap.to(c, {
      x: (Math.random() - .5) * (isLarge ? 700 : 400),
      y: (Math.random() - .5) * (isLarge ? 700 : 400) + (isLarge ? 100 : 0),
      rotation: Math.random() * 720,
      opacity: 0,
      duration: Math.random() * 2 + 1.2,
      ease: 'expo.out',
      force3D: true, // Hardware acceleration for buttery smoothness
      onComplete: () => c.remove()
    });
  }
}


// ─── FIREWORKS (Canvas Based) ───
const fwCanvas = document.getElementById('fireworkCanvas');
const fwCtx = fwCanvas?.getContext('2d');
let fireworks = [];
let particles = [];

function resizeFwCanvas() {
  if (fwCanvas) {
    fwCanvas.width = fwCanvas.parentElement.offsetWidth;
    fwCanvas.height = fwCanvas.parentElement.offsetHeight;
  }
}
window.addEventListener('resize', resizeFwCanvas);
resizeFwCanvas();

class Firework {
  constructor() {
    this.x = Math.random() * fwCanvas.width;
    this.y = fwCanvas.height;
    this.targetY = Math.random() * (fwCanvas.height * 0.3) + 100;
    this.speed = Math.random() * 4 + 4;
    this.velocity = { x: (Math.random() - 0.5) * 1.5, y: -this.speed };
    this.hue = Math.random() < 0.5 ? (Math.random() * 40 + 260) : (Math.random() * 60 + 10); // Purple/Blue or Gold/Red
    this.history = [];
    this.alive = true;
  }
  update() {
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > 20) this.history.shift();
    
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.y += 0.05; // Slight gravity on rocket
    
    if (this.velocity.y >= 0 || this.y <= this.targetY) {
      this.explode();
      this.alive = false;
    }
  }
  explode() {
    const count = 100;
    const colors = [this.hue, this.hue + 30, 45, 60]; // Primary + variants + Gold
    for (let i = 0; i < count; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      particles.push(new FwParticle(this.x, this.y, c));
    }
  }
  draw() {
    // Rocket Trail (Exhaust)
    fwCtx.beginPath();
    if (this.history.length > 0) {
      fwCtx.moveTo(this.history[0].x, this.history[0].y);
      for (let p of this.history) fwCtx.lineTo(p.x, p.y);
    }
    fwCtx.strokeStyle = 'rgba(255, 160, 0, 0.4)';
    fwCtx.lineWidth = 2;
    fwCtx.stroke();
    
    // Rocket Head
    fwCtx.fillStyle = '#FFDD00';
    fwCtx.beginPath();
    fwCtx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    fwCtx.fill();
  }
}

class FwParticle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.brightness = Math.random() * 20 + 50;
    const angle = Math.random() * Math.PI * 2;
    const force = Math.random() * 6 + 1;
    this.velocity = { x: Math.cos(angle) * force, y: Math.sin(angle) * force };
    this.gravity = 0.08;
    this.friction = 0.95;
    this.opacity = 1;
    this.history = [];
    this.alive = true;
  }
  update() {
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > 15) this.history.shift();
    
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.velocity.y += this.gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.opacity -= 0.01;
    if (this.opacity <= 0) this.alive = false;
  }
  draw() {
    fwCtx.beginPath();
    if (this.history.length > 1) {
      fwCtx.moveTo(this.history[0].x, this.history[0].y);
      for (let p of this.history) fwCtx.lineTo(p.x, p.y);
    }
    fwCtx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.opacity})`;
    fwCtx.lineWidth = 1.5;
    fwCtx.lineCap = 'round';
    fwCtx.stroke();
  }
}



function updateFireworks() {
  if (!fwCtx) return;
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  
  // Slightly higher frequency for cinematic effect
  if (Math.random() < 0.05 && fireworks.length < 12) {
    fireworks.push(new Firework());
  }
  
  fireworks = fireworks.filter(f => f.alive);
  fireworks.forEach(f => { f.update(); f.draw(); });
  
  particles = particles.filter(p => p.alive);
  particles.forEach(p => { 
    p.update();
    if (Math.random() > 0.15) p.draw(); 
  });
  
  requestAnimationFrame(updateFireworks);
}

// ─── BALLOONS ───
function spawnBalloons() {
  const hero = document.getElementById('hero');
  const colors = [
    '#E8A4B4', '#D4AF6B', '#C4607A', '#F0D5A0', '#F5D5DC', 
    '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6',
    '#E74C3C', '#2ECC71', '#3498DB', '#F1C40F'
  ];
  
  for (let i = 0; i < 25; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    const color = colors[Math.floor(Math.random() * colors.length)];
    b.style.backgroundColor = color;
    b.style.color = color;
    
    // Glossy overlay already handled in CSS via background radial gradient
    
    const string = document.createElement('div');
    string.className = 'balloon-string';
    b.appendChild(string);
    
    const scale = Math.random() * 0.4 + 0.4;
    const left = Math.random() * 95;
    const delay = Math.random() * 8;
    const duration = Math.random() * 10 + 10;
    
    gsap.set(b, { 
      left: left + '%', 
      bottom: -200, 
      scale: scale, 
      opacity: 0,
      rotate: Math.random() * 20 - 10 
    });
    
    hero.appendChild(b);
    
    const tl = gsap.timeline({ delay: delay, repeat: -1 });
    
    tl.to(b, { 
      bottom: '130%', 
      opacity: 0.9,
      duration: duration, 
      ease: 'none',
      onStart: () => gsap.set(b, { opacity: 0.9 })
    })
    .to(b, {
      x: (Math.random() > 0.5 ? 60 : -60),
      duration: duration / 3,
      yoyo: true,
      repeat: 3,
      ease: 'sine.inOut'
    }, 0);
    
    gsap.to(b, {
      rotate: '+=30',
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }
}


// ─── MAIN ANIMATIONS ───
function initAnimations() {
  // Start Fireworks
  updateFireworks();
  // Start Balloons
  spawnBalloons();

  // Hero Elements Intro
  gsap.from('.hero-top > div, .hero-bottom > div', {
    y: 30, opacity: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out', delay: 0.2
  });
  gsap.from('.hero-21', {
    opacity: 0, scale: 0.8, duration: 2, ease: 'expo.out', delay: 0.4
  });
  gsap.from('#cakeWrapper', {
    y: 100, opacity: 0, duration: 2, ease: 'elastic.out(1, 0.5)', delay: 0.6,
    onComplete: () => {
      // launchCelebration(); // Removed as per request
      // Start day counting
      const dayObj = { val: 1 };
      gsap.to(dayObj, {
        val: 26,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate: () => {
          document.getElementById('heroDay').textContent = Math.floor(dayObj.val);
        }
      });
      // Start age counting
      const ageObj = { val: 1 };
      gsap.to(ageObj, {
        val: 21,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate: () => {
          document.getElementById('heroAge').textContent = Math.floor(ageObj.val);
        }
      });
      // Start year counting
      const yearObj = { val: 2005 };
      gsap.to(yearObj, {
        val: 2026,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate: () => {
          document.getElementById('heroYear').textContent = Math.floor(yearObj.val);
        }
      });
    }
  });

  // Floating Cake continuous floating
  gsap.to('#floatingCake', {
    y: "-=30",
    duration: 2.5,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  // Parallax for floating cake within the Hero section
  gsap.to('#cakeWrapper', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    yPercent: -20, // Gentle parallax within section
    ease: 'none'
  });

  // Parallax for the number '21' without fading it out
  gsap.to('.hero-21', {
    yPercent: -40,
    ease: 'none',
    scrollTrigger: { 
      trigger: '#hero', 
      start: 'top top', 
      end: 'bottom top', 
      scrub: true 
    }
  });

  // About image (Cinematic repeating animation)
  gsap.set('[data-about-img]', { x: -60, scale: 0.95, opacity: 0, filter: 'blur(10px)' });
  gsap.set('.about-text > *', { y: 40, opacity: 0, filter: 'blur(10px)' });
  gsap.set('#aboutTags .tag', { opacity: 0, y: 20, scale: 0.8 });

  const aboutTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top 75%',
      toggleActions: 'play reverse play reverse'
    }
  });

  aboutTl.to('[data-about-img]', { 
    x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', 
    duration: 2.2, ease: 'power3.out' 
  })
  .to('.about-text > *', { 
    y: 0, opacity: 1, filter: 'blur(0px)', 
    stagger: 0.25, duration: 1.8, ease: 'power3.out' 
  }, "-=1.5")
  .to('#aboutTags .tag', { 
    opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 1.2, ease: 'back.out(1.5)' 
  }, "-=1.4");

  // Deco spin
  gsap.to('.about-deco', { rotation: 360, duration: 30, repeat: -1, ease: 'none' });
  gsap.to('.about-deco2', { rotation: -360, duration: 20, repeat: -1, ease: 'none' });

  // Animated Border Rotation
  gsap.to('.about-border', {
    '--angle': '360deg',
    duration: 4,
    repeat: -1,
    ease: 'none'
  });

  // Swipe Gallery Full Screen Wipe (CodePen style integrated with ScrollTrigger)
  const sections = gsap.utils.toArray(".slide");
  const images = gsap.utils.toArray(".image");
  const slideImages = gsap.utils.toArray(".slide__img");
  const outerWrappers = gsap.utils.toArray(".slide__outer");
  const innerWrappers = gsap.utils.toArray(".slide__inner");
  const count = document.querySelector(".count");

  gsap.set(outerWrappers, { xPercent: 100 });
  gsap.set(innerWrappers, { xPercent: -100 });
  gsap.set(".slide:nth-of-type(1) .slide__outer", { xPercent: 0 });
  gsap.set(".slide:nth-of-type(1) .slide__inner", { xPercent: 0 });
  
  // Set initial visibility and z-index for sections and overlay images
  gsap.set(sections, { zIndex: 0, autoAlpha: 0 });
  gsap.set(sections[0], { zIndex: 1, autoAlpha: 1 });
  
  gsap.set(images, { zIndex: 0, autoAlpha: 0 });
  gsap.set(images[0], { zIndex: 1, autoAlpha: 1 });
  
  if (count) count.innerText = "1";

  const swipeTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#swipeGallery",
      start: "top top",
      end: "+=" + (sections.length * 100) + "%",
      pin: true,
      scrub: 1,
      snap: {
         snapTo: 1 / (sections.length - 1),
         duration: 0.8,
         ease: "expo.inOut"
      }
    }
  });

  for (let i = 1; i < sections.length; i++) {
    let currentIndex = i - 1;
    let index = i;
    let heading = sections[currentIndex].querySelector(".slide__heading");
    let nextHeading = sections[index].querySelector(".slide__heading");

    swipeTl.addLabel("step" + i)
      .set(count, { text: index + 1 }, "step" + i)
      .set([sections, images], { zIndex: 0, autoAlpha: 0 }, "step" + i)
      .set([sections[currentIndex], images[index]], { zIndex: 1, autoAlpha: 1 }, "step" + i)
      .set([sections[index], images[currentIndex]], { zIndex: 2, autoAlpha: 1 }, "step" + i)
      .fromTo(outerWrappers[index], { xPercent: 100 }, { xPercent: 0, ease: "none" }, "step" + i)
      .fromTo(innerWrappers[index], { xPercent: -100 }, { xPercent: 0, ease: "none" }, "step" + i)
      .to(heading, { "--width": 800, xPercent: 30, ease: "none" }, "step" + i)
      .fromTo(nextHeading, { "--width": 800, xPercent: -30 }, { "--width": 200, xPercent: 0, ease: "none" }, "step" + i)
      .fromTo(images[index], { xPercent: 125, scaleX: 1.5, scaleY: 1.3 }, { xPercent: 0, scaleX: 1, scaleY: 1, ease: "none" }, "step" + i)
      .fromTo(images[currentIndex], { xPercent: 0, scaleX: 1, scaleY: 1 }, { xPercent: -125, scaleX: 1.5, scaleY: 1.3, ease: "none" }, "step" + i)
      .fromTo(slideImages[index], { scale: 2 }, { scale: 1, ease: "none" }, "step" + i);
  }

  // Gallery infinite scroll
  const track = document.getElementById('galleryTrack');
  const trackWidth = track.scrollWidth / 2;
  gsap.to(track, {
    x: -trackWidth,
    duration: 35, // Slower is smoother for horizontal motion
    ease: 'none', 
    repeat: -1,
    force3D: true
  });

  // FAQ
  ScrollTrigger.create({
    trigger: '#faqList', start: 'top 80%',
    onEnter: () => {
      gsap.to('.faq-item', {
        opacity: 1, x: 0, stagger: .12, duration: .9, ease: 'expo.out'
      });
    }
  });
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });



  // Wishes
  ScrollTrigger.create({
    trigger: '#wishCards', start: 'top 80%',
    onEnter: () => {
      gsap.to('.wish-card', {
        opacity: 1, y: 0, stagger: .12, duration: .9, ease: 'expo.out'
      });
    }
  });


  // Contact form
  ScrollTrigger.create({
    trigger: '#contactForm', start: 'top 80%',
    onEnter: () => {
      gsap.to('#contactForm', { opacity: 1, y: 0, duration: 1, ease: 'expo.out' });
    }
  });

  // Send button
  document.getElementById('btnSend')?.addEventListener('click', function (e) {
    const r = this.getBoundingClientRect();
    burstConfetti(r.left + r.width / 2, r.top, 60);
    gsap.to(this, { scale: 1.08, duration: .15, yoyo: true, repeat: 1 });
  });

  // Navbar on scroll
  ScrollTrigger.create({
    start: 'top -60px',
    onUpdate: self => {
      gsap.to('#navbar', {
        backdropFilter: self.progress > 0 ? 'blur(12px)' : 'blur(0px)',
        duration: .3
      });
    }
  });

  // ─── UNIFIED SECTION REVEALS (Entering Viewport) ───
  const revealSections = document.querySelectorAll('section:not(#hero)');
  revealSections.forEach(section => {
    // Select headers, labels, and specific text elements
    const elements = section.querySelectorAll('.section-label, h2, .about-text p, .wishes-header p');
    
    if (elements.length > 0) {
      gsap.from(elements, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 60,
        opacity: 0,
        filter: 'blur(10px)',
        stagger: 0.1,
        duration: 1.2,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }
  });

  // Specifically animate FAQ items with a slide-in
  gsap.utils.toArray('.faq-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 92%'
      },
      x: -40,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });
  });
}

