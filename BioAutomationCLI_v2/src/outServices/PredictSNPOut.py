import pandas as pd

class PredictSNPOut:
    
    def __init__(self, workspace, result_file: str) -> None:
        self._dataframe = self._read_dataframe(workspace['path_to_base_xlsx'])
        self._result_file = result_file
        self._path_to_result = workspace['out']['predictSNP']['path_to_file']

    def _read_dataframe(self, path: str) -> pd.DataFrame:
        return pd.read_excel(path)
    
    def getOut(self):
        df_raw = pd.read_csv(self._result_file, sep = '\t') 
        #Cleaning the dataframe
        df_raw = df_raw[['Wild residue', 'Position', 'Target residue', 'PredictSNP prediction']]
        df_raw['One_letter_code'] = df_raw['Wild residue']+df_raw['Position'].apply (lambda x:str(x))+df_raw['Target residue']
        df_raw = df_raw.drop (['Wild residue', 'Position', 'Target residue'], axis = 1)
        df_raw['PredictSNP'] = df_raw['PredictSNP prediction'].str.capitalize()
        df_raw = df_raw.drop ('PredictSNP prediction', axis = 1)
        #Merging dataframes
        df_predictsnp = pd.merge(self._dataframe, df_raw, how='inner', on = 'One_letter_code')
        df_predictsnp.to_excel(self._path_to_result)
        return