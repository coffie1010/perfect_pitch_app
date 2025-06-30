let synth = null;
let started = false;

// C3〜C5（2オクターブ）
const octaves = [3, 4];
const whiteNoteNames = ["C", "D", "E", "F", "G", "A", "B"];
const whiteNotes = [];

octaves.forEach(oct => {
  whiteNoteNames.forEach(name => {
    whiteNotes.push(name + oct);
  });
});
whiteNotes.push("C5"); // 最上のC

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
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.5 }
    }).toDestination();
    started = true;
  }
}

// ▶ 出題（前回と7音以上離す）
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

// 解答処理
function handleClick(note) {
  if (!started) return;
  synth.triggerAttackRelease(note, "1n");
  if (!currentNote) return;

  const name = currentNote.charAt(0);
  const color = noteColors[name];

  const colorStyle = name === "C"
    ? 'color: #333; background: #f0f0f0; padding: 2px 6px; border-radius: 4px;'
    : `color: ${color.code}`;

  if (note === currentNote) {
    result.innerHTML = `✅ すごーいっ♡ 正解！<br>${currentNote}: <span style="${colorStyle}">${color.label}</span>`;
  } else {
    result.innerHTML = `❌ ううん… 正解は ${currentNote} だよっ<br><span style="${colorStyle}">${color.label}</span>`;
  }

  currentNote = null;
}

// 鍵盤生成
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
