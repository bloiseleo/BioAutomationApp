import tempfile, os, shutil, json
from src.Configuration import Configuration
from src.helpers.FileHandler import FileHandler
from src.erros.WorkspaceAlreadyExistsException import WorkspaceAlreadyExistsException
import pytest

path_to_tempfolder = os.path.join(tempfile.gettempdir(), "bioautomation")

shutil.rmtree(path_to_tempfolder)

config = Configuration()

path_to_workspaces = os.path.join(path_to_tempfolder, "workspaces")
path_to_settings = os.path.join(path_to_tempfolder, "settings.json")

def test_if_bioautomation_temp_folder_was_created():
    assert FileHandler.folder_exists_in(tempfile.gettempdir(), "bioautomation")
def test_if_settings_was_saved():
    assert FileHandler.file_exists(path_to_settings)

@pytest.mark.parametrize(
    "name",
    [
        ("TDP43"),
        ("TDP42"),
        ("SOD1")
    ]
)
def test_if_create_workspace_is_working(name):
    config.create_workspace(name)
    assert name in config.configuration['workspaces']
    settings_saved_on_disk = FileHandler.read_file_contents(path_to_settings)
    assert name in settings_saved_on_disk['workspaces']
    assert FileHandler.folder_exists_in(path_to_workspaces, name)
    path_to_workspace = os.path.join(path_to_workspaces, name)
    path_to_settings_workspace = os.path.join(path_to_workspace, "settings.json")
    workspace_settings = FileHandler.read_file_contents(path_to_settings_workspace)
    assert workspace_settings['name'] == name
    assert workspace_settings['path'] == path_to_workspace
    assert workspace_settings['path_to_base_xlsx'] == os.path.join(path_to_workspace, "base_dataframe.xlsx")

@pytest.mark.parametrize(
    "name",
    [
        ("TDP43"),
        ("TDP42"),
        ("SOD1")
    ]
)
def test_if_error_while_creating_workspace_is_working(name):
    with pytest.raises(WorkspaceAlreadyExistsException) as e_info:
        config.create_workspace(name)

@pytest.mark.parametrize(
    "name",
    [
        ("TDP43"),
        ("TDP42"),
        ("SOD1")
    ]
)
def test_get_workspace(name):
    workpsace_settings = config.get_workspace(name)
    assert workpsace_settings != False
    assert workpsace_settings['name'] == name

def test_get_not_existing_workspace():
    workpsace_settings = config.get_workspace("non_Existing_workspace")
    assert workpsace_settings == False

def test_list_all_workspaces():
    all_workspaces = config.list_all_workspace()
    all_workspaces_settings = json.loads(all_workspaces)
    assert "TDP43" in all_workspaces_settings['workspaces']
    assert "TDP42" in all_workspaces_settings['workspaces']
    assert "SOD1" in all_workspaces_settings['workspaces']

@pytest.mark.parametrize(
    "name",
    [
        ("TDP43"),
        ("TDP42"),
        ("SOD1")
    ]
)
def test_delete_workspace(name):
    config.delete_workspace(name)
    assert name not in config.configuration['workspaces']
    settings_saved = FileHandler.read_file_contents(path_to_settings)
    assert name not in settings_saved['workspaces']
    assert not FileHandler.folder_exists_in(path_to_workspaces, name)
    path_to_workspace = os.path.join(path_to_workspaces, name)
    path_to_settings_workspace = os.path.join(path_to_workspace, "settings.json")
    assert not FileHandler.file_exists(path_to_settings_workspace)
