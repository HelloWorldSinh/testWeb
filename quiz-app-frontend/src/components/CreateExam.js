import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../axios';

const CreateExam = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    subject: 'General',
    duration: 60,
    passingPercent: 70,
    startDate: '',
    endDate: '',
    isPublished: false,
    questions: []
  });
  
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'multiple',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    points: 1,
    image: null
  });
  
  const [errors, setErrors] = useState({});
  
  const handleExamChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExamData({
      ...examData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleQuestionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentQuestion({
      ...currentQuestion,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleOptionChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedOptions = [...currentQuestion.options];
    
    if (name === 'isCorrect') {
      if (currentQuestion.type === 'single') {
        updatedOptions.forEach((option, i) => {
          option.isCorrect = i === index;
        });
      } else {
        updatedOptions[index].isCorrect = checked;
      }
    } else {
      updatedOptions[index].text = value;
    }
    
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions
    });
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentQuestion({
          ...currentQuestion,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCurrentQuestion({
      ...currentQuestion,
      image: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const addOption = () => {
    if (currentQuestion.options.length < 8) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [
          ...currentQuestion.options,
          { text: '', isCorrect: false }
        ]
      });
    }
  };
  
  const removeOption = (index) => {
    if (currentQuestion.options.length > 2) {
      const updatedOptions = currentQuestion.options.filter((_, i) => i !== index);
      setCurrentQuestion({
        ...currentQuestion,
        options: updatedOptions
      });
    }
  };
  
  const validateQuestion = () => {
    const errors = {};
    
    if (!currentQuestion.text.trim()) {
      errors.text = 'Question text is required';
    }
    
    const optionsWithText = currentQuestion.options.filter(option => option.text.trim());
    if (optionsWithText.length < 2) {
      errors.options = 'At least 2 options are required';
    }
    
    const hasCorrectOption = currentQuestion.options.some(option => option.isCorrect);
    if (!hasCorrectOption) {
      errors.correct = 'At least one correct option must be selected';
    }
    
    return errors;
  };
  
  const addQuestion = () => {
    const validationErrors = validateQuestion();
    
    if (Object.keys(validationErrors).length === 0) {
      setExamData({
        ...examData,
        questions: [
          ...examData.questions,
          currentQuestion
        ]
      });
      
      setCurrentQuestion({
        text: '',
        type: 'multiple',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
        points: 1,
        image: null
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };
  
  const editQuestion = (index) => {
    setCurrentQuestion(examData.questions[index]);
    const updatedQuestions = examData.questions.filter((_, i) => i !== index);
    setExamData({
      ...examData,
      questions: updatedQuestions
    });
  };
  
  const removeQuestion = (index) => {
    const updatedQuestions = examData.questions.filter((_, i) => i !== index);
    setExamData({
      ...examData,
      questions: updatedQuestions
    });
  };
  
  const validateExam = () => {
    const errors = {};
    
    if (!examData.title.trim()) {
      errors.title = 'Exam title is required';
    }
    
    if (!examData.description.trim()) {
      errors.description = 'Exam description is required';
    }
    
    if (!examData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!examData.endDate) {
      errors.endDate = 'End date is required';
    } else if (new Date(examData.startDate) >= new Date(examData.endDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    if (examData.questions.length === 0) {
      errors.questions = 'At least one question is required';
    }
    
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateExam();
    
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
        try {
        await axiosInstance.post('/api/exams', examData);
        navigate('/exams');
      } catch (err) {
        console.error('Error creating exam:', err);
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
      
      // If there are errors in the questions section, go to that step
      if (validationErrors.questions) {
        setCurrentStep(2);
      }
    }
  };
  
  return (
    <div className="create-exam-container">
      <aside className="create-exam-sidebar">
        <div className="py-3 px-3">
          <h3 className="mb-4">Create Exam</h3>
          <div className="mb-4">
            <div className={`sidebar-link ${currentStep === 1 ? 'active' : ''}`} onClick={() => setCurrentStep(1)}>
              <div className="option-marker mr-3">1</div>
              Basic Info
            </div>
          </div>
          <div className="mb-4">
            <div className={`sidebar-link ${currentStep === 2 ? 'active' : ''}`} onClick={() => setCurrentStep(2)}>
              <div className="option-marker mr-3">2</div>
              Questions
            </div>
          </div>
          <div className="mb-4">
            <div className={`sidebar-link ${currentStep === 3 ? 'active' : ''}`} onClick={() => setCurrentStep(3)}>
              <div className="option-marker mr-3">3</div>
              Review & Publish
            </div>
          </div>
        </div>
      </aside>

      <main className="create-exam-content">
        <div className="dashboard-header">
          <h1>Create New Exam</h1>
        </div>

        <div className="tab-content">
          {currentStep === 1 ? (
            <div className="exam-info-form">
              <h2 className="mb-4">Basic Information</h2>
              
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Exam Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={examData.title}
                  onChange={handleExamChange}
                  placeholder="Enter exam title"
                />
                {errors.title && <div className="form-text text-danger">{errors.title}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={examData.description}
                  onChange={handleExamChange}
                  placeholder="Enter exam description"
                  rows="3"
                />
                {errors.description && <div className="form-text text-danger">{errors.description}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <select
                  className="form-control"
                  id="subject"
                  name="subject"
                  value={examData.subject}
                  onChange={handleExamChange}
                >
                  <option value="General">General</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="duration" className="form-label">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="duration"
                      name="duration"
                      min="5"
                      max="180"
                      value={examData.duration}
                      onChange={handleExamChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="passingPercent" className="form-label">
                      Passing Percentage
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="passingPercent"
                      name="passingPercent"
                      min="1"
                      max="100"
                      value={examData.passingPercent}
                      onChange={handleExamChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="startDate" className="form-label">
                      Start Date <span className="required">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="startDate"
                      name="startDate"
                      value={examData.startDate}
                      onChange={handleExamChange}
                    />
                    {errors.startDate && <div className="form-text text-danger">{errors.startDate}</div>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="endDate" className="form-label">
                      End Date <span className="required">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="endDate"
                      name="endDate"
                      value={examData.endDate}
                      onChange={handleExamChange}
                    />
                    {errors.endDate && <div className="form-text text-danger">{errors.endDate}</div>}
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-outline">
                  Save as Draft
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setCurrentStep(2)}>
                  Next: Add Questions
                </button>
              </div>
            </div>
          ) : currentStep === 2 ? (
            <div className="questions-form">
              <div className="dashboard-header mb-4">
                <h2>Add Questions</h2>
                <div className="question-count">
                  {examData.questions.length} question{examData.questions.length !== 1 ? 's' : ''} added
                </div>
              </div>
              
              {errors.questions && <div className="alert alert-danger mb-4">{errors.questions}</div>}
              
              <div className="question-card">
                <div className="form-group">
                  <label htmlFor="questionText" className="form-label">
                    Question Text <span className="required">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="questionText"
                    name="text"
                    value={currentQuestion.text}
                    onChange={handleQuestionChange}
                    placeholder="Enter your question here"
                    rows="2"
                  />
                  {errors.text && <div className="form-text text-danger">{errors.text}</div>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Question Type</label>
                  <div className="d-flex">
                    <div className="form-check mr-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="type"
                        id="typeSingle"
                        value="single"
                        checked={currentQuestion.type === 'single'}
                        onChange={handleQuestionChange}
                      />
                      <label className="form-check-label" htmlFor="typeSingle">
                        Single Answer
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="type"
                        id="typeMultiple"
                        value="multiple"
                        checked={currentQuestion.type === 'multiple'}
                        onChange={handleQuestionChange}
                      />
                      <label className="form-check-label" htmlFor="typeMultiple">
                        Multiple Answers
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Answer Options <span className="required">*</span>
                  </label>
                  {errors.options && <div className="form-text text-danger mb-2">{errors.options}</div>}
                  {errors.correct && <div className="form-text text-danger mb-2">{errors.correct}</div>}
                  
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="option-input mb-2">
                      <div className="option-correct">
                        <input
                          type={currentQuestion.type === 'single' ? 'radio' : 'checkbox'}
                          name="isCorrect"
                          checked={option.isCorrect}
                          onChange={(e) => handleOptionChange(index, e)}
                        />
                      </div>
                      <div className="option-text">
                        <input
                          type="text"
                          className="form-control"
                          name="text"
                          value={option.text}
                          onChange={(e) => handleOptionChange(index, e)}
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                      <div className="option-remove">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          onClick={() => removeOption(index)}
                          disabled={currentQuestion.options.length <= 2}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    className="btn btn-sm btn-outline mt-2"
                    onClick={addOption}
                    disabled={currentQuestion.options.length >= 8}
                  >
                    <i className="fas fa-plus mr-1"></i>
                    Add Option
                  </button>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="points" className="form-label">Points</label>
                      <input
                        type="number"
                        className="form-control"
                        id="points"
                        name="points"
                        min="1"
                        max="10"
                        value={currentQuestion.points}
                        onChange={handleQuestionChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="image" className="form-label">Image (Optional)</label>
                      <input
                        type="file"
                        className="form-control-file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                      />
                    </div>
                  </div>
                </div>
                
                {currentQuestion.image && (
                  <div className="image-preview">
                    <img src={currentQuestion.image} alt="Question" />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={removeImage}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
                
                <div className="form-actions mt-4">
                  <button type="button" className="btn btn-primary" onClick={addQuestion}>
                    Add Question
                  </button>
                </div>
              </div>
              
              {examData.questions.length > 0 && (
                <div className="preview-questions-section mt-4">
                  <h3 className="mb-3">Added Questions</h3>
                  
                  {examData.questions.map((question, index) => (
                    <div key={index} className="preview-questions-card">
                      <div className="question-header">
                        <h4>Question {index + 1}</h4>
                        <div className="points-badge">{question.points} {question.points === 1 ? 'point' : 'points'}</div>
                      </div>
                      
                      <p>{question.text}</p>
                      
                      {question.image && (
                        <div className="question-image mb-3">
                          <img src={question.image} alt="Question" style={{ maxHeight: '200px' }} />
                        </div>
                      )}
                      
                      <div className="question-type mb-3">
                        <span className="type-badge">
                          {question.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                        </span>
                      </div>
                      
                      <div className="preview-options">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`option-item ${option.isCorrect ? 'correct' : ''}`}
                          >
                            <div className="option-marker">{String.fromCharCode(65 + optionIndex)}</div>
                            <div className="option-text">{option.text}</div>
                            {option.isCorrect && (
                              <div className="correct-marker">
                                <i className="fas fa-check-circle"></i>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="question-actions mt-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          onClick={() => editQuestion(index)}
                        >
                          <i className="fas fa-edit mr-1"></i>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeQuestion(index)}
                        >
                          <i className="fas fa-trash-alt mr-1"></i>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="form-actions mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setCurrentStep(1)}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setCurrentStep(3)}
                  disabled={examData.questions.length === 0}
                >
                  Next: Review
                </button>
              </div>
            </div>
          ) : (
            <div className="review-publish-form">
              <h2 className="mb-4">Review & Publish</h2>
              
              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="card-title">Exam Details</h3>
                  
                  <div className="row mb-3">
                    <div className="col-md-3 font-weight-bold">Title:</div>
                    <div className="col-md-9">{examData.title}</div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-3 font-weight-bold">Description:</div>
                    <div className="col-md-9">{examData.description}</div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-3 font-weight-bold">Subject:</div>
                    <div className="col-md-9">{examData.subject}</div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-3 font-weight-bold">Duration:</div>
                    <div className="col-md-9">{examData.duration} minutes</div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-3 font-weight-bold">Passing Score:</div>
                    <div className="col-md-9">{examData.passingPercent}%</div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-3 font-weight-bold">Total Questions:</div>
                    <div className="col-md-9">{examData.questions.length}</div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-3 font-weight-bold">Total Points:</div>
                    <div className="col-md-9">
                      {examData.questions.reduce((total, q) => total + q.points, 0)}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-3 font-weight-bold">Start Date:</div>
                    <div className="col-md-9">
                      {new Date(examData.startDate).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-3 font-weight-bold">End Date:</div>
                    <div className="col-md-9">
                      {new Date(examData.endDate).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={examData.isPublished}
                    onChange={handleExamChange}
                  />
                  <label className="form-check-label" htmlFor="isPublished">
                    Publish exam immediately (otherwise it will be saved as a draft)
                  </label>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setCurrentStep(2)}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Creating Exam...
                    </>
                  ) : (
                    'Create Exam'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateExam;