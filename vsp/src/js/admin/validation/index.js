export const groupCreateValid = result => (foo) => {
  const checkedResult = {
    ...result,
    isVip: result.isVip ? 1 : 0,
    enableHrs: result.enableHrs ? 1 : 0,
    isNotify: result.isNotify ? 1 : 0,
  };
  foo(checkedResult);
};

export const userCreateValid = result => (foo) => {
  const checkedResult = {
    ...result,
  };
  foo(checkedResult);
};
