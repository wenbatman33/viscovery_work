#http://stackoverflow.com/a/5293983
import random
import hashlib
import time
import uuid
from datetime import datetime,timedelta
from hashids import Hashids

h = Hashids(alphabet='abdegjklmnopqrvwxyzABDEGJKLMNOPQRVWXYZ1234567890',salt='1qaz2wsx',min_length=16)
h_token = Hashids(salt='2wsx1qaz',min_length=32)
life_seconds=30

def getuuid4():
    return uuid.uuid4().hex

def getsalt():
    ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return getsalt_custom(ALPHABET)

def getsalt_int():
    ALPHABET = "0123456789"
    return getsalt_custom(ALPHABET)

def getsalt_custom(pattern):
    chars=[]
    for i in range(16):
        chars.append(random.choice(pattern))
    return "".join(chars)

def gethash_password(password,salt):
    m = hashlib.md5()
    # 'b'pasword'
    # ps = bytes(password, 'utf8') +  bytes(salt, 'utf8')
    ps = password +  salt
    m.update(ps)
    return m.hexdigest()

def getdate_time_utcnow():
    return datetime.utcnow()

def adddate_time_seconds(dt,sec):
    return dt + timedelta(seconds=sec)

def gettoken_info_expires(id,sec):
    timestamp = getdate_time_stamp()
    end_time = (timestamp + (sec/2) )
    # end_time = (timestamp + 60 )
    # token = getencode_token_id_timestamp(timestamp,60)
    token = getencode_token_id_timestamp(timestamp,(sec/2))
    refresh_token = getencode_id(end_time)
    return {'uid':getencode_id_timestamp(id,end_time),'token':token,'refresh_token':refresh_token,'expires_in':end_time}

def gettoken_info(id):
    timestamp = getdate_time_stamp()
    end_time = (timestamp + life_seconds)
    token = getencode_token_id(timestamp)
    refresh_token = getencode_id(end_time)
    return {'uid':getencode_id_timestamp(id,end_time),'token':token,'refresh_token':refresh_token}

def is_valid_token(encodeid):
    try:
        ints = getdecode_token_ids(encodeid)
        if((ints[0]+ints[1]) >= getdate_time_stamp()):
            return True
    except Exception as e:
        error = str(e)
    return False

def getencode_token_id(id):
    return h_token.encode(id)

def getencode_token_id_timestamp(id,timestamp):
    return h_token.encode(id,timestamp)

def getencode_id(id):
    return h.encode(id)

def getencode_id_timestamp(id,timestamp):
    return h.encode(id,timestamp)

def getdecode_token_ids(encodeid):
    ints = h_token.decode(encodeid)
    return ints

def getdecode_ids(encodeid):
    ints = h.decode(encodeid)
    return ints

def getdate_time_stamp():
    timestamp = int(time.mktime(datetime.utcnow().timetuple()))
    return timestamp

def getdate_from_timestamp(timestamp):
    fromtimestamp = datetime.fromtimestamp(timestamp)
    return fromtimestamp

def get_bearer_token(header_token):
    bearer_prefix = 'Token '
    if header_token and header_token.startswith(bearer_prefix):
        return header_token[len(bearer_prefix):]
    return None