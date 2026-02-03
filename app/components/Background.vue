<template>
  <canvas ref="canvas" class="weather-bg-canvas" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

// ─── Props ────────────────────────────────────────────────────────────
interface WeatherData {
  dt: number
  timezone: number
  sys: { sunrise: number; sunset: number }
  weather: Array<{ main: string; description: string }>
}

const props = defineProps<{ weather: WeatherData | null }>()

// ─── Refs ─────────────────────────────────────────────────────────────
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let W = 0
let H = 0

// ─── Jour / Nuit ──────────────────────────────────────────────────────
function isNight(weather: WeatherData): boolean {
  const localNow = weather.dt + weather.timezone
  const sunrise  = weather.sys.sunrise + weather.timezone
  const sunset   = weather.sys.sunset  + weather.timezone
  return localNow < sunrise || localNow > sunset
}

// ─── Scènes ───────────────────────────────────────────────────────────
type SceneKey =
  | 'clear_day' | 'clear_night'
  | 'clouds_day' | 'clouds_night'
  | 'drizzle' | 'rain' | 'thunderstorm'
  | 'snow' | 'mist'

function getScene(weather: WeatherData): SceneKey {
  const main  = weather.weather?.[0]?.main ?? 'Clouds'
  const night = isNight(weather)
  switch (main) {
    case 'Clear':        return night ? 'clear_night'  : 'clear_day'
    case 'Clouds':       return night ? 'clouds_night' : 'clouds_day'
    case 'Drizzle':      return 'drizzle'
    case 'Rain':         return 'rain'
    case 'Thunderstorm': return 'thunderstorm'
    case 'Snow':         return 'snow'
    default:             return 'mist'
  }
}

// ─── Config par scène ─────────────────────────────────────────────────
interface SceneConfig {
  gradient: string[]
  cloudCount: number
  cloudColor: string
  rainCount: number
  snowCount: number
  sun: boolean
  moon: boolean
  stars: boolean
  lightning: boolean
  fogLayers: number
}

const SCENES: Record<SceneKey, SceneConfig> = {
  clear_day: {
    gradient: ['#87CEEB', '#b8e4f9', '#e8f7fd'],
    cloudCount: 2, cloudColor: 'rgba(255,255,255,0.75)',
    rainCount: 0, snowCount: 0,
    sun: true, moon: false, stars: false, lightning: false, fogLayers: 0,
  },
  clear_night: {
    gradient: ['#0a0e1a', '#141c35', '#1a2545'],
    cloudCount: 1, cloudColor: 'rgba(20,28,53,0.6)',
    rainCount: 0, snowCount: 0,
    sun: false, moon: true, stars: true, lightning: false, fogLayers: 0,
  },
  clouds_day: {
    gradient: ['#7a9bb5', '#a3bdd4', '#c8dce8'],
    cloudCount: 6, cloudColor: 'rgba(255,255,255,0.8)',
    rainCount: 0, snowCount: 0,
    sun: false, moon: false, stars: false, lightning: false, fogLayers: 0,
  },
  clouds_night: {
    gradient: ['#0f1520', '#1a2235', '#222d42'],
    cloudCount: 5, cloudColor: 'rgba(30,38,58,0.75)',
    rainCount: 0, snowCount: 0,
    sun: false, moon: true, stars: true, lightning: false, fogLayers: 0,
  },
  drizzle: {
    gradient: ['#4a6070', '#6b8a9e', '#8faab8'],
    cloudCount: 5, cloudColor: 'rgba(200,210,215,0.7)',
    rainCount: 70, snowCount: 0,
    sun: false, moon: false, stars: false, lightning: false, fogLayers: 1,
  },
  rain: {
    gradient: ['#2e3f4f', '#3d5466', '#4e6577'],
    cloudCount: 5, cloudColor: 'rgba(160,175,185,0.75)',
    rainCount: 160, snowCount: 0,
    sun: false, moon: false, stars: false, lightning: false, fogLayers: 1,
  },
  thunderstorm: {
    gradient: ['#1a1f2e', '#252d3d', '#2e3750'],
    cloudCount: 7, cloudColor: 'rgba(40,45,65,0.85)',
    rainCount: 220, snowCount: 0,
    sun: false, moon: false, stars: false, lightning: true, fogLayers: 2,
  },
  snow: {
    gradient: ['#c5d8e8', '#dce8f0', '#eef3f7'],
    cloudCount: 4, cloudColor: 'rgba(230,235,240,0.8)',
    rainCount: 0, snowCount: 180,
    sun: false, moon: false, stars: false, lightning: false, fogLayers: 0,
  },
  mist: {
    gradient: ['#8a9baa', '#aab8c2', '#c2ced6'],
    cloudCount: 3, cloudColor: 'rgba(180,190,195,0.6)',
    rainCount: 0, snowCount: 0,
    sun: false, moon: false, stars: false, lightning: false, fogLayers: 4,
  },
}

