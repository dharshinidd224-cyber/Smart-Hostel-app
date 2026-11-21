from flask import Flask, request, jsonify
from services.registration_service import RegistrationService
from services.verification_service import VerificationService

app = Flask(__name__)

registration_service = RegistrationService()
verification_service = VerificationService()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "success": True,
        "message": "Face Recognition Service Running"
    })


@app.route("/register-face", methods=["POST"])
def register_face():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No request body received."
            }), 400

        samples = data.get("samples")

        if not samples:
            return jsonify({
                "success": False,
                "message": "No face samples received."
            }), 400

        result = registration_service.generate_embeddings(samples)

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/verify-face", methods=["POST"])
def verify_face():
    """
    Verify a live face image against stored embeddings.

    Expected JSON body:
    {
        "image": "<base64 data URL of the captured frame>",
        "embeddings": [[...512 floats...], [...], ...]   // from face_embeddings table
    }
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "No request body received."}), 400

        image = data.get("image")
        embeddings = data.get("embeddings")

        if not image:
            return jsonify({"success": False, "message": "No image provided."}), 400

        if not embeddings:
            return jsonify({"success": False, "message": "No embeddings provided."}), 400

        result = verification_service.verify(image, embeddings)
        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5001,
        debug=False,
        use_reloader=False
    )