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

let previousIndex = null;
let currentNote = null;

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
    synth = new Tone.Synth().toDestination();
    started = true;
  }
}

// 出題：1音再生、ただし前回と1oct以上離す
playButton.addEventListener("click", async () => {
  await initAudio();

  let currentIndex;
  do {
    currentIndex = Math.floor(Math.random() * whiteNotes.length);
  } while (
    previousIndex !== null &&
    Math.abs(currentIndex - previousIndex) < 7 // 少なくとも1オクターブは離す
  );

  currentNote = whiteNotes[currentIndex];
  previousIndex = currentIndex;

  synth.triggerAttackRelease(currentNote, "1n");
  result.textContent = "どの音？ 鍵盤をクリック！";
});

// 判定
function handleClick(note) {
  if (!started) return;
  synth.triggerAttackRelease(note, "1n");
  if (!currentNote) return;

  const noteName = note.charAt(0);
  if (note === currentNote) {
    const colorInfo = noteColors[noteName];
    result.innerHTML = `✅ 正解！<br>${note}: <span style="color:${colorInfo.code}">${colorInfo.label}</span>`;
  } else {
    result.textContent = `❌ 不正解… 正解は ${currentNote}`;
  }

  currentNote = null;
}

// 鍵盤
whiteNotes.forEach(note => {
  const noteName = note.charAt(0);
  const wrapper = document.createElement("div");
  wrapper.className = "key-wrapper";

  const key = document.createElement("div");
  key.className = "white-key";
  key.style.background = noteColors[noteName].code;
  key.dataset.note = note;
  key.addEventListener("click", () => handleClick(note));
  wrapper.appendChild(key);

  const label = document.createElement("div");
  label.className = "key-label";
  label.textContent = noteName;
  wrapper.appendChild(label);

  keyboard.appendChild(wrapper);
});
