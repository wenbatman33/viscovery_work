
class EntitiesConvert:
    @staticmethod
    def obj2dict(model):
        if model is None:
            return None
        return {col.name: getattr(model, col.name) for col in model.__table__.columns}

    @staticmethod
    def listobj2dict(model_list):
        if model_list is None:
            return None

        res = []
        for i in model_list:
            res.append(EntitiesConvert.obj2dict(i))
        return res

