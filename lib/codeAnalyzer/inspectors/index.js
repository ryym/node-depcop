import findMissingModules from './findMissingModules';
import findStrayedModules from './findStrayedModules';
import findUnusedModules from './findUnusedModules';
import Report from './Report';

const inspectors = {
  missing: findMissingModules,
  strayed: findStrayedModules,
  unused: findUnusedModules
};

export default function loadInspectors(packageJson, options) {
  const makeReporter = (name, description) => {
    return new Report(name, description, packageJson.getFileInfo());
  };
  const names = Object.keys(options);

  return names.map(
    name => inspectors[name](packageJson, makeReporter, options[name])
  );
}
