from fastapi import FastAPI, HTTPException, Header, UploadFile
from pydantic import BaseModel
from typing import List
import hashlib, time, uuid, asyncio

app = FastAPI(title="Dropbox-like Storage API")

# ── Сховища даних (in-memory) ──────────────────
block_store: dict[str, bytes] = {}
metadata_db: dict[str, dict] = {}
auth_tokens: dict[str, str] = {"token_anna": "user_42"}
event_queue: asyncio.Queue = asyncio.Queue()

# ── Pydantic-схеми ────────────────────────────
class ChunkInfo(BaseModel):
    chunk_hash: str
    chunk_index: int

class FileUploadRequest(BaseModel):
    filename: str
    chunks: List[ChunkInfo]

class FileMetadata(BaseModel):
    file_id: str
    filename: str
    owner_id: str
    revision: int
    size_bytes: int
    chunk_hashes: List[str]
    created_at: float

# ── Автентифікація ────────────────────────────
def get_current_user(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Невірний формат токена")

    token = authorization.split(" ")[1]
    user_id = auth_tokens.get(token)

    if not user_id:
        raise HTTPException(401, "Токен недійсний або прострочений")

    return user_id

# ── Upload chunk (дедуплікація через SHA-256) ─
@app.post("/api/v1/chunks/{chunk_hash}")
async def upload_chunk(
    chunk_hash: str,
    file: UploadFile,
    authorization: str = Header(...),
):
    user_id = get_current_user(authorization)
    data = await file.read()

    if hashlib.sha256(data).hexdigest() != chunk_hash:
        raise HTTPException(400, f"Хеш не збігається: {chunk_hash[:12]}…")

    if chunk_hash in block_store:
        return {"status": "deduplicated", "chunk_hash": chunk_hash}

    block_store[chunk_hash] = data

    await event_queue.put({
        "event": "chunk.uploaded",
        "chunk_hash": chunk_hash,
        "size": len(data),
        "user_id": user_id
    })

    return {
        "status": "stored",
        "chunk_hash": chunk_hash,
        "size": len(data)
    }

# ── Upload file (метадані окремо від даних) ───
@app.post("/api/v1/files", response_model=FileMetadata)
async def upload_file(
    request: FileUploadRequest,
    authorization: str = Header(...),
):
    user_id = get_current_user(authorization)

    missing = [
        c.chunk_hash
        for c in request.chunks
        if c.chunk_hash not in block_store
    ]

    if missing:
        raise HTTPException(400, f"Відсутні блоки: {missing}")

    file_id = str(uuid.uuid4())
    chunk_hashes = [
        c.chunk_hash
        for c in sorted(request.chunks, key=lambda x: x.chunk_index)
    ]
    total_size = sum(len(block_store[h]) for h in chunk_hashes)
    revision = sum(
        1 for v in metadata_db.values()
        if v["owner_id"] == user_id
    )

    meta = {
        "file_id": file_id,
        "filename": request.filename,
        "owner_id": user_id,
        "revision": revision,
        "size_bytes": total_size,
        "chunk_hashes": chunk_hashes,
        "created_at": time.time(),
    }

    metadata_db[file_id] = meta

    await event_queue.put({
        "event": "file.uploaded",
        "file_id": file_id,
        "user_id": user_id,
        "filename": request.filename,
        "revision": revision
    })

    return FileMetadata(**meta)

# ── Download chunk ────────────────────────────
@app.get("/api/v1/chunks/{chunk_hash}")
async def download_chunk(
    chunk_hash: str,
    authorization: str = Header(...)
):
    get_current_user(authorization)

    if chunk_hash not in block_store:
        raise HTTPException(404, "Блок не знайдено")

    data = block_store[chunk_hash]

    return {
        "chunk_hash": chunk_hash,
        "size": len(data),
        "data_preview": data[:32].hex() + "…"
    }

# ── Get file metadata ─────────────────────────
@app.get("/api/v1/files")
async def list_files(
    since_revision: int = 0,
    authorization: str = Header(...)
):
    user_id = get_current_user(authorization)

    files = [
        v for v in metadata_db.values()
        if v["owner_id"] == user_id
        and v["revision"] >= since_revision
    ]

    return {
        "user_id": user_id,
        "since_revision": since_revision,
        "count": len(files),
        "files": files
    }

@app.get("/api/v1/files/{file_id}", response_model=FileMetadata)
async def get_file(
    file_id: str,
    authorization: str = Header(...)
):
    user_id = get_current_user(authorization)
    meta = metadata_db.get(file_id)

    if not meta:
        raise HTTPException(404, "Файл не знайдено")

    if meta["owner_id"] != user_id:
        raise HTTPException(403, "Доступ заборонено")

    return FileMetadata(**meta)

# ── Event worker (Kafka-подібна черга) ────────
async def event_worker():
    handlers = {
        "chunk.uploaded":
            lambda e: print(f"[DEDUP] {e['chunk_hash'][:12]}…"),
        "file.uploaded":
            lambda e: print(f"[NOTIF] {e['filename']} v{e['revision']}"),
    }

    while True:
        event = await event_queue.get()

        if h := handlers.get(event["event"]):
            h(event)

        event_queue.task_done()

@app.on_event("startup")
async def startup():
    asyncio.create_task(event_worker())

# ЗАПУСК: uvicorn server:app --reload
# DOCS:   http://localhost:8000/docs

'''
Запити до ШІ (модель Claude Sonnet 4.6):
− напишіть демонстраційний FastAPI-сервер, що імітує архітектуру
Dropbox: block storage з дедуплікацією через SHA-256, метадані окремо
від даних, Bearer-автентифікація, event queue замість Kafka. In-memory
сховища.
− додайте ендпоінти: upload chunk, upload file, download chunk, list files,
get file by id. Використай Pydantic-схеми для запитів і відповідей.
− скоротіть код – прибери rollback, stats, всі великі коментарі-рамки та
докстрінги. Залиш тільки ядро архітектури.
'''