Schema = mongoose.Schema;

projectSchema = mongoose.Schema;

projectSchema = mongoose.Schema({
    users_array: Array,
    messages: Array,
    date: Date
});

module.exports = mongoose.model("chat", projectSchema);
