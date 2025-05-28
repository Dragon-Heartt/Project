from flask import Blueprint, request, jsonify
import json
from flask import current_app as app
from app.models.user import User
from app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({'error': '이미 가입된 이메일입니다.'}), 400

    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return app.response_class(
        response=json.dumps({'message': '회원가입 성공'}, ensure_ascii=False),
        status=201,
        mimetype='application/json'
    )

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email, password=password).first()
    if user:
        return jsonify({'message': '로그인 성공'}), 200
    else:
        return jsonify({'error': '로그인 실패'}), 401