import pytest
import unittest.mock as mock
from unittest.mock import patch
from  src.util.dao import DAO

@pytest.fixture
def sut():
    with patch('src.util.dao.getValidator', autospec=True) as mockedgetValidator:
        mockedgetValidator.return_value = {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["description"],
                "properties": {
                    "description": {
                        "bsonType": "string",
                        "description": "the description of a todo must be determined",
                        "uniqueItems": True
                    }, 
                    "done": {
                        "bsonType": "bool"
                    }
                }
            } 
        }
        #mockeddao = mock.MagicMock()
        mockedsut = DAO("Test")

        yield mockedsut
        mockedsut.drop()
        return mockedsut

@pytest.mark.integration
@pytest.mark.parametrize('data, result', [({'description':'values', 'done': True}, {'description':'values', 'done': True})])
def test_create(sut, data, result):
    createData = sut.create(data)
    assert '_id' in createData
    assert createData == result

{'description': 1, 'done': True}
{'done': True}
{'description': 'test', 'done': True}, {'description': 'test', 'done': True}
@pytest.mark.integration
@pytest.mark.parametrize('data', [({'description': 'test', 'done': True}), ({'done': True}), ({'description': True, 'done': True})])
def test_create_2(sut, data):
    with pytest.raises(Exception):
        sut.create({'description': 'test', 'done': True})
        sut.create(data)