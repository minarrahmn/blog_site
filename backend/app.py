from flask import Flask, request, jsonify
from flask_cors import CORS
from models import User, Gender, Post
from extensions import db, bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from datetime import timedelta


app = Flask(__name__)

#Configuring database
BASE_DIR = os.path.abspath(os.path.dirname(__file__)) # defining directiory
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR) + 'blog.db' #decalring the database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # turning unnecessary slowdowns off
app.config['JWT_SECRET_KEY'] = 'randomisedkeygeneratedbymymind'  #secret jwt key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

#initializing the extenstions
db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)

# creating the database table

with app.app_context():
    db.create_all()


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json

    # getting data from the user
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    gender= data.get('gender', 'male')
    is_admin = data.get('is_admin', False)

    # checking if the required fields are filled or not
    if not username or not email or not password:
        return jsonify({"error":"Username, email, password are required."}), 400
    
    #checking if the username already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error":"Username already exists."}), 400
    
    #checking if the email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400
    

    #checking if valid gender is added

    if gender not in Gender.__members__:
        return jsonify({"Error":"Unrecognized gender given"}), 400
    gender_enum = Gender[gender]

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        username=username,
        email = email,
        name = name,
        password = hashed_pw,
        gender = gender_enum,
        is_admin = is_admin
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": "New user created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json

    # getting the login credentials 
    email = data.get('email')
    password = data.get('password')

    #checking if the required fields are filled or not 
    if not email or not password:
        return jsonify({"error":"cannot leave email or password empty"}), 400
    #finding the user by email
    user = User.query.filter_by(email=email).first()

    #validating the user
    if user is None or not (bcrypt.check_password_hash(user.password, password)):
        return jsonify({"Error":"Invalid credentials"}), 401
    
    # returning access token for the validated user
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "message":"Login Successful",
        "Token":access_token,
        "name": user.username
        }), 200


@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    #finding the user id from the token
    user_id = int(get_jwt_identity())

    #finding the user from the id
    user = User.query.get(user_id)

    #returning error if user not found
    if not user:
        return jsonify({"error":"user not found"})
    # returning the proifle if user found
    return jsonify(
        {
            "id":user.id,
            "name": user.name,
            "email": user.email,
            "gender": user.gender.value if user.gender else None
        }
    ), 200

#Making CRUD operations
#Creating posts
@app.route('/api/posts', methods=['POST'])
@jwt_required()
def create_post():

    #getting user id from the jwt token
    user_id = int(get_jwt_identity())

    #getting data from the user
    data = request.json

    title = data.get('title')
    text = data.get('text')

    #validating if all the fields are filled or not
    if not title or not text:
        return jsonify({"error":"cannot leave title or text empty"}), 400
    
    #saving the validated post to the db
    new_post = Post(
        title = title,
        text=text,
        author_id = user_id
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify({"message":"your post was posted successfully",
                    "title": title,
                    "text":text
                    }), 201

#listing all posts by creation time
@app.route('/api/posts', methods=['GET'])
def get_all_posts():
    #getting a ll the posts by their posting time in descending order

    posts = Post.query.order_by(Post.created_at.desc()).all()

    #looping through the posts and separting them
    post_list = []

    for post in posts:
        post_list.append(
            {
                "id":post.id,
                "title":post.title,
                "text": post.text,
                "created_at": post.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "author":{
                    "id": post.author.id,
                    "username": post.author.username,
                    "name": post.author.name
                }
            }
        )
    return jsonify({"posts":post_list}), 200

@app.route('/api/posts/<int:id>', methods=['GET'])
def get_single_post(id):
    #getting post by given id
    post = Post.query.get(id)

    #checking if the post exists or not
    if not post:
        return jsonify({"error":"post not found"}), 404
    
    # serializing the found post 
    post_data = {
        
                "id":post.id,
                "title":post.title,
                "text": post.text,
                "created_at": post.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "author":{
                    "id": post.author.id,
                    "username": post.author.username,
                    "name": post.author.name
                }
    }
    return jsonify({"post": post_data}), 200

#creating a update api
@app.route('/api/posts/<int:id>', methods=['PUT'])
@jwt_required()
def update_post(id):
    #getting user id from the jwt token
    user_id = int(get_jwt_identity())

    #getting post by id
    post = Post.query.get(id)

    if not post:
        return jsonify({"error":"post not found"}), 404
    if post.author.id != user_id:
        return jsonify({"error": "You are not allowed to edit this post"}), 403
    data = request.json

    #getting the updated data
    title = data.get('title')
    text = data.get('text')

    if not title and not text:
        return jsonify({"error":"cannot leave title or text empty"}), 400
    #updating the post in the db
    post.title = title or post.title
    post.text = text or post.text
    # commtiting the update
    db.session.commit()
    return jsonify({"message":"your post has been updated"}), 200

#creating a delete api
@app.route('/api/posts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_post(id):
    #getting user id from the jwt token 
    user_id = int(get_jwt_identity())

    #getting the post by id
    post = Post.query.get(id)

    #verifying if the post exists
    if not post:
        return jsonify({"error":"post was not found"}), 404

    #verifying the author and user are same person
    if post.author.id != user_id:
        return jsonify({"error":"you are not allowed to delete this post"}), 403

    #deleting the post from database
    db.session.delete(id)
    db.session.commit()
    return jsonify({"message":"your post has been deleted."})

if __name__== '__main__':
    app.run(debug=True)





    