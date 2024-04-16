import { Demo } from '@/types';

export const ProductService = {
    getProductsSmall() {
        return fetch('/data/data/products-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    getProducts() {
        return fetch('/data/data/products.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    getProductsWithOrdersSmall() {
        return fetch('/data/data/products-orders-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    }
};
