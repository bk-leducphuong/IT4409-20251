# Testing Guide

## Overview

This project uses **Jest** for unit testing. The tests are written for controllers to ensure API endpoints behave correctly.

## Setup

### Install Dependencies

```bash
npm install
```

This will install Jest and @jest/globals as specified in `package.json`.

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes)

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

## Test Structure

Tests are organized in `__test__` directories next to the files they test:

```
controllers/
  ├── __test__/
  │   ├── product.controller.test.js
  │   ├── category.controller.test.js
  │   ├── brand.controller.test.js
  │   ├── admin.product.controller.test.js
  │   ├── admin.category.controller.test.js
  │   └── admin.brand.controller.test.js
  ├── product.controller.js
  ├── category.controller.js
  ├── brand.controller.js
  ├── admin.product.controller.js
  ├── admin.category.controller.js
  ├── admin.brand.controller.js
  └── ...
```

## Test Coverage

Current test files cover:

### ✅ Product Controller (`product.controller.test.js`)

- `getProducts()` - List products with filters, search, sorting, pagination
- `getProductBySlug()` - Get product details with variants

**Test Cases:**

- ✓ Return products with default pagination
- ✓ Return products with custom filters (category, brand, search, sort)
- ✓ Handle empty results
- ✓ Return product by slug with variants
- ✓ Return 404 for non-existent product
- ✓ Handle service errors

### ✅ Category Controller (`category.controller.test.js`)

- `getCategories()` - List all categories
- `getCategoryBySlug()` - Get category with subcategories

**Test Cases:**

- ✓ Return all categories
- ✓ Return empty array when no categories exist
- ✓ Return category with subcategories
- ✓ Return 404 for non-existent category
- ✓ Handle service errors

### ✅ Brand Controller (`brand.controller.test.js`)

- `getBrands()` - List all brands
- `getBrandById()` - Get brand by ID

**Test Cases:**

- ✓ Return all brands
- ✓ Return empty array when no brands exist
- ✓ Return brand by ID
- ✓ Return 404 for non-existent brand
- ✓ Handle service errors

### ✅ Admin Product Controller (`admin.product.controller.test.js`)

- `createProduct()` - Create new product
- `updateProduct()` - Update product
- `deleteProduct()` - Delete product (cascade)
- `createVariant()` - Add product variant
- `updateVariant()` - Update variant
- `deleteVariant()` - Delete variant

**Test Cases:**

- ✓ Create product successfully
- ✓ Validate required fields
- ✓ Handle duplicate slug error
- ✓ Update product successfully
- ✓ Delete product with cascade
- ✓ Create/update/delete variants
- ✓ Return 404 for non-existent resources
- ✓ Handle validation and service errors

### ✅ Admin Category Controller (`admin.category.controller.test.js`)

- `createCategory()` - Create new category
- `updateCategory()` - Update category
- `deleteCategory()` - Delete category

**Test Cases:**

- ✓ Create category with/without parent
- ✓ Validate required fields (name, slug)
- ✓ Handle duplicate slug error
- ✓ Handle invalid parent category
- ✓ Update category fields
- ✓ Prevent self-reference
- ✓ Prevent deletion with child categories
- ✓ Return 404 for non-existent categories
- ✓ Handle service errors

### ✅ Admin Brand Controller (`admin.brand.controller.test.js`)

- `createBrand()` - Create new brand
- `updateBrand()` - Update brand
- `deleteBrand()` - Delete brand

**Test Cases:**

- ✓ Create brand with/without logo
- ✓ Validate required field (name)
- ✓ Handle duplicate name error
- ✓ Update brand fields
- ✓ Update name or logo separately
- ✓ Delete brand successfully
- ✓ Return 404 for non-existent brands
- ✓ Handle invalid ObjectId
- ✓ Handle service errors

## Test Statistics

**Total Test Coverage: 73 test cases**

| Controller          | Functions | Test Cases |
| ------------------- | --------- | ---------- |
| Product (Customer)  | 2         | 13         |
| Category (Customer) | 2         | 6          |
| Brand (Customer)    | 2         | 6          |
| Admin Product       | 6         | 16         |
| Admin Category      | 3         | 16         |
| Admin Brand         | 3         | 16         |
| **Total**           | **18**    | **73**     |

## Writing New Tests

### Basic Test Structure

```javascript
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { yourFunction } from '../your.controller.js';
import yourService from '../../services/your.service.js';

// Mock the service
jest.mock('../../services/your.service.js');

describe('Your Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();

    // Setup fresh mock implementations
    yourService.someMethod = jest.fn();
    yourService.anotherMethod = jest.fn();

    req = {
      body: {},
      params: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('yourFunction', () => {
    it('should handle success case', async () => {
      // Arrange
      const mockData = { id: '1', name: 'Test' };
      yourService.someMethod.mockResolvedValue(mockData);

      // Act
      await yourFunction(req, res);

      // Assert
      expect(yourService.someMethod).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockData,
      });
    });

    it('should handle error case', async () => {
      // Arrange
      yourService.someMethod.mockRejectedValue(new Error('Error message'));

      // Act
      await yourFunction(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error message',
      });
    });
  });
});
```

## Best Practices

1. **Arrange-Act-Assert Pattern**: Organize tests into three sections
   - Arrange: Set up test data and mocks
   - Act: Execute the function being tested
   - Assert: Verify the results

2. **Mock External Dependencies**: Always mock services and database calls

3. **Test Both Success and Error Cases**: Cover happy paths and error scenarios

4. **Clear Test Descriptions**: Use descriptive `it()` blocks

5. **Clean Up**: Use `beforeEach()` to reset mocks between tests

6. **Test Edge Cases**: Empty results, null values, invalid inputs, etc.

## Coverage Thresholds

The project enforces minimum coverage thresholds (configured in `jest.config.js`):

- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Continuous Integration

Tests should be run in CI/CD pipeline before deployment:

```bash
npm test -- --ci --coverage --maxWorkers=2
```

## Troubleshooting

### ES Modules Error

If you see module errors, make sure:

- `package.json` has `"type": "module"`
- Using `node --experimental-vm-modules` in test scripts
- Using `import` instead of `require`

### Mock Not Working (`mockResolvedValue is not a function`)

This happens when mocks aren't properly initialized. Follow this pattern:

**✅ Correct approach:**

```javascript
import yourService from '../../services/your.service.js';

// Auto-mock the module
jest.mock('../../services/your.service.js');

describe('Your Test', () => {
  beforeEach(() => {
    // Reset and recreate mocks for each test
    jest.resetAllMocks();

    // Assign fresh jest.fn() instances
    yourService.someMethod = jest.fn();
    yourService.anotherMethod = jest.fn();
  });

  it('test case', async () => {
    // Now you can use mockResolvedValue
    yourService.someMethod.mockResolvedValue({ data: 'test' });
  });
});
```

**Key points:**

- Use `jest.resetAllMocks()` (not `clearAllMocks`)
- Recreate `jest.fn()` instances in `beforeEach()`
- Mock path must be correct relative to test file
- Mock is defined **before** importing the controller

### Coverage Not Generated

Run:

```bash
npm run test:coverage
```

Coverage reports will be in `coverage/` directory.

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest Mock Functions](https://jestjs.io/docs/mock-functions)
- [Testing Best Practices](https://jestjs.io/docs/setup-teardown)
