import re

class StringDoctor:

    @staticmethod
    def treat_workspace_name(name: str) -> str:
        # Remove Special Chars
        name = re.sub(r"[@!#$%¨&*()_+´`[{^~}\]\[\.\/\\áéíóúãõç-]", "", name)
        name = name.strip()
        name = name.upper()
        # Replace White Spaces with -
        name = re.sub(r"\s", "-", name)
        # Replace lots of - chars to just one
        name_treated = re.sub(r"[-]+", "-", name)
        return name_treated