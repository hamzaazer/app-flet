import flet as ft
from store.data_store import DataStore

class NotesView:
    def __init__(self, page: ft.Page, store: DataStore):
        self.page = page
        self.store = store
        self.view = self._build_view()

    def _build_note_form(self):
        student_dropdown = ft.Dropdown(
            label="Student",
            options=[
                ft.dropdown.Option(student.id, student.name)
                for student in self.store.students
            ],
            width=300,
            border=ft.InputBorder.OUTLINE
        )

        title_field = ft.TextField(
            label="Note Title",
            border=ft.InputBorder.OUTLINE
        )

        content_field = ft.TextField(
            label="Note Content",
            border=ft.InputBorder.OUTLINE,
            multiline=True,
            min_lines=3,
            max_lines=5
        )

        def add_note(e):
            if student_dropdown.value and title_field.value and content_field.value:
                self.store.add_note(
                    student_dropdown.value,
                    title_field.value,
                    content_field.value
                )
                self.page.show_snack_bar(
                    ft.SnackBar(content=ft.Text("Note added successfully"))
                )
                title_field.value = ""
                content_field.value = ""
                self.page.update()
            else:
                self.page.show_snack_bar(
                    ft.SnackBar(content=ft.Text("Please fill all fields"))
                )

        return ft.Column(
            controls=[
                ft.Text("Add Note", size=20, weight=ft.FontWeight.BOLD),
                student_dropdown,
                title_field,
                content_field,
                ft.ElevatedButton(
                    "Add Note",
                    on_click=add_note,
                    width=300
                )
            ],
            spacing=20,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER
        )

    def _build_view(self):
        return ft.View(
            "/notes",
            [
                ft.AppBar(title=ft.Text("Notes"), bgcolor=ft.colors.SURFACE_VARIANT),
                ft.Container(
                    content=self._build_note_form(),
                    padding=20
                )
            ]
        )