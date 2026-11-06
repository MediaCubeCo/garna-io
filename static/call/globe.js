/* Garna call page · dotted globe (WebGL, no libraries). window.bkGlobe(canvas, {tz, reduce, pinYou, pinUs}) -> {focus, fire} or null. */
(function () {
  function dpr() { return Math.min(window.devicePixelRatio || 1, 2); }
  function sizeCanvas(c) {
    var r = c.getBoundingClientRect(), k = dpr(), w = Math.max(1, Math.round(r.width * k)), h = Math.max(1, Math.round(r.height * k));
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    return { w: w, h: h, cw: r.width, ch: r.height };
  }
  function shader(gl, type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  function program(gl, vs, fs) {
    var a = shader(gl, gl.VERTEX_SHADER, vs), b = shader(gl, gl.FRAGMENT_SHADER, fs);
    if (!a || !b) return null;
    var p = gl.createProgram(); gl.attachShader(p, a); gl.attachShader(p, b); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(p)); return null; }
    return p;
  }
  // runs fn(t) every frame while the element is on screen and the tab is visible
  function loop(el, fn, still) {
    var on = true, raf = 0, t0 = performance.now();
    function tick(now) { raf = 0; fn((now - t0) / 1000); if (on && !still) raf = requestAnimationFrame(tick); }
    function start() { if (!raf) raf = requestAnimationFrame(tick); }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { on = es[0].isIntersecting; if (on) start(); }, { threshold: 0 }).observe(el);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && on) start(); });
    start();
    return { kick: start };
  }

  // land outlines: world-atlas 2.0.2 land-110m.json (public domain, Natural Earth). On garna.io it can be a local file - window.BK_CONFIG.landUrl
  var LAND_URL = (window.BK_CONFIG && window.BK_CONFIG.landUrl) || 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json';
  // world-atlas topojson -> 360x180 bitmask in a canvas (1 deg); null on any failure
  function loadLand() {
    return fetch(LAND_URL).then(function (r) { return r.json(); }).then(function (t) {
      var s = t.transform.scale, tr = t.transform.translate;
      var arcs = t.arcs.map(function (a) { var x = 0, y = 0; return a.map(function (p) { x += p[0]; y += p[1]; return [x * s[0] + tr[0], y * s[1] + tr[1]]; }); });
      function ring(r) { var out = []; r.forEach(function (i, k) { var a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]; out = out.concat(k ? a.slice(1) : a); }); return out; }
      var c = document.createElement('canvas'); c.width = 360; c.height = 180; var x = c.getContext('2d'); x.fillStyle = '#fff';
      var g = t.objects.land, geoms = g.type === 'GeometryCollection' ? g.geometries : [g];
      geoms.forEach(function (G) {
        (G.type === 'Polygon' ? [G.arcs] : G.arcs).forEach(function (P) {
          x.beginPath();
          P.forEach(function (R) { var pts = ring(R); pts.forEach(function (p, k) { var X = p[0] + 180, Y = 90 - p[1]; if (!k || Math.abs(p[0] - pts[k - 1][0]) > 180) x.moveTo(X, Y); else x.lineTo(X, Y); }); x.closePath(); });
          x.fill('evenodd');
        });
      });
      var d = x.getImageData(0, 0, 360, 180).data;
      return function (lat, lon) { var r = Math.min(179, Math.max(0, Math.floor(90 - lat))), cc = ((Math.floor(lon + 180) % 360) + 360) % 360; return d[(r * 360 + cc) * 4 + 3] > 110; };
    }).catch(function () { return null; });
  }
  var TZ = { 'Europe/Lisbon': [38.7, -9.1], 'Europe/London': [51.5, -0.1], 'Europe/Dublin': [53.3, -6.3], 'Europe/Madrid': [40.4, -3.7], 'Europe/Paris': [48.9, 2.35],
    'Europe/Berlin': [52.5, 13.4], 'Europe/Amsterdam': [52.4, 4.9], 'Europe/Brussels': [50.8, 4.35], 'Europe/Zurich': [47.4, 8.5], 'Europe/Rome': [41.9, 12.5],
    'Europe/Vienna': [48.2, 16.4], 'Europe/Prague': [50.1, 14.4], 'Europe/Warsaw': [52.2, 21], 'Europe/Stockholm': [59.3, 18.1], 'Europe/Oslo': [59.9, 10.8],
    'Europe/Copenhagen': [55.7, 12.6], 'Europe/Helsinki': [60.2, 24.9], 'Europe/Tallinn': [59.4, 24.8], 'Europe/Riga': [56.9, 24.1], 'Europe/Vilnius': [54.7, 25.3],
    'Europe/Minsk': [53.9, 27.6], 'Europe/Kiev': [50.45, 30.5], 'Europe/Kyiv': [50.45, 30.5], 'Europe/Moscow': [55.75, 37.6], 'Europe/Istanbul': [41, 29],
    'Europe/Athens': [37.98, 23.7], 'Europe/Bucharest': [44.4, 26.1], 'Europe/Sofia': [42.7, 23.3], 'Europe/Belgrade': [44.8, 20.5], 'Europe/Budapest': [47.5, 19],
    'Asia/Nicosia': [35.17, 33.36], 'Europe/Nicosia': [35.17, 33.36], 'Asia/Yerevan': [40.2, 44.5], 'Asia/Tbilisi': [41.7, 44.8], 'Asia/Baku': [40.4, 49.9],
    'Asia/Dubai': [25.2, 55.3], 'Asia/Tel_Aviv': [32.1, 34.8], 'Asia/Jerusalem': [31.8, 35.2], 'Asia/Riyadh': [24.7, 46.7], 'Asia/Almaty': [43.2, 76.9],
    'Asia/Tashkent': [41.3, 69.3], 'Asia/Karachi': [24.9, 67], 'Asia/Kolkata': [19.1, 72.9], 'Asia/Calcutta': [19.1, 72.9], 'Asia/Dhaka': [23.8, 90.4],
    'Asia/Bangkok': [13.75, 100.5], 'Asia/Jakarta': [-6.2, 106.8], 'Asia/Singapore': [1.35, 103.8], 'Asia/Kuala_Lumpur': [3.1, 101.7], 'Asia/Manila': [14.6, 121],
    'Asia/Ho_Chi_Minh': [10.8, 106.7], 'Asia/Shanghai': [31.2, 121.5], 'Asia/Hong_Kong': [22.3, 114.2], 'Asia/Taipei': [25, 121.5], 'Asia/Seoul': [37.6, 127],
    'Asia/Tokyo': [35.7, 139.7], 'Australia/Sydney': [-33.9, 151.2], 'Australia/Melbourne': [-37.8, 145], 'Pacific/Auckland': [-36.8, 174.8],
    'Africa/Cairo': [30, 31.2], 'Africa/Lagos': [6.5, 3.4], 'Africa/Nairobi': [-1.3, 36.8], 'Africa/Johannesburg': [-26.2, 28], 'Africa/Casablanca': [33.6, -7.6],
    'America/New_York': [40.7, -74], 'America/Toronto': [43.7, -79.4], 'America/Chicago': [41.9, -87.6], 'America/Denver': [39.7, -105], 'America/Los_Angeles': [34.05, -118.2],
    'America/Vancouver': [49.3, -123.1], 'America/Mexico_City': [19.4, -99.1], 'America/Bogota': [4.7, -74.1], 'America/Lima': [-12, -77], 'America/Santiago': [-33.4, -70.7],
    'America/Sao_Paulo': [-23.5, -46.6], 'America/Argentina/Buenos_Aires': [-34.6, -58.4], 'America/Buenos_Aires': [-34.6, -58.4] };
  var GARNA = [35.17, 33.36]; // Nicosia, Garna LTD
  function where(tz) {
    if (TZ[tz]) return TZ[tz];
    var off = -new Date().getTimezoneOffset() / 60;
    return [40, Math.max(-170, Math.min(170, off * 15))];
  }
  function v3(lat, lon) { var a = lat * Math.PI / 180, b = lon * Math.PI / 180; return [Math.cos(a) * Math.cos(b), Math.sin(a), -Math.cos(a) * Math.sin(b)]; }
  function slerp(p, q, t) {
    var d = Math.acos(Math.max(-1, Math.min(1, p[0] * q[0] + p[1] * q[1] + p[2] * q[2])));
    if (d < 1e-4) return p.slice();
    var s = Math.sin(d), a = Math.sin((1 - t) * d) / s, b = Math.sin(t * d) / s;
    return [p[0] * a + q[0] * b, p[1] * a + q[1] * b, p[2] * a + q[2] * b];
  }

  /* ================= dotted globe ================= */
  // sun direction for the day / night side, from the current UTC time (good to a degree or two)
  function sunDir() {
    var d = new Date(), doy = (Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5;
    var dec = -23.44 * Math.cos(2 * Math.PI * (doy + 10) / 365);
    var h = d.getUTCHours() + d.getUTCMinutes() / 60;
    return v3(dec, -15 * (h - 12));
  }
  window.bkGlobe = function (canvas, o) {
    if (!canvas) return null;
    var gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) return null;
    // a_k: 0 land dot, 1 arc dot, 2 marker, 3 ring. a_t: position along the arc (0 = lead, 1 = Garna); markers and rings 1 = Garna, 2 = lead
    var VS = 'attribute vec3 a_p;attribute float a_k;attribute float a_t;uniform mat3 u_r;uniform vec3 u_sun;uniform float u_time,u_px,u_scale,u_fire,u_focus,u_rev;uniform vec2 u_res;varying vec4 v_c;varying float v_k;' +
      'void main(){vec3 p=u_r*a_p;float fr=smoothstep(-.2,.3,p.z);float s;vec4 c;' +
      'if(a_k<.5){float day=smoothstep(-.12,.22,dot(a_p,u_sun));s=u_px*1.9;c=vec4(mix(vec3(.6,.62,.68),vec3(.88,.9,.92),day),(.12+.78*fr)*(.8+.2*day));}' +
      'else if(a_k<1.5){float sp=.28+.25*u_focus+.6*u_fire;float head=fract(u_time*sp);float dd=min(abs(a_t-head),abs(a_t-head+1.));float g=1.-smoothstep(0.,.1,dd);' +
      'float lit=max(g,u_fire);float on=step(a_t,u_rev);s=u_px*(2.+3.*g+1.5*u_fire)*on;c=vec4(.8,.953,0.,(.35+.65*lit)*max(fr,.35)*on);}' +
      'else if(a_k<2.5){float pu=.5+.5*sin(u_time*3.+a_t*2.);float on=a_t>1.5?1.:step(.999,u_rev);s=u_px*(14.+6.*pu+16.*u_fire*step(1.5,a_t))*on;c=vec4(.8,.953,0.,max(fr,.2)*on);}' +
      'else{float ph=fract(u_time*.42+a_t*.37);float vis=a_t>1.5?1.:u_fire;s=u_px*(12.+58.*ph);c=vec4(.8,.953,0.,(1.-ph)*.75*vis*step(.05,fr));}' +
      'gl_PointSize=s;v_k=a_k;v_c=c;gl_Position=vec4(p.x*u_scale*u_res.y/u_res.x,p.y*u_scale,0.,1.);}';
    var FS = 'precision mediump float;varying vec4 v_c;varying float v_k;void main(){vec2 d=gl_PointCoord-.5;float r=length(d);float a;' +
      'if(v_k>2.5)a=smoothstep(.36,.44,r)*(1.-smoothstep(.44,.5,r));' +
      'else if(v_k>1.5)a=(1.-smoothstep(0.,.5,r))*.55+(1.-smoothstep(.12,.22,r));' +
      'else a=1.-smoothstep(.3,.5,r);gl_FragColor=vec4(v_c.rgb,v_c.a*a);}';
    var prog = program(gl, VS, FS); if (!prog) return null;
    var you = where(o.tz), A = v3(you[0], you[1]), B = v3(GARNA[0], GARNA[1]), count = 0, bufs = {};
    function buf(arr, name, n) {
      var b = bufs[name] || (bufs[name] = gl.createBuffer()); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
      var l = gl.getAttribLocation(prog, name); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, n, gl.FLOAT, false, 0, 0);
    }
    function build(land) {
      var P = [], K = [], Tt = [], N = land ? 30000 : 2600, ga = Math.PI * (3 - Math.sqrt(5)), i;
      for (i = 0; i < N; i++) {
        var y = 1 - 2 * (i + .5) / N, th = ga * i;
        var lat = Math.asin(y) * 180 / Math.PI, lon = Math.atan2(Math.sin(th), Math.cos(th)) * 180 / Math.PI;
        if (land ? !land(lat, lon) : (Math.abs(lat) > 72)) continue;
        var q = v3(lat, lon); P.push(q[0], q[1], q[2]); K.push(0); Tt.push(0);
      }
      var far = Math.abs(you[0] - GARNA[0]) + Math.abs(you[1] - GARNA[1]) > 4;
      if (far) for (i = 0; i <= 90; i++) {
        var tt = i / 90, s = slerp(A, B, tt), lift = 1 + .22 * Math.sin(Math.PI * tt);
        P.push(s[0] * lift, s[1] * lift, s[2] * lift); K.push(1); Tt.push(tt);
      }
      P.push(B[0], B[1], B[2]); K.push(3); Tt.push(1);
      P.push(A[0], A[1], A[2]); K.push(3); Tt.push(2);
      P.push(B[0], B[1], B[2]); K.push(2); Tt.push(1);
      P.push(A[0], A[1], A[2]); K.push(2); Tt.push(2);
      gl.useProgram(prog); buf(P, 'a_p', 3); buf(K, 'a_k', 1); buf(Tt, 'a_t', 1); count = K.length;
    }
    build(null);
    loadLand().then(function (land) { if (land) { build(land); if (L) L.kick(); } });
    window.addEventListener('resize', function () { if (L) L.kick(); });
    var U = {}; ['u_r', 'u_sun', 'u_time', 'u_px', 'u_scale', 'u_res', 'u_fire', 'u_focus', 'u_rev'].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // camera faces the middle of the arc
    var mid = slerp(A, B, .5), mlat = Math.asin(mid[1]) * 180 / Math.PI, mlon = Math.atan2(-mid[2], mid[0]) * 180 / Math.PI;
    var st = { yaw: -(mlon * Math.PI / 180) - Math.PI / 2, pitch: Math.max(-.6, Math.min(.6, mlat * Math.PI / 180 * .8)), drag: 0, dragY: 0, fire: 0, tf: 0, focus: 0, tfo: 0, down: null, scale: .86, sun: sunDir(), t0: -1 };
    canvas.addEventListener('pointerdown', function (e) { st.down = [e.clientX, e.clientY, st.drag, st.dragY]; canvas.setPointerCapture(e.pointerId); canvas.classList.add('is-drag'); });
    canvas.addEventListener('pointermove', function (e) { if (!st.down) return; st.drag = st.down[2] + (e.clientX - st.down[0]) * .006; st.dragY = Math.max(-.5, Math.min(.5, st.down[3] + (e.clientY - st.down[1]) * .004)); });
    function up() { st.down = null; canvas.classList.remove('is-drag'); }
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    function rot(yaw, pitch) {
      var cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      return [cy, sp * sy, -cp * sy, 0, cp, sp, sy, -sp * cy, cp * cy]; // Rx(pitch) * Ry(yaw), column-major
    }
    function apply(m, p) { return [m[0] * p[0] + m[3] * p[1] + m[6] * p[2], m[1] * p[0] + m[4] * p[1] + m[7] * p[2], m[2] * p[0] + m[5] * p[1] + m[8] * p[2]]; }
    function pin(el, p, s, m) {
      if (!el) return;
      var q = apply(m, p), x = (q[0] * st.scale * s.ch / s.cw * .5 + .5) * s.cw, y = (-q[1] * st.scale * .5 + .5) * s.ch;
      el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)'; el.style.opacity = q[2] > .05 ? 1 : 0;
    }
    setInterval(function () { st.sun = sunDir(); }, 60e3);
    var L = loop(canvas, function (t) {
      if (st.t0 < 0) st.t0 = t;
      var s = sizeCanvas(canvas); gl.viewport(0, 0, s.w, s.h);
      st.fire += (st.tf - st.fire) * .05; st.focus += (st.tfo - st.focus) * .05;
      var rev = o.reduce ? 1 : Math.min(1, Math.max(0, (t - st.t0 - .5) / 1.6)); rev = 1 - Math.pow(1 - rev, 3);
      var sway = o.reduce ? 0 : Math.sin(t * .15) * .35;
      var m = rot(st.yaw + sway + st.drag, st.pitch + st.dragY);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.useProgram(prog);
      gl.uniformMatrix3fv(U.u_r, false, new Float32Array(m)); gl.uniform3f(U.u_sun, st.sun[0], st.sun[1], st.sun[2]);
      gl.uniform1f(U.u_time, o.reduce ? 0 : t); gl.uniform1f(U.u_px, dpr() * Math.max(1, s.cw / 520));
      gl.uniform1f(U.u_scale, st.scale); gl.uniform2f(U.u_res, s.w, s.h); gl.uniform1f(U.u_fire, st.fire); gl.uniform1f(U.u_focus, st.focus); gl.uniform1f(U.u_rev, rev);
      gl.drawArrays(gl.POINTS, 0, count);
      pin(o.pinYou, A, s, m); pin(o.pinUs, B, s, m);
    }, o.reduce);
    return { focus: function () { st.tfo = 1; L.kick(); }, fire: function () { st.tf = 1; L.kick(); } };
  };
})();
