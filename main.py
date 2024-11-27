import flet as ft
from views.dashboard import DashboardView
from views.students import StudentsView
from views.attendance import AttendanceView
from views.grades import GradesView
from views.notes import NotesView
from views.settings import SettingsView
from views.academic import AcademicView
from store.data_store import DataStore

class TeacherManagementApp:
    def __init__(self):
        self.data_store = DataStore()
        
    def main(self, page: ft.Page):
        # Configure page settings
        page.title = "EduManager"
        page.theme_mode = ft.ThemeMode.LIGHT
        page.padding = 0
        page.spacing = 0
        page.window_width = 400
        page.window_height = 850
        page.theme = ft.Theme(
            color_scheme_seed=ft.colors.BLUE,
        )

        # Initialize views
        self.dashboard = DashboardView(page, self.data_store)
        self.students = StudentsView(page, self.data_store)
        self.attendance = AttendanceView(page, self.data_store)
        self.grades = GradesView(page, self.data_store)
        self.notes = NotesView(page, self.data_store)
        self.settings = SettingsView(page, self.data_store)
        self.academic = AcademicView(page, self.data_store)

        def route_change(e):
            page.views.clear()
            troute = ft.TemplateRoute(page.route)
            
            if troute.match("/"):
                page.views.append(self.dashboard.view)
            elif troute.match("/students"):
                page.views.append(self.students.view)
            elif troute.match("/attendance"):
                page.views.append(self.attendance.view)
            elif troute.match("/grades"):
                page.views.append(self.grades.view)
            elif troute.match("/notes"):
                page.views.append(self.notes.view)
            elif troute.match("/settings"):
                page.views.append(self.settings.view)
            elif troute.match("/academic"):
                page.views.append(self.academic.view)
            
            page.update()

        def view_pop(e):
            page.views.pop()
            top_view = page.views[-1]
            page.go(top_view.route)

        page.on_route_change = route_change
        page.on_view_pop = view_pop
        page.go(page.route)

if __name__ == "__main__":
    app = TeacherManagementApp()
    ft.app(target=app.main, assets_dir="assets")