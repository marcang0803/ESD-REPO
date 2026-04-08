import grpc

from app.config import Config
from app.services import wallet_pb2, wallet_pb2_grpc


def _get_wallet_stub():
    target = f"{Config.WALLET_GRPC_HOST}:{Config.WALLET_GRPC_PORT}"
    channel = grpc.insecure_channel(target)
    stub = wallet_pb2_grpc.WalletServiceStub(channel)
    return channel, stub


def debit_credits(user_id, amount, transaction_id):
    channel, stub = _get_wallet_stub()
    try:
        request = wallet_pb2.WalletMutationRequest(
            user_id=user_id,
            amount=amount,
            transaction_id=transaction_id
        )

        response = stub.DebitCredits(request, timeout=10)

        return {
            "success": response.success,
            "status": response.status,
            "message": response.message,
            "user_id": response.user_id,
            "balance": response.balance,
            "transaction_id": response.transaction_id,
            "entry_type": response.entry_type,
            "amount": response.amount
        }
    finally:
        channel.close()


def refund_credits(user_id, amount, transaction_id):
    channel, stub = _get_wallet_stub()
    try:
        request = wallet_pb2.WalletMutationRequest(
            user_id=user_id,
            amount=amount,
            transaction_id=transaction_id
        )

        response = stub.RefundCredits(request, timeout=10)

        return {
            "success": response.success,
            "status": response.status,
            "message": response.message,
            "user_id": response.user_id,
            "balance": response.balance,
            "transaction_id": response.transaction_id,
            "entry_type": response.entry_type,
            "amount": response.amount
        }
    finally:
        channel.close()