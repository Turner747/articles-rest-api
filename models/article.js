const connection = require("../mongoose");

// articles collection
const articleSchema = new connection.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    }
},{
    validateBeforeSave: true
});
const Article = connection.model("Article", articleSchema);

module.exports = Article;