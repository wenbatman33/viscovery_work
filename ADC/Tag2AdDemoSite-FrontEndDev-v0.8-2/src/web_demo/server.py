from flask import Flask, render_template, redirect, request
import tornado.wsgi
import tornado.httpserver
import optparse
import os
import logging
import argparse
import json
import traceback
from collections import namedtuple
import sys
import subprocess
import urllib
import msgpack
from urlparse import urlparse

##### Parse config file
import ConfigParser
Config = ConfigParser.ConfigParser()
Config.read('src/web_demo/config.ini')
LOG_PATH = Config.get('Logs', 'Server_Log_path')
SERVER_PORT = Config.get('CriticalSettings', 'Server_LocalPort')
NOTIFIER_EXTERN_PORT = Config.get('CriticalSettings', 'Notifier_ExternPort')
DOWNLOAD_FOLDER = Config.get('General', 'Download_Folder')
DOWNLOAD_URL_PREFIX = Config.get('General', 'Download_url_prefix')
TAG_SUBFOLDER = Config.get('General', 'Tag_SubFolder_name')
CREATIVE_URL_PREFIX = Config.get('General', 'Creative_url_prefix')
CREATIVE_FOLDER = Config.get('General', 'Creative_Folder')
JS_CSS_FOLDER = Config.get('General', 'JS_CSS_Folder')
JS_CSS_URL_PREFIX = Config.get('General', 'JS_CSS_url_prefix')
ASSETS_Folder = Config.get('General', 'ASSETS_Folder')
ASSETS_url_PREFIX = Config.get('General', 'ASSETS_url_prefix')
isLiteVersion = Config.get('LiteVersion', 'isLiteVersion').lower() in ("yes", "true", "t", "1")
##### Parse ENDS

###Place_4_License###

app = Flask(__name__)

@app.route('/')
def index():
    hostname = urlparse(request.url).hostname
    notifier_url = 'http://{}:{}'.format(hostname, NOTIFIER_EXTERN_PORT)
    return render_template('index.html', has_result=False, version=app.version, notifier_url=notifier_url,
                            liteVersion=isLiteVersion )

@app.route('/classify_url', methods=['POST'])
def classify_url():

    logger = logging.getLogger('classify_url')
    clientid = request.form.get('clientid')
    targeturl = urllib.unquote(request.form.get('targeturl').encode('utf8')).decode("utf-8")
    targeturl = urllib.quote( targeturl.encode('utf8'), '~!@#$&*()=:/,;?+\'')
    logger.debug('targeturl= {}; type= {}'.format(targeturl, type(targeturl)))
    if not isLiteVersion:
        isDebug = request.form.get('isDebug')=='true'
    # in lite version, force debug mode to be false  (prevent intruders to send isDebug=True info)
    else:
        isDebug = False
    #run.delay( clientid=clientid, targeturl=targeturl, isDebug=isDebug )

    print targeturl

    if not isLiteVersion and targeturl == 'http://twimg.edgesuite.net/images/ReNews/20140828/640_71d0c16c7ff2546d64bf471e68e4d37c.jpg':
        return 'Task done.\n54N9FG71'
    elif not isLiteVersion and targeturl == 'https://v.qq.com/x/page/m03878gky0y.html':
        return 'Task done.\nVPA6JXI6'
    elif isLiteVersion and targeturl == 'http://twimg.edgesuite.net/images/ReNews/20140828/640_71d0c16c7ff2546d64bf471e68e4d37c.jpg':
        return 'Task done.\n33DGUC3C'
    elif isLiteVersion and targeturl == 'https://v.qq.com/x/page/m03878gky0y.html':
        return 'Task done.\n70GFMCFD'
    else:
        return 'Unknown link', 202

