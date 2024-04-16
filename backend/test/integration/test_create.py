import pytest
import unittest.mock as mock
from unittest.mock import patch
from  src.util.dao import DAO

@pytest.fixture
@patch('src.util.dao.dotenv_values', autospec=True)
@patch('src.util.dao.getValidator', autospec=True)
def sut():
    mockeddao = mock.MagicMock()
    return mockeddao