const synth = new Tone.Synth().toDestination();

// C4〜C5（8音）
const whiteNotes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

let currentNote = null;
const keyboard = document.getElementById("keyboard");

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
  label.textContent = note.charAt(0); // "C"など
  wrapper.appendChild(label);

  keyboard.appendChild(wrapper);
});

document.getElementById("playNote").addEventListener("click", async () => {
  await Tone.start();
  currentNote = whiteNotes[Math.floor(Math.random() * whiteNotes.length)];
  synth.triggerAttackRelease(currentNote, "1n");
  document.getElementById("result").textContent = "どの音？ 鍵盤をクリック！";
});

function handleClick(note) {
  synth.triggerAttackRelease(note, "1n");
  if (!currentNote) return;
  const result = note === currentNote
    ? "✅ 正解！"
    : `❌ 不正解… 正解は ${currentNote}`;
  document.getElementById("result").textContent = result;
  currentNote = null;
}
