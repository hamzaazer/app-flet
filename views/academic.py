import flet as ft
from store.data_store import DataStore
from datetime import datetime

class AcademicView:
    def __init__(self, page: ft.Page, store: DataStore):
        self.page = page
        self.store = store
        self.view = self._build_view()

    def _build_year_form(self):
        name_field = ft.TextField(
            label="Academic Year Name",
            border=ft.InputBorder.OUTLINE,
            width=300
        )

        start_date = ft.TextField(
            label="Start Date",
            value=datetime.now().strftime("%Y-%m-%d"),
            border=ft.InputBorder.OUTLINE,
            width=300
        )

        end_date = ft.TextField(
            label="End Date",
            value=datetime.now().strftime("%Y-%m-%d"),
            border=ft.InputBorder.OUTLINE,
            width=300
        )

        def add_year(e):
            if name_field.value:
                year = {
                    "name": name_field.value,
                    "start_date": start_date.value,
                    "end_date": end_date.value
                }
                # Add year logic would go here
                self.page.show_snack_bar(
                    ft.SnackBar(content=ft.Text(f"Added year: {year['name']}"))
                )
                name_field.value = ""
                self.page.update()

        return ft.Column(
            controls=[
                ft.Text("Add Academic Year", size=20, weight=ft.FontWeight.BOLD),
                name_field,
                start_date,
                end_date,
                ft.ElevatedButton(
                    "Add Year",
                    on_click=add_year,
                    width=300
                )
            ],
            spacing=20,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER
        )

    def _build_view(self):
        return ft.View(
            "/academic",
            [
                ft.AppBar(title=ft.Text("Academic"), bgcolor=ft.colors.SURFACE_VARIANT),
                ft.Container(
                    content=self._build_year_form(),
                    padding=20
                )
            ]
        )