<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx, w, h, particles = [], animId

function init() {
  const c = canvas.value
  ctx = c.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  for (let i = 0; i < 50; i++) createParticle()
  animate()
}

function resize() {
  const c = canvas.value
  c.width = window.innerWidth
  c.height = window.innerHeight
  w = c.width; h = c.height
}

function createParticle() {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 3 + 1,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -(Math.random() * 0.6 + 0.2),
    opacity: Math.random() * 0.5 + 0.15,
    fl: Math.random() * Math.PI * 2,
  })
}

function animate() {
  ctx.clearRect(0, 0, w, h)
  particles.forEach((p, i) => {
    p.x += p.vx + Math.sin(p.fl) * 0.1
    p.y += p.vy
    p.fl += 0.01
    if (p.y < -10 || p.x < -10 || p.x > w + 10) {
      p.x = Math.random() * w
      p.y = h + 10
    }
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(201,169,110,${p.opacity})`
    ctx.fill()
    // glow
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(201,169,110,${p.opacity * 0.15})`
    ctx.fill()
  })
  if (particles.length < 50) createParticle()
  animId = requestAnimationFrame(animate)
}

onMounted(init)
onUnmounted(() => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) })
</script>

<template>
  <canvas ref="canvas" class="particle-canvas"></canvas>
</template>
