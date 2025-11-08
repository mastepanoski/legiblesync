// core/PluginManager.ts
import { LegibleEngine, Concept, SyncRule } from '@legible-sync/core';

export interface Plugin {
  name: string;
  concepts: Record<string, Concept>;
  syncs: SyncRule[];
  initialize?: (engine: LegibleEngine) => Promise<void>;
}

export class PluginManager {
  private engine: LegibleEngine;
  private loadedPlugins: Map<string, Plugin> = new Map();

  constructor(engine: LegibleEngine) {
    this.engine = engine;
  }

  async loadPlugin(plugin: Plugin): Promise<void> {
    console.log(`🔌 Loading plugin: ${plugin.name}`);

    // Register concepts
    for (const [name, concept] of Object.entries(plugin.concepts)) {
      this.engine.registerConcept(name, concept);
      console.log(`  ✓ Registered concept: ${name}`);
    }

    // Register sync rules
    for (const sync of plugin.syncs) {
      this.engine.registerSync(sync);
      console.log(`  ✓ Registered sync: ${sync.name}`);
    }

    // Initialize plugin if needed
    if (plugin.initialize) {
      await plugin.initialize(this.engine);
      console.log(`  ✓ Initialized plugin: ${plugin.name}`);
    }

    this.loadedPlugins.set(plugin.name, plugin);
    console.log(`✅ Plugin ${plugin.name} loaded successfully\n`);
  }

  getLoadedPlugins(): string[] {
    return Array.from(this.loadedPlugins.keys());
  }

  getPlugin(name: string): Plugin | undefined {
    return this.loadedPlugins.get(name);
  }
}