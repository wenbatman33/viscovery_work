import randomsalt
import entities
import datetime
import hashlib
from datetime import datetime
from flask import Flask,jsonify,request,render_template,abort,g
from randomsalt import *
from entities import *
from sqlalchemy import desc
from sqlalchemy.orm import sessionmaker
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPTokenAuth

auth = HTTPTokenAuth(scheme='Token')

app = Flask(__name__, instance_relative_config=True)
def configure_app(app):
    app.config.from_object('config')
    app.config.from_pyfile("config.py", silent=True)
    return app
configure_app(app)

alchemy_db = SQLAlchemy(app)
# engine = create_engine(app.config["SQLALCHEMY_BINDS"], pool_recycle=280)
engine = alchemy_db.create_engine(app.config["SQLALCHEMY_DATABASE_URI"], pool_recycle=app.config["SQLALCHEMY_POOL_RECYCLE"])
Session = sessionmaker(bind=engine)
dbsession = Session()


@app.teardown_appcontext
def shutdown_session(exception=None):
    dbsession.close()

@app.route('/oldindex', methods=['GET'])
def index():
    origin = request.args.get('origin')
    is_extension=False
    if origin=='chrome':
        is_extension=True
    return render_template('index.html',is_extension=is_extension)

@app.route('/VideoPage/<vinfo>', methods=['GET'])
@app.route('/VideoPage', methods=['GET'])
@app.route('/VideoList', methods=['GET'])
@app.route('/LoadingPage', methods=['GET'])
@app.route('/', methods=['GET'])
def reactindex(vinfo=None):
    return render_template('reactindex.html')

@app.route('/login',methods=['GET'])
def login():
    origin = request.args.get('origin')
    is_extension=False
    if origin=='chrome':
        is_extension=True
    return render_template('login.html',is_extension=is_extension)

@app.route('/videosdktest',methods=['GET'])
def videosdktest():
    return render_template('videosdktest.html');

@app.route('/youtubesdktest',methods=['GET'])
def youtubesdktest():
    return render_template('youtubesdktest.html');

@app.route('/vimeosdktest',methods=['GET'])
def vimeosdktest():
    return render_template('vimeosdktest.html');

@auth.verify_token
def verify_token(token):
    # return True
    return randomsalt.is_valid_token(token)
    # if token =='testtoken':
    #     return True
    # return False

@auth.error_handler
def auth_error():
    abort(400)
    # return jsonify({'state':401})

@app.route('/u/mamagement', methods=['GET'])
def user_management():
    return render_template('mamagement.html')

@app.route('/u/success', methods=['GET'])
def user_extension_success():
    return ''

@app.route('/api/v1/token/extension', methods=['POST'])
def v1_get_token_extension():
    try:
        source_id = request.form['source_id']
        uid = request.form['uid']
        uids = getdecode_ids(uid)
        info = get_save_token_info(uids[0],source_id)
        if info:
            # todo remove old key
            info['isSuccess']=True
            info['msg']=''
            return jsonify(info)
    except Exception as e:
        error = str(e)
        return jsonify({'isSuccess':False,'msg':error})
    return jsonify({'isSuccess':False,'msg':'fail'})

@app.route('/api/v1/token', methods=['POST'])
def v1_get_token():
    try:
        #http://www.programcreek.com/python/example/51531/flask.request.headers
        header_token = request.headers['Authorization']
        token = get_bearer_token(header_token)
        uid = request.form['uid']
        refresh_token = request.form['refresh_token']
        uids = getdecode_ids(uid)
        source_id = request.form['source_id']
        if(refresh_token and source_id and token):
            expires_time = dbsession.query(RefreshTokenEntity.expires_time).filter(RefreshTokenEntity.id==refresh_token,RefreshTokenEntity.source_id==source_id,RefreshTokenEntity.token==token).scalar()
            if expires_time and getdate_time_utcnow() < expires_time:
                info = get_save_token_info(uids[0],source_id)
                if info:
                    # todo remove old key
                    info['isSuccess']=True
                    info['msg']=''
                    return jsonify(info)
        else:
            return jsonify({'isSuccess':False,'msg':'parameter not null'})
    except Exception as e:
        error = str(e)
        return jsonify({'isSuccess':False,'msg':error})
    return jsonify({'isSuccess':False,'msg':'fail'})

