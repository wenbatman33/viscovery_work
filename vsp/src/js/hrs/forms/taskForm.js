import R from 'ramda';

const validTaskPriority = (priority) => {
  if (priority !== parseInt(priority, 10)) return null;
  return {
    priority,
  };
};

const validTaskAssignee = (assignerId, assigneeId) => {
  if (assignerId !== parseInt(assignerId, 10) || assigneeId !== parseInt(assigneeId, 10)) {
    return null;
  }

  return {
    assignerId,
    assigneeId,
  };
};

const takeTaskPriorityPatch = ({ priority }) => (
  {
    priority,
  }
);

const takeTaskAssigneePatch = ({ assignerId, assigneeId }) => (
  {
    assigner_id: assignerId,
    assignee_id: assigneeId,
  }
);

const taskPatchToForm = (videoObj) => {
  const formData = new FormData();
  Object.keys(videoObj).forEach((key) => {
    formData.append(key, videoObj[key]);
  });

  return formData;
};

// (priority) -> FormData
export const handleTaskPatchPriority = R.compose(
  taskPatchToForm,
  takeTaskPriorityPatch,
  validTaskPriority
);

// (assignerId, assigneeId) -> FormData
export const handleTaskPatchAssignee = R.compose(
  taskPatchToForm,
  takeTaskAssigneePatch,
  validTaskAssignee
);
