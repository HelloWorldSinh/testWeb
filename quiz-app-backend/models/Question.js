const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    content: { type: String, required: true },
    media: { type: String },
    answers: [
        {
            content: { type: String, required: true },
            media: { type: String },
            isCorrect: { type: Boolean, required: true },
        },
    ],
});

module.exports = mongoose.model('Question', questionSchema);