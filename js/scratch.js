/* Scratch-to-reveal card for the wedding ceremony section */
(function () {
  'use strict';

  var wrap = document.getElementById('ceScratch');
  if (!wrap) return;

  var canvas = document.getElementById('ceCanvas');
  var skipBtn = document.getElementById('ceSkip');
  var ctx = canvas.getContext('2d');

  var dpr = 1,
    width = 0,
    height = 0;
  var revealed = false,
    scratching = false,
    lastX = 0,
    lastY = 0;
  var mask = null,
    mctx = null,
    maskW = 0,
    maskH = 0;
  var CHECK_DIVIDER = 14,
    STROKE = 52,
    CLEAR_RATIO = 0.48;

  function paintFoil() {
    width = wrap.clientWidth;
    height = wrap.clientHeight;
    if (!width || !height) return;

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, '#E9CD85');
    g.addColorStop(0.5, '#D4AF37');
    g.addColorStop(1, '#936F1F');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    for (var i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.strokeStyle = '#FFF8E7';
      ctx.lineWidth = 0.6 + Math.random() * 1.4;
      ctx.globalAlpha = 0.03 + Math.random() * 0.09;
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    maskW = Math.max(1, Math.round(width / CHECK_DIVIDER));
    maskH = Math.max(1, Math.round(height / CHECK_DIVIDER));
    mask = document.createElement('canvas');
    mask.width = maskW;
    mask.height = maskH;
    mctx = mask.getContext('2d');
    mctx.fillStyle = '#000';
    mctx.fillRect(0, 0, maskW, maskH);
  }

  function points(pos) {
    var r = wrap.getBoundingClientRect();
    return { x: pos.clientX - r.left, y: pos.clientY - r.top };
  }

  function scratchLine(a, b) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = STROKE;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    var s = maskW / width;
    mctx.globalCompositeOperation = 'destination-out';
    mctx.lineCap = 'round';
    mctx.lineJoin = 'round';
    mctx.lineWidth = Math.max(1, STROKE * s);
    mctx.beginPath();
    mctx.moveTo(a.x * s, a.y * s);
    mctx.lineTo(b.x * s, b.y * s);
    mctx.stroke();

    ctx.globalCompositeOperation = 'source-over';
    mctx.globalCompositeOperation = 'source-over';
  }

  function checkProgress() {
    if (!mctx) return false;
    var data = mctx.getImageData(0, 0, maskW, maskH).data;
    var cleared = 0;
    for (var i = 3; i < data.length; i += 4) {
      if (data[i] === 0) cleared++;
    }
    return cleared / (maskW * maskH) > CLEAR_RATIO;
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    scratching = false;
    wrap.classList.add('is-open');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.tabIndex = -1;
    if (wrap.blur) wrap.blur();
  }

  skipBtn.addEventListener('click', function (evT) {
    evT.stopPropagation();
    reveal();
  });
  skipBtn.addEventListener('pointerdown', function (evT) {
    evT.stopPropagation();
  });

  wrap.addEventListener('pointerdown', function (evT) {
    if (revealed) return;
    scratching = true;
    var p = points(evT);
    lastX = p.x;
    lastY = p.y;
    if (wrap.setPointerCapture) {
      try {
        wrap.setPointerCapture(evT.pointerId);
      } catch (e) {}
    }
    evT.preventDefault();
  });

  wrap.addEventListener('pointermove', function (evT) {
    if (!scratching || revealed) return;
    var p = points(evT);
    scratchLine({ x: lastX, y: lastY }, p);
    lastX = p.x;
    lastY = p.y;
    if (checkProgress()) reveal();
    evT.preventDefault();
  });

  function stop() {
    scratching = false;
  }

  wrap.addEventListener('pointerup', stop);
  wrap.addEventListener('pointercancel', stop);
  wrap.addEventListener('pointerleave', stop);

  wrap.addEventListener('keydown', function (evT) {
    if (revealed) return;
    if (evT.key === 'Enter' || evT.key === ' ') {
      evT.preventDefault();
      reveal();
    }
  });

  window.addEventListener('resize', function () {
    if (revealed || !painted) return;
    paintFoil();
  });

  var painted = false;
  function boot() {
    if (painted) return;
    paintFoil();
    painted = true;
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        boot();
        io.disconnect();
      });
    }, { rootMargin: '200px 0px' });
    io.observe(wrap);
  } else {
    boot();
  }
})();