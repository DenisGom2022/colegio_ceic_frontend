/**
 * Component Usage Analysis Script
 * 
 * This script analyzes React component usage in a codebase, including:
 * - Direct imports of components
 * - Usage in JSX
 * - References in CSS files
 * - Exports in barrel files (index.ts/js)
 * - Full dependency chain tracing for barrel files
 * 
 * Features:
 * - Detects truly unused components (not imported, referenced, or used anywhere)
 * - Identifies components only exported in barrel files that aren't used
 * - Provides detailed reporting with file paths and line numbers
 * - Identifies components only referenced by CSS filename
 * 
 * Usage:
 * node find-unused-components-final.js
 * 
 * Output:
 * - Generates a component-usage-report.md file with detailed analysis
 * - Lists components that can be safely removed
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const srcDir = path.join(__dirname, 'src');
const fileExtensions = ['.tsx', '.ts', '.js', '.jsx'];
const cssExtensions = ['.css', '.scss', '.sass', '.less', '.module.css', '.module.scss'];
const allExtensions = [...fileExtensions, ...cssExtensions];
const excludeDirs = ['node_modules', '.git', 'build', 'dist'];
const componentNameRegex = /export\s+(default\s+)?(function|const|class)\s+([A-Z][A-Za-z0-9_]+)/g;
const namedExportRegex = /export\s+(?!default|type|interface)(?:const|function|class|let|var)\s+([A-Z][A-Za-z0-9_]+)/g;
const defaultExportRegex = /export\s+default\s+(?:const|function|class|let|var)?\s*([A-Z][A-Za-z0-9_]+)/g;
const exportAsRegex = /export\s+{\s*[^}]*\s+as\s+([A-Z][A-Za-z0-9_]+)[^}]*}/g;
const exportRegex = /export\s+{\s*([A-Z][A-Za-z0-9_]+)(?:\s*,\s*([A-Z][A-Za-z0-9_]+))*\s*}/g;

// Helper function to get all files recursively
function getAllFiles(dir, extensions) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.relative(srcDir, fullPath);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !excludeDirs.includes(item)) {
      files = files.concat(getAllFiles(fullPath, extensions));
    } else if (stat.isFile() && extensions.includes(path.extname(fullPath))) {
      files.push({ path: fullPath, relativePath });
    }
  }
  
  return files;
}

// Helper function to extract component names from a file
function extractComponentNames(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const componentNames = [];
  let match;
  
  // Extract component names from different export patterns
  while ((match = componentNameRegex.exec(content)) !== null) {
    componentNames.push(match[3]);
  }
  
  // Reset regex since we're reusing it
  componentNameRegex.lastIndex = 0;
  
  // Check for named exports
  while ((match = namedExportRegex.exec(content)) !== null) {
    componentNames.push(match[1]);
  }
  namedExportRegex.lastIndex = 0;
  
  // Check for default exports
  while ((match = defaultExportRegex.exec(content)) !== null) {
    if (match[1] && match[1].charAt(0) === match[1].charAt(0).toUpperCase()) {
      componentNames.push(match[1]);
    }
  }
  defaultExportRegex.lastIndex = 0;
  
  // Check for "export as" syntax
  while ((match = exportAsRegex.exec(content)) !== null) {
    componentNames.push(match[1]);
  }
  exportAsRegex.lastIndex = 0;
  
  // Check for direct exports
  while ((match = exportRegex.exec(content)) !== null) {
    const exportedNames = match[0].match(/[A-Z][A-Za-z0-9_]+/g);
    if (exportedNames) {
      componentNames.push(...exportedNames);
    }
  }
  exportRegex.lastIndex = 0;
  
  // Extract from barrel files (index.ts/index.js)
  if (path.basename(filePath) === 'index.ts' || path.basename(filePath) === 'index.js') {
    // Find re-exports like: export { default as ComponentName } from './ComponentName'
    const reExportRegex = /export\s+{\s*(?:default\s+as\s+)?([A-Z][A-Za-z0-9_]+)\s*}/g;
    while ((match = reExportRegex.exec(content)) !== null) {
      componentNames.push(match[1]);
    }
  }
  
  return [...new Set(componentNames)]; // Remove duplicates
}

// Helper function to find all imports of a component
function findImports(componentName, files) {
  const importRegexes = [
    new RegExp(`import\\s+{[^}]*\\b${componentName}\\b[^}]*}\\s+from`, 'g'),
    new RegExp(`import\\s+${componentName}\\s+from`, 'g'),
    new RegExp(`import\\s+{[^}]*\\bas\\s+${componentName}[^}]*}\\s+from`, 'g')
  ];
  
  // Additional regexes to check for usage in React Router or other dynamic component usages
  const usageRegexes = [
    // Component used in a variable or property
    new RegExp(`=\\s*${componentName}\\b`, 'g'),
    // Component used in array or object
    new RegExp(`[\\[{]\\s*${componentName}\\b`, 'g'),
    // Component used as property of object
    new RegExp(`:\\s*${componentName}\\b`, 'g'),
    // Component used in JSX property
    new RegExp(`component={${componentName}}`, 'g'),
    new RegExp(`element={<${componentName}`, 'g'),
    // Route path with component
    new RegExp(`path:\\s*["'].*["']\\s*,\\s*(?:component|element):\\s*${componentName}`, 'g'),
    // React.lazy loading
    new RegExp(`React\\.lazy\\([^)]*${componentName}[^)]*\\)`, 'g'),
    new RegExp(`lazy\\([^)]*${componentName}[^)]*\\)`, 'g')
  ];
  
  const imports = [];
  
  for (const file of files) {
    // Skip CSS files for import check
    if (cssExtensions.some(ext => file.path.endsWith(ext))) {
      continue;
    }
    
    const content = fs.readFileSync(file.path, 'utf8');
    const lines = content.split('\n');
    
    let found = false;
    
    // Check import patterns
    for (const regex of importRegexes) {
      regex.lastIndex = 0; // Reset regex before use
      
      // We need to check each line to get line numbers
      for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i])) {
          imports.push({
            file: file.relativePath,
            line: i + 1, // 1-based line numbers
            type: 'import'
          });
          found = true;
          break;
        }
      }
      
      if (found) break;
    }
    
    // If not found through imports, check other usage patterns
    if (!found) {
      for (const regex of usageRegexes) {
        regex.lastIndex = 0; // Reset regex before use
        
        for (let i = 0; i < lines.length; i++) {
          if (regex.test(lines[i])) {
            imports.push({
              file: file.relativePath,
              line: i + 1, // 1-based line numbers
              type: 'usage'
            });
            found = true;
            break;
          }
        }
        
        if (found) break;
      }
    }
  }
  
  return imports;
}

// Helper function to check if a component is referenced in barrel files
function isInBarrelFile(componentName, files) {
  const barrelFiles = files.filter(file => 
    path.basename(file.path) === 'index.ts' || 
    path.basename(file.path) === 'index.js' ||
    path.basename(file.path) === 'index.tsx'
  );
  
  const barrelReferences = [];
  
  for (const file of barrelFiles) {
    const content = fs.readFileSync(file.path, 'utf8');
    const lines = content.split('\n');
    
    // Check for different barrel file export patterns
    const barrelExportPatterns = [
      new RegExp(`export\\s+{\\s*(?:default\\s+as\\s+)?${componentName}\\s*}\\s+from`, ''),
      new RegExp(`export\\s+\\*\\s+from\\s+['"]\\./(?:\\.\\./)*(${componentName}|${componentName.toLowerCase()})['"']`, ''),
      new RegExp(`export\\s+{[^}]*\\b${componentName}\\b[^}]*}`, '')
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const pattern of barrelExportPatterns) {
        if (pattern.test(line)) {
          barrelReferences.push({
            file: path.relative(srcDir, file.path),
            line: i + 1,
            exportStatement: line.trim()
          });
          break;
        }
      }
    }
  }
  
  return barrelReferences;
}

// Helper function to check if a component is referenced in CSS files
function isReferencedInCssFiles(componentName, files) {
  // CSS files often use kebab-case or lowercase versions of component names
  const kebabCase = componentName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  
  const cssFiles = files.filter(file => 
    cssExtensions.some(ext => file.path.endsWith(ext))
  );
  
  const cssReferences = [];
  
  // Also check if the component name might be part of a CSS module filename
  // Only consider an exact match or component name followed by .module
  const cssModuleFile = files.find(file => {
    const baseName = path.basename(file.path);
    return baseName === `${componentName}.module.css` || 
           baseName === `${kebabCase}.module.css` ||
           baseName === `${componentName}.css` ||
           baseName === `${kebabCase}.css`;
  });
  
  if (cssModuleFile) {
    cssReferences.push({
      file: cssModuleFile.relativePath,
      type: 'fileName'
    });
  }
  
  // Check for references in CSS content - be more specific to avoid false positives
  for (const file of cssFiles) {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const lines = content.split('\n');
      
      // CSS class selectors might be in different formats - more specific patterns to avoid false positives
      const cssPatterns = [
        { pattern: new RegExp(`\\.${componentName}[\\s{:]`, ''), desc: 'class selector (exact case)' },
        { pattern: new RegExp(`\\.${kebabCase}[\\s{:]`, ''), desc: 'class selector (kebab-case)' },
        { pattern: new RegExp(`\\[class\\*="${componentName}"]`, ''), desc: 'attribute selector' },
        { pattern: new RegExp(`\\[class\\*="${kebabCase}"]`, ''), desc: 'attribute selector (kebab-case)' }
      ];
      
      for (const { pattern, desc } of cssPatterns) {
        // Check each line to get line numbers
        for (let i = 0; i < lines.length; i++) {
          if (pattern.test(lines[i])) {
            cssReferences.push({
              file: file.relativePath,
              type: desc,
              line: i + 1 // 1-based line numbers
            });
            break; // Only add each file once
          }
        }
      }
    } catch (error) {
      console.error(`Error reading CSS file ${file.relativePath}: ${error.message}`);
    }
  }
  
  return cssReferences;
}

// Helper function to check if a barrel file is being imported/used
function findBarrelFileUsages(barrelFilePath, files) {
  const barrelRelativePath = path.relative(srcDir, barrelFilePath).replace(/\\/g, '/');
  const barrelDirPath = path.dirname(barrelFilePath);
  const barrelDirName = path.basename(barrelDirPath);
  const barrelFileNoExt = path.basename(barrelFilePath, path.extname(barrelFilePath));
  
  // Get relative path without extension and with forward slashes
  const barrelRelativePathNoExt = barrelRelativePath.replace(/\.[^/.]+$/, '');
  
  // Get directory relative to src without leading ./
  const barrelDirRelativePath = path.dirname(barrelRelativePath);
  
  // Possible import paths for the barrel file
  const possibleImportPaths = [
    // Direct import by name
    barrelFileNoExt,
    // Directory name (common for barrel files)
    barrelDirName,
    // Path from src
    barrelRelativePathNoExt,
    // Directory path
    barrelDirRelativePath,
    // With relative prefix
    `./${barrelFileNoExt}`,
    `../${barrelDirName}`,
  ];
  
  // Add paths with different slashes/formats
  const morePaths = possibleImportPaths.flatMap(p => [
    p,
    p.replace(/\//g, '\\'),
    p.replace(/\\/g, '/')
  ]);
  
  // Remove duplicates
  const uniquePaths = [...new Set(morePaths)];
  
  const usages = [];
  
  for (const file of files) {
    // Skip the barrel file itself and CSS files
    if (file.path === barrelFilePath || cssExtensions.some(ext => file.path.endsWith(ext))) {
      continue;
    }
    
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for import statements that reference this barrel file
        for (const importPath of uniquePaths) {
          // Match typical import patterns with quotes
          const importPatterns = [
            `from '${importPath}'`,
            `from "${importPath}"`,
            `from './${importPath}'`,
            `from "./${importPath}"`,
            `import '${importPath}'`,
            `import "${importPath}"`,
            `import './${importPath}'`,
            `import "./${importPath}"`,
            `require('${importPath}')`,
            `require("${importPath}")`,
            `require('./${importPath}')`,
            `require("./${importPath}")`
          ];
          
          if (importPatterns.some(pattern => line.includes(pattern))) {
            usages.push({
              file: file.relativePath,
              line: i + 1,
              importStatement: line.trim()
            });
            break;
          }
        }
      }
    } catch (error) {
      console.error(`Error reading file ${file.relativePath}: ${error.message}`);
    }
  }
  
  return usages;
}

// Main function
function findUnusedComponents() {
  // Get all files
  const files = getAllFiles(srcDir, allExtensions);
  
  // First identify all barrel files and their usages
  const barrelFiles = files.filter(file => 
    path.basename(file.path) === 'index.ts' || 
    path.basename(file.path) === 'index.js' ||
    path.basename(file.path) === 'index.tsx'
  );
  
  const barrelFileUsages = {};
  for (const barrelFile of barrelFiles) {
    barrelFileUsages[barrelFile.path] = findBarrelFileUsages(barrelFile.path, files);
    // Debug output for barrel file usages
    if (barrelFileUsages[barrelFile.path].length === 0) {
      console.log(`Barrel file ${barrelFile.relativePath} might not be used anywhere`);
    }
  }
  
  // Extract component information
  const components = [];
  
  for (const file of files) {
    // Skip non-component files and test files
    if (file.relativePath.includes('.test.') || 
        file.relativePath.includes('.spec.') ||
        file.relativePath.includes('__tests__')) {
      continue;
    }
    
    const componentNames = extractComponentNames(file.path);
    
    for (const name of componentNames) {
      components.push({
        name,
        file: file.relativePath,
        fullPath: file.path
      });
    }
  }
  
  console.log(`Found ${components.length} potential components to analyze`);
  
  // Process each component
  let processedCount = 0;
  const totalComponents = components.length;
  const componentsReport = [];
  
  for (const component of components) {
    processedCount++;
    if (processedCount % 10 === 0 || processedCount === totalComponents) {
      console.log(`Processing components: ${processedCount}/${totalComponents}`);
    }
    
    const imports = findImports(component.name, files);
    const barrelReferences = isInBarrelFile(component.name, files);
    const isInBarrel = barrelReferences.length > 0;
    
    // Check if the barrel files that re-export this component are being used
    const barrelUsages = [];
    if (isInBarrel) {
      for (const barrelRef of barrelReferences) {
        const barrelFullPath = path.join(srcDir, barrelRef.file);
        const usages = barrelFileUsages[barrelFullPath] || [];
        
        if (usages.length > 0) {
          barrelUsages.push({
            barrelFile: barrelRef.file,
            usages: usages
          });
        }
      }
    }
    
    const cssReferences = isReferencedInCssFiles(component.name, files);
    
    // Check for JSX usage
    let jsxUsages = [];
    const filesWithJSX = files.filter(file => 
      ['.tsx', '.jsx'].includes(path.extname(file.path))
    );
    
    for (const file of filesWithJSX) {
      const content = fs.readFileSync(file.path, 'utf8');
      const lines = content.split('\n');
      const jsxRegex = new RegExp(`<${component.name}[\\s>]`);
      
      for (let i = 0; i < lines.length; i++) {
        if (jsxRegex.test(lines[i])) {
          jsxUsages.push({
            file: file.relativePath,
            line: i + 1, // 1-based line numbers
            type: 'jsx'
          });
        }
      }
    }
    
    // Check for router usage
    let routeUsages = [];
    if (component.name.includes('Page') || 
        component.file.toLowerCase().includes('page') ||
        component.file.toLowerCase().includes('route') || 
        component.name === 'ADMIN_ROUTES') {
      
      const routeFiles = files.filter(file => 
        file.relativePath.toLowerCase().includes('route') || 
        file.relativePath.toLowerCase().includes('router') ||
        file.relativePath.toLowerCase().includes('app')
      );
      
      for (const routeFile of routeFiles) {
        const content = fs.readFileSync(routeFile.path, 'utf8');
        const lines = content.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(component.name)) {
            routeUsages.push({
              file: routeFile.relativePath,
              line: i + 1, // 1-based line numbers
              type: 'route'
            });
            console.log(`Component ${component.name} appears to be used in routes: ${routeFile.relativePath} at line ${i + 1}`);
            break; // Just report the first occurrence in a file
          }
        }
      }
    }
    
    // Check if the component is only referenced by filename in CSS
    const isOnlyReferencedByCssFileName = 
      imports.length === 0 && 
      !isInBarrel && 
      jsxUsages.length === 0 && 
      routeUsages.length === 0 && 
      cssReferences.length > 0 &&
      cssReferences.every(ref => ref.type === 'fileName');
    
    // Check if barrel references are actually used
    const barrelFilesUsed = barrelUsages.length > 0;

    // Add to report
    componentsReport.push({
      name: component.name,
      file: component.file,
      imports: imports,
      isInBarrel: isInBarrel,
      barrelReferences: barrelReferences,
      barrelUsages: barrelUsages,
      barrelFilesUsed: barrelFilesUsed,
      cssReferences: cssReferences,
      jsxUsages: jsxUsages,
      routeUsages: routeUsages,
      isOnlyReferencedByCssFileName: isOnlyReferencedByCssFileName,
      isUnused: imports.length === 0 && (!isInBarrel || !barrelFilesUsed) && cssReferences.length === 0 && jsxUsages.length === 0 && routeUsages.length === 0
    });
  }
  
  // Generate report file
  const reportFilePath = path.join(__dirname, 'component-usage-report.md');
  let reportContent = '# Component Usage Report\n\n';
  reportContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  // Add summary section
  const unusedComponents = componentsReport.filter(comp => comp.isUnused);
  const cssFileNameOnlyComponents = componentsReport.filter(comp => comp.isOnlyReferencedByCssFileName);
  const componentsInUnusedBarrelFiles = componentsReport.filter(comp => 
    comp.isInBarrel && !comp.barrelFilesUsed && comp.imports.length === 0
  );
  
  reportContent += `## Summary\n\n`;
  reportContent += `- Total components analyzed: ${componentsReport.length}\n`;
  reportContent += `- Unused components: ${unusedComponents.length}\n`;
  reportContent += `- Components only in unused barrel files: ${componentsInUnusedBarrelFiles.length}\n`;
  reportContent += `- Components only referenced by CSS filename: ${cssFileNameOnlyComponents.length}\n`;
  reportContent += `- Fully used components: ${componentsReport.length - unusedComponents.length - cssFileNameOnlyComponents.length}\n\n`;
  
  if (unusedComponents.length > 0) {
    reportContent += `## Unused Components\n\n`;
    unusedComponents.forEach(comp => {
      reportContent += `- **${comp.name}** (in \`${comp.file}\`)\n`;
    });
    reportContent += '\n';
  }
  
  if (componentsInUnusedBarrelFiles.length > 0) {
    reportContent += `## Components Only in Unused Barrel Files\n\n`;
    reportContent += `These components are only exported in barrel files that aren't imported anywhere else in your codebase.\n\n`;
    componentsInUnusedBarrelFiles.forEach(comp => {
      reportContent += `- **${comp.name}** (in \`${comp.file}\`)\n`;
      comp.barrelReferences.forEach(ref => {
        reportContent += `  - Exported in unused barrel file: \`${ref.file}\`\n`;
      });
    });
    reportContent += '\n';
  }
  
  if (cssFileNameOnlyComponents.length > 0) {
    reportContent += `## Components Only Referenced By CSS Filename\n\n`;
    reportContent += `These components may not be actively used in your codebase. They are only detected because they have a CSS file with the same name.\n\n`;
    cssFileNameOnlyComponents.forEach(comp => {
      reportContent += `- **${comp.name}** (in \`${comp.file}\`)\n`;
    });
    reportContent += '\n';
  }
  
  // Detailed report of all components
  reportContent += `## Detailed Component Analysis\n\n`;
  
  // Sort components alphabetically by name
  componentsReport.sort((a, b) => a.name.localeCompare(b.name));
  
  for (const comp of componentsReport) {
    reportContent += `### ${comp.name}\n\n`;
    reportContent += `- **File**: \`${comp.file}\`\n`;
    let statusText = '✅ USED';
    let statusColor = '';
    if (comp.isUnused) {
      statusText = '❌ UNUSED';
      statusColor = '';
    } else if (comp.isOnlyReferencedByCssFileName) {
      statusText = '⚠️ ONLY CSS FILENAME';
      statusColor = '';
    }
    
    reportContent += `- **Status**: ${statusText}${statusColor}\n`;
    
    // Add barrel file information
    if (comp.isInBarrel) {
      const barrelStatus = comp.barrelFilesUsed ? '✅ USED' : '❌ UNUSED';
      reportContent += `- **In Barrel Files**: Yes (${barrelStatus})\n`;
      
      comp.barrelReferences.forEach(ref => {
        reportContent += `  - Exported in \`${ref.file}\` at line ${ref.line}: \`${ref.exportStatement}\`\n`;
        
        // Check if this barrel file is used elsewhere
        const matchingUsage = comp.barrelUsages.find(usage => usage.barrelFile === ref.file);
        if (matchingUsage && matchingUsage.usages.length > 0) {
          reportContent += `    - This barrel file is imported in:\n`;
          matchingUsage.usages.forEach(usage => {
            reportContent += `      - \`${usage.file}\` at line ${usage.line}: \`${usage.importStatement}\`\n`;
          });
        } else {
          reportContent += `    - ⚠️ This barrel file is not imported anywhere!\n`;
        }
      });
    } else {
      reportContent += `- **In Barrel Files**: No\n`;
    }
    
    if (!comp.isUnused) {
      reportContent += `- **Usage Details**:\n`;
      
      if (comp.imports.length > 0) {
        reportContent += `  - **Imported in**:\n`;
        comp.imports.forEach(imp => {
          reportContent += `    - \`${imp.file}\` (línea ${imp.line}, ${imp.type})\n`;
        });
      }
      
      if (comp.isInBarrel && comp.barrelReferences && comp.barrelReferences.length > 0) {
        reportContent += `  - **Re-exported in barrel files**:\n`;
        comp.barrelReferences.forEach(ref => {
          reportContent += `    - \`${ref.file}\` (línea ${ref.line}): \`${ref.exportStatement}\`\n`;
        });
      }
      
      if (comp.cssReferences && comp.cssReferences.length > 0) {
        reportContent += `  - **Referenced in CSS**:\n`;
        comp.cssReferences.forEach(ref => {
          const lineInfo = ref.line ? ` (línea ${ref.line})` : '';
          reportContent += `    - \`${ref.file}\` (${ref.type}${lineInfo})\n`;
        });
      }
      
      if (comp.jsxUsages.length > 0) {
        reportContent += `  - **Used in JSX in**:\n`;
        comp.jsxUsages.forEach(jsx => {
          reportContent += `    - \`${jsx.file}\` (línea ${jsx.line})\n`;
        });
      }
      
      if (comp.routeUsages.length > 0) {
        reportContent += `  - **Used in routes in**:\n`;
        comp.routeUsages.forEach(route => {
          reportContent += `    - \`${route.file}\` (línea ${route.line})\n`;
        });
      }
    }
    
    reportContent += '\n---\n\n';
  }
  
  // Add recommendations section
  reportContent += `## Recommendations\n\n`;
  reportContent += `- Components marked as **UNUSED** can be safely removed from the codebase if they are not needed for future use.\n`;
  reportContent += `- When removing a component, check if it's exported in any barrel files and remove those export statements as well.\n`;
  reportContent += `- Components in **UNUSED BARREL FILES** might need to be reconsidered for removal since they're only exported in barrel files that aren't used elsewhere.\n`;
  reportContent += `- Components marked as **ONLY CSS FILENAME** should be reviewed to determine if they are truly needed.\n\n`;
  
  reportContent += `Report generated by find-unused-components-final.js\n`;
  
  // Write report file
  fs.writeFileSync(reportFilePath, reportContent);
  
  // Print results to console
  console.log(`\n===== COMPONENT USAGE ANALYSIS SUMMARY =====`);
  console.log(`Total components analyzed: ${componentsReport.length}`);
  console.log(`Fully used components: ${componentsReport.length - unusedComponents.length - cssFileNameOnlyComponents.length - componentsInUnusedBarrelFiles.length}`);
  
  console.log(`\n===== UNUSED COMPONENTS (${unusedComponents.length}) =====`);
  
  if (unusedComponents.length === 0) {
    console.log('No unused components found.');
  } else {
    unusedComponents.forEach(component => {
      console.log(`- ${component.name} (in ${component.file})`);
    });
    
    console.log('\nThese components are not detected as used in your codebase.');
  }
  
  console.log(`\n===== COMPONENTS IN UNUSED BARREL FILES (${componentsInUnusedBarrelFiles.length}) =====`);
  if (componentsInUnusedBarrelFiles.length === 0) {
    console.log('No components found in unused barrel files.');
  } else {
    componentsInUnusedBarrelFiles.forEach(comp => {
      console.log(`- ${comp.name} (in ${comp.file})`);
      comp.barrelReferences.forEach(ref => {
        console.log(`  - Exported in unused barrel file: ${ref.file}`);
      });
    });
    console.log('\nThese components are only exported in barrel files that aren\'t imported anywhere else.');
  }
  
  console.log(`\n===== COMPONENTS ONLY REFERENCED BY CSS FILENAME (${cssFileNameOnlyComponents.length}) =====`);
  
  if (cssFileNameOnlyComponents.length === 0) {
    console.log('No components found that are only referenced by CSS filename.');
  } else {
    cssFileNameOnlyComponents.forEach(component => {
      console.log(`- ${component.name} (in ${component.file})`);
    });
    
    console.log('\nThese components might not be actively used in your codebase.');
    console.log('They are only detected because they have a CSS file with the same name.');
    console.log('Consider checking if they are used in other ways or can be removed.');
  }
  
  console.log('\nWe checked all components for:');
  console.log('1. Direct imports in other files');
  console.log('2. Re-exports through barrel files');
  console.log('3. References in CSS files and CSS modules');
  console.log('4. Direct usage in JSX');
  console.log('5. Usage in routing configuration');
  console.log('6. Dynamic imports and React.lazy() usage');
  console.log('\nReview components carefully before removal as they might be used in ways this script');
  console.log('couldn\'t detect (e.g., string-based dynamic rendering or very custom patterns).');
  
  console.log(`\nDetailed report saved to: ${reportFilePath}`);
}

// Execute the function and show progress
console.time('Analysis completed in');
console.log('Starting analysis...');
findUnusedComponents();
console.timeEnd('Analysis completed in');
