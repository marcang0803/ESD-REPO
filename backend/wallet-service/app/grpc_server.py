from concurrent import futures

import grpc

from app.config import Config
from app.service import apply_transaction, get_wallet_balance
import wallet_pb2
import wallet_pb2_grpc


class WalletServiceServicer(wallet_pb2_grpc.WalletServiceServicer):
    def GetBalance(self, request, context):
        try:
            result = get_wallet_balance(request.user_id)
            return wallet_pb2.BalanceResponse(
                success=True,
                status="ok",
                message="Balance retrieved successfully",
                user_id=result["userId"],
                balance=result["balance"],
            )
        except Exception as exc:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(exc))
            return wallet_pb2.BalanceResponse(
                success=False,
                status="error",
                message=str(exc),
                user_id=request.user_id,
                balance=0,
            )

    def DebitCredits(self, request, context):
        return self._handle_mutation(request, context, "DEBIT")

    def RefundCredits(self, request, context):
        return self._handle_mutation(request, context, "REFUND")

    def ForfeitCredits(self, request, context):
        return self._handle_mutation(request, context, "FORFEIT")

    def _handle_mutation(self, request, context, entry_type: str):
        try:
            result = apply_transaction(
                user_id=request.user_id,
                amount=request.amount,
                transaction_id=request.transaction_id,
                entry_type=entry_type,
            )

            return wallet_pb2.WalletMutationResponse(
                success=result["success"],
                status=result["status"],
                message=result["message"],
                user_id=result["userId"],
                balance=result["balance"],
                transaction_id=result["transactionId"],
                entry_type=result["type"],
                amount=result["amount"],
            )

        except ValueError as exc:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details(str(exc))
            return wallet_pb2.WalletMutationResponse(
                success=False,
                status="invalid_argument",
                message=str(exc),
                user_id=request.user_id,
                balance=0,
                transaction_id=request.transaction_id,
                entry_type=entry_type,
                amount=request.amount,
            )

        except Exception as exc:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(exc))
            return wallet_pb2.WalletMutationResponse(
                success=False,
                status="error",
                message=str(exc),
                user_id=request.user_id,
                balance=0,
                transaction_id=request.transaction_id,
                entry_type=entry_type,
                amount=request.amount,
            )


def serve_grpc() -> None:
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    wallet_pb2_grpc.add_WalletServiceServicer_to_server(
        WalletServiceServicer(),
        server,
    )
    server.add_insecure_port(f"[::]:{Config.GRPC_PORT}")
    server.start()
    print(f"gRPC server running on port {Config.GRPC_PORT}")
    server.wait_for_termination()