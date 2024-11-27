import flet as ft
from store.data_store import DataStore
from datetime import datetime

class AttendanceView:
    def __init__(self, page: ft.Page, store: DataStore):
        self.page = page
        self.store = store
        self.view = self._build_view()

    def _build_attendance_form(self):
        date_picker = ft.TextField(
            label="Date",
            value=datetime.now().strftime("%Y-%m-%d"),
            read_only=True,
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

        attendance_list = ft.Column(scroll=ft.ScrollMode.AUTO, spacing=10)

        def update_attendance(e, student_id: str, is_present: bool):
            if module_dropdown.value:
                self.store.add_attendance(
                    student_id,
                    module_dropdown.value,
                    is_present,
                    date_picker.value
                )
                self.page.show_snack_bar(
                    ft.SnackBar(content=ft.Text("Attendance updated"))
                )

        def build_attendance_cards():
            attendance_list.controls.clear()
            for student in self.store.students:
                attendance_card = ft.Card(
                    content=ft.Container(
                        content=ft.Row(
                            controls=[
                                ft.Icon(ft.icons.PERSON),
                                ft.Text(student.name, expand=True),
                                ft.IconButton(
                                    icon=ft.icons.CHECK_CIRCLE,
                                    icon_color=ft.colors.GREEN,
                                    on_click=lambda e, sid=student.id: update_attendance(e, sid, True)
                                ),
                                ft.IconButton(
                                    icon=ft.icons.CANCEL,
                                    icon_color=ft.colors.RED,
                                    on_click=lambda e, sid=student.id: update_attendance(e, sid, False)
                                )
                            ],
                            alignment=ft.MainAxisAlignment.SPACE_BETWEEN
                        ),
                        padding=10
                    )
                )
                attendance_list.controls.append(attendance_card)
            self.page.update()

        module_dropdown.on_change = lambda _: build_attendance_cards()

        return ft.Column(
            controls=[
                ft.Text("Mark Attendance", size=20, weight=ft.FontWeight.BOLD),
                date_picker,
                module_dropdown,
                ft.Divider(),
                attendance_list
            ],
            spacing=20
        )

    def _build_view(self):
        return ft.View(
            "/attendance",
            [
                ft.AppBar(title=ft.Text("Attendance"), bgcolor=ft.colors.SURFACE_VARIANT),
                ft.Container(
                    content=self._build_attendance_form(),
                    padding=20
                )
            ]
        )