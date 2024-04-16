import pytest
import unittest.mock as mock
from  src.controllers.usercontroller import UserController

@pytest.fixture
def sut(user):
    mockeddao = mock.MagicMock()
    mockeddao.find.return_value = (user)
    mockedsut = UserController(dao=mockeddao)
    return mockedsut

#@pytest.mark.unit
#@pytest.mark.parametrize('mail, user, outcome', [("jane.doe@gmail.com", None, None), ("jane.doe@gmail.com", ["User1"], "User1"), ("jane.doe@gmail.com", ["User1", "User2"], "User1")])
#def test_get_user_by_email(sut, mail, back, outcome):
#    getuser = sut.get_user_by_email(email=mail)
#    assert getuser == outcome 

@pytest.mark.unit
@pytest.mark.parametrize('mail, user, outcome', [("jane.doe@gmail.com", [None], None), ("jane.doe@gmail.com", ["User1"], "User1"), ("jane.doe@gmail.com", ["User1", "User2"], "User1")])
def test_get_user_by_email(sut, mail, outcome):
    getuser = sut.get_user_by_email(mail)
    assert getuser == outcome 

@pytest.mark.unit
@pytest.mark.parametrize('mail, user, outcome', [("jane.doe.com", [None], None), ("jane.doe.com", ["User1"], "User1"), ("jane.doe.com", ["User1", "User2"], "User1")])
def test_get_user_by_email_invalid(sut, mail, user, outcome):
    mockeddao = mock.MagicMock()
    mockeddao.find.return_value = (user)
    mockedsut = UserController(dao=mockeddao)
    with pytest.raises(ValueError):
        sut.get_user_by_email(mail)