@app.route('/inspect_job', methods=['GET'])
def inspect_job():

    logger = logging.getLogger('inspect_job')
    task_id = str( request.args.get('targetid', '') )

    # extract information from job id
    has_result = False
    file_type = ''
    content_type = ''
    rsltpath = []
    proc_time = []
    rslt_version = ''
    err_log = ''
    try:
        # use pre-defined path (this must comply with the settings in url2tag)
        rsltpath_graph = os.path.join(DOWNLOAD_FOLDER, task_id, TAG_SUBFOLDER, 'data.tsv')
        
        logger.info('reading job id {}'.format(task_id))

        # read detail.json or detail.msgpack (backward compatible)
        rsltpath_detail = os.path.join(DOWNLOAD_FOLDER, task_id, TAG_SUBFOLDER, 'detail.msgpack')
        if( os.path.exists(rsltpath_detail) ):
            with open(rsltpath_detail) as dd:
                rslt = msgpack.unpack(dd)
        else:
            rsltpath_detail = os.path.join(DOWNLOAD_FOLDER, task_id, TAG_SUBFOLDER, 'detail.json')
            with open(rsltpath_detail) as dd:
                rslt = json.load(dd)

        rslt_version = rslt['version']
        file_type = rslt['info']['type']
        content_type = rslt['content']
        proc_time = [rslt['output']['processT']['url2frames'], rslt['output']['processT']['frames2adcs']]
        
        logger.info('reading result done')
        has_result = True
    except Exception:
        err_log = traceback.format_exc()
        logger.error( err_log )
        logger.error( 'An error happened during classification' )
    
    hostname = urlparse(request.url).hostname
    notifier_url = 'http://{}:{}'.format(hostname, NOTIFIER_EXTERN_PORT)

    # get current folder's task IDs
    list_taskID = os.listdir( DOWNLOAD_FOLDER )
    list_taskID = [ x for x in list_taskID if not x.startswith('.') ]

    return render_template('result.html', has_result=has_result, version=rslt_version, notifier_url=notifier_url,
                            file_type=file_type, rslt=rslt, rsltpath_graph=rsltpath_graph, proc_time=proc_time, content_type=content_type,
                            err_log=err_log.split('\n'), liteVersion=isLiteVersion,
                            current_taskID=task_id, list_taskID=list_taskID )



def start_tornado(app, port=5000):

    # define static folder path
    settings = { "static_path":       DOWNLOAD_FOLDER,
                 "static_url_prefix": DOWNLOAD_URL_PREFIX }

    # start Tornado server
    creative_url = CREATIVE_URL_PREFIX + '(.*)'
    creative_url = creative_url.replace("\\", "\\\\")  # convert string to raw string
    
    # [Shawn] added
    js_css_url = JS_CSS_URL_PREFIX + '(.*)'
    js_css_url = js_css_url.replace("\\", "\\\\")
    # [Batman] added
    assests_url = ASSETS_url_PREFIX + '(.*)'
    assests_url = assests_url.replace("\\", "\\\\")
    
    wsgi_app = tornado.wsgi.WSGIContainer(app)
    tornado_app = tornado.web.Application(
        [
            (creative_url, tornado.web.StaticFileHandler, {'path': CREATIVE_FOLDER}),
            (js_css_url, tornado.web.StaticFileHandler, {'path': JS_CSS_FOLDER}),
            (assests_url, tornado.web.StaticFileHandler, {'path': ASSETS_Folder}),
            ('.*', tornado.web.FallbackHandler, dict(fallback=wsgi_app))
        ], **settings)

#    http_server = tornado.httpserver.HTTPServer(tornado_app)
    tornado_app.listen(port)
    print("Tornado server starting on port {}".format(port))
    logging.info("Tornado server starting on port {}".format(port))
    tornado.ioloop.IOLoop.instance().start()


def start_from_terminal(app):
    """
    Parse command line options and start the server.
    """
    parser = optparse.OptionParser()
    parser.add_option(
        '-p', '--port',
        help="which port to serve content on",
        type='int', default=SERVER_PORT)

    opts, args = parser.parse_args()

    logger = logging.getLogger('start_from_terminal')

    app.version = 'v0.8-2-gf4c7704-FrontEndDev'

    # Start server
    start_tornado(app, opts.port)



if __name__ == '__main__':

    start_from_terminal(app)
