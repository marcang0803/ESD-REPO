from sqlalchemy import BigInteger, Column, DateTime, Integer, String, func, Index

from app.db import Base


class Wallet(Base):
    __tablename__ = "wallets"

    user_id = Column(BigInteger, primary_key=True)
    balance = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


class WalletLedger(Base):
    __tablename__ = "wallet_ledger"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    transaction_id = Column(String(100), nullable=False, unique=True, index=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    entry_type = Column(String(20), nullable=False)  # DEBIT / REFUND / FORFEIT
    amount = Column(Integer, nullable=False)
    balance_before = Column(Integer, nullable=False)
    balance_after = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    __table_args__ = (
        Index("ix_wallet_ledger_user_created", "user_id", "created_at"),
    )