import os, json
import pandas as pd

class PredictSNPEntry:

    def __init__(self, dataframe_path: str, protein_seqence: str) -> None:
        self._dataframe_path = dataframe_path
        self._protein_sequence = protein_seqence
    
    def extract_mutations(self):
        dataframe = pd.read_excel(self._dataframe_path)
        mutations = []
        for element in dataframe['One_letter_code']:
            mutations.append(element)
        return mutations

    def getEntry(self, path_to_save_file: str) -> None:
        dataframe = pd.read_excel(self._dataframe_path)
        data = dict()
        data['protein_sequence'] = self._protein_sequence
        data['mutations'] = self.extract_mutations()
        with open(path_to_save_file, "w") as file:
            file.write(json.dumps(data))
