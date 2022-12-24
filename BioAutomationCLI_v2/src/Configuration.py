import os, tempfile, json, logging
from src.helpers.FileHandler import FileHandler
from src.erros.WorkspaceAlreadyExistsException import WorkspaceAlreadyExistsException
from src.helpers.StringDoctor import StringDoctor
from src.services.DbsnpToExcel import DbsnpToExcel

class Configuration:
    
    configuration = {
        "workspaces": []
    }

    def __init__(self) -> None:
        self.path_to_temp_folder = os.path.join(tempfile.gettempdir(), "bioautomation")
        self.path_to_configuration = os.path.join(self.path_to_temp_folder, "settings.json")
        self.path_to_workspace_folder = os.path.join(self.path_to_temp_folder, "workspaces")
        self.logger = logging.Logger("BioAutomation: ")
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

    def check_if_workspace_exist(self, name: str) -> bool:
        return FileHandler.folder_exists_in(self.path_to_workspace_folder, name)

    def create_path_to_workspace(self, name: str) -> str:
        return os.path.join(self.path_to_workspace_folder, name)

    def save(self):
        FileHandler.save_file_in(self.path_to_configuration, self.configuration)

    def create_settings_to_workspace(self, name: str, protein_header: str, protein_sequence: str) -> dict:
        path_to_workspace = self.create_path_to_workspace(name)
        return {
            "name": name,
            "path": path_to_workspace,
            "path_to_base_xlsx": os.path.join(path_to_workspace, "base_dataframe.xlsx"),
            "entry": {
                "predictSNP": {
                    "done": False,
                    "path_to_file": os.path.join(path_to_workspace, "predict_snp_entry.txt")
                }
            },
            "protein_header": protein_header,
            "protein_sequence": protein_sequence
        }

    def service_done(self, workspace_name: str,kind: str, service_name: str) -> dict:
        result = self.get_workspace(workspace_name)
        if(result['status'] == 404):
            return self._message(500, "Não foi possível configurar o serviço como feito. Contate o administrador.")
        workspace_settings = json.loads(result['message'])
        workspace_settings[kind][service_name]['done'] = True
        try:
            self.save_workspace(os.path.join(workspace_settings['path'], "settings.json"), workspace_settings)
            return self._message(200)
        except Exception as exception:
            self.logger.error(f"Erro ao tentar salvar as configurações do workspace: {exception}")
            return self._message(500, f"Houve um erro interno na API. Contate o Admin.")

    def save_workspace(self, path_to_settings: str, workspace_settings: dict) -> None:
        FileHandler.save_file_in(path_to_settings, workspace_settings)

    def create_workspace(self, name: str, file: str, refseq: str, remove_truncating: str, protein_header: str, protein_sequence: str):
        
        name = StringDoctor.treat_workspace_name(name)
        
        if(self.check_if_workspace_exist(name)):
            return self._message(401, f"O workspace que você está tentando criar já existe")
        
        workspace_settings = self.create_settings_to_workspace(name, protein_header, protein_sequence)
        
        try:
            FileHandler.create_folder(workspace_settings['path'])
        except Exception as exception:
            self.logger.error(f"Erro ao salvar arquivo de configurações do workspace: {workspace_settings} - Erro Original: {exception}")
            return self._message(500, f"Houve um erro interno na API. Contate o Admin.")

        path_to_settings = os.path.join(workspace_settings['path'], 'settings.json')

        try:
            self.save_workspace(path_to_settings, workspace_settings)
            self.configuration['workspaces'].append(name)
            self.save()
        except Exception as exception:
            self.logger.error(f"Erro ao salvar workspace e/ou configurações do aplicativo: {exception}")
            return self._message(500, f"Houve um erro interno na API. Contate o Admin.")

        try:
            reader = DbsnpToExcel(refseq, file)
            df = reader.read(remove_truncating)
            df.to_excel(workspace_settings['path_to_base_xlsx'])
        except Exception as exception:
            self.logger.error(f"Erro ao executar dbsnp_to_excel: {exception}")
            return self._message(500, f"Houve um erro interno na API. Contate o Admin.")
        
        return self._message(200, "")


    def delete_workspace(self, name):
        if(not self.check_if_workspace_exist(name)):
            return self._message(404, "O Workspace não existe")
        path_to_workspace = self.create_path_to_workspace(name)
        FileHandler.delete_dir(path_to_workspace)
        workspaces = self.configuration['workspaces']
        filtered_workspaces = filter(lambda workspace: workspace != name, workspaces)
        self.configuration['workspaces'] = list(filtered_workspaces)
        self.save()
        return self._message(200)
    
    def get_workspace(self, name) -> dict:
        name = StringDoctor.treat_workspace_name(name)
        if name not in self.configuration['workspaces']:
            return self._message(404, "O Workspace não existe")
        path_to_workspace = self.create_path_to_workspace(name)
        path_to_settings = os.path.join(path_to_workspace, 'settings.json')
        settings = FileHandler.read_file_contents(path_to_settings)
        return self._message(200, json.dumps(settings))
    
    def list_all_workspace(self) -> str:
        wrokspaces_settings = []
        workspaces_names: list = self.configuration['workspaces']
        for workspace_name in workspaces_names:
            path_to_settings = os.path.join(self.create_path_to_workspace(workspace_name), "settings.json")
            wrokspaces_settings.append(FileHandler.read_file_contents(path_to_settings))
        return json.dumps(wrokspaces_settings)

    def _message(self, status: int, message: str | None = None):
        return {
            "status": status,
            "message": message
        }