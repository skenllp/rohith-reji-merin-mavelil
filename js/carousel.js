/* Photo carousel · moments section */
(function () {
  'use strict';

  var carousel = document.querySelector('.carousel');
  if (!carousel) return;

  var viewport = carousel.querySelector('.carousel__viewport');
  var track = carousel.querySelector('.carousel__track');
  var slides = Array.prototype.slice.call(track.querySelectorAll('.carousel__slide'));
  var prevBtn = carousel.querySelector('.carousel__arrow--prev');
  var nextBtn = carousel.querySelector('.carousel__arrow--next');
  var counterNow = carousel.querySelector('.carousel__counter-now');
  var dotsWrap = carousel.querySelector('.carousel__dots');
  var total = slides.length;
  if (!total) return;

  var index = 0;
  var playing = true;
  var AUTO_MS = 4500;
  var timer = null;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function go(i) {
    index = (i + total) % total;
    track.style.transform = 'translateX(-' + index * 100 + '%)';
    counterNow.textContent = pad(index + 1);
    Array.prototype.forEach.call(dotsWrap.children, function (d, di) {
      d.classList.toggle('is-active', di === index);
    });
  }

  function next() { go(index + 1); }
  function prev() { go(index - 1); }
  function stop() { playing = false; clearTimeout(timer); }
  function play() {
    playing = true;
    clearTimeout(timer);
    timer = setTimeout(next, AUTO_MS);
  }
  function restart() {
    clearTimeout(timer);
    if (playing && !reduceMotion) timer = setTimeout(next, AUTO_MS);
  }

  dotsWrap.innerHTML = '';
  for (var d = 0; d < total; d++) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel__dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Go to slide ' + (d + 1));
    if (d === 0) dot.classList.add('is-active');
    dot.addEventListener('click', function (di) {
      stop();
      go(di);
      restart();
    }.bind(null, d));
    dotsWrap.appendChild(dot);
  }

  prevBtn.addEventListener('click', function () { stop(); prev(); restart(); });
  nextBtn.addEventListener('click', function () { stop(); next(); restart(); });

  var dragging = false;
  var startX = 0;
  var deltaX = 0;

  viewport.addEventListener('pointerdown', function (evT) {
    dragging = true;
    startX = evT.clientX;
    deltaX = 0;
    stop();
    if (viewport.setPointerCapture && evT.pointerType !== 'mouse') {
      try { viewport.setPointerCapture(evT.pointerId); } catch (e) {}
    }
  });

  viewport.addEventListener('pointermove', function (evT) {
    if (!dragging) return;
    deltaX = evT.clientX - startX;
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    if (Math.abs(deltaX) > 60) {
      if (deltaX < 0) next(); else prev();
    }
    restart();
  }

  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('pointerleave', endDrag);

  carousel.addEventListener('keydown', function (evT) {
    if (evT.key === 'ArrowLeft') { stop(); prev(); restart(); }
    else if (evT.key === 'ArrowRight') { stop(); next(); restart(); }
  });
  carousel.setAttribute('tabindex', '0');

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', restart);

  var started = false;
  function boot() {
    if (started) return;
    started = true;
    go(0);
    restart();
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        boot();
        io.disconnect();
      });
    }, { rootMargin: '200px 0px' });
    io.observe(carousel);
  } else {
    boot();
  }
})();