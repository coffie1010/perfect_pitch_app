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
whiteNotes.push("C6"); // 最上のCを追加

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

// 初回タップで音声初期化
async function initAudio() {
  if (!started) {
    await Tone.start();
    synth = new Tone.Synth().toDestination();
    started = true;
  }
}

// 出題：前回と1オクターブ（7音）以上離れた音を選ぶ
playButton.addEventListener("click", async () => {
  await initAudio();

  let index;
  do {
    index = Math.floor(Math.random() * whiteNotes.length);
  } while (
    previousIndex !== null &&
    Math.abs(index - previousIndex) < 7
  );

  currentNote = whiteNotes[index];
  previousIndex = index;

  synth.triggerAttackRelease(currentNote, "1n");
  result.textContent = "どの音かな？クリックしてね♡";
});

// 回答処理
function handleClick(note) {
  if (!started) return;
  synth.triggerAttackRelease(note, "1n");

  if (!currentNote) return;

  const name = note.charAt(0);
  const correct = note === currentNote;

  if (correct) {
    const color = noteColors[name];
    result.innerHTML = `✅ すごーいっ♡ 正解！<br>${note}: <span style="color:${color.code}">${color.label}</span>`;
  } else {
    result.textContent = `❌ ううん… 正解は ${currentNote} だよっ`;
  }

  currentNote = null;
}

// 鍵盤生成（C3〜C6）
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
