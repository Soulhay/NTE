// DOM elements
const listNameInput = document.getElementById('listNameInput');
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const noteList = document.getElementById('noteList');
const listSelector = document.getElementById('listSelector');

// Initialize notes object (fetch from localStorage if exists)
let lists = JSON.parse(localStorage.getItem('lists')) || {};

// Function to save lists to localStorage
function saveLists() {
  localStorage.setItem('lists', JSON.stringify(lists));
}

// Function to render notes for the selected list
function renderNotes(listName) {
  noteList.innerHTML = '';  // Clear the list

  const selectedList = lists[listName] || [];

  selectedList.forEach((note, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${note.content}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteNote(listName, index));

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editNote(listName, index));

    li.appendChild(deleteBtn);
    li.appendChild(editBtn);
    noteList.appendChild(li);
  });
}

// Function to add a new note to the specified list
addNoteBtn.addEventListener('click', () => {
  const listName = listNameInput.value.trim();
  const content = noteInput.value.trim();

  if (listName && content) {
    // If the list doesn't exist, create it
    if (!lists[listName]) {
      lists[listName] = [];
      // Automatically add the new list name to the dropdown
      addListToSelector(listName);
    }

    const newNote = { content };

    // Add the note to the list
    lists[listName].push(newNote);
    saveLists();

    // Render the notes for the current list
    renderNotes(listName);

    // Clear input fields
    listNameInput.value = '';
    noteInput.value = '';
  }
});

// Function to delete a note
function deleteNote(listName, index) {
  lists[listName].splice(index, 1);
  saveLists();
  renderNotes(listName);
}

// Function to edit a note
function editNote(listName, index) {
  noteInput.value = lists[listName][index].content;
  addNoteBtn.textContent = 'Update Note';

  // Change the add button functionality to update the note
  addNoteBtn.removeEventListener('click', addNote);
  addNoteBtn.addEventListener('click', () => {
    const updatedContent = noteInput.value.trim();
    if (updatedContent) {
      lists[listName][index].content = updatedContent;
      saveLists();
      renderNotes(listName);
      addNoteBtn.textContent = 'Add Note';  // Reset the button text
    }
  });
}

// Function to populate the list selector dropdown
function populateListSelector() {
  listSelector.innerHTML = '<option value="">Select List</option>';  // Clear the dropdown
  Object.keys(lists).forEach(listName => {
    const option = document.createElement('option');
    option.value = listName;
    option.textContent = listName;
    listSelector.appendChild(option);
  });
}

// Function to add the new list name to the dropdown
function addListToSelector(listName) {
  const option = document.createElement('option');
  option.value = listName;
  option.textContent = listName;
  listSelector.appendChild(option);
}

// Event listener for when a list is selected from the dropdown
listSelector.addEventListener('change', (e) => {
  const selectedListName = e.target.value;
  if (selectedListName) {
    renderNotes(selectedListName);
  } else {
    noteList.innerHTML = '';  // Clear notes if no list is selected
  }
});

// Populate the list selector when the extension is opened
populateListSelector();
