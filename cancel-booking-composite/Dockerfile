FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python -m grpc_tools.protoc -I./proto --python_out=./app/services --grpc_python_out=./app/services ./proto/wallet.proto

EXPOSE 5004

CMD ["python", "run.py"]
