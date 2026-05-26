const fs = require('fs');

function run() {
  try {
    // 1. Recibir datos del workflow a través de variables de entorno (inputs)
    const branchName = process.env['INPUT_BRANCH_NAME'] ? process.env['INPUT_BRANCH_NAME'].trim() : '';
    const allowedPrefixesInput = process.env['INPUT_ALLOWED_PREFIXES'] ? process.env['INPUT_ALLOWED_PREFIXES'].trim() : '';

    console.log(`[INFO] Iniciando validación para la rama: "${branchName}"`);
    console.log(`[INFO] Prefijos configurados: "${allowedPrefixesInput}"`);

    // 2. Procesar información y aplicar las reglas de validación
    const prefixes = allowedPrefixesInput.split(',').map(p => p.trim());
    let isValid = false;
    let reason = "El nombre de la rama no cumple con ninguno de los patrones permitidos.";

    for (const prefix of prefixes) {
      // Comprueba si la rama empieza por el prefijo seguido de una barra (ej: feature/)
      if (branchName.startsWith(`${prefix}/`)) {
        isValid = true;
        reason = `La rama es válida. Cumple con el patrón estructurado: "${prefix}/*"`;
        break;
      }
    }

    // 3. Devolver resultados estructurados escribiendo en el archivo de outputs de GitHub
    const outputPath = process.env['GITHUB_OUTPUT'];
    if (outputPath) {
      fs.appendFileSync(outputPath, `is_valid=${isValid}\n`);
      fs.appendFileSync(outputPath, `reason=${reason}\n`);
      console.log("[OK] Outputs estructurados guardados correctamente.");
    } else {
      console.log(`[Simulación Local] is_valid: ${isValid}`);
      console.log(`[Simulación Local] reason: ${reason}`);
    }

  } catch (error) {
    console.error(`[ERROR] Ocurrió un fallo en la lógica: ${error.message}`);
    process.exit(1);
  }
}

// Ejecutar la función principal
run();
