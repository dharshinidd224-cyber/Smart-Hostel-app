import base64
import numpy as np
import cv2

from models.detector import FaceDetector
from config import SIMILARITY_THRESHOLD


class VerificationService:
    """
    Verification Service

    Receives one face image and a list of registered embeddings (from DB).
    Returns whether the live face matches any of the stored embeddings.
    """

    def __init__(self):
        self.model = FaceDetector.get_model()
        self.threshold = SIMILARITY_THRESHOLD

    def _decode_image(self, base64_string):
        try:
            if "," in base64_string:
                base64_string = base64_string.split(",")[1]
            image_bytes = base64.b64decode(base64_string)
            np_arr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            return image
        except Exception:
            return None

    def _cosine_similarity(self, a, b):
        a = np.array(a, dtype=np.float32)
        b = np.array(b, dtype=np.float32)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))

    def verify(self, image_base64, stored_embeddings):
        """
        image_base64     – base64 data URL of the live captured frame
        stored_embeddings – list of 512-dim float arrays from face_embeddings table
        """

        if not image_base64:
            return {"success": False, "message": "No image provided."}

        if not stored_embeddings or len(stored_embeddings) == 0:
            return {"success": False, "message": "No stored embeddings found for this student."}

        # ── Decode image ──────────────────────────────────────────────────────
        image = self._decode_image(image_base64)
        if image is None:
            return {"success": False, "message": "Invalid image data."}

        # ── Detect face in live image ─────────────────────────────────────────
        faces = self.model.get(image)
        if len(faces) == 0:
            return {"success": False, "message": "No face detected in the captured image."}
        if len(faces) > 1:
            return {"success": False, "message": "Multiple faces detected. Please ensure only your face is visible."}

        live_embedding = faces[0].embedding.astype(np.float32)

        # ── Compare against every stored embedding ────────────────────────────
        best_score = 0.0
        for stored in stored_embeddings:
            score = self._cosine_similarity(live_embedding, stored)
            if score > best_score:
                best_score = score

        matched = best_score >= self.threshold

        print("\n===== FACE VERIFICATION =====")
        print(f"Best similarity score : {best_score:.4f}")
        print(f"Threshold             : {self.threshold}")
        print(f"Result                : {'MATCH' if matched else 'NO MATCH'}")
        print("==============================\n")

        return {
            "success": matched,
            "score": round(best_score, 4),
            "threshold": self.threshold,
            "message": (
                "Face verified successfully." if matched
                else f"Face does not match. Score: {best_score:.2f}, required: {self.threshold}"
            )
        }
