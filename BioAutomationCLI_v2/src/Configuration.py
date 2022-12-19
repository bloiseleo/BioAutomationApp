import os, tempfile, json
from src.helpers.FileHandler import FileHandler
from src.erros.WorkspaceAlreadyExistsException import WorkspaceAlreadyExistsException
from src.helpers.StringDoctor import StringDoctor

class Configuration:
    
    configuration = {
        "workspaces": []
    }

    def __init__(self) -> None:
        self.path_to_temp_folder = os.path.join(tempfile.gettempdir(), "bioautomation")
        self.path_to_configuration = os.path.join(self.path_to_temp_folder, "settings.json")
        self.path_to_workspace_folder = os.path.join(self.path_to_temp_folder, "workspaces")
        self.init()

    def load_config(self):
        settings_exists = FileHandler.file_exists(self.path_to_configuration)
        if(not settings_exists):
            self.save()
            return
        self.configuration = FileHandler.read_file_contents(self.path_to_configuration)

    def init(self):
        FileHandler.create_folder(self.path_to_temp_folder)
        FileHandler.create_folder(self.path_to_workspace_folder)
        self.load_config()

    def check_if_workspace_exist(self, name: str) -> None:
        return FileHandler.folder_exists_in(self.path_to_workspace_folder, name)

    def create_path_to_workspace(self, name: str) -> str:
        return os.path.join(self.path_to_workspace_folder, name)

    def save(self):
        FileHandler.save_file_in(self.path_to_configuration, self.configuration)

    def create_settings_to_workspace(self, name: str) -> dict:
        path_to_workspace = self.create_path_to_workspace(name)
        return {
            "name": name,
            "path": path_to_workspace,
            "path_to_base_xlsx": os.path.join(path_to_workspace, "base_dataframe.xlsx")
        }

    def create_workspace(self, name):
        name = StringDoctor.treat_workspace_name(name)
        if(self.check_if_workspace_exist(name)):
            raise WorkspaceAlreadyExistsException(f"{name} - Já existe esse workspace")
        workspace_settings = self.create_settings_to_workspace(name)
        FileHandler.create_folder(workspace_settings['path'])
        path_to_settings = os.path.join(workspace_settings['path'], 'settings.json')
        FileHandler.save_file_in(path_to_settings, workspace_settings)
        self.configuration['workspaces'].append(name)
        self.save()

    def delete_workspace(self, name):
        if(not self.check_if_workspace_exist(name)):
            raise WorkspaceAlreadyExistsException(f"{name} - Esse workspace não existe.") 
        path_to_workspace = self.create_path_to_workspace(name)
        FileHandler.delete_dir(path_to_workspace)
        workspaces = self.configuration['workspaces']
        filtered_workspaces = filter(lambda workspace: workspace != name, workspaces)
        self.configuration['workspaces'] = list(filtered_workspaces)
        self.save()
    
    def get_workspace(self, name) -> bool | dict:
        if name not in self.configuration['workspaces']:
            return False

        path_to_workspace = self.create_path_to_workspace(name)
        path_to_settings = os.path.join(path_to_workspace, 'settings.json')
        settings = FileHandler.read_file_contents(path_to_settings)
        return settings
    
    def list_all_workspace(self) -> str:
        return json.dumps(self.configuration)