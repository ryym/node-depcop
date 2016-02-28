import findUnlistedModules from './findUnlistedModules';
import findStrayedModules from './findStrayedModules';

const inspectors = {
  unlisted: findUnlistedModules,
  strayed: findStrayedModules
};

export default function loadInspector(name) {
  return inspectors[name];
}
