import ImportedModuleCollector from './ImportedModuleCollector';

/**
 * Search source code and collect imported module information.
 * @param {Object} params
 * @param {Object} params.parserOptions
 * @param {Object} params.targetFiles
 * @param {Function} params.readFile - Used to read source files.
 * @return {ImportedModule[]}
 */
export default function collectModules({
  parserOptions, targetFiles, readFile
}) {
  const collector = new ImportedModuleCollector(parserOptions);

  targetFiles.forEach(fileInfo => {
    const rawContent = readFile(fileInfo.getPath());
    const content = normalizeSourceCode(rawContent);
    collector.searchImports(content, fileInfo);
  });

  return collector.collectImportedModules();
}

/**
 * Normalize source code (Remove shebangs).
 * @private
 */
function normalizeSourceCode(text) {
  return text.replace(/^#![^\r\n]+/, '');
}
