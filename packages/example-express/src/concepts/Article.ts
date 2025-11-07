// concepts/Article.ts
import { ConceptImpl } from '@legible-sync/core';
import { v4 as uuidv4 } from 'uuid';

function slugify(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export const Article: ConceptImpl = {
  state: {
    articles: new Set<string>(),
    title: new Map<string, string>(),
    body: new Map<string, string>(),
    author: new Map<string, string>(),
    slug: new Map<string, string>(),
  },

  async execute(action: string, input: any) {
    const state = this.state;

    if (action === 'create') {
      const { article, title, body, author } = input;
      if (!title) throw new Error('Title required');

      const slug = slugify(title);
      if ([...state.slug.values()].includes(slug)) throw new Error('Slug collision');

      state.articles.add(article);
      state.title.set(article, title);
      state.body.set(article, body);
      state.author.set(article, author);
      state.slug.set(article, slug);

      return { article, slug };
    }

    throw new Error(`Unknown action: ${action}`);
  }
};