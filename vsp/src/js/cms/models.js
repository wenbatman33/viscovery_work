export const filterPendingUploads = uploads => uploads.filter(upload => upload.status === 0);
export const filterActiveUploads = uploads => uploads.filter(upload => upload.status === 1);
export const filterCompletedUploads = uploads => uploads.filter(upload => upload.status === 2);
export const filterFailedUploads = uploads => uploads.filter(upload => upload.status === 3);
