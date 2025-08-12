// migration-validator.ts
/**
 * Este script ayuda a detectar posibles problemas después de la migración.
 * Debe ser ejecutado con ts-node o similar.
 * 
 * Para usar este script:
 * 1. npm install --save-dev ts-node @types/node
 * 2. npx ts-node migration-validator.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Añadir tipos para evitar errores de TypeScript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
    }
  }
}

// Configuración
const SRC_DIR = path.join(process.cwd(), 'src');
const OLD_PATHS = ['hooks', 'pages', 'models', 'services'];
const NEW_PATHS = ['features'];
const IGNORE_PATTERNS = ['.git', 'node_modules', 'dist', 'build'];

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Contador de problemas
let issues = {
  duplicatedFiles: 0,
  missingIndexExports: 0,
  potentialCircularDeps: 0,
  totalIssues: 0,
};

// Función principal
async function validateMigration() {
  console.log(`${colors.blue}=== Validación de Migración Feature-Based ===${colors.reset}`);
  console.log(`${colors.blue}Analizando estructura de archivos...${colors.reset}\n`);
  
  await Promise.all([
    checkDuplicatedFiles(),
    checkMissingIndexExports(),
    checkPotentialCircularDeps(),
  ]);
  
  console.log(`\n${colors.blue}=== Resumen ===${colors.reset}`);
  console.log(`${colors.yellow}Archivos duplicados: ${issues.duplicatedFiles}${colors.reset}`);
  console.log(`${colors.yellow}Exportaciones faltantes en index.ts: ${issues.missingIndexExports}${colors.reset}`);
  console.log(`${colors.yellow}Potenciales dependencias circulares: ${issues.potentialCircularDeps}${colors.reset}`);
  console.log(`${colors.yellow}Total de problemas: ${issues.totalIssues}${colors.reset}`);
  
  if (issues.totalIssues === 0) {
    console.log(`\n${colors.green}¡No se encontraron problemas! La migración parece estar en buen estado.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}Se encontraron ${issues.totalIssues} problemas. Revise los detalles arriba.${colors.reset}`);
  }
}

// Verificar archivos duplicados entre la estructura antigua y nueva
async function checkDuplicatedFiles() {
  console.log(`${colors.cyan}Verificando archivos duplicados...${colors.reset}`);
  
  const oldFiles = await getAllFiles(OLD_PATHS.map(dir => path.join(SRC_DIR, dir)));
  const newFiles = await getAllFiles(NEW_PATHS.map(dir => path.join(SRC_DIR, dir)));
  
  const oldFileNames = oldFiles.map(file => path.basename(file));
  const newFileNames = newFiles.map(file => path.basename(file));
  
  const duplicates = oldFileNames.filter(file => newFileNames.includes(file));
  
  if (duplicates.length > 0) {
    console.log(`${colors.red}Archivos duplicados encontrados:${colors.reset}`);
    duplicates.forEach(file => {
      console.log(`  - ${file}`);
      issues.duplicatedFiles++;
      issues.totalIssues++;
    });
  } else {
    console.log(`${colors.green}No se encontraron archivos duplicados.${colors.reset}`);
  }
}

// Verificar que cada directorio en la nueva estructura tiene un index.ts
async function checkMissingIndexExports() {
  console.log(`\n${colors.cyan}Verificando exportaciones en index.ts...${colors.reset}`);
  
  const featureDirs = await findDirectories(path.join(SRC_DIR, 'features'));
  
  for (const dir of featureDirs) {
    const subDirs = await findDirectories(dir);
    
    for (const subDir of subDirs) {
      if (path.basename(subDir) !== 'node_modules') {
        const indexFile = path.join(subDir, 'index.ts');
        
        if (!fs.existsSync(indexFile)) {
          console.log(`${colors.red}Falta index.ts en ${subDir.replace(SRC_DIR, 'src')}${colors.reset}`);
          issues.missingIndexExports++;
          issues.totalIssues++;
        } else {
          // Verificar que el index.ts exporta todos los archivos del directorio
          const dirFiles = await getAllFiles([subDir], [indexFile]);
          const indexContent = fs.readFileSync(indexFile, 'utf-8');
          
          for (const file of dirFiles) {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
              const basename = path.basename(file).replace(/\.(ts|tsx)$/, '');
              if (!indexContent.includes(`from './${basename}'`) && !indexContent.includes(`from "./${basename}"`)) {
                console.log(`${colors.yellow}Posible exportación faltante en ${indexFile.replace(SRC_DIR, 'src')}: ${basename}${colors.reset}`);
                issues.missingIndexExports++;
                issues.totalIssues++;
              }
            }
          }
        }
      }
    }
  }
  
  if (issues.missingIndexExports === 0) {
    console.log(`${colors.green}Todos los directorios tienen index.ts con las exportaciones necesarias.${colors.reset}`);
  }
}

// Verificar potenciales dependencias circulares
async function checkPotentialCircularDeps() {
  console.log(`\n${colors.cyan}Verificando potenciales dependencias circulares...${colors.reset}`);
  
  const featureFiles = await getAllFiles([path.join(SRC_DIR, 'features')]);
  const imports = new Map();
  
  for (const file of featureFiles) {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(file, 'utf-8');
      const fileImports = extractImports(content);
      imports.set(file, fileImports);
    }
  }
  
  const checked = new Set();
  
  for (const [file, fileImports] of imports.entries()) {
    for (const importPath of fileImports) {
      if (importPath.startsWith('.')) {
        const resolvedPath = path.resolve(path.dirname(file), importPath);
        const possiblePaths = [
          `${resolvedPath}.ts`,
          `${resolvedPath}.tsx`,
          `${resolvedPath}/index.ts`,
          `${resolvedPath}/index.tsx`,
        ];
        
        for (const possiblePath of possiblePaths) {
          if (fs.existsSync(possiblePath) && imports.has(possiblePath)) {
            const key = [file, possiblePath].sort().join('->');
            
            if (!checked.has(key)) {
              checked.add(key);
              
              const reverseImports = imports.get(possiblePath) || [];
              for (const reverseImport of reverseImports) {
                if (reverseImport.startsWith('.')) {
                  const reverseResolved = path.resolve(path.dirname(possiblePath), reverseImport);
                  const reversePossiblePaths = [
                    `${reverseResolved}.ts`,
                    `${reverseResolved}.tsx`,
                    `${reverseResolved}/index.ts`,
                    `${reverseResolved}/index.tsx`,
                  ];
                  
                  if (reversePossiblePaths.some(p => p === file || (p.startsWith(file) && p.slice(file.length).startsWith('/')))) {
                    console.log(`${colors.red}Potencial dependencia circular:${colors.reset}`);
                    console.log(`  - ${file.replace(SRC_DIR, 'src')} -> ${possiblePath.replace(SRC_DIR, 'src')}`);
                    issues.potentialCircularDeps++;
                    issues.totalIssues++;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  if (issues.potentialCircularDeps === 0) {
    console.log(`${colors.green}No se detectaron potenciales dependencias circulares.${colors.reset}`);
  }
}

// Extraer importaciones de un archivo
function extractImports(content) {
  const imports = [];
  const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

// Encontrar todos los directorios en un directorio dado
async function findDirectories(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const dirs = entries
    .filter(entry => entry.isDirectory() && !IGNORE_PATTERNS.includes(entry.name))
    .map(entry => path.join(dir, entry.name));
  
  return dirs;
}

// Obtener todos los archivos recursivamente
async function getAllFiles(dirs, excludeFiles = []) {
  const excludeSet = new Set(excludeFiles.map(f => path.normalize(f)));
  const files = [];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (IGNORE_PATTERNS.some(pattern => entry.name.includes(pattern))) {
        continue;
      }
      
      if (entry.isDirectory()) {
        const subDirFiles = await getAllFiles([fullPath], excludeFiles);
        files.push(...subDirFiles);
      } else if (entry.isFile() && !excludeSet.has(path.normalize(fullPath))) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// Ejecutar la validación
validateMigration().catch(error => {
  console.error(`${colors.red}Error durante la validación:${colors.reset}`, error);
  process.exit(1);
});
