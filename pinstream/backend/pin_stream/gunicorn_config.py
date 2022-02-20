from multiprocessing import cpu_count

def get_workers():
    return 5

bind = '0.0.0.0:8085'
capture_output = True
workers = get_workers()
worker_class = "gevent"
graceful_timeout = 60
loglevel = 'info'
accesslog = 'access_log.log'
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" **%(L)s/%(D)s**'
errorlog = 'error_log.log'
