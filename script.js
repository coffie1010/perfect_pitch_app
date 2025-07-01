let synth = null;
let started = false;

const octaves = [3, 4, 5];
const whiteNoteNames = ["C", "D", "E", "F", "G", "A", "B"];
const whiteNotes = [];

octaves.forEach(oct => {
  whiteNoteNames.forEach(name => whiteNotes.push(name + oct));
});
whiteNotes.push("C6");

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
const waveformSelect = document.getElementById("waveform");

async function initAudio() {
  if (!started) {
    await Tone.start();
    started = true;
  }
}

playButton.addEventListener("click", async () => {
  await initAudio();
  if (synth) synth.dispose();

  const selected = waveformSelect.value;
  const type = selected === "random"
    ? ["sine", "triangle", "square", "sawtooth"][Math.floor(Math.random() * 4)]
    : selected;

  const volumeAdjust = { sine: 0, triangle: -2, square: -20, sawtooth: -20 }[type] || 0;

  synth = new Tone.Synth({
    oscillator: { type },
    envelope: { attack: 0, decay: 0, sustain: 1, release: 0 }, // ← 変化なし
    volume: volumeAdjust
  }).toDestination();

  const candidates = whiteNotes
    .map((note, i) => ({ note, i }))
    .filter(({ i }) => previousIndex === null || Math.abs(i - previousIndex) >= 4);

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  currentNote = chosen.note;
  previousIndex = chosen.i;

  setTimeout(() => {
    synth.triggerAttackRelease(currentNote, "1n");
  }, 20);

  result.innerHTML = "どの音かな？クリックしてね♡";
});

function handleClick(note) {
  if (!started) return;
  synth.triggerAttackRelease(note, "1n");
  if (!currentNote) return;

  const name = currentNote.charAt(0);
  const color = noteColors[name];
  const colorStyle = name === "C"
    ? 'color:#333; background:#f0f0f0; padding:2px 6px; border-radius:4px;'
    : `color:${color.code}`;

  if (note === currentNote) {
    result.innerHTML = `✅ すごーいっ♡ 正解！<br>${currentNote}: <span style="${colorStyle}">${color.label}</span>`;
  } else {
    result.innerHTML = `❌ ううん… 正解は ${currentNote} だよっ<br><span style="${colorStyle}">${color.label}</span>`;
  }

  currentNote = null;
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
