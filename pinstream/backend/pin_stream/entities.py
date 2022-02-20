import datetime
from sqlalchemy import Column, ForeignKey,Table #, func
# http://docs.sqlalchemy.org/en/latest/dialects/mysql.html#mysql-data-types
from sqlalchemy.dialects.mysql import INTEGER, VARCHAR, CHAR,DATETIME ,DATE, TINYINT
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class OAuthEntity(Base):
    __tablename__ = 'oauth'
    id = Column("oid", INTEGER, primary_key=True, nullable=False, autoincrement=True)
    source_id= Column("source_id", VARCHAR(32),nullable=False)
    refresh_token_life_time= Column("refresh_token_life_time", VARCHAR(10),nullable=False)
    description= Column("description", VARCHAR(20),nullable=False)

class RefreshTokenEntity(Base):
    __tablename__ = 'refresh_tokens'
    id = Column("rid", VARCHAR(16), primary_key=True, nullable=False)
    source_id= Column("source_id", VARCHAR(32),nullable=False)
    issued_time= Column("issued_time", DATETIME,nullable=False)
    expires_time= Column("expires_time", DATETIME,nullable=False)
    token= Column("token", VARCHAR(32),nullable=False)

# http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html#association-object
class UsersVideoinfoEntity(Base):
    __tablename__ = 'users_videoinfo'
    vid = Column(INTEGER, ForeignKey('videoinfo.vid'), primary_key=True)
    uid = Column(INTEGER, ForeignKey('users.uid'), primary_key=True)
    is_valid = Column("is_valid",TINYINT(1), nullable=False,default='1')
    create_time= Column("create_time",DATETIME,default=datetime.datetime.utcnow)
    create_user= Column("create_user",VARCHAR(10),default='pinstream')
    lastview_time= Column("lastview_time",DATETIME)
    # users = relationship("UserEntity", back_populates="videoinfos")
    # videoinfo = relationship("VideoInfoEntity", back_populates="users")
    users = relationship("UserEntity", backref="videoinfo_associations")
    videoinfo = relationship("VideoInfoEntity", backref="user_associations")
    # def __repr__(self):
    #     return "<UsersVideoinfoEntity(vid='%s', uid='%s' , is_valid='%s', lastview_time='%s')>" % \
    #              (self.vid, self.uid,self.is_valid,self.lastview_time)

class UserEntity(Base):
    __tablename__ = 'users'
    id = Column("uid", INTEGER, primary_key=True, nullable=False, autoincrement=True)
    email= Column("email", VARCHAR(200),nullable=False)
    type= Column("type", CHAR(1),nullable=False,default='0')#0=>fb 1=>email
    password= Column("password", VARCHAR(32),nullable=False)
    password_salt= Column("password_salt", VARCHAR(16),nullable=False)
    birthday= Column("birthday", DATE,nullable=False)
    thirdparty_info= Column("thirdparty_info",VARCHAR(2000),nullable=False)
    create_time= Column("create_time",DATETIME,default=datetime.datetime.utcnow)
    create_user= Column("create_user",VARCHAR(10),default='pinstream')
    edit_time= Column("edit_time",DATETIME,default=datetime.datetime.utcnow)
    edit_user= Column("edit_user",VARCHAR(10),nullable=False,default='pinstream')
    # videoinfos = relationship("UsersVideoinfoEntity", back_populates="users")
    videoinfos = relationship("VideoInfoEntity" , secondary="users_videoinfo")

    @property
    def serialize(self):
        return {'id':self.id,
        'email':self.email,
        'birthday':self.birthday,
        'thirdparty_info':self.thirdparty_info,
        'create_time':self.create_time,
        'edit_time':self.edit_time}
    def __repr__(self):
        return "<User(id='%s', email='%s' , type='%s', password='%s', password_salt='%s', birthday='%s', \
                thirdparty_info='%s', create_time='%s', create_user='%s', edit_time='%s', edit_user='%s')>" % \
                (self.id, self.email,self.type,self.password,\
                self.password_salt,self.birthday,self.thirdparty_info,self.create_time,self.create_user,\
                self.edit_time,self.edit_user)

class VideoInfoEntity(Base):
    __tablename__ = 'videoinfo'
    id = Column("vid", INTEGER, primary_key=True, nullable=False, autoincrement=True)
    website_vid= Column("website_vid", VARCHAR(20),nullable=False)
    website= Column("website", CHAR(2),nullable=False,default='0')#0=>fb 1=>youtube
    title= Column("title", VARCHAR(200),nullable=False)
    url= Column("url", VARCHAR(2000),nullable=False)
    imgurl= Column("imgurl", VARCHAR(2000),nullable=False)
    create_time= Column("create_time",DATETIME,default=datetime.datetime.utcnow)
    create_user= Column("create_user",VARCHAR(10),default='pinstream')
    edit_time= Column("edit_time",VARCHAR(10),nullable=False,default=datetime.datetime.utcnow)
    edit_user= Column("edit_user",VARCHAR(10),default='pinstream')
    users = relationship("UserEntity" , backref="users", secondary="users_videoinfo")
    # users_videoinfo = relationship("UsersVideoinfoEntity" , backref="users_videoinfo")

    # users = relationship("UsersVideoinfoEntity", back_populates="videoinfo")

    # def __repr__(self):
    #     return "<VideoInfo(id='%s', website_vid='%s' , website='%s', title='%s', url='%s', \
    #             imgurl='%s', create_time='%s', create_user='%s', edit_time='%s', edit_user='%s')>" % \
    #             (self.id, self.website_vid,self.website,self.title,\
    #             self.url,self.imgurl,self.create_time,self.create_user,\
    #             self.edit_time,self.edit_user)