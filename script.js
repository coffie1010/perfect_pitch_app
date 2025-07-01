let synth = null;
let started = false;

const octaves = [3, 4, 5];
const whiteNoteNames = ["C", "D", "E", "F", "G", "A", "B"];
const whiteNotes = [];

octaves.forEach(oct => {
  whiteNoteNames.forEach(name => whiteNotes.push(name + oct));
});
whiteNotes.push("C5");

let currentNote = null;
let previousIndex = null;

const noteColors = {
  "C": { label: "白", code: "#f0f0f0" },
  "D": { label: "黄", code: "#ffe476" },
  "E": { label: "緑", code: "#92dc92" },
  "F": { label: "青", code: "#7fbfff" },
  "G": { label: "水", code: "#66d6d3" },
  "A": { label: "橙", code: "#ff8f79" },
  "B": { label: "紫", code: "#c792eb" }
};

const keyboard = document.getElementById("keyboard");
const result = document.getElementById("result");
const playButton = document.getElementById("playNote");

const chartCtx = document.getElementById("scoreChart").getContext("2d");
let scoreChart = new Chart(chartCtx, {
  type: "bar",
  data: { labels: [], datasets: [{ label: "正答率 (%)", data: [], backgroundColor: "#7fbfff" }] },
  options: {
    scales: { y: { min: 0, max: 100 } },
    responsive: true
  }
});

const apiUrl = "https://script.google.com/macros/s/AKfycbxROQVNmHUPnLyUJY5zbGQaF84JSuzhvL8La3Ft3HCrWkHFXuOoo73170ujK1FTtmSK/exec";

async function initAudio() {
  if (!started) {
    await Tone.start();
    started = true;
  }
}

playButton.addEventListener("click", async () => {
  await initAudio();
  if (synth) synth.dispose();

  const types = ["sine", "triangle", "square", "sawtooth"];
  const randomType = types[Math.floor(Math.random() * types.length)];
  let volumeAdjust = { sine: 0, triangle: -2, square: -20, sawtooth: -20 }[randomType];

  synth = new Tone.Synth({
    oscillator: { type: randomType },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.5 },
    volume: volumeAdjust
  }).toDestination();

  const candidates = whiteNotes.map((note, i) => ({ note, i }))
    .filter(({ i }) => previousIndex === null || Math.abs(i - previousIndex) >= 4);

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  currentNote = chosen.note;
  previousIndex = chosen.i;

  setTimeout(() => synth.triggerAttackRelease(currentNote, "1n"), 20);
  result.innerHTML = "どの音かな？クリックしてね♡";
});

function handleClick(note) {
  if (!started) return;
  synth.triggerAttackRelease(note, "1n");
  if (!currentNote) return;

  const correct = note === currentNote;
  const name = currentNote.charAt(0);
  const color = noteColors[name];
  const style = name === "C"
    ? 'color:#333; background:#f0f0f0; padding:2px 6px; border-radius:4px;'
    : `color:${color.code}`;

  result.innerHTML = correct
    ? `✅ すごーいっ♡ 正解！<br>${currentNote}: <span style="${style}">${color.label}</span>`
    : `❌ ううん… 正解は ${currentNote} だよっ<br><span style="${style}">${color.label}</span>`;

  const today = new Date().toISOString().split("T")[0];
  fetch(apiUrl, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({ date: today, correct: correct ? 1 : 0, total: 1 })
  });

  currentNote = null;
  updateChart(); // グラフ再描画
}

whiteNotes.forEach(note => {
  const name = note.charAt(0);
  const wrapper = document.createElement("div");
  wrapper.className = "key-wrapper";
  const key = document.createElement("div");
  key.className = "white-key";
  key.style.background = noteColors[name].code;
  key.dataset.note = note;
  key.addEventListener("click", () => handleClick(note));
  wrapper.appendChild(key);
  const label = document.createElement("div");
  label.className = "key-label";
  label.textContent = name;
  wrapper.appendChild(label);
  keyboard.appendChild(wrapper);
});

function updateChart() {
  fetch(apiUrl + "?read=true")
    .then(res => res.json())
    .then(rows => {
      const grouped = {};
      rows.forEach(row => {
        const { date, correct, total } = row;
        if (!grouped[date]) grouped[date] = { correct: 0, total: 0 };
        grouped[date].correct += Number(correct);
        grouped[date].total += Number(total);
      });

      const labels = Object.keys(grouped).sort();
      const data = labels.map(date => {
        const d = grouped[date];
        return Math.round((d.correct / d.total) * 100);
      });

      scoreChart.data.labels = labels;
      scoreChart.data.datasets[0].data = data;
      scoreChart.update();
    });
}

updateChart(); // 初回読み込みで表示