@app.route('/api/v1/video/<encodeuid>', methods=['GET'])
@auth.login_required
def v1_get_video(encodeuid):
    videos = []
    uid=''
    result={}
    try:
        ints=randomsalt.getdecode_ids(encodeuid)
        if ints:
            uid=ints[0]
            qry=dbsession.query(VideoInfoEntity.id,
                    VideoInfoEntity.website,
                    VideoInfoEntity.website_vid,
                    VideoInfoEntity.title,
                    VideoInfoEntity.imgurl,
                    VideoInfoEntity.url).join(UsersVideoinfoEntity) \
                    .filter(UsersVideoinfoEntity.uid== uid ,UsersVideoinfoEntity.is_valid==1) \
                    .order_by(desc(UsersVideoinfoEntity.create_time))
            
            videos = map(lambda d: d._asdict(), qry)
            result={'isSuccess':True,'msg':'OK','videos':videos}
        else:
            result={'isSuccess':False,'msg':'Not Found','videos':[]}
    except Exception as e:
        #errors.append(str(e))
        result={'isSuccess':False,'msg':'Server Error','videos':[]}
    return jsonify(result)

@app.route('/api/v1/video',methods=['POST','DELETE'])
@auth.login_required
def v1_video():
    errors = []
    if request.method == 'POST':
        try:
            #todo alidation value
            ints = randomsalt.getdecode_ids(request.form['uid'])
            uid = ints[0]
            website_vid = request.form['id']
            website = request.form['website'] #0=>fb 1=>youtube
            url    = request.form['url']
            title = request.form['title']
            imgurl = request.form['imgurl']
            video_info = dbsession.query(VideoInfoEntity).filter(VideoInfoEntity.website_vid==website_vid,VideoInfoEntity.website==website).first()
            result={'isSuccess':True,'msg':'Ok'}
            if(video_info==None):
                video_info = VideoInfoEntity(website_vid=website_vid,website=website,title=title,url=url,imgurl=imgurl)
                user = dbsession.query(UserEntity).filter(UserEntity.id ==uid).first()
                user.videoinfos.append(video_info)
                dbsession.commit()
            else:
                user = dbsession.query(UserEntity).filter(UserEntity.id ==uid).first()
                user_videoinfo=dbsession.query(UsersVideoinfoEntity).filter(UsersVideoinfoEntity.vid==video_info.id,UsersVideoinfoEntity.uid==uid).first()
                if(user_videoinfo and user_videoinfo.is_valid==1):
                    result={'isSuccess':False,'msg':'Exist'}
                elif(user_videoinfo):
                    user_videoinfo.is_valid=1
                    user_videoinfo.create_time=datetime.datetime.utcnow()
                    dbsession.commit()
                else:
                    user.videoinfos.append(video_info)
                    dbsession.commit()
        except Exception as e:
            dbsession.rollback()
            errors.append(str(e))
            result={'isSuccess':False,'msg':errors}
        return jsonify(result)
    else:
        result=[]
        try:
            vid = request.form['vid']
            ints = getdecode_ids(request.form['uid'])
            if ints:
                uid = ints[0]
                user_videoinfo=dbsession.query(UsersVideoinfoEntity).filter(UsersVideoinfoEntity.uid==uid,UsersVideoinfoEntity.vid==vid,UsersVideoinfoEntity.is_valid==1).first()
                if(user_videoinfo is not None):
                    user_videoinfo.is_valid='0'
                    dbsession.commit()
                    return jsonify({'isSuccess':True,'msg':'Ok'})
            result={'isSuccess':False,'msg':'No found or Parameter Not null'}
        except Exception as e:
            result={'isSuccess':False,'msg':'Server Error'}
        return jsonify(result)

@app.route('/api/v1/users')
@auth.login_required
def getusers():
    users = dbsession.query(UserEntity.id,UserEntity.create_time,UserEntity.email).order_by(desc(UserEntity.create_time)).all()
    result = map(lambda d: d._asdict(), users)
    return jsonify({'data': result})

@app.route('/api/v1/videos')
# @auth.login_required
def getvideos():
    videos = dbsession.query(VideoInfoEntity.id,
                VideoInfoEntity.website,
                VideoInfoEntity.website_vid,
                VideoInfoEntity.title,
                VideoInfoEntity.imgurl,
                VideoInfoEntity.url).order_by(desc(VideoInfoEntity.create_time))

    result = map(lambda d: d._asdict(), videos)
    return jsonify({'data': result})

