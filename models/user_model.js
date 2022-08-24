Schema = mongoose.Schema;

projectSchema = mongoose.Schema;

projectSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    friends: Array,
    date: Date,
    image: String,
    requests: Array
});

module.exports = mongoose.model("user", projectSchema);
