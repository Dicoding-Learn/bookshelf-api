const { nanoid } = require("nanoid");
const bookshelfs = require("./bookshelfs");

const addBookShelfHandler = (request, h) => {
    const {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading
    } = request.payload;

    if (name === undefined || year === undefined || author === undefined || summary === undefined || publisher === undefined || pageCount === undefined || readPage === undefined || reading === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Book has not been added. Some fields are empty',
        });
        response.code(400);
        return response;
    }

    if (pageCount < readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Book has not been added. Page count is less than read page',
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);

    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (pageCount === readPage);

    const newBookShelf = {
        id, 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        finished, 
        reading, 
        insertedAt, 
        updatedAt
    };

    bookshelfs.push(newBookShelf);

    const isSucces = bookshelfs.filter((bookshelf) => bookshelf.id === id).length > 0;

    if (isSucces) {
        const response = h.response({
            status: 'success',
            message: 'Book has been added',
            data: {
                bookShelfId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Book has not been added',
    });
    response.code(500);
    return response;
};

const getAllBookShelfsHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBookShelfs = bookshelfs;

    if (name !== undefined) {
        filteredBookShelfs = filteredBookShelfs.filter((bookshelf) => bookshelf.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (reading !== undefined) {
        filteredBookShelfs = filteredBookShelfs.filter((bookshelf) => bookshelf.reading === !!Number(reading));
    }

    if (finished !== undefined) {
        filteredBookShelfs = filteredBookShelfs.filter((bookshelf) => bookshelf.finished === !!Number(finished));
    }

    const response = h.response({
        status: 'success',
        data: {
            bookshelfs: filteredBookShelfs.map((bookshelf) => ({
                id: bookshelf.id,
                name: bookshelf.name,
                publisher: bookshelf.publisher,
                year: bookshelf.year,
            })),
        },
    });
    response.code(200);
    return response;
};

const getBookShelfByIdHandler = (request, h) => {
    const { id } = request.params;

    const bookshelf = bookshelfs.filter((b) => b.id === id)[0];

    if (bookshelf !== undefined) {
        return {
            status: 'success',
            data: {
                bookshelf,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Book has not been found',
    });
    response.code(404);
    return response;
};

const editBookShelfByIdHandler = (request, h) => {
    const { id } = request.params;
    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        finished, 
        reading 
    } = request.payload;

    const updatedAt = new Date().toISOString();
    const index = bookshelfs.findIndex((bookshelf) => bookshelf.id === id);

    if (index !== -1) {
        if (name !== undefined) {
            const response = h.response({
                status: 'fail',
                message: 'Book has not been updated. Name field is empty',
            });
            response.code(400);
            return response;
        }

        if (pageCount < readPage) {
            const response = h.response({
                status: 'fail',
                message: 'Book has not been updated. Page count is less than read page',
            });
            response.code(400);
            return response;
        }

        const finished = (pageCount === readPage);
        bookshelfs[index] = {
            ...bookshelfs[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Book has been updated',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Book has not been updated. Id not found',
    });
    response.code(404);
    return response;
};

const deleteBookShelfByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = bookshelfs.findIndex((bookshelf) => bookshelf.id === id);

    if (index !== -1) {
        bookshelfs.splice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Book has been deleted',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Book has not been deleted. Id not found',
    });
    response.code(404);
    return response;
};

module.exports = { 
    addBookShelfHandler, 
    getAllBookShelfsHandler, 
    getBookShelfByIdHandler, 
    editBookShelfByIdHandler, 
    deleteBookShelfByIdHandler 
};