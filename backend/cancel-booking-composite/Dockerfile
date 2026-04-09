FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python -m grpc_tools.protoc -I./proto --python_out=./app/services --grpc_python_out=./app/services ./proto/wallet.proto && \
    sed -i 's/import wallet_pb2/from app.services import wallet_pb2/' \
    ./app/services/wallet_pb2_grpc.py

EXPOSE 5004

CMD ["python", "run.py"]
