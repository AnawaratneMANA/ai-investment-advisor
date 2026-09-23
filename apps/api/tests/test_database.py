from sqlalchemy import create_engine, text


def test_test_database_strategy_uses_sqlite() -> None:
    engine = create_engine("sqlite:///:memory:")

    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

    assert result.scalar_one() == 1

