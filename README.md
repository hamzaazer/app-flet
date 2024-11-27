# EduManager - Teacher Management System

A mobile-first teacher management system built with Python and Flet framework.

## Features

- Student Management
- Attendance Tracking
- Grade Management
- Academic Year/Section/Group Organization
- Student Notes
- Performance Analytics

## Requirements

- Python 3.7+
- Flet 0.21.1+

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/edumanager.git
cd edumanager
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python main.py
```

## Project Structure

```
edumanager/
├── assets/              # Static assets
├── store/              # Data management
│   └── data_store.py
├── views/              # UI views
│   ├── academic.py
│   ├── attendance.py
│   ├── dashboard.py
│   ├── grades.py
│   ├── notes.py
│   ├── settings.py
│   └── students.py
├── main.py             # Application entry point
└── requirements.txt    # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.