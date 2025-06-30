let synth = null;
let started = false;

const octaves = [3, 4, 5];
const whiteNoteNames = ["C", "D", "E", "F", "G", "A", "B"];
const whiteNotes = [];

octaves.forEach(oct => {
  whiteNoteNames.forEach(name => {
    whiteNotes.push(name + oct);
  });
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

async function initAudio() {
  if (!started) {
    await Tone.start();
    synth = new Tone.Synth({
      oscillator: { type: "triangle" }, // 少し音色くっきり♪
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.5 }
    }).toDestination();
    started = true;
  }
}

playButton.addEventListener("click", async () => {
  await initAudio();

  const candidates = whiteNotes
    .map((note, i) => ({ note, i }))
    .filter(({ i }) => previousIndex === null || Math.abs(i - previousIndex) >= 7);

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  currentNote = chosen.note;
  previousIndex = chosen.i;

  synth.triggerAttackRelease(currentNote, "1n");
  result.textContent = "どの音かな？クリックしてね♡";
});

function handleClick(note) {
  if (!started) return;
  synth.triggerAttackRelease(note, "1n");

  if (!currentNote) return;

  const name = note.charAt(0);
  if (note === currentNote) {
    const color = noteColors[name];
    result.innerHTML = `✅ すごーいっ♡ 正解！<br>${note}: <span style="color:${color.code}">${color.label}</span>`;
  } else {
    result.textContent = `❌ ううん… 正解は ${currentNote} だよっ`;
  }

  currentNote = null;
}

// 鍵盤作成（C3〜C6）
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
