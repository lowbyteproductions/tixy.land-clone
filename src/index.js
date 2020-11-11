const codeInput = document.getElementById('code');
const canvas = document.getElementById('main');
const ctx = canvas.getContext('2d');

codeInput.value = "sin(i + x + y + t)";

['sin','cos','tan','atan2','sqrt','hypot','abs'].forEach(method => {
  window[method] = Math[method];
});


const w = 500;
const h = 500;
const md = w / 16;
const mr = md / 2;

const fill = (r, g, b, a) => ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
const stroke = (r, g, b, a) => ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
const noStroke = () => stroke(0, 0, 0, 0);
const noFill = () => fill(0, 0, 0, 0);

const circle = (x, y, r) => {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

noStroke();

let tixyFn = new Function('t', 'i', 'x', 'y', 'return ' + codeInput.value);
let startTime = Date.now() / 1000;
let time = startTime;

codeInput.addEventListener('keydown', e => {
  if (e.key === "Backspace") return true;

  if (e.target.value.length === 32) {
    e.preventDefault();
    return false;
  }

  if (e.key === "Enter") {
    tixyFn = new Function('t', 'i', 'x', 'y', 'return ' + e.target.value);
    startTime = Date.now() / 1000;
    time = startTime;
  }
})



const draw = () => {
  const currentNow = Date.now() / 1000;
  time = currentNow - startTime;

  fill(0, 0, 0, 1);
  ctx.fillRect(0, 0, w, h);

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const index = y * 16 + x;
      const value = tixyFn(time, index, x, y);
      const r = Math.max(0, Math.min(Math.abs(value), 1));

      if (value > 0) {
        fill(255, 255, 255, 1);
      } else {
        fill(0xff, 0x22, 0x44, 1);
      }

      circle(mr + x * md, mr + y * md, r * mr);
    }
  }

  requestAnimationFrame(draw);
}

draw();