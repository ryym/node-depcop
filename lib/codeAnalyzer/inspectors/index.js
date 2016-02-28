import findUnlistedModules from './findUnlistedModules';
import findStrayedModules from './findStrayedModules';
import findUnusedModules from './findUnusedModules';

const inspectors = {
  unlisted: findUnlistedModules,
  strayed: findStrayedModules,
  unused: findUnusedModules
};

export default function loadInspector(name) {
  return inspectors[name];
}
