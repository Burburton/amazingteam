import { VERSION, AGENTS, getAgent, listAgents, AgentConfig } from './index';

describe('AI Team', () => {
  describe('VERSION', () => {
    it('should be defined', () => {
      expect(VERSION).toBeDefined();
      expect(VERSION).toBe('1.0.0');
    });

    it('should be a string', () => {
      expect(typeof VERSION).toBe('string');
    });

    it('should follow semantic versioning format', () => {
      expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('AGENTS', () => {
    it('should have all required agents', () => {
      expect(AGENTS).toHaveProperty('architect');
      expect(AGENTS).toHaveProperty('developer');
      expect(AGENTS).toHaveProperty('qa');
      expect(AGENTS).toHaveProperty('reviewer');
    });

    it('should have exactly 4 agents defined', () => {
      expect(Object.keys(AGENTS)).toHaveLength(4);
    });

    it('each agent should have required properties', () => {
      Object.values(AGENTS).forEach((agent) => {
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('description');
        expect(agent).toHaveProperty('skills');
        expect(Array.isArray(agent.skills)).toBe(true);
      });
    });

    it('agent names should match their keys', () => {
      Object.entries(AGENTS).forEach(([key, agent]) => {
        expect(agent.name).toBe(key);
      });
    });

    it('each agent should have at least one skill', () => {
      Object.values(AGENTS).forEach((agent) => {
        expect(agent.skills.length).toBeGreaterThan(0);
      });
    });

    it('agent descriptions should be non-empty strings', () => {
      Object.values(AGENTS).forEach((agent) => {
        expect(typeof agent.description).toBe('string');
        expect(agent.description.length).toBeGreaterThan(0);
      });
    });

    it('architect should have repo-architecture-reader skill', () => {
      expect(AGENTS.architect.skills).toContain('repo-architecture-reader');
    });

    it('developer should have test-first-feature-dev skill', () => {
      expect(AGENTS.developer.skills).toContain('test-first-feature-dev');
    });

    it('developer should have bugfix-playbook skill', () => {
      expect(AGENTS.developer.skills).toContain('bugfix-playbook');
    });

    it('qa should have test-first-feature-dev skill', () => {
      expect(AGENTS.qa.skills).toContain('test-first-feature-dev');
    });

    it('reviewer should have safe-refactor-checklist skill', () => {
      expect(AGENTS.reviewer.skills).toContain('safe-refactor-checklist');
    });
  });

  describe('getAgent', () => {
    it('should return agent by name', () => {
      const architect = getAgent('architect');
      expect(architect).toBeDefined();
      expect(architect?.name).toBe('architect');
    });

    it('should return undefined for unknown agent', () => {
      const unknown = getAgent('unknown');
      expect(unknown).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const empty = getAgent('');
      expect(empty).toBeUndefined();
    });

    it('should return undefined for null', () => {
      const nullResult = getAgent(null as unknown as string);
      expect(nullResult).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      const undefinedResult = getAgent(undefined as unknown as string);
      expect(undefinedResult).toBeUndefined();
    });

    it('should return correct agent for all defined agents', () => {
      const agentNames = ['architect', 'developer', 'qa', 'reviewer'];
      agentNames.forEach(name => {
        const agent = getAgent(name);
        expect(agent).toBeDefined();
        expect(agent?.name).toBe(name);
      });
    });

    it('should be case-sensitive', () => {
      const uppercase = getAgent('ARCHITECT');
      expect(uppercase).toBeUndefined();

      const mixedCase = getAgent('Architect');
      expect(mixedCase).toBeUndefined();
    });
  });

  describe('listAgents', () => {
    it('should return all agent names', () => {
      const agents = listAgents();
      expect(agents).toContain('architect');
      expect(agents).toContain('developer');
      expect(agents).toContain('qa');
      expect(agents).toContain('reviewer');
    });

    it('should return exactly 4 agent names', () => {
      const agents = listAgents();
      expect(agents).toHaveLength(4);
    });

    it('should return an array', () => {
      const agents = listAgents();
      expect(Array.isArray(agents)).toBe(true);
    });

    it('should return strings only', () => {
      const agents = listAgents();
      agents.forEach(agent => {
        expect(typeof agent).toBe('string');
      });
    });

    it('should not contain duplicate agent names', () => {
      const agents = listAgents();
      const uniqueAgents = [...new Set(agents)];
      expect(agents).toHaveLength(uniqueAgents.length);
    });

    it('should return a new array on each call', () => {
      const agents1 = listAgents();
      const agents2 = listAgents();
      expect(agents1).not.toBe(agents2);
      expect(agents1).toEqual(agents2);
    });
  });

  describe('AgentConfig interface', () => {
    it('should accept valid agent configuration', () => {
      const validConfig: AgentConfig = {
        name: 'test-agent',
        description: 'A test agent',
        skills: ['skill1', 'skill2']
      };
      expect(validConfig.name).toBe('test-agent');
      expect(validConfig.description).toBe('A test agent');
      expect(validConfig.skills).toEqual(['skill1', 'skill2']);
    });

    it('should accept empty skills array', () => {
      const config: AgentConfig = {
        name: 'test-agent',
        description: 'A test agent',
        skills: []
      };
      expect(config.skills).toEqual([]);
    });

    it('should accept single skill', () => {
      const config: AgentConfig = {
        name: 'test-agent',
        description: 'A test agent',
        skills: ['single-skill']
      };
      expect(config.skills).toHaveLength(1);
    });
  });
});
