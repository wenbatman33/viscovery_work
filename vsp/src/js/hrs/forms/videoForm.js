import R from 'ramda';

const validVideoPriority = (priority) => {
  if (priority !== parseInt(priority, 10)) return null;
  return {
    priority,
  };
};

const validPatchVideos = R.compose(validVideoPriority);

const takeVideosPatch = ({ priority }) => (
  {
    priority,
  }
);

const videosPatchToForm = (videoObj) => {
  const formData = new FormData();
  Object.keys(videoObj).forEach((key) => {
    formData.append(key, videoObj[key]);
  });

  return formData;
};

// (Object[] frames) -> FormData
const handleVideosPatchData = R.compose(videosPatchToForm, takeVideosPatch, validPatchVideos);
export default handleVideosPatchData;
