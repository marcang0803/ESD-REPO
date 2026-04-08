from typing import Any

from sqlalchemy import desc, select
from sqlalchemy.exc import IntegrityError

from app.config import Config
from app.db import SessionLocal
from app.models import Wallet, WalletLedger

VALID_ENTRY_TYPES = {"DEBIT", "REFUND", "FORFEIT"}


def _serialize_wallet(wallet: Wallet) -> dict[str, Any]:
    return {
        "userId": wallet.user_id,
        "balance": wallet.balance,
        "createdAt": wallet.created_at.isoformat() if wallet.created_at else None,
        "updatedAt": wallet.updated_at.isoformat() if wallet.updated_at else None,
    }


def _serialize_ledger(entry: WalletLedger) -> dict[str, Any]:
    return {
        "id": entry.id,
        "transactionId": entry.transaction_id,
        "userId": entry.user_id,
        "type": entry.entry_type,
        "amount": entry.amount,
        "balanceBefore": entry.balance_before,
        "balanceAfter": entry.balance_after,
        "createdAt": entry.created_at.isoformat() if entry.created_at else None,
    }


def ensure_wallet_exists(user_id: int) -> None:
    session = SessionLocal()
    try:
        wallet = session.get(Wallet, user_id)
        if wallet is not None:
            return

        wallet = Wallet(
            user_id=user_id,
            balance=Config.INITIAL_CREDITS,
        )
        session.add(wallet)
        try:
            session.commit()
        except IntegrityError:
            session.rollback()
    finally:
        session.close()


def get_wallet_balance(user_id: int) -> dict[str, Any]:
    ensure_wallet_exists(user_id)

    session = SessionLocal()
    try:
        wallet = session.get(Wallet, user_id)
        return _serialize_wallet(wallet)
    finally:
        session.close()


def get_wallet_ledger(user_id: int, limit: int = 50, offset: int = 0) -> dict[str, Any]:
    ensure_wallet_exists(user_id)

    session = SessionLocal()
    try:
        entries = session.execute(
            select(WalletLedger)
            .where(WalletLedger.user_id == user_id)
            .order_by(desc(WalletLedger.created_at), desc(WalletLedger.id))
            .offset(offset)
            .limit(limit)
        ).scalars().all()

        wallet = session.get(Wallet, user_id)

        return {
            "userId": user_id,
            "balance": wallet.balance,
            "count": len(entries),
            "limit": limit,
            "offset": offset,
            "entries": [_serialize_ledger(entry) for entry in entries],
        }
    finally:
        session.close()


def apply_transaction(
    user_id: int,
    amount: int,
    transaction_id: str,
    entry_type: str,
) -> dict[str, Any]:
    if entry_type not in VALID_ENTRY_TYPES:
        raise ValueError(f"Unsupported entry type: {entry_type}")

    if amount <= 0:
        raise ValueError("Amount must be greater than 0")

    if not transaction_id or not transaction_id.strip():
        raise ValueError("transactionId is required")

    ensure_wallet_exists(user_id)

    session = SessionLocal()
    try:
        existing = session.execute(
            select(WalletLedger).where(WalletLedger.transaction_id == transaction_id)
        ).scalar_one_or_none()

        if existing is not None:
            wallet = session.get(Wallet, existing.user_id)
            return {
                "success": True,
                "status": "already_processed",
                "message": "transactionId already processed",
                "userId": existing.user_id,
                "balance": wallet.balance,
                "transactionId": existing.transaction_id,
                "type": existing.entry_type,
                "amount": existing.amount,
            }

        wallet = session.execute(
            select(Wallet)
            .where(Wallet.user_id == user_id)
            .with_for_update()
        ).scalar_one()

        balance_before = wallet.balance
        balance_after = wallet.balance

        if entry_type == "DEBIT":
            if wallet.balance < amount:
                session.rollback()
                return {
                    "success": False,
                    "status": "insufficient_balance",
                    "message": "Insufficient balance",
                    "userId": wallet.user_id,
                    "balance": wallet.balance,
                    "transactionId": transaction_id,
                    "type": entry_type,
                    "amount": amount,
                }
            wallet.balance -= amount
            balance_after = wallet.balance

        elif entry_type == "REFUND":
            wallet.balance += amount
            balance_after = wallet.balance

        elif entry_type == "FORFEIT":
            balance_after = wallet.balance

        ledger_entry = WalletLedger(
            transaction_id=transaction_id,
            user_id=user_id,
            entry_type=entry_type,
            amount=amount,
            balance_before=balance_before,
            balance_after=balance_after,
        )

        session.add(ledger_entry)

        try:
            session.commit()
        except IntegrityError:
            session.rollback()

            existing = session.execute(
                select(WalletLedger).where(WalletLedger.transaction_id == transaction_id)
            ).scalar_one_or_none()

            if existing is not None:
                wallet = session.get(Wallet, existing.user_id)
                return {
                    "success": True,
                    "status": "already_processed",
                    "message": "transactionId already processed",
                    "userId": existing.user_id,
                    "balance": wallet.balance,
                    "transactionId": existing.transaction_id,
                    "type": existing.entry_type,
                    "amount": existing.amount,
                }
            raise

        return {
            "success": True,
            "status": "processed",
            "message": "Transaction applied successfully",
            "userId": wallet.user_id,
            "balance": wallet.balance,
            "transactionId": transaction_id,
            "type": entry_type,
            "amount": amount,
        }
    finally:
        session.close()