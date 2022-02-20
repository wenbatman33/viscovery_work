export const validAd = ad => (
    Object.values(ad)
      .filter(value => value === null)
      .length === 0
  );


export const toAd = adData => (
  {
    start_time: adData.startTime,
    end_time: adData.endTime,
    ad_category: adData.category,
    ad_form: adData.form,
    updated_time: new Date(),
    ad_provider: adData.adProvider,
  }
);

export default class Ad {
  // data is an ad content object in response, eg. response.ads[0].content[0]
  constructor(videoId, data) {
    if (data && typeof data === 'object') {
      this._id = data.id;
      this._start = data.start_position;
      this._end = data.end_position;
      this._category = data.category;
      this._filter_id = data.filter_id;
      this._form = data.form;
      this._video = videoId;
    } else {
      this._id = null;
      this._start = null;
      this._end = null;
      this._category = null;
      this._form = null;
      this._video = videoId;
    }
  }

  id() {
    return this._id;
  }

  start() {
    return this._start;
  }

  end() {
    return this._end;
  }

  category() {
    return this._category;
  }

  filter() {
    return this._filter_id;
  }

  form() {
    return this._form;
  }

  video() {
    return this._video;
  }
}