// ─── Particules ───────────────────────────────────────────────────────
interface Raindrop  { x: number; y: number; speed: number; len: number; opacity: number }
interface Snowflake { x: number; y: number; r: number; speed: number; drift: number; opacity: number }
interface Cloud     { x: number; y: number; w: number; speed: number; opacity: number }
interface Star      { x: number; y: number; r: number; phase: number }
interface FogLayer  { x: number; y: number; speed: number; opacity: number; w: number; blur: number }

let raindrops:  Raindrop[]  = []
let snowflakes: Snowflake[] = []
let clouds:     Cloud[]     = []
let stars:      Star[]      = []
let fogLayers:  FogLayer[]  = []
let lightningAlpha = 0
let currentScene: SceneKey | null = null

function initParticles(scene: SceneKey) {
  if (W === 0 || H === 0) return  // guard : pas de dimensions encore

  const cfg = SCENES[scene]

  raindrops = Array.from({ length: cfg.rainCount }, () => ({
    x:       Math.random() * W,
    y:       Math.random() * H,
    speed:   10 + Math.random() * 16,
    len:     12 + Math.random() * 22,
    opacity: 0.25 + Math.random() * 0.45,
  }))

  snowflakes = Array.from({ length: cfg.snowCount }, () => ({
    x:       Math.random() * W,
    y:       Math.random() * H,
    r:       2 + Math.random() * 4,
    speed:   0.6 + Math.random() * 1.4,
    drift:   Math.random() * Math.PI * 2,
    opacity: 0.55 + Math.random() * 0.45,
  }))

  clouds = Array.from({ length: cfg.cloudCount }, (_, i) => ({
    x:       (W / cfg.cloudCount) * i - 80,
    y:       25 + Math.random() * 90,
    w:       180 + Math.random() * 180,
    speed:   0.12 + Math.random() * 0.22,
    opacity: 0.5 + Math.random() * 0.35,
  }))

  stars = cfg.stars
    ? Array.from({ length: 90 }, () => ({
        x:     Math.random() * W,
        y:     Math.random() * H * 0.55,
        r:     0.7 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      }))
    : []

  fogLayers = Array.from({ length: cfg.fogLayers }, (_, i) => ({
    x:       0,
    y:       H * 0.55 + (H * 0.35 / Math.max(cfg.fogLayers, 1)) * i,
    speed:   0.3 + Math.random() * 0.5,
    opacity: 0.06 + Math.random() * 0.08,
    w:       W * 1.8,
    blur:    40 + i * 20,
  }))

  lightningAlpha = 0
  currentScene = scene
}

// ─── Dessin ───────────────────────────────────────────────────────────
function drawGradient(cfg: SceneConfig) {
  if (!ctx) return
  const g = ctx.createLinearGradient(0, 0, 0, H)
  cfg.gradient.forEach((c, i) => g.addColorStop(i / (cfg.gradient.length - 1), c))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
}

