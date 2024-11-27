import uuid
from datetime import datetime
from dataclasses import dataclass, asdict
from typing import List, Optional

@dataclass
class Student:
    id: str
    name: str
    age: int
    year_id: str
    section_id: str
    group_id: str
    attendance: List[dict]
    grades: List[dict]
    notes: List[dict]

@dataclass
class Year:
    id: str
    name: str
    start_date: str
    end_date: str
    weights: dict
    modules: List[dict]

@dataclass
class Section:
    id: str
    name: str
    year_id: str

@dataclass
class Group:
    id: str
    name: str
    section_id: str

class DataStore:
    def __init__(self):
        self.students: List[Student] = []
        self.years: List[Year] = []
        self.sections: List[Section] = []
        self.groups: List[Group] = []
        
        # Initialize with sample data
        self._init_sample_data()
    
    def _init_sample_data(self):
        # Create a sample academic year
        year = Year(
            id=str(uuid.uuid4()),
            name="2023-2024",
            start_date="2023-09-01",
            end_date="2024-06-30",
            weights={"attendance": 20, "assignments": 30, "exams": 50},
            modules=[{
                "id": str(uuid.uuid4()),
                "name": "Mathematics",
                "weights": {"assignments": 40, "exams": 60},
                "components": [
                    {"type": "Course", "hours": 2},
                    {"type": "TD", "hours": 1.5},
                    {"type": "TP", "hours": 1.5}
                ]
            }]
        )
        self.years.append(year)

        # Create a sample section
        section = Section(
            id=str(uuid.uuid4()),
            name="Section A",
            year_id=year.id
        )
        self.sections.append(section)

        # Create a sample group
        group = Group(
            id=str(uuid.uuid4()),
            name="Group 1",
            section_id=section.id
        )
        self.groups.append(group)

        # Create a sample student
        student = Student(
            id=str(uuid.uuid4()),
            name="John Doe",
            age=20,
            year_id=year.id,
            section_id=section.id,
            group_id=group.id,
            attendance=[],
            grades=[],
            notes=[]
        )
        self.students.append(student)

    def add_student(self, name: str, age: int, year_id: str, section_id: str, group_id: str) -> Student:
        student = Student(
            id=str(uuid.uuid4()),
            name=name,
            age=age,
            year_id=year_id,
            section_id=section_id,
            group_id=group_id,
            attendance=[],
            grades=[],
            notes=[]
        )
        self.students.append(student)
        return student

    def add_attendance(self, student_id: str, module_id: str, is_present: bool, date: str) -> dict:
        attendance = {
            "id": str(uuid.uuid4()),
            "date": date,
            "module_id": module_id,
            "is_present": is_present,
            "points": 0.5 if is_present else 0
        }
        
        for student in self.students:
            if student.id == student_id:
                student.attendance.append(attendance)
                break
                
        return attendance

    def add_grade(self, student_id: str, module_id: str, grade_type: str, 
                 score: float, max_score: float, name: str) -> dict:
        grade = {
            "id": str(uuid.uuid4()),
            "type": grade_type,
            "module_id": module_id,
            "name": name,
            "score": score,
            "max_score": max_score,
            "date": datetime.now().isoformat()
        }
        
        for student in self.students:
            if student.id == student_id:
                student.grades.append(grade)
                break
                
        return grade

    def add_note(self, student_id: str, title: str, content: str) -> dict:
        note = {
            "id": str(uuid.uuid4()),
            "title": title,
            "content": content,
            "date": datetime.now().isoformat()
        }
        
        for student in self.students:
            if student.id == student_id:
                student.notes.append(note)
                break
                
        return note

    def get_student(self, student_id: str) -> Optional[Student]:
        return next((s for s in self.students if s.id == student_id), None)

    def get_year(self, year_id: str) -> Optional[Year]:
        return next((y for y in self.years if y.id == year_id), None)

    def get_section(self, section_id: str) -> Optional[Section]:
        return next((s for s in self.sections if s.id == section_id), None)

    def get_group(self, group_id: str) -> Optional[Group]:
        return next((g for g in self.groups if g.id == group_id), None)