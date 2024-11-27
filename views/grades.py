import flet as ft
from store.data_store import DataStore

class GradesView:
    def __init__(self, page: ft.Page, store: DataStore):
        self.page = page
        self.store = store
        self.view = self._build_view()

    def _build_grade_form(self):
        student_dropdown = ft.Dropdown(
            label="Student",
            options=[
                ft.dropdown.Option(student.id, student.name)
                for student in self.store.students
            ],
            width=300,
            border=ft.InputBorder.OUTLINE
        )

        module_dropdown = ft.Dropdown(
            label="Module",
            options=[
                ft.dropdown.Option(
                    module["id"],
                    module["name"]
                ) for year in self.store.years 
                for module in year.modules
            ],
            width=300,
            border=ft.InputBorder.OUTLINE
        )

        grade_type = ft.Dropdown(
            label="Grade Type",
            options=[
                ft.dropdown.Option("assignment", "Assignment"),
                ft.dropdown.Option("exam", "Exam")
            ],
            width=300,
            border=ft.InputBorder.OUTLINE
        )

        grade_name = ft.TextField(
            label="Grade Name",
            border=ft.InputBorder.OUTLINE
        )

        score = ft.TextField(
            label="Score",
            border=ft.InputBorder.OUTLINE,
            keyboard_type=ft.KeyboardType.NUMBER
        )

        max_score = ft.TextField(
            label="Max Score",
            border=ft.InputBorder.OUTLINE,
            keyboard_type=ft.KeyboardType.NUMBER,
            value="20"
        )

        def add_grade(e):
            try:
                self.store.add_grade(
                    student_dropdown.value,
                    module_dropdown.value,
                    grade_type.value,
                    float(score.value),
                    float(max_score.value),
                    grade_name.value
                )
                self.page.show_snack_bar(
                    ft.SnackBar(content=ft.Text("Grade added successfully"))
                )
                grade_name.value = ""
                score.value = ""
                max_score.value = "20"
                self.page.update()
            except ValueError:
                self.page.show_snack_bar(
                    ft.SnackBar(content=ft.Text("Please fill all fields correctly"))
                )

        return ft.Column(
            controls=[
                ft.Text("Add Grade", size=20, weight=ft.FontWeight.BOLD),
                student_dropdown,
                module_dropdown,
                grade_type,
                grade_name,
                score,
                max_score,
                ft.ElevatedButton(
                    "Add Grade",
                    on_click=add_grade,
                    width=300
                )
            ],
            spacing=20,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER
        )

    def _build_view(self):
        return ft.View(
            "/grades",
            [
                ft.AppBar(title=ft.Text("Grades"), bgcolor=ft.colors.SURFACE_VARIANT),
                ft.Container(
                    content=self._build_grade_form(),
                    padding=20
                )
            ]
        )