#demo@viscovery.com/viscoverydemo
@app.route('/api/v1/login/<type>', methods=['POST'])
def v1_login(type):
    try:
        source_id = request.form['source_id']
        email = request.form['email']
        if(type=='fb'):
            id = request.form['id']
            birthday = request.form['birthday']
            thirdparty_info = "{id:'%s',email:'%s',birthday:'%s'}"%(id,email,birthday)
            # uid = dbsession.query(UserEntity.id).filter(UserEntity.email == email,UserEntity.thirdparty_info == thirdparty_info).scalar()
            uid = dbsession.query(UserEntity.id).filter(UserEntity.email == email).scalar()
            if uid:
                info = get_save_token_info(uid,source_id)
                if info:
                    info['isSuccess']=True
                    info['msg']=''
                    return jsonify(info)
            return jsonify({'isSuccess':False,'msg':'not found'})
        elif (type=='email'):
            try:
                password = request.form['password']
                userinfo = dbsession.query(UserEntity.id,UserEntity.password,UserEntity.password_salt).filter(UserEntity.email == email).first()
                if(userinfo==None):
                    return jsonify({'isSuccess':False,'msg':'Not found'})
                hash_password = randomsalt.gethash_password(password,userinfo.password_salt)
                if (hash_password==userinfo.password):
                    info = get_save_token_info(userinfo.id,source_id)
                    info['isSuccess']=True
                    info['msg']=''
                    return jsonify(info)
                else:
                    return jsonify({'isSuccess':False,'msg':'email or password error!'})
            except Exception as e:
                return jsonify({'isSuccess':False,'msg':str(e)})
        else:
            return jsonify({'isSuccess':False,'msg':'not implement'})
    except Exception as e:
        return jsonify({'isSuccess':False,'msg':str(e)})

@app.route('/api/v1/enroll/<type>', methods=['POST'])
def v1_enroll_type(type):
    if(type=='fb'):
        try:
            id = request.form['id']
            email = request.form['email']
            birthday = request.form['birthday']
            source_id = request.form['source_id']
            uid = dbsession.query(UserEntity.id).filter(UserEntity.email == email).scalar()
            msg=''
            if uid:
                return jsonify({'isSuccess':False,'msg':'exist'})
            else:
                thirdparty_info = "{id:'%s',email:'%s',birthday:'%s'}"%(id,email,birthday)
                birthday_date= str(datetime.datetime.strptime(birthday, '%m/%d/%Y').date())
                edit_time = str(datetime.datetime.now())
                user_entity=UserEntity(email=email,type='0',birthday=birthday_date,thirdparty_info=thirdparty_info,edit_time=edit_time)
                dbsession.add(user_entity)
                dbsession.commit()
                msg='enroll'
                uid=user_entity.id
                info = get_save_token_info(uid,source_id)
                if info:
                    info['isSuccess']=True
                    info['msg']=msg
                    return jsonify(info)
        except Exception as e:
            dbsession.rollback()
            return jsonify({'isSuccess':False,'msg':str(e)})
    else:
        return jsonify({'isSuccess':False,'msg':'not implement'})

@app.route('/api/v1/enroll', methods=['POST'])
def v1_enroll():
    try:
        source_id = request.form['source_id']
        id = request.form['id']
        email = request.form['email']
        birthday = request.form['birthday']
        uid = dbsession.query(UserEntity.id).filter(UserEntity.email == email).scalar()
        msg=''
        if uid:
            msg='exist'
        else:
            thirdparty_info = "{id:'%s',email:'%s',birthday:'%s'}"%(id,email,birthday)
            birthday_date= str(datetime.datetime.strptime(birthday, '%m/%d/%Y').date())
            edit_time = str(datetime.datetime.now())
            user_entity=UserEntity(email=email,type='0',birthday=birthday_date,thirdparty_info=thirdparty_info,edit_time=edit_time)
            dbsession.add(user_entity)
            dbsession.commit()
            msg='enroll'
            uid=user_entity.id
        info = get_save_token_info(uid,source_id)
        if info:
            info['isSuccess']=True
            info['msg']=msg
            return jsonify(info)
        return jsonify({'isSuccess':False,'msg':'Fail'})
    except Exception as e:
        dbsession.rollback()
        return jsonify({'isSuccess':False,'msg':str(e)})

@app.route('/youtube/<id>')
def youtubeVideo(id):
    return '<iframe width="480" height="270" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>'

def get_save_token_info(uid,source_id):
    refresh_token_life_time = dbsession.query(OAuthEntity.refresh_token_life_time).filter(OAuthEntity.source_id == source_id).scalar()
    if refresh_token_life_time:
        refresh_token_life_time_int = int(refresh_token_life_time)
        issued_time = getdate_time_utcnow()
        expires_time = adddate_time_seconds(issued_time,refresh_token_life_time_int)
        info = gettoken_info_expires(uid,refresh_token_life_time_int)
        entity=RefreshTokenEntity(id=info['refresh_token'],source_id=source_id,issued_time=issued_time,expires_time=expires_time,token=info['token'])
        dbsession.add(entity)
        dbsession.commit()
        return info
    return None

# local run 
# if __name__ == "__main__":
#     app.run()