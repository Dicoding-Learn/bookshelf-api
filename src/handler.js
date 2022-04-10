const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Book has not been added. Some fields are empty'
    })
    response.code(400)
    return response
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Book has not been added. Page count is less than read page'
    })
    response.code(400)
    return response
  }

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = (pageCount === readPage)

  const newBook = {
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
  }

  books.push(newBook)

  const isSucces = books.filter((book) => book.id === id).length > 0

  if (isSucces) {
    const response = h.response({
      status: 'success',
      message: 'Book has been added',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Book has not been added'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query

  let filteredBooks = books

  if (name !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading))
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished))
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  })
  response.code(200)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params
  const book = books.filter((b) => b.id === id)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Book has not been found'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params
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
  } = request.payload

  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    if (name !== undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Book has not been updated. Name field is empty'
      })
      response.code(400)
      return response
    }

    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Book has not been updated. Page count is less than read page'
      })
      response.code(400)
      return response
    }

    const finished = (pageCount === readPage)
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Book has been updated'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Book has not been updated. Id not found'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    books.splice(index, 1)

    const response = h.response({
      status: 'success',
      message: 'Book has been deleted'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Book has not been deleted. Id not found'
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
