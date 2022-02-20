#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import sys
import inspect
import traceback

from flask import g
from sqlalchemy.sql import text
# from sqlalchemy.pool import NullPool

from contextlib import contextmanager

sys.path.insert(0, os.path.join("..",".."))
from hrsapi_app.app import app, alchemy_db, session, InfraLog as Ilg


class SqlAlchemyUtil(object):
    #_count = 0
 
    def __init__(self):
        self._engine = {}
        self._session = {}
        pass
        #SqlAlchemyUtil._count += 1
        #self._id = SqlAlchemyUtil._count
        #print " << init SqlAlchemyUtil >> id=%s, SqlAlchemyUtil.count = %s" % (self._id, SqlAlchemyUtil._count)
        #print " << init SqlAlchemyUtil >> SqlAlchemyUtil.count = %s" % SqlAlchemyUtil._count

    def __del__(self):
        pass
        #print " << del SqlAlchemyUtil >>" 

    ##################################################################################    
    def _get_engine(self, db_name=None):
        return alchemy_db.get_engine(alchemy_db.get_app(), db_name)

        if db_name not in self._engine or self._engine[db_name] is None:
            eng = alchemy_db.create_engine(app.config['SQLALCHEMY_BINDS'][db_name])
            self._engine[db_name] = eng
        return self._engine[db_name]

    def _create_session(self, db_name):
            engine = self._get_engine(db_name)
            session.configure(bind=engine)

            return session() 

    def _get_session(self, db_name):
        session = getattr(g, '_db_sessions', None)

        if session is None:
            #print '  -- [SqlAlchemyUtil] ->  session is None, create ssession by 1st method'
            g._db_sessions = {}
            g._db_sessions[db_name] = self._create_session(db_name)

        elif db_name not in session or session[db_name] is None:
            #print '  -- [SqlAlchemyUtil] -> session[db_name] is None, create session by 2nd method'
            g._db_sessions[db_name] = self._create_session(db_name)
        else:
            pass
            #print '  -- [SqlAlchemyUtil] -> return _get_session'

        return g._db_sessions[db_name]

    ##################################################################################    
    def _connect_db(self, dbname=None):
        #print '  -- [SqlAlchemyUtil] -> call _connect_db'
        #conn = alchemy_db.get_engine(alchemy_db.get_app(), dbname).connect()
        eng = alchemy_db.get_engine(alchemy_db.get_app(), dbname)
        #print '**** eng id:', id(eng)

        conn = eng.connect()
        #print '**** conn id:', id(conn)
        return conn

    def _get_conn(self, db_name):
        #print '  -- [SqlAlchemyUtil] -> call _get_conn'
        conn = getattr(g, '_db_conns', None)
        if conn is None: 
            #print '  -- [SqlAlchemyUtil] ->  conn is None, create connection by 1st method'
            conn = {}
            conn[db_name] = self._connect_db(db_name)
            g._db_conns = conn
        
        elif db_name not in conn or conn[db_name] is None:
            #print '  -- [SqlAlchemyUtil] -> conn[db_name] is None, create connection by 2nd method'
            conn[db_name] = self._connect_db(db_name)
            g._db_conns = conn
        else:
            pass
            # print '  -- [SqlAlchemyUtil] -> return _get_conn'

        return conn[db_name]

    
    #################################################################
    ### result proxy callback action
    def _callback_nothing(self, result_proxy):
        return result_proxy

    def _callback_fetchall(self, result_proxy):
        return result_proxy.fetchall()

    def _callback_fetchmany(self, result_proxy):
        return result_proxy.fetchmany()

    def _callback_fetchone(self, result_proxy):
        return result_proxy.fetchone()

    def _callback_rowcount(self, result_proxy):
        return result_proxy.rowcount


    def _execute_raw(self, db_name, statement, params, callback_get_data):
        status = 0  # 0 for success

        try:
            conn = self._get_conn(db_name)
        except Exception as e:
            status = -10411     # -10411: failed to connect db
            err_msg = 'failed to connect db[%s]: %s\n%s' % (db_name, str(e), traceback.format_exc())
            return status, err_msg

        if conn is None:
            status = -10412     # -10412: the result of db connection is None
            err_msg = 'the result of db[%s] connection is None' % (db_name)
            return status, err_msg
        
        try:
            statement = text(statement)

            with conn.begin() as trans:
                #result_proxy = conn.execute(statement, params, multi=True)
                result_proxy = conn.execute(statement, params)

                rec = callback_get_data(result_proxy)

        except Exception as e:
            status = -10413     # -10413: failed to execute sql statement
            err_msg = 'failed to execute sql statement: %s\n%s' % (str(e), traceback.format_exc())
            return status, err_msg

        return status, rec

    def _execute(self, db_name, statement, params, callback_get_data):
        status, rec = self._execute_raw(db_name, statement, params, callback_get_data)

        if status != 0:
            fn = "%s.%s" % (type(self).__name__, inspect.stack()[0][3])
            print >> sys.stderr, "[ERROR][%s] [%s]%s" % (fn, status, rec)

        return status, rec


    ##################################################
    ### Public Method 
    ##################################################
    @app.teardown_appcontext
    def teardown_db(exception):
        conn = getattr(g, '_db_conns', None)
        if conn is not None:
            for db_name in conn:
                conn[db_name].close()

        session = getattr(g, '_db_sessions', None)
        if session is not None:
            for db_name in session:
                session[db_name].close()

    ### operation methods ###
    ''' 
        return status: 
                 0: for success
            -10411: failed to connect db
            -10412: the result of db connection is None
            -10413: failed to execute sql statement
            -10421: failed to create session
    '''
    def get_nothing_by_stmt(self, db_name, statement, params={}):
        status, rec = self._execute(db_name, statement, params, self._callback_nothing)

        return status, rec

    def get_obj_by_stmt(self, db_name, statement, params={}):
        status, rec = self._execute(db_name, statement, params, self._callback_fetchone)
        
        if status == 0:
            rec = dict(rec)

        return status, rec

    def get_list_obj_by_stmt(self, db_name, statement, params={}):
        status, rec = self._execute(db_name, statement, params, self._callback_fetchall)

        if status == 0:
            rec = [dict(row) for row in rec]

        return status, rec

    def get_list_by_stmt(self, db_name, statement, params={}):
        status, rec = self._execute(db_name, statement, params, self._callback_fetchall)

        if status == 0:
            rec = [row[0] for row in rec]

        return status, rec

    def get_rows_by_stmt(self, db_name, statement, params={}):
        status, rec = self._execute(db_name, statement, params, self._callback_rowcount)
        
        return status, rec


    #### for ORM Session ################################
    def get_session(self, db_name):
        status = 0  # 0 for success

        try:
            Session = self._get_session(db_name)
            #print 'sqlutil: ', id(Session)

        except Exception as e:
            status = -10421     # -10421: failed to create session
            err_msg = 'failed to create session, db=[%s]: %s\n%s' % (db_name, str(e), traceback.format_exc())

            fn = "%s.%s" % (type(self).__name__, inspect.stack()[0][3])
            Ilg.Write(Ilg.PRI_ERROR, "[ERROR][%s] [%s]%s" % (fn, status, err_msg))
            
            return status, err_msg
            
        return status, Session

    @contextmanager
    def session_scope(self, db_name):
        status, session = self.get_session(db_name)
        session.expire_on_commit = False
        try:
            yield session
            session.commit()
        except:
            Ilg.Write(Ilg.PRI_ERROR, "session_scope except: %s" % (traceback.format_exc()))
            session.rollback()
            raise
        finally:
           session.close()


if __name__ == '__main__':
    db_util = SqlAlchemyUtil()
    db = db_util.get_db('VDS3')
    print db

    
