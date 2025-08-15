// Database Simulation
const DB = {
    subjects: [
        {
            id: 1,
            name: "Computer Science Fundamentals",
            description: "Basic concepts of computer science",
            notes: "Computer science is the study of algorithms, computational systems, and the design of computer and their uses. It includes theory of computation, algorithms and data structures, programming languages, computer systems architecture, and computer graphics.",
            status: "active",
            createdAt: new Date().toISOString()
        }
    ],
    questions: [],
    students: [
        {
            id: 1,
            name: "John Doe",
            email: "student@example.com",
            password: "password123"
        }
    ],
    admin: {
        email: "adarshreddy532@gmail.com",
        password: "admin123"
    },
    examAttempts: [],
    results: []
};

// Current User State
let currentUser = null;
let userType = null; // 'admin' or 'student'

// Exam State
let currentExam = {
    subjectId: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    timer: null,
    timeRemaining: 1800 // 30 minutes in seconds
};

// Application State
class ExamApp {
    constructor() {
        this.currentLoginType = null;
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApp();
            });
        } else {
            this.setupApp();
        }
    }

    setupApp() {
        this.setupEventListeners();
        this.showScreen('homeScreen');
        this.generateInitialQuestions();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');

        // Navigation - Remove any existing event listeners first
        this.setupNavigation();
        
        // Home actions
        this.setupHomeActions();

        // Login/Register forms
        this.setupAuthForms();

        // Dashboard tabs
        this.setupDashboardTabs();

        // Subject Management
        this.setupSubjectManagement();

        // Exam Interface
        this.setupExamInterface();

        // Results and other elements
        this.setupMiscellaneous();
    }

    setupNavigation() {
        const homeBtn = document.getElementById('homeBtn');
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        if (homeBtn) {
            homeBtn.onclick = (e) => {
                e.preventDefault();
                this.showScreen('homeScreen');
                return false;
            };
        }
        
        if (loginBtn) {
            loginBtn.onclick = (e) => {
                e.preventDefault();
                this.showScreen('loginScreen');
                return false;
            };
        }
        
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                this.logout();
                return false;
            };
        }
    }

    setupHomeActions() {
        const adminLoginBtn = document.getElementById('adminLoginBtn');
        const studentLoginBtn = document.getElementById('studentLoginBtn');

        if (adminLoginBtn) {
            adminLoginBtn.onclick = (e) => {
                e.preventDefault();
                this.showAdminLogin();
                return false;
            };
        }
        
        if (studentLoginBtn) {
            studentLoginBtn.onclick = (e) => {
                e.preventDefault();
                this.showStudentLogin();
                return false;
            };
        }
    }

    setupAuthForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');

        if (loginForm) {
            loginForm.onsubmit = (e) => this.handleLogin(e);
        }
        if (registerForm) {
            registerForm.onsubmit = (e) => this.handleRegister(e);
        }
        
        if (showRegister) {
            showRegister.onclick = (e) => {
                e.preventDefault();
                this.showScreen('registerScreen');
                return false;
            };
        }
        
        if (showLogin) {
            showLogin.onclick = (e) => {
                e.preventDefault();
                this.showScreen('loginScreen');
                return false;
            };
        }
    }

    setupDashboardTabs() {
        const adminTabs = ['subjectsTabBtn', 'questionsTabBtn', 'resultsTabBtn'];
        const studentTabs = ['examTabBtn', 'myResultsTabBtn'];

        adminTabs.forEach(tabId => {
            const btn = document.getElementById(tabId);
            if (btn) {
                const tabName = tabId.replace('TabBtn', '');
                btn.onclick = (e) => {
                    e.preventDefault();
                    this.showTab(tabName);
                    return false;
                };
            }
        });

        studentTabs.forEach(tabId => {
            const btn = document.getElementById(tabId);
            if (btn) {
                const tabName = tabId.replace('TabBtn', '');
                btn.onclick = (e) => {
                    e.preventDefault();
                    this.showTab(tabName);
                    return false;
                };
            }
        });
    }

    setupSubjectManagement() {
        const addSubjectBtn = document.getElementById('addSubjectBtn');
        const addSubjectForm = document.getElementById('addSubjectForm');

        if (addSubjectBtn) {
            addSubjectBtn.onclick = (e) => {
                e.preventDefault();
                this.showAddSubjectModal();
                return false;
            };
        }
        
        if (addSubjectForm) {
            addSubjectForm.onsubmit = (e) => this.handleAddSubject(e);
        }
    }

    setupExamInterface() {
        const prevQuestionBtn = document.getElementById('prevQuestionBtn');
        const nextQuestionBtn = document.getElementById('nextQuestionBtn');
        const submitExamBtn = document.getElementById('submitExamBtn');

        if (prevQuestionBtn) {
            prevQuestionBtn.onclick = (e) => {
                e.preventDefault();
                this.previousQuestion();
                return false;
            };
        }
        
        if (nextQuestionBtn) {
            nextQuestionBtn.onclick = (e) => {
                e.preventDefault();
                this.nextQuestion();
                return false;
            };
        }
        
        if (submitExamBtn) {
            submitExamBtn.onclick = (e) => {
                e.preventDefault();
                this.submitExam();
                return false;
            };
        }
    }

    setupMiscellaneous() {
        const backToDashboardBtn = document.getElementById('backToDashboardBtn');
        if (backToDashboardBtn) {
            backToDashboardBtn.onclick = (e) => {
                e.preventDefault();
                this.backToDashboard();
                return false;
            };
        }

        // Modals
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                this.closeModal(e.target.closest('.modal'));
                return false;
            };
        });

        // Filter
        const questionSubjectFilter = document.getElementById('questionSubjectFilter');
        if (questionSubjectFilter) {
            questionSubjectFilter.onchange = (e) => this.filterQuestions(e.target.value);
        }

        // Modal background clicks
        document.onclick = (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        };
    }

    showScreen(screenId) {
        console.log('Showing screen:', screenId);
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show selected screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
        }
        
        // Update navigation
        this.updateNavigation();
    }

    updateNavigation() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (currentUser) {
            if (loginBtn) loginBtn.classList.add('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
        } else {
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');
        }
    }

    showAdminLogin() {
        console.log('Showing admin login');
        const loginTitle = document.getElementById('loginTitle');
        const registerLink = document.getElementById('registerLink');
        
        if (loginTitle) loginTitle.textContent = 'Admin Login';
        if (registerLink) registerLink.classList.add('hidden');
        
        this.currentLoginType = 'admin';
        this.showScreen('loginScreen');
    }

    showStudentLogin() {
        console.log('Showing student login');
        const loginTitle = document.getElementById('loginTitle');
        const registerLink = document.getElementById('registerLink');
        
        if (loginTitle) loginTitle.textContent = 'Student Login';
        if (registerLink) registerLink.classList.remove('hidden');
        
        this.currentLoginType = 'student';
        this.showScreen('loginScreen');
    }

    handleLogin(e) {
        e.preventDefault();
        console.log('Handling login for:', this.currentLoginType);
        
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        
        if (!emailInput || !passwordInput) {
            console.error('Login inputs not found');
            return;
        }
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        console.log('Login attempt:', email, password);

        if (this.currentLoginType === 'admin') {
            if (email === DB.admin.email && password === DB.admin.password) {
                currentUser = { email, type: 'admin', name: 'Admin' };
                userType = 'admin';
                console.log('Admin login successful');
                this.showScreen('adminDashboard');
                this.loadAdminDashboard();
            } else {
                alert('Invalid admin credentials');
                return;
            }
        } else {
            const student = DB.students.find(s => s.email === email && s.password === password);
            console.log('Student search result:', student);
            if (student) {
                currentUser = student;
                userType = 'student';
                console.log('Student login successful');
                this.showScreen('studentDashboard');
                this.loadStudentDashboard();
            } else {
                alert('Invalid student credentials');
                return;
            }
        }

        // Clear form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
    }

    handleRegister(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('registerName');
        const emailInput = document.getElementById('registerEmail');
        const passwordInput = document.getElementById('registerPassword');
        
        if (!nameInput || !emailInput || !passwordInput) return;
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Check if student already exists
        if (DB.students.find(s => s.email === email)) {
            alert('Student with this email already exists');
            return;
        }

        const newStudent = {
            id: DB.students.length + 1,
            name,
            email,
            password
        };

        DB.students.push(newStudent);
        alert('Registration successful! Please login.');
        this.showScreen('loginScreen');
        
        const registerForm = document.getElementById('registerForm');
        if (registerForm) registerForm.reset();
    }

    logout() {
        currentUser = null;
        userType = null;
        this.showScreen('homeScreen');
    }

    showTab(tabName) {
        console.log('Showing tab:', tabName);
        
        // Admin tabs
        const adminTabs = ['subjects', 'questions', 'results'];
        adminTabs.forEach(tab => {
            const tabElement = document.getElementById(`${tab}Tab`);
            const btnElement = document.getElementById(`${tab}TabBtn`);
            
            if (tabElement) tabElement.classList.add('hidden');
            if (btnElement) {
                btnElement.classList.remove('btn--primary');
                btnElement.classList.add('btn--secondary');
            }
        });

        // Student tabs
        const studentTabs = ['exam', 'myResults'];
        studentTabs.forEach(tab => {
            const tabElement = document.getElementById(`${tab}Tab`);
            const btnElement = document.getElementById(`${tab}TabBtn`);
            
            if (tabElement) tabElement.classList.add('hidden');
            if (btnElement) {
                btnElement.classList.remove('btn--primary');
                btnElement.classList.add('btn--secondary');
            }
        });

        // Show selected tab
        const selectedTab = document.getElementById(`${tabName}Tab`);
        const selectedBtn = document.getElementById(`${tabName}TabBtn`);
        
        if (selectedTab) selectedTab.classList.remove('hidden');
        if (selectedBtn) {
            selectedBtn.classList.remove('btn--secondary');
            selectedBtn.classList.add('btn--primary');
        }

        // Load tab content
        setTimeout(() => {
            if (tabName === 'subjects') this.loadSubjects();
            else if (tabName === 'questions') this.loadQuestions();
            else if (tabName === 'results') this.loadResults();
            else if (tabName === 'exam') this.loadAvailableExams();
            else if (tabName === 'myResults') this.loadStudentResults();
        }, 100);
    }

    loadAdminDashboard() {
        this.showTab('subjects');
    }

    loadStudentDashboard() {
        this.showTab('exam');
    }

    loadSubjects() {
        const container = document.getElementById('subjectsList');
        if (!container) return;
        
        container.innerHTML = '';

        DB.subjects.forEach(subject => {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'subject-card';
            
            const questionCount = DB.questions.filter(q => q.subjectId === subject.id).length;
            
            subjectCard.innerHTML = `
                <h4>${subject.name}</h4>
                <p>${subject.description}</p>
                <div class="subject-meta">
                    <span class="questions-count">${questionCount} questions</span>
                    <span class="status-active">Active</span>
                </div>
                <div class="subject-actions">
                    <button class="btn btn--sm btn--secondary" data-action="viewNotes" data-id="${subject.id}">View Notes</button>
                    <button class="btn btn--sm btn--outline" data-action="regenerate" data-id="${subject.id}">Regenerate</button>
                    <button class="btn btn--sm btn--outline" style="color: var(--color-error);" data-action="delete" data-id="${subject.id}">Delete</button>
                </div>
            `;
            
            container.appendChild(subjectCard);
        });

        // Setup action buttons
        container.querySelectorAll('[data-action]').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                const action = e.target.dataset.action;
                const id = parseInt(e.target.dataset.id);
                
                if (action === 'viewNotes') this.viewSubjectNotes(id);
                else if (action === 'regenerate') this.regenerateQuestions(id);
                else if (action === 'delete') this.deleteSubject(id);
                
                return false;
            };
        });
    }

    showAddSubjectModal() {
        if (DB.subjects.length >= 3) {
            alert('Maximum 3 subjects allowed');
            return;
        }
        
        const modal = document.getElementById('addSubjectModal');
        if (modal) modal.classList.remove('hidden');
    }

    handleAddSubject(e) {
        e.preventDefault();
        
        if (DB.subjects.length >= 3) {
            alert('Maximum 3 subjects allowed');
            return;
        }

        const nameInput = document.getElementById('subjectName');
        const descriptionInput = document.getElementById('subjectDescription');
        const notesInput = document.getElementById('subjectNotes');
        
        if (!nameInput || !descriptionInput || !notesInput) return;
        
        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const notes = notesInput.value.trim();

        if (!name || !description || !notes) {
            alert('Please fill in all fields');
            return;
        }

        // Close add subject modal
        this.closeModal(document.getElementById('addSubjectModal'));
        
        // Show loading modal
        const loadingModal = document.getElementById('loadingModal');
        if (loadingModal) loadingModal.classList.remove('hidden');

        // Simulate question generation delay
        setTimeout(() => {
            const newSubject = {
                id: DB.subjects.length + 1,
                name,
                description,
                notes,
                status: 'active',
                createdAt: new Date().toISOString()
            };

            DB.subjects.push(newSubject);
            this.generateQuestionsForSubject(newSubject);

            if (loadingModal) loadingModal.classList.add('hidden');
            
            const form = document.getElementById('addSubjectForm');
            if (form) form.reset();
            
            this.loadSubjects();
            alert('Subject added and questions generated successfully!');
        }, 2000);
    }

    generateInitialQuestions() {
        // Generate questions for existing subjects
        DB.subjects.forEach(subject => {
            if (DB.questions.filter(q => q.subjectId === subject.id).length === 0) {
                this.generateQuestionsForSubject(subject);
            }
        });
    }

    generateQuestionsForSubject(subject) {
        const mcqTemplates = [
            {
                question: `What is the primary concept discussed in ${subject.name}?`,
                options: ['Data Processing', 'Algorithm Design', 'System Architecture', 'All of the above'],
                correct: 3
            },
            {
                question: `Which of the following is most important in ${subject.name.toLowerCase()}?`,
                options: ['Memory Management', 'User Interface', 'Network Security', 'File Systems'],
                correct: 0
            },
            {
                question: `In the context of ${subject.name.toLowerCase()}, what does efficiency refer to?`,
                options: ['Code readability', 'Resource utilization', 'User satisfaction', 'Documentation quality'],
                correct: 1
            },
            {
                question: `Which principle is fundamental to ${subject.name.toLowerCase()}?`,
                options: ['Abstraction', 'Inheritance', 'Polymorphism', 'Encapsulation'],
                correct: 0
            },
            {
                question: `What is the main goal when studying ${subject.name.toLowerCase()}?`,
                options: ['Understanding complexity', 'Building applications', 'Learning syntax', 'Managing projects'],
                correct: 0
            },
            {
                question: `Which aspect is crucial for ${subject.name.toLowerCase()} implementation?`,
                options: ['Documentation', 'Testing', 'Optimization', 'All of the above'],
                correct: 3
            },
            {
                question: `In ${subject.name.toLowerCase()}, what determines the best approach?`,
                options: ['Problem constraints', 'Available resources', 'Time limitations', 'All of the above'],
                correct: 3
            },
            {
                question: `Which factor affects performance in ${subject.name.toLowerCase()}?`,
                options: ['Algorithm choice', 'Data structure', 'Implementation details', 'All of the above'],
                correct: 3
            },
            {
                question: `What is essential for mastering ${subject.name.toLowerCase()}?`,
                options: ['Theory understanding', 'Practical application', 'Problem solving', 'All of the above'],
                correct: 3
            }
        ];

        const descriptiveTemplates = [
            `Explain the key concepts covered in ${subject.name} and provide real-world examples of their application.`,
            `Discuss the importance of ${subject.name.toLowerCase()} in modern computing and describe three major challenges.`,
            `Compare and contrast different approaches mentioned in ${subject.name} and analyze their effectiveness.`
        ];

        // Generate 9 MCQs
        for (let i = 0; i < 9; i++) {
            const template = mcqTemplates[i % mcqTemplates.length];
            const question = {
                id: DB.questions.length + 1,
                subjectId: subject.id,
                type: 'mcq',
                question: template.question,
                options: [...template.options],
                correctAnswer: template.correct,
                points: 2
            };
            DB.questions.push(question);
        }

        // Generate 1 descriptive question
        const descriptiveQuestion = {
            id: DB.questions.length + 1,
            subjectId: subject.id,
            type: 'descriptive',
            question: descriptiveTemplates[0],
            sampleAnswer: `This is a comprehensive answer about ${subject.name.toLowerCase()} covering the main concepts, practical applications, and real-world examples. The answer should demonstrate understanding of key principles and their implementation.`,
            points: 10
        };
        DB.questions.push(descriptiveQuestion);
    }

    loadQuestions() {
        const container = document.getElementById('questionsList');
        const filter = document.getElementById('questionSubjectFilter');
        
        if (!container || !filter) return;
        
        // Update filter options
        filter.innerHTML = '<option value="">All Subjects</option>';
        DB.subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            filter.appendChild(option);
        });

        this.displayQuestions();
    }

    filterQuestions(subjectId) {
        this.displayQuestions(subjectId);
    }

    displayQuestions(subjectId = '') {
        const container = document.getElementById('questionsList');
        if (!container) return;
        
        container.innerHTML = '';

        let questions = DB.questions;
        if (subjectId) {
            questions = questions.filter(q => q.subjectId == subjectId);
        }

        questions.forEach(question => {
            const subject = DB.subjects.find(s => s.id === question.subjectId);
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';

            let optionsHtml = '';
            if (question.type === 'mcq') {
                optionsHtml = question.options.map((option, index) => {
                    const isCorrect = index === question.correctAnswer;
                    return `<div class="question-option ${isCorrect ? 'correct-answer' : ''}">${String.fromCharCode(65 + index)}. ${option}</div>`;
                }).join('');
            }

            questionDiv.innerHTML = `
                <div class="question-header">
                    <div>
                        <span class="question-type">${question.type.toUpperCase()}</span>
                        <small style="margin-left: 12px; color: var(--color-text-secondary);">${subject?.name || 'Unknown Subject'}</small>
                    </div>
                    <small>${question.points} points</small>
                </div>
                <div class="question-text">${question.question}</div>
                ${optionsHtml}
                ${question.sampleAnswer ? `<div style="margin-top: 12px; padding: 12px; background: var(--color-bg-3); border-radius: 6px;"><strong>Sample Answer:</strong> ${question.sampleAnswer}</div>` : ''}
            `;

            container.appendChild(questionDiv);
        });

        if (questions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No questions found.</p>';
        }
    }

    loadAvailableExams() {
        const container = document.getElementById('availableSubjects');
        if (!container) return;
        
        container.innerHTML = '';

        DB.subjects.forEach(subject => {
            const questionCount = DB.questions.filter(q => q.subjectId === subject.id).length;
            
            if (questionCount === 0) return;

            const subjectCard = document.createElement('div');
            subjectCard.className = 'subject-card';
            
            subjectCard.innerHTML = `
                <h4>${subject.name}</h4>
                <p>${subject.description}</p>
                <div class="subject-meta">
                    <span class="questions-count">${questionCount} questions</span>
                    <span style="font-size: 12px; color: var(--color-text-secondary);">30 minutes</span>
                </div>
                <div class="subject-actions">
                    <button class="btn btn--primary" data-action="startExam" data-id="${subject.id}">Start Exam</button>
                </div>
            `;
            
            container.appendChild(subjectCard);
        });

        // Setup exam start buttons
        container.querySelectorAll('[data-action="startExam"]').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                const id = parseInt(e.target.dataset.id);
                this.startExam(id);
                return false;
            };
        });
    }

    startExam(subjectId) {
        const subject = DB.subjects.find(s => s.id === subjectId);
        const questions = DB.questions.filter(q => q.subjectId === subjectId);

        if (questions.length === 0) {
            alert('No questions available for this subject.');
            return;
        }

        // Initialize exam state
        currentExam = {
            subjectId,
            subject,
            questions: this.shuffleArray([...questions]),
            currentQuestionIndex: 0,
            answers: {},
            timeRemaining: 1800 // 30 minutes
        };

        const examSubjectName = document.getElementById('examSubjectName');
        if (examSubjectName) examSubjectName.textContent = subject.name;
        
        this.showScreen('examInterface');
        this.displayCurrentQuestion();
        this.startTimer();
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    displayCurrentQuestion() {
        const { questions, currentQuestionIndex } = currentExam;
        const question = questions[currentQuestionIndex];
        const container = document.getElementById('questionContainer');
        
        if (!container) return;

        // Update progress
        const progressElement = document.getElementById('questionProgress');
        if (progressElement) {
            progressElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
        }

        let questionHtml = `
            <div class="question-number">Question ${currentQuestionIndex + 1}</div>
            <div class="question-text">${question.question}</div>
        `;

        if (question.type === 'mcq') {
            questionHtml += '<div class="options-container">';
            question.options.forEach((option, index) => {
                const isSelected = currentExam.answers[question.id] === index;
                questionHtml += `
                    <div class="option-item ${isSelected ? 'selected' : ''}" data-question="${question.id}" data-option="${index}">
                        <input type="radio" name="q${question.id}" value="${index}" ${isSelected ? 'checked' : ''} class="option-radio">
                        <label>${String.fromCharCode(65 + index)}. ${option}</label>
                    </div>
                `;
            });
            questionHtml += '</div>';
        } else {
            const savedAnswer = currentExam.answers[question.id] || '';
            questionHtml += `
                <textarea class="descriptive-answer" placeholder="Type your answer here..." data-question="${question.id}">${savedAnswer}</textarea>
            `;
        }

        container.innerHTML = questionHtml;

        // Setup event listeners for new elements
        if (question.type === 'mcq') {
            container.querySelectorAll('.option-item').forEach(item => {
                item.onclick = () => {
                    const questionId = parseInt(item.dataset.question);
                    const optionIndex = parseInt(item.dataset.option);
                    this.selectOption(questionId, optionIndex);
                };
            });
        } else {
            const textarea = container.querySelector('.descriptive-answer');
            if (textarea) {
                textarea.oninput = (e) => {
                    const questionId = parseInt(e.target.dataset.question);
                    this.saveDescriptiveAnswer(questionId, e.target.value);
                };
            }
        }

        // Update navigation buttons
        const prevBtn = document.getElementById('prevQuestionBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');
        const submitBtn = document.getElementById('submitExamBtn');
        
        if (prevBtn) prevBtn.style.display = currentQuestionIndex > 0 ? 'inline-flex' : 'none';
        
        const isLastQuestion = currentQuestionIndex === questions.length - 1;
        if (nextBtn) nextBtn.style.display = !isLastQuestion ? 'inline-flex' : 'none';
        if (submitBtn) submitBtn.style.display = isLastQuestion ? 'inline-flex' : 'none';
    }

    selectOption(questionId, optionIndex) {
        currentExam.answers[questionId] = optionIndex;
        this.displayCurrentQuestion();
    }

    saveDescriptiveAnswer(questionId, answer) {
        currentExam.answers[questionId] = answer;
    }

    previousQuestion() {
        if (currentExam.currentQuestionIndex > 0) {
            currentExam.currentQuestionIndex--;
            this.displayCurrentQuestion();
        }
    }

    nextQuestion() {
        if (currentExam.currentQuestionIndex < currentExam.questions.length - 1) {
            currentExam.currentQuestionIndex++;
            this.displayCurrentQuestion();
        }
    }

    startTimer() {
        if (currentExam.timer) {
            clearInterval(currentExam.timer);
        }

        currentExam.timer = setInterval(() => {
            currentExam.timeRemaining--;
            this.updateTimerDisplay();

            if (currentExam.timeRemaining <= 0) {
                clearInterval(currentExam.timer);
                alert('Time is up! Submitting exam automatically.');
                this.submitExam();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(currentExam.timeRemaining / 60);
        const seconds = currentExam.timeRemaining % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const timerElement = document.getElementById('timerDisplay');
        if (!timerElement) return;
        
        timerElement.textContent = display;

        // Add warning colors
        timerElement.classList.remove('warning', 'danger');
        if (currentExam.timeRemaining <= 300) { // 5 minutes
            timerElement.classList.add('danger');
        } else if (currentExam.timeRemaining <= 600) { // 10 minutes
            timerElement.classList.add('warning');
        }
    }

    submitExam() {
        if (!this.confirmSubmission()) return;

        clearInterval(currentExam.timer);

        // Calculate score
        const results = this.calculateScore();
        
        // Save exam attempt
        const examAttempt = {
            id: DB.examAttempts.length + 1,
            studentId: currentUser.id,
            subjectId: currentExam.subjectId,
            answers: { ...currentExam.answers },
            score: results.totalScore,
            maxScore: results.maxScore,
            timestamp: new Date().toISOString(),
            timeSpent: 1800 - currentExam.timeRemaining
        };

        DB.examAttempts.push(examAttempt);
        
        // Display results
        this.displayResults(results);
    }

    confirmSubmission() {
        const answeredQuestions = Object.keys(currentExam.answers).length;
        const totalQuestions = currentExam.questions.length;
        
        if (answeredQuestions < totalQuestions) {
            return confirm(`You have answered ${answeredQuestions} out of ${totalQuestions} questions. Are you sure you want to submit?`);
        }
        
        return confirm('Are you sure you want to submit your exam? This action cannot be undone.');
    }

    calculateScore() {
        const { questions, answers } = currentExam;
        let totalScore = 0;
        let maxScore = 0;
        const questionResults = [];

        questions.forEach(question => {
            maxScore += question.points;
            const userAnswer = answers[question.id];
            let score = 0;
            let status = 'incorrect';

            if (question.type === 'mcq') {
                if (userAnswer === question.correctAnswer) {
                    score = question.points;
                    status = 'correct';
                }
            } else {
                // Descriptive question evaluation
                score = this.evaluateDescriptiveAnswer(question, userAnswer);
                if (score === question.points) status = 'correct';
                else if (score > 0) status = 'partial';
            }

            totalScore += score;
            questionResults.push({
                question,
                userAnswer,
                score,
                status
            });
        });

        return {
            totalScore,
            maxScore,
            percentage: Math.round((totalScore / maxScore) * 100),
            questionResults
        };
    }

    evaluateDescriptiveAnswer(question, answer) {
        if (!answer || answer.trim().length === 0) return 0;

        // Simple evaluation based on keywords and length
        const keywords = ['algorithm', 'data', 'structure', 'computer', 'system', 'programming', 'code', 'function', 'method', 'class', 'object', 'database', 'query', 'table', 'relation'];
        const answerWords = answer.toLowerCase().split(/\s+/);
        const keywordMatches = keywords.filter(keyword => 
            answerWords.some(word => word.includes(keyword))
        ).length;

        // Scoring criteria
        let score = 0;
        
        // Keyword matching (30% of total)
        score += Math.min(keywordMatches * 0.5, 3);
        
        // Length and completeness (40% of total)
        if (answer.length > 200) score += 4;
        else if (answer.length > 100) score += 2;
        else if (answer.length > 50) score += 1;
        
        // Basic structure (30% of total)
        if (answer.includes('.') && answer.split('.').length > 2) score += 2;
        if (answer.split(' ').length > 20) score += 1;

        return Math.min(Math.round(score), question.points);
    }

    displayResults(results) {
        this.showScreen('resultsDisplay');
        const container = document.getElementById('resultsContent');
        if (!container) return;

        let grade = 'F';
        if (results.percentage >= 90) grade = 'A+';
        else if (results.percentage >= 80) grade = 'A';
        else if (results.percentage >= 70) grade = 'B';
        else if (results.percentage >= 60) grade = 'C';
        else if (results.percentage >= 50) grade = 'D';

        let reviewHtml = '';
        results.questionResults.forEach((result, index) => {
            let answerText = '';
            if (result.question.type === 'mcq') {
                const userOption = result.userAnswer !== undefined ? 
                    result.question.options[result.userAnswer] : 'No answer';
                const correctOption = result.question.options[result.question.correctAnswer];
                answerText = `
                    <div class="your-answer"><strong>Your answer:</strong> ${userOption}</div>
                    <div class="correct-answer"><strong>Correct answer:</strong> ${correctOption}</div>
                `;
            } else {
                answerText = `
                    <div class="your-answer"><strong>Your answer:</strong> ${result.userAnswer || 'No answer provided'}</div>
                    ${result.question.sampleAnswer ? `<div class="correct-answer"><strong>Sample answer:</strong> ${result.question.sampleAnswer}</div>` : ''}
                `;
            }

            reviewHtml += `
                <div class="review-question ${result.status}">
                    <div class="review-header">
                        <span><strong>Q${index + 1}:</strong> ${result.question.question}</span>
                        <div>
                            <span class="answer-status ${result.status}">${result.status.toUpperCase()}</span>
                            <span style="margin-left: 8px; font-size: 12px;">${result.score}/${result.question.points} pts</span>
                        </div>
                    </div>
                    ${answerText}
                </div>
            `;
        });

        container.innerHTML = `
            <div class="results-summary">
                <div class="score-display">${results.totalScore}/${results.maxScore}</div>
                <p>Grade: <strong>${grade}</strong> (${results.percentage}%)</p>
                <p>Subject: <strong>${currentExam.subject.name}</strong></p>
            </div>

            <div class="score-breakdown">
                <div class="score-item">
                    <h4>MCQ Score</h4>
                    <div class="score">${results.questionResults.filter(r => r.question.type === 'mcq').reduce((sum, r) => sum + r.score, 0)}/18</div>
                </div>
                <div class="score-item">
                    <h4>Descriptive Score</h4>
                    <div class="score">${results.questionResults.filter(r => r.question.type === 'descriptive').reduce((sum, r) => sum + r.score, 0)}/10</div>
                </div>
                <div class="score-item">
                    <h4>Total Percentage</h4>
                    <div class="score">${results.percentage}%</div>
                </div>
            </div>

            <div class="answer-review">
                <h3>Answer Review</h3>
                ${reviewHtml}
            </div>
        `;
    }

    backToDashboard() {
        if (userType === 'student') {
            this.showScreen('studentDashboard');
            this.loadStudentDashboard();
        } else {
            this.showScreen('adminDashboard');
            this.loadAdminDashboard();
        }
    }

    loadResults() {
        const container = document.getElementById('resultsList');
        if (!container) return;
        
        if (DB.examAttempts.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No exam attempts yet.</p>';
            return;
        }

        let tableHtml = `
            <table class="results-table">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Date</th>
                        <th>Time Spent</th>
                    </tr>
                </thead>
                <tbody>
        `;

        DB.examAttempts.forEach(attempt => {
            const student = DB.students.find(s => s.id === attempt.studentId);
            const subject = DB.subjects.find(s => s.id === attempt.subjectId);
            const percentage = Math.round((attempt.score / attempt.maxScore) * 100);
            const timeSpent = this.formatTime(attempt.timeSpent);
            const date = new Date(attempt.timestamp).toLocaleDateString();

            tableHtml += `
                <tr>
                    <td>${student?.name || 'Unknown'}</td>
                    <td>${subject?.name || 'Unknown'}</td>
                    <td>${attempt.score}/${attempt.maxScore}</td>
                    <td>${percentage}%</td>
                    <td>${date}</td>
                    <td>${timeSpent}</td>
                </tr>
            `;
        });

        tableHtml += '</tbody></table>';
        container.innerHTML = tableHtml;
    }

    loadStudentResults() {
        const container = document.getElementById('studentResults');
        if (!container) return;
        
        const studentAttempts = DB.examAttempts.filter(a => a.studentId === currentUser.id);
        
        if (studentAttempts.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No exam attempts yet.</p>';
            return;
        }

        let resultsHtml = '';
        studentAttempts.forEach(attempt => {
            const subject = DB.subjects.find(s => s.id === attempt.subjectId);
            const percentage = Math.round((attempt.score / attempt.maxScore) * 100);
            const timeSpent = this.formatTime(attempt.timeSpent);
            const date = new Date(attempt.timestamp).toLocaleDateString();

            let gradeClass = 'error';
            if (percentage >= 80) gradeClass = 'success';
            else if (percentage >= 60) gradeClass = 'warning';

            resultsHtml += `
                <div class="card" style="margin-bottom: 16px;">
                    <div class="card__body">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <h4>${subject?.name || 'Unknown Subject'}</h4>
                            <span class="status status--${gradeClass}">${percentage}%</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; font-size: 14px; color: var(--color-text-secondary);">
                            <div><strong>Score:</strong> ${attempt.score}/${attempt.maxScore}</div>
                            <div><strong>Time:</strong> ${timeSpent}</div>
                            <div><strong>Date:</strong> ${date}</div>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = resultsHtml;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    // Utility methods
    viewSubjectNotes(subjectId) {
        const subject = DB.subjects.find(s => s.id === subjectId);
        if (subject) {
            alert(`Notes for ${subject.name}:\n\n${subject.notes}`);
        }
    }

    regenerateQuestions(subjectId) {
        if (confirm('Are you sure you want to regenerate questions for this subject? Existing questions will be replaced.')) {
            // Remove existing questions
            DB.questions = DB.questions.filter(q => q.subjectId !== subjectId);
            
            // Generate new questions
            const subject = DB.subjects.find(s => s.id === subjectId);
            this.generateQuestionsForSubject(subject);
            
            alert('Questions regenerated successfully!');
            this.loadSubjects();
        }
    }

    deleteSubject(subjectId) {
        if (confirm('Are you sure you want to delete this subject? All associated questions and results will be permanently removed.')) {
            // Remove subject
            DB.subjects = DB.subjects.filter(s => s.id !== subjectId);
            
            // Remove associated questions
            DB.questions = DB.questions.filter(q => q.subjectId !== subjectId);
            
            // Remove associated exam attempts
            DB.examAttempts = DB.examAttempts.filter(a => a.subjectId !== subjectId);
            
            alert('Subject deleted successfully!');
            this.loadSubjects();
        }
    }

    closeModal(modal) {
        if (modal) modal.classList.add('hidden');
    }
}

// Initialize app
const app = new ExamApp();

// Global functions for onclick handlers (fallback)
window.app = app;

// Prevent accidental page refresh during exam
window.addEventListener('beforeunload', (e) => {
    if (currentExam.timer) {
        e.preventDefault();
        e.returnValue = 'You have an active exam. Are you sure you want to leave?';
        return e.returnValue;
    }
});