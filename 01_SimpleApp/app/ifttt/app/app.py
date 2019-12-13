from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'crud.sqlite')
db = SQLAlchemy(app)
ma = Marshmallow(app)


class User(db.Model):
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)
    phone = db.Column(db.String(20), unique=True, primary_key=True)
    points = db.Column(db.Integer, unique=False)
    lag = db.Column(db.Integer, unique=False)
    lng = db.Column(db.Integer, unique=False)
    pass1 = db.Column(db.String(20), unique=False)
    pass2 = db.Column(db.String(20), unique=False)
    pass3 = db.Column(db.String(20), unique=False)
    pass4 = db.Column(db.String(20), unique=False)
    pass5 = db.Column(db.String(20), unique=False)
    #pass6 = db.Column(db.String(20), unique=False)


    def __init__(self, username, email, phone, points, lag, lng, pass1, pass2,pass3,pass4,pass5):
        self.username = username
        self.email = email
        self.phone = phone
        self.points = points
        self.lag = lag
        self.lng =lng
        self.pass1 = pass1
        self.pass2 = pass2
        self.pass3 = pass3
        self.pass3 = pass4
        self.pass3 = pass5



class UserSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('username', 'email', 'phone', 'points', 'lag', 'lng', 'pass1', 'pass2', 'pass3','pass4','pass5')


user_schema = UserSchema()
users_schema = UserSchema(many=True)


# endpoint to create new user
@app.route("/user", methods=["POST"])
def add_user():
    username = request.json['username']
    email = request.json['email']

    new_user = User(username, email)

    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user)


# endpoint to show all users
@app.route("/user", methods=["GET"])
def get_user():
    all_users = User.query.all()
    result = users_schema.dump(all_users)
    return jsonify(result.data)


# endpoint to get user detail by id
@app.route("/user/<id>", methods=["GET"])
def user_detail(id):
    user = User.query.get(id)
    return user_schema.jsonify(user)


# endpoint to update user
@app.route("/user/<id>", methods=["PUT"])
def user_update(id):
    user = User.query.get(id)
    username = request.json['username']
    email = request.json['email']

    user.email = email
    user.username = username

    db.session.commit()
    return user_schema.jsonify(user)


# endpoint to delete user
@app.route("/user/<id>", methods=["DELETE"])
def user_delete(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()

    return user_schema.jsonify(user)


if __name__ == '__main__':
    app.run(debug=True)