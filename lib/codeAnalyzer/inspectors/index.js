import findUnlistedModules from './findUnlistedModules';

const inspectors = {
  unlisted: findUnlistedModules
};

export default function loadInspector(name) {
  return inspectors[name];
}
