/**
 * Configuration Merger Module
 * Merges user configuration with foundation defaults
 */

/**
 * Check if value is a plain object
 * @param {*} value 
 * @returns {boolean}
 */
function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Deep clone an object
 * @param {*} obj 
 * @returns {*}
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key of Object.keys(obj)) {
    cloned[key] = deepClone(obj[key]);
  }
  return cloned;
}

/**
 * Deep merge two objects
 * User config overrides foundation defaults
 * Arrays are replaced, not merged
 * 
 * @param {Object} foundationDefaults - Base configuration from foundation
 * @param {Object} userConfig - User overrides
 * @returns {Object} Merged configuration
 */
function mergeConfig(foundationDefaults, userConfig) {
  const result = deepClone(foundationDefaults);
  
  if (!userConfig || typeof userConfig !== 'object') {
    return result;
  }
  
  for (const key of Object.keys(userConfig)) {
    if (userConfig[key] === undefined || userConfig[key] === null) {
      continue;
    }
    
    // Handle $preset key - skip it (it's just a reference)
    if (key === '$preset') {
      continue;
    }
    
    // If both are objects (not arrays), deep merge
    if (isObject(userConfig[key]) && isObject(result[key])) {
      result[key] = mergeConfig(result[key], userConfig[key]);
    } else {
      // Otherwise, user value replaces default
      result[key] = deepClone(userConfig[key]);
    }
  }
  
  return result;
}

/**
 * Merge preset with user config
 * @param {Object} presetConfig - Preset configuration (e.g., typescript.yaml)
 * @param {Object} defaultConfig - Default configuration
 * @param {Object} userConfig - User configuration
 * @returns {Object} Final merged configuration
 */
function mergeWithPreset(presetConfig, defaultConfig, userConfig) {
  // First merge preset with defaults
  let result = mergeConfig(defaultConfig, presetConfig || {});
  
  // Then merge user config
  result = mergeConfig(result, userConfig || {});
  
  return result;
}

/**
 * Validate merged configuration
 * @param {Object} config - Merged configuration
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateMergedConfig(config) {
  const errors = [];
  
  // Check required fields
  if (!config.version) {
    errors.push('Missing required field: version');
  }
  
  if (!config.project) {
    errors.push('Missing required field: project');
  } else {
    if (!config.project.name) {
      errors.push('Missing required field: project.name');
    }
    if (!config.project.language) {
      errors.push('Missing required field: project.language');
    }
  }
  
  // Validate agents
  if (config.agents) {
    const validAgents = ['planner', 'architect', 'developer', 'qa', 'reviewer', 'triage', 'ci_analyst'];
    for (const agentName of Object.keys(config.agents)) {
      if (!validAgents.includes(agentName)) {
        errors.push(`Unknown agent: ${agentName}`);
      }
    }
  }
  
  // Validate workflows
  if (config.workflows) {
    const validRoles = ['planner', 'architect', 'developer', 'qa', 'reviewer', 'triage', 'ci_analyst'];
    for (const [workflowName, workflow] of Object.entries(config.workflows)) {
      if (!workflow.sequence || !Array.isArray(workflow.sequence)) {
        errors.push(`Workflow '${workflowName}' must have a sequence array`);
      } else {
        for (const role of workflow.sequence) {
          if (!validRoles.includes(role)) {
            errors.push(`Unknown role '${role}' in workflow '${workflowName}'`);
          }
        }
      }
    }
  }
  
  // Validate rules
  if (config.rules) {
    if (config.rules.test_coverage_threshold !== undefined) {
      const threshold = config.rules.test_coverage_threshold;
      if (typeof threshold !== 'number' || threshold < 0 || threshold > 100) {
        errors.push('test_coverage_threshold must be a number between 0 and 100');
      }
    }
    
    if (config.rules.max_function_lines !== undefined) {
      const lines = config.rules.max_function_lines;
      if (typeof lines !== 'number' || lines < 1) {
        errors.push('max_function_lines must be a positive number');
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  mergeConfig,
  mergeWithPreset,
  validateMergedConfig,
  deepClone,
  isObject
};