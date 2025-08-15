# EduExam – Automated Question Generation & Exam Evaluation System

EduExam is a web application designed for educational institutions to automate question generation (MCQs & descriptive) and perform answer evaluation for online exams. Admins upload subject notes, and the system generates realistic questions for up to 3 subjects. Students can take auto-scored exams, see their results, and analytics are presented for performance tracking.

---

## Features

- **Admin Panel**
  - Admin registration & login
  - Add/edit/delete subjects (limit: 3)
  - Upload notes (text)
  - Automatic generation of 10 questions per subject (9 MCQs, 1 descriptive)
  - Review/edit questions
  - Student results & analytics dashboard

- **Automated Question Generation**
  - MCQs with 4 options
  - Contextually generated descriptive questions

- **Student Exam System**
  - Student registration/login
  - Select subject and take timed exam
  - Submit answers and receive instant results
  - See breakdown of correct answers & score

- **Answer Evaluation**
  - MCQs: Auto-scoring
  - Descriptive: Keyword matching, completeness, grammar, relevance (simulated)

- **Results Management**
  - Score tables stored in simulated database objects
  - Performance analytics for admin

---

## Installation

No backend required; all logic is in the frontend.

1. **Clone the repository:**
    ```
    git clone https://github.com/your-username/EduExam.git
    ```
2. **Open the project folder and run:**
    - Open `index.html` in your web browser.

---

## Usage

**Admin Credentials**
- Email: `admin@example.com`
- Password: `admin123`

**Student Credentials (sample)**
- Email: `student@example.com`
- Password: `password123`

**Flow**
1. Admin logs in, manages subjects and uploads notes.
2. System generates questions automatically per subject.
3. Students register/login, select subject, take exam.
4. System evaluates responses, displays scores & correct answers.
5. Admin reviews results and analytics from dashboard.

---

## Project Structure

