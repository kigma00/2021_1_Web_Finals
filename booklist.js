// Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI class : UI를 다루는 기능
class UI{
    //Display Book
    static displayBooks() {
        // const books = [
        //     {
        //         title: 'Book 1',
        //         author: '베르나르',
        //         isbn: '응애 1'
        //     },
        //     {
        //         title: 'Book 2',
        //         author: '나르',
        //         isbn: '응애 2'
        //     },
        //     {
        //         title: 'Book 3',
        //         author: '베르베르',
        //         isbn: '응애 3' 
        //     }
        // ];

        const books = Store.getBooks();

        books.forEach( (book) => UI.addBookToList(book));
    }

    // 2. Add book to UI
    static addBookToList(book) {
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td> <a class="btn btn-danger btn-sm delete"> X </a> </td>
        `;
        list.appendChild(row);
    }

    static deleteBook(target) {
        // console.log(target);
        target.parentElement.parentElement.remove();
    }

    //알림메시지 표시
     static showAlert(message, className) {
         const div = document.createElement('div');
         div.className = `alert alert-${className}`;
         div.appendChild(document.createTextNode(message));
         const container = document.querySelector('.BookBox');
         const form = document.querySelector('#book-form');
         container.insertBefore(div, form);

         setTimeout(() => document.querySelector('.alert').remove(), 1000);
     }

    //Clear Fields
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
    
}

//Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.target);

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // 입력검증
    if(title === '' || author === '' || isbn === '') {
        // alert("모든 필드를 입력해주세요...");
        UI.showAlert('모든 필드를 입력해주세요', 'danger');
    } else {
        const book = new Book(title, author, isbn);

        //화면 테이블에 추가
        UI.addBookToList(book);

        // Store에 저장하기
        Store.addBook(book);

        UI.showAlert('책이 저장되었습니다', 'success');

        // Clear field
        UI.clearFields();
    }
});

// Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remive book from UI
    UI.deleteBook(e.target);

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //메시지 표시
    UI.showAlert('책을 삭제했습니다', 'info');

});

//Store class : localStorage에 저장하는 기능
class Store {
    
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null ) {
            books = [];
        }   else {
            books = JSON.parse(localStorage.getItem('books')); 
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach( (book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

}