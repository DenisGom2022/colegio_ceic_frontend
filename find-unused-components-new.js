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
    
    let found = false;
    
    // Check import patterns
    for (const regex of importRegexes) {
      if (regex.test(content)) {
        imports.push(file.relativePath);
        found = true;
        break;
      }
    }
    
    // If not found through imports, check other usage patterns
    if (!found) {
      for (const regex of usageRegexes) {
        if (regex.test(content)) {
          imports.push(file.relativePath);
          break;
        }
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
  
  for (const file of barrelFiles) {
    const content = fs.readFileSync(file.path, 'utf8');
    
    // Check for different barrel file export patterns
    const barrelExportPatterns = [
      new RegExp(`export\\s+{\\s*(?:default\\s+as\\s+)?${componentName}\\s*}\\s+from`, 'g'),
      new RegExp(`export\\s+\\*\\s+from\\s+['"]\\./(?:\\.\\./)*(${componentName}|${componentName.toLowerCase()})['"']`, 'g'),
      new RegExp(`export\\s+{[^}]*\\b${componentName}\\b[^}]*}`, 'g')
    ];
    
    for (const pattern of barrelExportPatterns) {
      if (pattern.test(content)) {
        return true;
      }
    }
  }
  
  return false;
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
      
      // CSS class selectors might be in different formats - more specific patterns to avoid false positives
      const cssPatterns = [
        { pattern: new RegExp(`\\.${componentName}[\\s{:]`, ''), desc: 'class selector (exact case)' },
        { pattern: new RegExp(`\\.${kebabCase}[\\s{:]`, ''), desc: 'class selector (kebab-case)' },
        { pattern: new RegExp(`\\[class\\*="${componentName}"]`, ''), desc: 'attribute selector' },
        { pattern: new RegExp(`\\[class\\*="${kebabCase}"]`, ''), desc: 'attribute selector (kebab-case)' }
      ];
    
    for (const { pattern, desc } of cssPatterns) {
      if (pattern.test(content)) {
        cssReferences.push({
          file: file.relativePath,
          type: desc
        });
        break; // Only add each file once
      }
    }
  }
  
  return cssReferences;
}

// Main function
function findUnusedComponents() {
  // Get all files
  const files = getAllFiles(srcDir, allExtensions);
  
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
    const isInBarrel = isInBarrelFile(component.name, files);
    const cssReferences = isReferencedInCssFiles(component.name, files);
    
    // Check for JSX usage
    let jsxUsages = [];
    const filesWithJSX = files.filter(file => 
      ['.tsx', '.jsx'].includes(path.extname(file.path))
    );
    
    for (const file of filesWithJSX) {
      const content = fs.readFileSync(file.path, 'utf8');
      const jsxRegex = new RegExp(`<${component.name}[\\s>]`);
      if (jsxRegex.test(content)) {
        jsxUsages.push(file.relativePath);
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
        if (content.includes(component.name)) {
          routeUsages.push(routeFile.relativePath);
          console.log(`Component ${component.name} appears to be used in routes: ${routeFile.relativePath}`);
        }
      }
    }
    
    // Add to report
    componentsReport.push({
      name: component.name,
      file: component.file,
      imports: imports,
      isInBarrel: isInBarrel,
      cssReferences: cssReferences,
      jsxUsages: jsxUsages,
      routeUsages: routeUsages,
      isUnused: imports.length === 0 && !isInBarrel && cssReferences.length === 0 && jsxUsages.length === 0 && routeUsages.length === 0
    });
  }
  
  // Generate report file
  const reportFilePath = path.join(__dirname, 'component-usage-report.md');
  let reportContent = '# Component Usage Report\n\n';
  reportContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  // Add summary section
  const unusedComponents = componentsReport.filter(comp => comp.isUnused);
  reportContent += `## Summary\n\n`;
  reportContent += `- Total components analyzed: ${componentsReport.length}\n`;
  reportContent += `- Unused components: ${unusedComponents.length}\n`;
  reportContent += `- Used components: ${componentsReport.length - unusedComponents.length}\n\n`;
  
  if (unusedComponents.length > 0) {
    reportContent += `## Unused Components\n\n`;
    unusedComponents.forEach(comp => {
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
    reportContent += `- **Status**: ${comp.isUnused ? '❌ UNUSED' : '✅ USED'}\n`;
    
    if (!comp.isUnused) {
      reportContent += `- **Usage Details**:\n`;
      
      if (comp.imports.length > 0) {
        reportContent += `  - **Imported in**:\n`;
        comp.imports.forEach(imp => {
          reportContent += `    - \`${imp}\`\n`;
        });
      }
      
      if (comp.isInBarrel) {
        reportContent += `  - **Re-exported in barrel files**\n`;
      }
      
      if (comp.cssReferences && comp.cssReferences.length > 0) {
        reportContent += `  - **Referenced in CSS**:\n`;
        comp.cssReferences.forEach(ref => {
          reportContent += `    - \`${ref.file}\` (${ref.type})\n`;
        });
      }
      
      if (comp.jsxUsages.length > 0) {
        reportContent += `  - **Used in JSX in**:\n`;
        comp.jsxUsages.forEach(jsx => {
          reportContent += `    - \`${jsx}\`\n`;
        });
      }
      
      if (comp.routeUsages.length > 0) {
        reportContent += `  - **Used in routes in**:\n`;
        comp.routeUsages.forEach(route => {
          reportContent += `    - \`${route}\`\n`;
        });
      }
    }
    
    reportContent += '\n---\n\n';
  }
  
  // Write report file
  fs.writeFileSync(reportFilePath, reportContent);
  
  // Print results to console
  console.log(`\n===== UNUSED COMPONENTS (${unusedComponents.length}) =====`);
  
  if (unusedComponents.length === 0) {
    console.log('No unused components found. Great job keeping your codebase clean!');
  } else {
    unusedComponents.forEach(component => {
      console.log(`- ${component.name} (in ${component.file})`);
    });
    
    console.log('\nThese components are not detected as used in your codebase. We checked for:');
    console.log('1. Direct imports in other files');
    console.log('2. Re-exports through barrel files');
    console.log('3. References in CSS files and CSS modules');
    console.log('4. Direct usage in JSX');
    console.log('5. Usage in routing configuration');
    console.log('6. Dynamic imports and React.lazy() usage');
    console.log('\nReview them carefully before removal as they might be used in ways this script');
    console.log('couldn\'t detect (e.g., string-based dynamic rendering or very custom patterns).');
  }
  
  console.log(`\nDetailed report saved to: ${reportFilePath}`);
}

// Execute the function and show progress
console.time('Analysis completed in');
console.log('Starting analysis...');
findUnusedComponents();
console.timeEnd('Analysis completed in');
