let synth = null;
let started = false;

// C3〜C5（21音）
const octaves = [3, 4];
const whiteNoteNames = ["C", "D", "E", "F", "G", "A", "B"];
const whiteNotes = [];

octaves.forEach(oct => {
  whiteNoteNames.forEach(name => {
    whiteNotes.push(name + oct);
  });
});
whiteNotes.push("C5"); // 上のCを追加

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

// オーディオ初期化（1回だけ）
async function initAudio() {
  if (!started) {
    await Tone.start();
    started = true;
  }
}

// ▶ 出題ボタン押下
playButton.addEventListener("click", async () => {
  await initAudio();

  // 🎛️ 音色ランダム
  if (synth) synth.dispose(); // 前の音を破棄！
  const types = ["sine", "triangle", "square", "sawtooth"];
  const randomType = types[Math.floor(Math.random() * types.length)];
  synth = new Tone.Synth({
    oscillator: { type: randomType },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.5 }
  }).toDestination();

  // 4音以上離れた候補から選ぶ
  const candidates = whiteNotes
    .map((note, i) => ({ note, i }))
    .filter(({ i }) => previousIndex === null || Math.abs(i - previousIndex) >= 4);

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  currentNote = chosen.note;
  previousIndex = chosen.i;

  synth.triggerAttackRelease(currentNote, "1n");

  result.innerHTML = `🎛️ <span style="font-size:0.9em; color:#999;">音色: ${randomType}</span><br>どの音かな？クリックしてね♡`;
});

// 鍵盤をクリックしたときの処理
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

// 鍵盤生成（白鍵21音）
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
