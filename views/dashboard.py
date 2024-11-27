import flet as ft
from store.data_store import DataStore

class DashboardView:
    def __init__(self, page: ft.Page, store: DataStore):
        self.page = page
        self.store = store
        self.view = self._build_view()

    def _build_view(self):
        def navigate(e):
            self.page.go(e.control.data)

        stats = [
            {
                "title": "Total Students",
                "value": len(self.store.students),
                "icon": ft.Icon(ft.icons.PEOPLE),
                "color": ft.colors.BLUE
            },
            {
                "title": "Active Sections",
                "value": len(self.store.sections),
                "icon": ft.Icon(ft.icons.BOOK),
                "color": ft.colors.GREEN
            },
            {
                "title": "Study Groups",
                "value": len(self.store.groups),
                "icon": ft.Icon(ft.icons.GROUPS),
                "color": ft.colors.PURPLE
            }
        ]

        quick_actions = [
            ft.ElevatedButton(
                "Add New Student",
                icon=ft.icons.PERSON_ADD,
                data="/students",
                on_click=navigate,
                width=300
            ),
            ft.ElevatedButton(
                "Take Attendance",
                icon=ft.icons.FACT_CHECK,
                data="/attendance",
                on_click=navigate,
                width=300
            ),
            ft.ElevatedButton(
                "Record Grades",
                icon=ft.icons.GRADE,
                data="/grades",
                on_click=navigate,
                width=300
            )
        ]

        stats_row = ft.Row(
            controls=[
                ft.Card(
                    content=ft.Container(
                        content=ft.Column(
                            controls=[
                                stat["icon"],
                                ft.Text(str(stat["value"]), size=24, weight=ft.FontWeight.BOLD),
                                ft.Text(stat["title"], size=12)
                            ],
                            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                            spacing=5
                        ),
                        padding=15,
                        width=110
                    ),
                    color=stat["color"]
                )
                for stat in stats
            ],
            alignment=ft.MainAxisAlignment.SPACE_AROUND
        )

        return ft.View(
            "/",
            [
                ft.AppBar(title=ft.Text("Dashboard"), bgcolor=ft.colors.SURFACE_VARIANT),
                ft.Container(
                    content=ft.Column(
                        controls=[
                            stats_row,
                            ft.Divider(height=20, color=ft.colors.TRANSPARENT),
                            ft.Text("Quick Actions", size=20, weight=ft.FontWeight.BOLD),
                            ft.Column(
                                controls=quick_actions,
                                horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                                spacing=10
                            )
                        ],
                        spacing=20,
                        scroll=ft.ScrollMode.AUTO
                    ),
                    padding=20
                )
            ]
        )