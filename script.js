let synth = null;
let started = false;

const whiteNotes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
let currentNote = null;

const noteColors = {
  "C4": { label: "白", code: "#f0f0f0" },
  "D4": { label: "黄", code: "#ffe476" },
  "E4": { label: "緑", code: "#92dc92" },
  "F4": { label: "青", code: "#7fbfff" },
  "G4": { label: "水", code: "#66d6d3" },
  "A4": { label: "橙", code: "#ff8f79" },
  "B4": { label: "紫", code: "#c792eb" },
  "C5": { label: "白", code: "#eaeaea" }
};

const keyboard = document.getElementById("keyboard");
const result = document.getElementById("result");
const playButton = document.getElementById("playNote");

// 最初のタップでAudioContextを初期化
async function initAudio() {
  if (!started) {
    await Tone.start();
    synth = new Tone.Synth().toDestination();
    started = true;
  }
}

// 出題ボタン
playButton.addEventListener("click", async () => {
  await initAudio();
  currentNote = whiteNotes[Math.floor(Math.random() * whiteNotes.length)];
  synth.triggerAttackRelease(currentNote, "1n");
  result.textContent = "どの音？ 鍵盤をクリック！";
});

// 回答処理
function handleClick(note) {
  if (!started) return;
  synth.triggerAttackRelease(note, "1n");
  if (!currentNote) return;

  if (note === currentNote) {
    const colorInfo = noteColors[note];
    result.innerHTML = `✅ 正解！<br>${note}: <span style="color:${colorInfo.code}">${colorInfo.label}</span>`;
  } else {
    result.textContent = `❌ 不正解… 正解は ${currentNote}`;
  }

  currentNote = null;
}

// 鍵盤生成
whiteNotes.forEach(note => {
  const wrapper = document.createElement("div");
  wrapper.className = "key-wrapper";

  const key = document.createElement("div");
  key.className = `white-key key-${note}`;
  key.dataset.note = note;
  key.addEventListener("click", () => handleClick(note));
  wrapper.appendChild(key);

  const label = document.createElement("div");
  label.className = "key-label";
  label.textContent = note.charAt(0);
  wrapper.appendChild(label);

  keyboard.appendChild(wrapper);
});
