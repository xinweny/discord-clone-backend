export default function checkEmptyEnv (vars: string[]) {
  const emptyVars = [];

  for (const varName of vars) {
    if (process.env[varName] === undefined) emptyVars.push(varName);
  } 

  if (emptyVars.length > 0) {
    throw new Error(`The following environment variables are missing:
    ${emptyVars.join('\r\n')}`);
  }
}