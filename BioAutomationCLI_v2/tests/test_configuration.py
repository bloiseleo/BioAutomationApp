import tempfile, os, shutil, json
from src.Configuration import Configuration
from src.helpers.FileHandler import FileHandler
from src.erros.WorkspaceAlreadyExistsException import WorkspaceAlreadyExistsException
import pytest
import pandas as pd

path_to_tempfolder = os.path.join(tempfile.gettempdir(), "bioautomation")

shutil.rmtree(path_to_tempfolder)

config = Configuration()

path_to_workspaces = os.path.join(path_to_tempfolder, "workspaces")
path_to_settings = os.path.join(path_to_tempfolder, "settings.json")
concept_df =     {
        'Unnamed: 0': {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7}, 
        'dbSNP_ID': {0: 'rs80356715', 1: 'rs80356715', 2: 'rs80356717', 3: 'rs80356718', 4: 'rs80356719', 5: 'rs80356719', 6: 'rs4884357', 7: 'rs4884357'},
        'Clinical_significance': {0: 'uncertain-significance', 1: 'uncertain-significance', 2: 'conflicting-interpretations-of-pathogenicity', 3: 'pathogenic', 4: 'likely-pathogenic,uncertain-significance,pathogenic', 5: 'likely-pathogenic,uncertain-significance,pathogenic', 6: 'pathogenic,pathogenic-likely-pathogenic,uncertain-significance', 7: 'pathogenic,pathogenic-likely-pathogenic,uncertain-significance'}, 'Variant': {0: 'Ala90Gly', 1: 'Ala90Val', 2: 'Asp169Gly', 3: 'Asn267Ser', 4: 'Gly287Ser', 5: 'Gly287Arg', 6: 'Gly298Ser', 7: 'Gly298Cys'}, 
        'Position': {0: 90, 1: 90, 2: 169, 3: 267, 4: 287, 5: 287, 6: 298, 7: 298}, 
        'One_letter_code': {0: 'A90G', 1: 'A90V', 2: 'D169G', 3: 'N267S', 4: 'G287S', 5: 'G287R', 6: 'G298S', 7: 'G298C'}
    }

def test_if_bioautomation_temp_folder_was_created():
    assert FileHandler.folder_exists_in(tempfile.gettempdir(), "bioautomation")
def test_if_settings_was_saved():
    assert FileHandler.file_exists(path_to_settings)

