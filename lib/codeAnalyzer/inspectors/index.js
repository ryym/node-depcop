import findMissingModules from './findMissingModules';
import findStrayedModules from './findStrayedModules';
import findUnusedModules from './findUnusedModules';

const inspectors = {
  missing: findMissingModules,
  strayed: findStrayedModules,
  unused: findUnusedModules
};

export default function loadInspectors(packageJson, options) {
  const names = Object.keys(options);
  return names.map(
    name => inspectors[name](packageJson, options[name])
  );
}
