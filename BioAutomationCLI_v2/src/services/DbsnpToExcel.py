import pandas as pd
import re

class DbsnpToExcel:

    def __init__(self, code: str, file: str) -> None:
        self._code = code
        self._file = file
    
    def read(self, remove_truncating: bool) -> pd.DataFrame:
        df = pd.read_xml(self._file)
        df = df[['SNP_ID', 'CLINICAL_SIGNIFICANCE', 'DOCSUM']]

        #Data wrangling
        df['SNP_ID'] = df['SNP_ID'].map (lambda x: 'rs'+str (x))
        df = df.fillna('unkown')
        
        #Finding only the missense mutations related to rs_id
        df['DOCSUM'] = df['DOCSUM'].map (lambda x: re.findall (self._code+':p.[A-Z]{1}[a-z]{2}[0-9]+[A-Z]{1}[a-z]{2}', x))
        df['DOCSUM'] = df['DOCSUM'].map (lambda x: None if x == [] else x)
        
        #Remove truncating mutations
        if remove_truncating == True:
            df['DOCSUM'] = df['DOCSUM'].map (lambda x: None if re.findall ('Ter', str(x)) else x)
        
        #Adjusting variant names
        df = df.dropna().reset_index(drop = True)
        df['DOCSUM'] = df['DOCSUM'].map (lambda x: re.findall('[A-Z]{1}[a-z]{2}[0-9]+[A-Z]{1}[a-z]{2}', str (x)))
        
        #Creating a dataframe containing one variant per row
        variant_list = []
        for i in range (len (df['DOCSUM'])):
            for j in range (len (df['DOCSUM'][i])):
                variant_list.append ((df['SNP_ID'][i], df['CLINICAL_SIGNIFICANCE'][i], df['DOCSUM'][i][j]))
        
        df = pd.DataFrame (data = variant_list, columns = ['SNP_ID', 'CLINICAL_SIGNIFICANCE', 'DOCSUM'])
        
        #Creating a column with variant position and reordering the dataframe
        df['Position'] = df['DOCSUM'].map (lambda x: int (x[3:-3]))
        df = df.rename ({'DOCSUM':'Variant',
                        'SNP_ID':'dbSNP_ID',
                        'CLINICAL_SIGNIFICANCE':'Clinical_significance'}, axis = 1)
        df = df.sort_values (by = 'Position')
        
        #Remove duplicated mutations
        df = df.drop_duplicates (subset = 'Variant').reset_index (drop=True)
        
        #Creating a column with one letter code for each variant
        dictionary = {'Ala':'A', 'Arg':'R', 'Asn':'N', 'Asp':'D', 'Cys':'C', 'Glu':'E', 'Gln':'Q',
                'Gly':'G', 'His':'H', 'Ile':'I', 'Leu':'L', 'Lys':'K', 'Met':'M', 'Phe':'F',
                'Pro':'P', 'Ser':'S', 'Thr':'T', 'Trp':'W', 'Tyr':'Y', 'Val':'V', 'Ter':'*'}
        df['One_letter_code'] = df['Variant']
        df['One_letter_code'] = df['One_letter_code'].replace (dictionary, regex = True)
        
        #Return a structured dataframe
        return df