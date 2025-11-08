import { LegibleEngine } from '@legible-sync/core';
import { PluginManager, Plugin } from '../../src/core/PluginManager';

describe('PluginManager', () => {
  let engine: LegibleEngine;
  let pluginManager: PluginManager;

  beforeEach(() => {
    engine = new LegibleEngine();
    pluginManager = new PluginManager(engine);
  });

  describe('Plugin Loading', () => {
    it('should load a plugin successfully', async () => {
      const mockPlugin: Plugin = {
        name: 'test-plugin',
        concepts: {
          TestConcept: {
            state: { counter: 0 },
            execute: jest.fn().mockResolvedValue({ success: true })
          }
        },
        syncs: [],
        initialize: jest.fn().mockResolvedValue(undefined)
      };

      await pluginManager.loadPlugin(mockPlugin);

      expect(mockPlugin.initialize).toHaveBeenCalledWith(engine);
      expect(pluginManager.getLoadedPlugins()).toContain('test-plugin');
      expect(pluginManager.getPlugin('test-plugin')).toBe(mockPlugin);
    });

    it('should register concepts and syncs with the engine', async () => {
      const mockConcept = {
        state: {},
        execute: jest.fn().mockResolvedValue({ result: 'ok' })
      };

      const mockSync = {
        name: 'test-sync',
        when: [{ concept: 'TestConcept', action: 'test' }],
        then: [{ concept: 'OtherConcept', action: 'handle', input: {} }]
      };

      const mockPlugin: Plugin = {
        name: 'test-plugin',
        concepts: { TestConcept: mockConcept },
        syncs: [mockSync]
      };

      // Mock engine methods
      const registerConceptSpy = jest.spyOn(engine as any, 'registerConcept');
      const registerSyncSpy = jest.spyOn(engine as any, 'registerSync');

      await pluginManager.loadPlugin(mockPlugin);

      expect(registerConceptSpy).toHaveBeenCalledWith('TestConcept', mockConcept);
      expect(registerSyncSpy).toHaveBeenCalledWith(mockSync);
    });

    it('should handle plugin initialization errors', async () => {
      const mockPlugin: Plugin = {
        name: 'failing-plugin',
        concepts: {},
        syncs: [],
        initialize: jest.fn().mockRejectedValue(new Error('Init failed'))
      };

      await expect(pluginManager.loadPlugin(mockPlugin)).rejects.toThrow('Init failed');
      expect(pluginManager.getLoadedPlugins()).not.toContain('failing-plugin');
    });
  });

  describe('Plugin Management', () => {
    it('should return loaded plugin names', async () => {
      const plugin1: Plugin = {
        name: 'plugin1',
        concepts: {},
        syncs: []
      };

      const plugin2: Plugin = {
        name: 'plugin2',
        concepts: {},
        syncs: []
      };

      await pluginManager.loadPlugin(plugin1);
      await pluginManager.loadPlugin(plugin2);

      const loadedPlugins = pluginManager.getLoadedPlugins();
      expect(loadedPlugins).toHaveLength(2);
      expect(loadedPlugins).toContain('plugin1');
      expect(loadedPlugins).toContain('plugin2');
    });

    it('should return specific plugin by name', async () => {
      const mockPlugin: Plugin = {
        name: 'specific-plugin',
        concepts: {},
        syncs: []
      };

      await pluginManager.loadPlugin(mockPlugin);

      expect(pluginManager.getPlugin('specific-plugin')).toBe(mockPlugin);
      expect(pluginManager.getPlugin('non-existent')).toBeUndefined();
    });
  });
});