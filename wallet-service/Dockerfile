FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# grpcio needs gcc to compile
RUN apt-get update && apt-get install -y gcc python3-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN python -m grpc_tools.protoc -I./proto --python_out=. --grpc_python_out=. ./proto/wallet.proto

EXPOSE 5000
EXPOSE 50051

CMD ["python", "run.py"]