import flet as ft
from store.data_store import DataStore

class StudentsView:
    def __init__(self, page: ft.Page, store: DataStore):
        self.page = page
        self.store = store
        self.view = self._build_view()

    def _build_student_form(self):
        name_field = ft.TextField(
            label="Student Name",
            border=ft.InputBorder.OUTLINE
        )
        age_field = ft.TextField(
            label="Age",
            border=ft.InputBorder.OUTLINE,
            keyboard_type=ft.KeyboardType.NUMBER
        )
        year_dropdown = ft.Dropdown(
            label="Academic Year",
            options=[
                ft.dropdown.Option(year.id, year.name)
                for year in self.store.years
            ],
            width=300,
            border=ft.InputBorder.OUTLINE
        )
        section_dropdown = ft.Dropdown(
            label="Section",
            options=[
                ft.dropdown.Option(section.id, section.name)
                for section in self.store.sections
            ],
            width=300,
            border=ft.InputBorder.OUTLINE
        )
        group_dropdown = ft.Dropdown(
            label="Group",
            options=[
                ft.dropdown.Option(group.id, group.name)
                for group in self.store.groups
            ],
            width=300,
            border=ft.InputBorder.OUTLINE
        )

        def add_student(e):
            try:
                student = self.store.add_student(
                    name_field.value,
                    int(age_field.value),
                    year_dropdown.value,
                    section_dropdown.value,
                    group_dropdown.value
                )
                self.page.show_snack_bar(
                    ft.SnackBar(content=ft.Text(f"Added student: {student.name}"))
                )
                name_field.value = ""
                age_field.value = ""
                year_dropdown.value = None
                section_dropdown.value = None
                group_dropdown.value = None
                self.page.update()
            except ValueError:
                self.page.show_snack_bar(
                    ft.SnackBar(content=ft.Text("Please fill all fields correctly"))
                )

        return ft.Card(
            content=ft.Container(
                content=ft.Column(
                    controls=[
                        ft.Text("Add New Student", size=20, weight=ft.FontWeight.BOLD),
                        name_field,
                        age_field,
                        year_dropdown,
                        section_dropdown,
                        group_dropdown,
                        ft.ElevatedButton(
                            "Add Student",
                            on_click=add_student,
                            width=300
                        )
                    ],
                    spacing=20,
                    horizontal_alignment=ft.CrossAxisAlignment.CENTER
                ),
                padding=20
            )
        )

    def _build_student_list(self):
        students_column = ft.Column(scroll=ft.ScrollMode.AUTO, spacing=10)

        for student in self.store.students:
            year = self.store.get_year(student.year_id)
            section = self.store.get_section(student.section_id)
            group = self.store.get_group(student.group_id)

            student_card = ft.Card(
                content=ft.Container(
                    content=ft.Column(
                        controls=[
                            ft.ListTile(
                                leading=ft.Icon(ft.icons.PERSON),
                                title=ft.Text(student.name),
                                subtitle=ft.Text(
                                    f"Age: {student.age} | {year.name if year else ''} "
                                    f"| {section.name if section else ''} "
                                    f"| {group.name if group else ''}"
                                )
                            ),
                            ft.Row(
                                controls=[
                                    ft.TextButton("View Details"),
                                    ft.TextButton("Edit"),
                                ],
                                alignment=ft.MainAxisAlignment.END
                            )
                        ]
                    ),
                    padding=10
                )
            )
            students_column.controls.append(student_card)

        return students_column

    def _build_view(self):
        return ft.View(
            "/students",
            [
                ft.AppBar(
                    title=ft.Text("Students"),
                    bgcolor=ft.colors.SURFACE_VARIANT,
                    actions=[
                        ft.IconButton(ft.icons.SEARCH),
                        ft.IconButton(ft.icons.FILTER_LIST)
                    ]
                ),
                ft.Container(
                    content=ft.Column(
                        controls=[
                            self._build_student_form(),
                            ft.Divider(),
                            self._build_student_list()
                        ],
                        spacing=20,
                        scroll=ft.ScrollMode.AUTO
                    ),
                    padding=20
                )
            ]
        )