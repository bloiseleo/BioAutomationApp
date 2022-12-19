import os, json

class FileHandler:

    @staticmethod
    def create_folder(path: str):
        if not os.path.isdir(path):
            os.mkdir(path)
    @staticmethod
    def folder_exists_in(path: str, wanted: str):
        folders = os.listdir(path)
        return wanted in folders
    @staticmethod
    def save_file_in(path: str, content: dict) -> None:
        with open(path, "w") as file:
            file.write(json.dumps(content))
    @staticmethod
    def file_exists(path: str) -> bool:
        return os.path.isfile(path)
    @staticmethod
    def read_file_contents(path: str) -> dict:
        with open(path, 'r') as file:
            content = file.read()
            data = json.loads(content)
            return data