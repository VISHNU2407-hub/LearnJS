// ==============================
// Buttons
// ==============================

const newNoteBtn = document.querySelector("aside button");

const favoriteBtn = document.querySelector("section:last-child button:first-child");

const deleteBtn = document.querySelector("section:last-child button:last-child");

// ==============================
// Inputs
// ==============================

const searchInput = document.querySelector('input[type="text"]');

const titleInput = document.querySelector(
    'section:last-child input'
);

const noteInput = document.querySelector("textarea");

// ==============================
// Navigation
// ==============================

const allNotes = document.querySelectorAll("nav li")[0];

const favorites = document.querySelectorAll("nav li")[1];

const trash = document.querySelectorAll("nav li")[2];

// ==============================
// Containers
// ==============================

const notesContainer = document.querySelector("#notes-container");

const editor = document.querySelector("section:last-child");

// ==============================
// Theme Toggle
// ==============================

const themeToggle = document.querySelector(
    'input[type="checkbox"]'
);
const notes = [];

// New Note Logic
let selectedNoteIndex = -1;
function displayNotes(notesArray) {

    // Clear old notes
    notesContainer.innerHTML = "";

    // Loop through all notes
    notesArray.forEach((note, index) => {

        // Create Card
        const noteCard = document.createElement("div");
        noteCard.classList.add("note-card");

        // Create Heading
        const heading = document.createElement("h3");
        if (note.favorite == true) {
            heading.textContent = "⭐" + note.heading;
        }
        else {
            heading.textContent = note.heading
        }
        // Create Paragraph
        const content = document.createElement("p");
        content.textContent = note.matter;

        // Append Elements
        noteCard.append(heading);
        noteCard.append(content);
        noteCard.addEventListener("click", () => {

            titleInput.value = note.heading;
            noteInput.value = note.matter;

            selectedNoteIndex = index;

            newNoteBtn.innerText = "Edit Note";

        });

        notesContainer.append(noteCard);

    });

}
newNoteBtn.addEventListener("click", () => {

    let title = titleInput.value.trim();
    let content = noteInput.value.trim();

    if (title.length === 0 || content.length === 0) {
        alert("Enter valid input");
        return;
    }

    let note = {
        heading: title,
        matter: content,
        favorite: false,
        deleted: false
    };

    if (selectedNoteIndex === -1) {

        notes.push(note);

    } else {
        notes[selectedNoteIndex].heading = title;
        notes[selectedNoteIndex].matter = content;

        selectedNoteIndex = -1;

        newNoteBtn.innerText = "+New Note";

    }
    saveNotes()

    titleInput.value = "";
    noteInput.value = "";

    titleInput.focus();

    displayNotes(notes);

});
deleteBtn.addEventListener("click", () => {
    if (selectedNoteIndex == -1) {
        alert("Select a node to delete")
        return
    } else {
        notes.splice(selectedNoteIndex, 1)
        titleInput.value = ""
        noteInput.value = ""
        selectedNoteIndex = -1
        newNoteBtn.innerText = "+ New Note";
        displayNotes(notes)
    }
    saveNotes()
})

favoriteBtn.addEventListener("click", () => {

    if (selectedNoteIndex == -1) {
        alert("Select a note first");
        return;
    }

    notes[selectedNoteIndex].favorite =
        !notes[selectedNoteIndex].favorite;

    displayNotes(notes);
    saveNotes()
});

searchInput.addEventListener("input", () => {

    let searchText = searchInput.value.toLowerCase();

    const filteredNotes = notes.filter((note) => {

        return (
            note.heading.toLowerCase().includes(searchText) ||
            note.matter.toLowerCase().includes(searchText)
        );

    });

    displayNotes(filteredNotes);

});
function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}
function loadNotes() {

    const savedNotes = localStorage.getItem("notes");

    if (savedNotes) {

        const parsedNotes = JSON.parse(savedNotes);

        notes.push(...parsedNotes);

        displayNotes(notes);

    }

} loadNotes();