function drawSun() {
  if (!ctx) return
  const cx = W * 0.78, cy = H * 0.20
  const g = ctx.createRadialGradient(cx, cy, 12, cx, cy, 120)
  g.addColorStop(0,    'rgba(255,255,255,0.97)')
  g.addColorStop(0.25, 'rgba(255,248,180,0.75)')
  g.addColorStop(0.6,  'rgba(255,210,90,0.3)')
  g.addColorStop(1,    'rgba(255,180,50,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(cx, cy, 120, 0, Math.PI * 2)
  ctx.fill()
}

function drawMoon() {
  if (!ctx) return
  const cx = W * 0.78, cy = H * 0.18
  const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, 65)
  g.addColorStop(0,    'rgba(255,255,240,0.95)')
  g.addColorStop(0.35, 'rgba(220,220,200,0.55)')
  g.addColorStop(1,    'rgba(100,110,160,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(cx, cy, 65, 0, Math.PI * 2)
  ctx.fill()
  // croissant
  const bgColor = (currentScene && SCENES[currentScene]?.gradient[0]) ?? '#0a0e1a'
  ctx.fillStyle = bgColor
  ctx.beginPath()
  ctx.arc(cx + 16, cy - 7, 46, 0, Math.PI * 2)
  ctx.fill()
}

function drawStars(t: number) {
  if (!ctx) return
  stars.forEach(s => {
    const flicker = 0.45 + 0.55 * Math.sin(t * 0.0018 + s.phase)
    ctx!.globalAlpha = flicker * 0.9
    ctx!.fillStyle = '#fff'
    ctx!.beginPath()
    ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx!.fill()
  })
  ctx.globalAlpha = 1
}

function drawClouds(cfg: SceneConfig) {
  if (!ctx) return
  clouds.forEach(c => {
    ctx!.globalAlpha = c.opacity
    ctx!.fillStyle = cfg.cloudColor
    ctx!.beginPath()
    ctx!.ellipse(c.x + c.w * 0.50, c.y + 24, c.w * 0.40, 23, 0, 0, Math.PI * 2)
    ctx!.ellipse(c.x + c.w * 0.24, c.y + 30, c.w * 0.21, 18, 0, 0, Math.PI * 2)
    ctx!.ellipse(c.x + c.w * 0.73, c.y + 28, c.w * 0.23, 20, 0, 0, Math.PI * 2)
    ctx!.fill()
  })
  ctx.globalAlpha = 1
}

function drawRain(cfg: SceneConfig) {
  if (!ctx || cfg.rainCount === 0) return
  const isStorm = currentScene === 'thunderstorm'
  ctx.strokeStyle = isStorm ? 'rgba(170,195,230,0.55)' : 'rgba(120,160,205,0.5)'
  ctx.lineWidth   = isStorm ? 1.4 : 1.1
  ctx.lineCap     = 'round'
  raindrops.forEach(d => {
    ctx!.globalAlpha = d.opacity
    ctx!.beginPath()
    ctx!.moveTo(d.x, d.y)
    ctx!.lineTo(d.x - 2.5, d.y - d.len)
    ctx!.stroke()
  })
  ctx.globalAlpha = 1
}

function drawSnow() {
  if (!ctx) return
  snowflakes.forEach(f => {
    ctx!.globalAlpha = f.opacity
    ctx!.fillStyle   = '#fff'
    ctx!.beginPath()
    ctx!.arc(f.x, f.y, f.r, 0, Math.PI * 2)
    ctx!.fill()
  })
  ctx.globalAlpha = 1
}

function drawFog() {
  if (!ctx) return
  fogLayers.forEach(layer => {
    ctx!.globalAlpha = layer.opacity
    ctx!.fillStyle   = 'rgba(180,190,195,1)'
    ctx!.filter      = `blur(${layer.blur}px)`
    ctx!.fillRect(layer.x, layer.y - 30, layer.w, 60)
    ctx!.filter      = 'none'
  })
  ctx.globalAlpha = 1
}

function drawLightning() {
  if (!ctx) return
  if (lightningAlpha > 0) {
    ctx.globalAlpha = lightningAlpha * 0.65
    ctx.fillStyle   = '#fff'
    ctx.fillRect(0, 0, W, H)
    ctx.globalAlpha = 1
    lightningAlpha  = Math.max(0, lightningAlpha - 0.07)
  }
  if (Math.random() < 0.007) {
    lightningAlpha = 1
    let bx = W * 0.25 + Math.random() * W * 0.5
    let by = 0
    ctx.strokeStyle = 'rgba(210,225,255,0.92)'
    ctx.lineWidth   = 2.8
    ctx.lineCap     = 'round'
    ctx.beginPath()
    ctx.moveTo(bx, by)
    for (let i = 0; i < 7; i++) {
      bx += (Math.random() - 0.5) * 45
      by += 55 + Math.random() * 42
      ctx.lineTo(bx, by)
    }
    ctx.stroke()
  }
}

// ─── Update ───────────────────────────────────────────────────────────
function update() {
  raindrops.forEach(d => {
    d.y += d.speed
    d.x -= 2
    if (d.y > H || d.x < 0) { d.y = -d.len; d.x = Math.random() * W }
  })
  snowflakes.forEach(f => {
    f.y     += f.speed
    f.drift += 0.018
    f.x     += Math.sin(f.drift) * 0.55
    if (f.y > H) { f.y = -f.r; f.x = Math.random() * W }
    if (f.x > W) f.x = 0
    if (f.x < 0) f.x = W
  })
  clouds.forEach(c => {
    c.x += c.speed
    if (c.x > W + 200) c.x = -c.w - 80
  })
  fogLayers.forEach(layer => {
    layer.x -= layer.speed
    if (layer.x < -layer.w) layer.x = W
  })
}

// ─── Boucle ───────────────────────────────────────────────────────────
function loop(t: number) {
  if (!ctx || !currentScene) {
    // pas encore prêt, on relance quand même pour attendre
    animationId = requestAnimationFrame(loop)
    return
  }
  const cfg = SCENES[currentScene]

  drawGradient(cfg)
  if (cfg.sun)       drawSun()
  if (cfg.moon)      drawMoon()
  if (cfg.stars)     drawStars(t)
  drawClouds(cfg)
  if (cfg.lightning) drawLightning()
  drawRain(cfg)
  drawSnow()
  drawFog()
  update()

  animationId = requestAnimationFrame(loop)
}

// ─── Resize ───────────────────────────────────────────────────────────
function onResize() {
  const el = canvas.value
  if (!el) return

  W = el.offsetWidth
  H = el.offsetHeight
  if (W === 0 || H === 0) return

  el.width  = W * devicePixelRatio
  el.height = H * devicePixelRatio
  ctx = el.getContext('2d')
  if (ctx) ctx.scale(devicePixelRatio, devicePixelRatio)

  // re-génère les particules avec les bonnes dimensions
  if (currentScene) {
    initParticles(currentScene)
  } else if (props.weather) {
    // première fois après que le DOM est prêt
    initParticles(getScene(props.weather))
  }
}

// ─── Watch météo ──────────────────────────────────────────────────────
watch(
  () => props.weather,
  (w) => {
    if (!w) return
    const scene = getScene(w)
    // si le canvas est déjà monté on init directement, sinon onMounted le fera
    if (W > 0 && H > 0) {
      initParticles(scene)
    } else {
      // on stocke juste la scène, initParticles sera appelé dans onResize après mount
      currentScene = scene
    }
  }
)

// ─── Lifecycle ────────────────────────────────────────────────────────
onMounted(() => {
  // guard SSR : on ne touche au DOM que client-side
  if (!process.client) return

  onResize()  // première mesure des dimensions
  window.addEventListener('resize', onResize)

  // démarre la boucle
  animationId = requestAnimationFrame(loop)
})

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  if (process.client) {
    window.removeEventListener('resize', onResize)
  }
})
</script>

<style scoped>
.weather-bg-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>