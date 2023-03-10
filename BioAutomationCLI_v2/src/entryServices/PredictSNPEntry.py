import pandas as pd
import os

class PredictSNPEntry:

    def __init__(self, dataframe_path: str, protein_header: str, protein_seqence: str) -> None:
        self._dataframe_path = dataframe_path
        self._protein_header = protein_header
        self._protein_sequence = protein_seqence
    
    def extract_mutations(self):
        dataframe = pd.read_excel(self._dataframe_path)
        mutations = []
        for element in dataframe['One_letter_code']:
            mutations.append(element)
        return mutations

    def getEntry(self, path_to_save_file: str) -> None:
        protein_sequence = self._protein_header + "\n" + self._protein_sequence
        mutations = "\n".join(self.extract_mutations())
        content = f"Protein Sequence in FASTA format:\n\n{protein_sequence}\n\nMutations with breakline as separator:\n\n{mutations}"
        with open(path_to_save_file, "w") as file:
            file.write(content)
