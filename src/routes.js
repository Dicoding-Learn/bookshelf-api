const { 
    addBookShelfHandler, 
    getAllBookShelfsHandler, 
    getBookShelfByIdHandler, 
    editBookShelfByIdHandler, 
    deleteBookShelfByIdHandler 
} = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/bookshelfs',
        handler: addBookShelfHandler,
    },
    {
        method: 'GET',
        path: '/bookshelfs',
        handler: getAllBookShelfsHandler,
    },
    {
        method: 'GET',
        path: '/bookshelfs/{id}',
        handler: getBookShelfByIdHandler,
    },
    {
        method: 'PUT',
        path: '/bookshelfs/{id}',
        handler: editBookShelfByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/bookshelfs/{id}',
        handler: deleteBookShelfByIdHandler,
    },
];

module.exports = routes;