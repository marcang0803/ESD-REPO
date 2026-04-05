FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc python3-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefer-binary -r requirements.txt

COPY . .

RUN python -m grpc_tools.protoc -I./proto --python_out=./app/services --grpc_python_out=./app/services ./proto/wallet.proto

RUN sed -i 's/import wallet_pb2 as wallet__pb2/from app.services import wallet_pb2 as wallet__pb2/' ./app/services/wallet_pb2_grpc.py

EXPOSE 5003

CMD ["python", "run.py"]