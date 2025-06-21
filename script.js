const synth = new Tone.Synth().toDestination();
const whiteNotes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
let currentNote = null;
const keyboard = document.getElementById("keyboard");

// 鍵盤を生成
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

// 音を出すボタン
document.getElementById("playNote").addEventListener("click", async () => {
  await Tone.start(); // スマホ対応：ユーザー操作でstart
  document.getElementById("result").textContent = "どの音？ 鍵盤をクリック！";
  currentNote = whiteNotes[Math.floor(Math.random() * whiteNotes.length)];
  synth.triggerAttackRelease(currentNote, "1n");
});

function handleClick(note) {
  synth.triggerAttackRelease(note, "1n");
  if (!currentNote) return;
  const result = (note === currentNote)
    ? "✅ 正解！"
    : `❌ 不正解… 正解は ${currentNote}`;
  document.getElementById("result").textContent = result;
  currentNote = null;
}
