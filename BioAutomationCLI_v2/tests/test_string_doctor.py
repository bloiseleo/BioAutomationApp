import pytest
from src.helpers.StringDoctor import StringDoctor

@pytest.mark.parametrize(
    "name, result",
    [
        (" TDP 43", "TDP-43"),
        ("tdp43", "TDP43"),
        ("   tdp    43 ./&", "TDP-43"),
        ("tdp  43 --- proteína", "TDP-43-PROTENA"),
        ("tdp43-", "TDP43"),
        ("tdp43            /ç", "TDP43")
    ]

)
def test_validation_name_workspace(name: str, result: str): 
    name_treated = StringDoctor.treat_workspace_name(name)
    assert name_treated == result