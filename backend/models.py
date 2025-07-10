from extensions import db
import enum
from datetime import datetime


class Gender(enum.Enum):
    male = 'Male'
    female = 'Female'
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    gender = db.Column(db.Enum(Gender), default=Gender.male)
    email = db.Column(db.String(100), nullable = False)
    is_admin = db.Column(db.Boolean, default= False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    posts = db.relationship('Post',backref='author',lazy='select')


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300), nullable=False)
    text = db.Column(db.Text ,nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable =False )

