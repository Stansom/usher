# An example of using the Usher routing library in Node.js

## To run the example:

Execute the following command in the example root directory <br>
`npm i && node src/main.js`

## Some routes to try:

- '/' - this is a home route <br>
- '/user/:id?' - returns an user id, the parameter is optional: /user/6969 <br>
- '/book/:id?/comment/:commentId?' - returns a book id and comment id if given, the parameters id and commentId are optional: /book/888/comment/142
