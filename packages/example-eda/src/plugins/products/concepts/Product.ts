// plugins/products/concepts/Product.ts
import { Concept } from '@legible-sync/core';
import { v4 as uuidv4 } from 'uuid';

export const Product: Concept = {
  state: {
    products: new Map<string, any>(),
    skus: new Set<string>(),
  },

  async execute(action: string, input: any) {
    const state = this.state;

    switch (action) {
      case 'create': {
        const { name, sku, price, description, category } = input;

        // Validation
        if (!name || !sku || price === undefined) {
          throw new Error('Name, SKU, and price are required');
        }

        if (state.skus.has(sku)) {
          throw new Error('SKU already exists');
        }

        // Create product
        const productId = uuidv4();
        const product = {
          id: productId,
          name,
          sku,
          price: Number(price),
          description: description || '',
          category: category || 'general',
          status: 'active',
          createdAt: new Date()
        };

        state.products.set(productId, product);
        state.skus.add(sku);

        return { productId, product };
      }

      case 'get': {
        const { productId } = input;
        const product = state.products.get(productId);
        if (!product) {
          throw new Error('Product not found');
        }
        return { product };
      }

      case 'update': {
        const { productId, updates } = input;
        const product = state.products.get(productId);
        if (!product) {
          throw new Error('Product not found');
        }

        // Update product
        const updatedProduct = { ...product, ...updates, updatedAt: new Date() };
        state.products.set(productId, updatedProduct);

        return { product: updatedProduct };
      }

      case 'deactivate': {
        const { productId } = input;
        const product = state.products.get(productId);
        if (!product) {
          throw new Error('Product not found');
        }

        product.status = 'inactive';
        product.deactivatedAt = new Date();
        state.products.set(productId, product);

        return { product };
      }

      case 'list': {
        const { category, status = 'active' } = input;
        const products = Array.from(state.products.values())
          .filter((p: any) => p.status === status)
          .filter((p: any) => !category || p.category === category);

        return { products };
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
};