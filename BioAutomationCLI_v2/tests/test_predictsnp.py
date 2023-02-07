import pytest, tempfile, shutil, os
from src.Configuration import Configuration
from src.outServices.PredictSNPOut import PredictSNPOut
from src.entryServices.PredictSNPEntry import PredictSNPEntry
from src.helpers.FileHandler import FileHandler
from json import loads
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

def create_workspace(config: Configuration):
    config.create_workspace("TDP43", "C:\\Users\\leona\\workspace\\BioAutomationDesktopApp\\BioAutomationCLI_v2\\tests\\testdata\\snp_result.xml", 
        "NP_031401.1", True, ">sp|Q13148|TADBP_HUMAN TAR DNA-binding protein 43 OS=Homo sapiens OX=9606 GN=TARDBP PE=1 SV=1",
        "MSEYIRVTEDENDEPIEIPSEDDGTVLLSTVTAQFPGACGLRYRNPVSQCMRGVRLVEGILHAPDAGWGNLVYVVNYPKDNKRKMDETDASSAVKVKRAVQKTSDLIVLGLPWKTTEQDLKEYFSTFGEVLMVQVKKDLKTGHSKGFGFVRFTEYETQVKVMSQRHMIDGRWCDCKLPNSKQSQDEPLRSRKVFVGRCTEDMTEDELREFFSQYGDVMDVFIPKPFRAFAFVTFADDQIAQSLCGEDLIIKGISVHISNAEPKHNSNRQLERSGRFGGNPGGFGNQGGFGNSRGGGAGLGNNQGSNMGGGMNFGAFSINPAMMAAAQAALQSSWGMMGMLASQQNQSGPSGNNQNQGNMQREPNQAFGSGNNSYSGSNSGAAIGWGSASNAGSGSGFNGGFGSSMDSKSSGWGM")
def generate_entry_to_predict_snp(workspace_name: str):
    workspace = config.get_workspace("TDP43")
    if(workspace['status'] != 200):
        raise Exception("Erro ao Criar Workspace")
    workspace = loads(workspace['message'])
    service = PredictSNPEntry(dataframe_path=workspace['path_to_base_xlsx'],
    protein_header=workspace['protein_header'],
    protein_seqence=workspace['protein_sequence'])
    service.getEntry(workspace['entry']['predictSNP']['path_to_file'])
    config.service_done(workspace_name, "entry", "predictSNP")


@pytest.mark.parametrize(
    "result_file",
    [
        ("C:\\Users\\leona\\workspace\\BioAutomationDesktopApp\\BioAutomationCLI_v2\\tests\\testdata\\predict_snp.csv")
    ]
)
def test_predictsnp_out(result_file: str):
    create_workspace(config)
    workspace = config.get_workspace("TDP43")
    generate_entry_to_predict_snp("TDP43")
    if(workspace == False):
        raise Exception("Workspace não foi selecionado")
    workspace = loads(workspace['message'])
    service = PredictSNPOut(workspace, result_file)
    service.getOut()
    assert FileHandler.file_exists(workspace['out']['predictSNP']['path_to_file']) == True
