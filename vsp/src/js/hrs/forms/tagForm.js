import R from 'ramda';

const validTagsPatchIsArray = (userId, processId, tags) => {
  if (!Array.isArray(tags)) throw new Error('tags is not an array.');
  return {
    userId,
    processId,
    tags,
  };
};

const patchToObject = ({ userId, processId, tags }) => (
  {
    userId,
    processId,
    tags,
  }
);

const validTagsPatch = R.compose(patchToObject, validTagsPatchIsArray);

const takeTagsPatch = ({ userId, processId, tags }) => (
  {
    assignee_id: userId,
    process_id: processId,
    tags: JSON.stringify(tags),
  }
);

const tagsPatchToForm = (jobsObj) => {
  const formData = new FormData();
  Object.keys(jobsObj).forEach((key) => {
    formData.append(key, jobsObj[key]);
  });

  return formData;
};

// (Object[] frames) -> FormData
const handleTagsPatchData = R.compose(tagsPatchToForm, takeTagsPatch, validTagsPatch);
export default handleTagsPatchData;
