#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys
import inspect
import traceback

from hrsapi_app.app import InfraLog as Ilg
from hrsapi_app.etc.errors_list import err_map

class ApiBase(object):

    def service_exception_handle(self, result, e=''):
        Ilg.Write(Ilg.PRI_ERROR, traceback.format_exc())
        result['response_msg'] = str(sys.exc_info()[0])
        result['response_code'] = -99999
        return result
        
    def api_process(self, func, request, **kwargs):
        result = {}
        if request.environ["REQUEST_METHOD"] == "GET":
            params = request.view_args
        else:
            params = request.json
            if params is None:
                params = {}
        params.update(kwargs)
        try:
            result['response_data'], result['response_code'] = func(**params)
            result['response_msg'] = "Undefined" if result['response_code'] not in err_map\
                else err_map[result['response_code']]
        except Exception as e:
            self.service_exception_handle(result)
        return result, 200
