const books = [];
const RENDER_EVENT = 'render-book';
const variableLocal = 'listbook';
const savedEvent = 'save-book';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(variableLocal, parsed);
  document.dispatchEvent(new Event(savedEvent));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(variableLocal);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  const textTitle = document.createElement('h3');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = author;

  const textYear = document.createElement('p');
  textYear.innerText = year;

  const textAction = document.createElement('div');
  textAction.classList.add('action');

  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(textTitle, textAuthor, textYear, textAction);
  container.setAttribute('id', `book-${id}`);

  if (isCompleted) {
    const belumButton = document.createElement('button');
    belumButton.classList.add('green');
    belumButton.innerText = 'Belum Selesai dibaca';
    belumButton.addEventListener('click', function () {
      addBookToUnread(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = 'Hapus Buku';
    trashButton.addEventListener('click', function () {
      removeBook(id);
    });

    textAction.append(belumButton, trashButton);
  } else {
    const selesaiButton = document.createElement('button');
    selesaiButton.classList.add('green');
    selesaiButton.innerText = 'Selesai dibaca';
    selesaiButton.addEventListener('click', function () {
      addBookToReaded(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = 'Hapus Buku';
    trashButton.addEventListener('click', function () {
      removeBook(id);
    });

    textAction.append(selesaiButton, trashButton);
  }

  return container;
}

function addBook() {
  const textBook = document.getElementById('inputBookTitle').value;
  const textAuthor = document.getElementById('inputBookAuthor').value;
  const textYear = document.getElementById('inputBookYear').value;
  const checkbox = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    textBook,
    textAuthor,
    textYear,
    checkbox
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToReaded(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToUnread(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  //Remove popup
  var result = confirm('Want to delete?');
  if (result) {
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

///Search
function findbookfilter() {
  const value = document.getElementById('searchBookTitle').value.toLowerCase();

  bookFilter = books.filter((data) => {
    return data.title.toLowerCase().match(new RegExp(value, 'g'));
  });
  const uncompletedBOOKList = document.getElementById(
    'incompleteBookshelfList'
  );
  const listCompleted = document.getElementById('completeBookshelfList');
  // clearing list item
  uncompletedBOOKList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookItem of bookFilter) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('searchBook');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    findbookfilter();
  });
});

///Render Pertama kali dan Submit
document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  loadDataFromStorage();
});

document.addEventListener(savedEvent, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById(
    'incompleteBookshelfList'
  );
  const listCompleted = document.getElementById('completeBookshelfList');

  // clearing list item
  uncompletedBOOKList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
});