@pytest.mark.parametrize(
    "name, file, refseq, remove_truncating, protein_header, protein_sequence",
    [
        ("TDP43", "C:\\Users\\leona\\workspace\\BioAutomationDesktopApp\\BioAutomationCLI_v2\\tests\\testdata\\snp_result.xml", "NP_031401.1", True, ">sp|Q13148|TADBP_HUMAN TAR DNA-binding protein 43 OS=Homo sapiens OX=9606 GN=TARDBP PE=1 SV=1","MSEYIRVTEDENDEPIEIPSEDDGTVLLSTVTAQFPGACGLRYRNPVSQCMRGVRLVEGILHAPDAGWGNLVYVVNYPKDNKRKMDETDASSAVKVKRAVQKTSDLIVLGLPWKTTEQDLKEYFSTFGEVLMVQVKKDLKTGHSKGFGFVRFTEYETQVKVMSQRHMIDGRWCDCKLPNSKQSQDEPLRSRKVFVGRCTEDMTEDELREFFSQYGDVMDVFIPKPFRAFAFVTFADDQIAQSLCGEDLIIKGISVHISNAEPKHNSNRQLERSGRFGGNPGGFGNQGGFGNSRGGGAGLGNNQGSNMGGGMNFGAFSINPAMMAAAQAALQSSWGMMGMLASQQNQSGPSGNNQNQGNMQREPNQAFGSGNNSYSGSNSGAAIGWGSASNAGSGSGFNGGFGSSMDSKSSGWGM"),
        ("TDP42", "C:\\Users\\leona\\workspace\\BioAutomationDesktopApp\\BioAutomationCLI_v2\\tests\\testdata\\snp_result.xml", "NP_031401.1", True, ">sp|Q13148|TADBP_HUMAN TAR DNA-binding protein 43 OS=Homo sapiens OX=9606 GN=TARDBP PE=1 SV=1","MSEYIRVTEDENDEPIEIPSEDDGTVLLSTVTAQFPGACGLRYRNPVSQCMRGVRLVEGILHAPDAGWGNLVYVVNYPKDNKRKMDETDASSAVKVKRAVQKTSDLIVLGLPWKTTEQDLKEYFSTFGEVLMVQVKKDLKTGHSKGFGFVRFTEYETQVKVMSQRHMIDGRWCDCKLPNSKQSQDEPLRSRKVFVGRCTEDMTEDELREFFSQYGDVMDVFIPKPFRAFAFVTFADDQIAQSLCGEDLIIKGISVHISNAEPKHNSNRQLERSGRFGGNPGGFGNQGGFGNSRGGGAGLGNNQGSNMGGGMNFGAFSINPAMMAAAQAALQSSWGMMGMLASQQNQSGPSGNNQNQGNMQREPNQAFGSGNNSYSGSNSGAAIGWGSASNAGSGSGFNGGFGSSMDSKSSGWGM"),
        ("SOD1", "C:\\Users\\leona\\workspace\\BioAutomationDesktopApp\\BioAutomationCLI_v2\\tests\\testdata\\snp_result.xml", "NP_031401.1", True, ">sp|Q13148|TADBP_HUMAN TAR DNA-binding protein 43 OS=Homo sapiens OX=9606 GN=TARDBP PE=1 SV=1","MSEYIRVTEDENDEPIEIPSEDDGTVLLSTVTAQFPGACGLRYRNPVSQCMRGVRLVEGILHAPDAGWGNLVYVVNYPKDNKRKMDETDASSAVKVKRAVQKTSDLIVLGLPWKTTEQDLKEYFSTFGEVLMVQVKKDLKTGHSKGFGFVRFTEYETQVKVMSQRHMIDGRWCDCKLPNSKQSQDEPLRSRKVFVGRCTEDMTEDELREFFSQYGDVMDVFIPKPFRAFAFVTFADDQIAQSLCGEDLIIKGISVHISNAEPKHNSNRQLERSGRFGGNPGGFGNQGGFGNSRGGGAGLGNNQGSNMGGGMNFGAFSINPAMMAAAQAALQSSWGMMGMLASQQNQSGPSGNNQNQGNMQREPNQAFGSGNNSYSGSNSGAAIGWGSASNAGSGSGFNGGFGSSMDSKSSGWGM")
    ]
)
def test_if_create_workspace_is_working(name, file, refseq, remove_truncating, protein_header, protein_sequence):
    config.create_workspace(name, file, refseq, remove_truncating, protein_header, protein_sequence)
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
    assert workspace_settings['protein_header'] == protein_header
    assert workspace_settings['protein_sequence'] == protein_sequence
    assert FileHandler.file_exists(workspace_settings['path_to_base_xlsx'])
    dataframe = pd.read_excel(workspace_settings['path_to_base_xlsx'])
    dict_dataframe = dataframe.to_dict() #{column -> {index -> value}}
    columns = ["dbSNP_ID", "Clinical_significance", "Variant", "Position", "One_letter_code"]
    for column in columns:
        assert column in dict_dataframe.keys()
        concept_row = concept_df[column]
        real_row = dict_dataframe[column]
        for cell_index in real_row.keys():
            assert real_row[cell_index] == concept_row[cell_index]


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
        config.create_workspace(name, "", "", True, "", "")

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
@pytest.mark.parametrize(
    "name, kind, service_name",
    [
        ("TDP43", "entry", "predictSNP"),
        ("TDP42", "entry", "predictSNP"),
        ("SOD1", "entry", "predictSNP")
    ]
)
def test_service_done(name, kind, service_name):
    config.service_done(name, kind, service_name)
    workpsace_settings = config.get_workspace(name)
    assert workpsace_settings[kind][service_name]['done'] == True


def test_get_not_existing_workspace():
    workpsace_settings = config.get_workspace("non_Existing_workspace")
    assert workpsace_settings == False

def test_list_all_workspaces():
    all_workspaces = config.list_all_workspace()
    all_workspaces_settings = json.loads(all_workspaces)
    workspace_settings_TDP43 = all_workspaces_settings[0]
    keys = [
        "name",
        "path",
        "path_to_base_xlsx",
        "entry",
        "protein_sequence"
    ]
    for key in keys:
        assert key in workspace_settings_TDP43.keys()

# @pytest.mark.parametrize(
#     "name",
#     [
#         ("TDP43"),
#         ("TDP42"),
#         ("SOD1")
#     ]
# )
# def test_delete_workspace(name):
#     config.delete_workspace(name)
#     assert name not in config.configuration['workspaces']
#     settings_saved = FileHandler.read_file_contents(path_to_settings)
#     assert name not in settings_saved['workspaces']
#     assert not FileHandler.folder_exists_in(path_to_workspaces, name)
#     path_to_workspace = os.path.join(path_to_workspaces, name)
#     path_to_settings_workspace = os.path.join(path_to_workspace, "settings.json")
#     assert not FileHandler.file_exists(path_to_settings_workspace)
