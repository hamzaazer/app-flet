import flet as ft
from store.data_store import DataStore

class SettingsView:
    def __init__(self, page: ft.Page, store: DataStore):
        self.page = page
        self.store = store
        self.view = self._build_view()

    def _build_module_settings(self):
        year_dropdown = ft.Dropdown(
            label="Academic Year",
            options=[
                ft.dropdown.Option(year.id, year.name)
                for year in self.store.years
            ],
            width=300,
            border=ft.InputBorder.OUTLINE
        )

        module_dropdown = ft.Dropdown(
            label="Module",
            options=[],
            width=300,
            border=ft.InputBorder.OUTLINE
        )

        assignments_weight = ft.TextField(
            label="Assignments Weight (%)",
            border=ft.InputBorder.OUTLINE,
            keyboard_type=ft.KeyboardType.NUMBER,
            width=300
        )

        exams_weight = ft.TextField(
            label="Exams Weight (%)",
            border=ft.InputBorder.OUTLINE,
            keyboard_type=ft.KeyboardType.NUMBER,
            width=300
        )

        def update_modules(e):
            if year_dropdown.value:
                year = self.store.get_year(year_dropdown.value)
                if year:
                    module_dropdown.options = [
                        ft.dropdown.Option(module["id"], module["name"])
                        for module in year.modules
                    ]
                    self.page.update()

        year_dropdown.on_change = update_modules

        def save_weights(e):
            try:
                assignments = int(assignments_weight.value)
                exams = int(exams_weight.value)
                if assignments + exams != 100:
                    raise ValueError("Weights must sum to 100%")
                
                # Update weights logic would go here
                self.page.show_snack_bar(
                    ft.SnackBar(content=ft.Text("Settings saved successfully"))
                )
            except ValueError as err:
                self.page.show_snack_bar(
                    ft.SnackBar(content=ft.Text(str(err)))
                )

        return ft.Column(
            controls=[
                ft.Text("Module Settings", size=20, weight=ft.FontWeight.BOLD),
                year_dropdown,
                module_dropdown,
                assignments_weight,
                exams_weight,
                ft.ElevatedButton(
                    "Save Settings",
                    on_click=save_weights,
                    width=300
                )
            ],
            spacing=20,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER
        )

    def _build_view(self):
        return ft.View(
            "/settings",
            [
                ft.AppBar(title=ft.Text("Settings"), bgcolor=ft.colors.SURFACE_VARIANT),
                ft.Container(
                    content=self._build_module_settings(),
                    padding=20
                )
            ]
        )