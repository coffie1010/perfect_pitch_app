let synth;
let currentNote = null;
const whiteNotes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
const keyboard = document.getElementById("keyboard");
const result = document.getElementById("result");

// 鍵盤を作成
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

// 最初のタップでSynthを初期化
function initSynth() {
  if (!synth) {
    synth = new Tone.Synth().toDestination();
    Tone.start();
  }
}

// 問題出題
document.getElementById("playNote").addEventListener("click", async () => {
  initSynth();
  result.textContent = "どの音？ 鍵盤をクリック！";
  currentNote = whiteNotes[Math.floor(Math.random() * whiteNotes.length)];
  synth.triggerAttackRelease(currentNote, "1n");
});

// 回答処理
function handleClick(note) {
  initSynth();
  synth.triggerAttackRelease(note, "1n");
  if (!currentNote) return;
  result.textContent = (note === currentNote)
    ? "✅ 正解！"
    : `❌ 不正解… 正解は ${currentNote}`;
  currentNote = null;
}
