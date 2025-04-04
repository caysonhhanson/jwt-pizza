import { test, expect } from 'playwright-test-coverage';


test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('buy pizza with register', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: "Veggie", image: "pizza1.png", price: 0.0038, description: "A garden of delight" },
      { id: 2, title: "Pepperoni", image: "pizza2.png", price: 0.0042, description: "Spicy treat" },
      { id: 3, title: "Margarita", image: "pizza3.png", price: 0.0042, description: "Essential classic" },
      { id: 4, title: "Crusty", image: "pizza4.png", price: 0.0028, description: "A dry mouthed favorite" },
      { id: 5, title: "Charred Leopard", image: "pizza5.png", price: 0.0099, description: "For those with a darker side" }
    ];
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 1,
        name: "PizzaPlace",
        stores: [
          { id: 1, name: "Provo" }
        ]
      }
    ];
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth/register', async (route) => {
    const registerReq = {
      name: 'cayson hanson',
      email: 'test@gmail.com',
      password: '123456'
    };
    const registerRes = {
      user: { id: 1, name: 'cayson hanson', email: 'test@gmail.com', roles: [{ role: 'diner' }] },
      token: 'mock-jwt-token'
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(registerReq);
    await route.fulfill({ json: registerRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: "Veggie", price: 0.0038 },
          { menuId: 2, description: "Pepperoni", price: 0.0042 },
          { menuId: 3, description: "Margarita", price: 0.0042 },
          { menuId: 4, description: "Crusty", price: 0.0028 },
          { menuId: 5, description: "Charred Leopard", price: 0.0099 }
        ],
        storeId: "1",
        franchiseId: 1,
        id: 1
      },
      jwt: 'mock-jwt-token'
    };
    await route.fulfill({ json: orderRes });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Order now' }).click();
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await page.getByRole('link', { name: 'Image Description Margarita' }).click();
  await page.getByRole('link', { name: 'Image Description Crusty A' }).click();
  await page.getByRole('link', { name: 'Image Description Charred' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('');
  await page.getByRole('main').getByText('Register').click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('cayson hanson');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('test@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Register' }).click();
});

test.skip('purchase with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const method = route.request().method();
    
    if (method === 'PUT') {
      const loginReq = { email: 'd@jwt.com', password: 'a' };
      const loginRes = { 
        user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, 
        token: 'abcdef' 
      };
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    } else if (method === 'DELETE') {
      await route.fulfill({ 
        status: 200, 
        json: { message: 'Logged out successfully' } 
      });
    }
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();

  await page.getByRole('link', { name: 'Logout' }).click();
});


test('everything but buying', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: "Veggie", image: "pizza1.png", price: 0.0038, description: "A garden of delight" },
      { id: 2, title: "Pepperoni", image: "pizza2.png", price: 0.0042, description: "Spicy treat" },
      { id: 3, title: "Margarita", image: "pizza3.png", price: 0.0042, description: "Essential classic" },
      { id: 4, title: "Crusty", image: "pizza4.png", price: 0.0028, description: "A dry mouthed favorite" },
      { id: 5, title: "Charred Leopard", image: "pizza5.png", price: 0.0099, description: "For those with a darker side" }
    ];
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: "LotaPizza",
        stores: [
          { id: 7, name: "Spanish Fork" }
        ]
      }
    ];
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() === 'PUT') {
      const loginReq = { email: 'test@gmail.com', password: '123456' };
      const loginRes = {
        user: { id: 2, name: 'ch', email: 'test@gmail.com', roles: [{ role: 'diner' }] },
        token: 'test-jwt-token'
      };
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    } else if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 200, json: { message: 'Logged out successfully' } });
    }
  });

await page.goto('/');
await page.locator('div').filter({ hasText: /^Most amazing pizza experience of my life\. — Megan Fox, Springville$/ }).first().click();
await page.locator('div').filter({ hasText: /^All I can say is WOW! — José García, Orem$/ }).first().click();
await page.getByRole('link', { name: 'Login' }).click();
await page.getByRole('textbox', { name: 'Email address' }).fill('test@gmail.com');
await page.getByRole('textbox', { name: 'Password' }).click();
await page.getByRole('textbox', { name: 'Password' }).fill('123456');
await page.getByRole('button', { name: 'Login' }).click();
await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
await page.getByRole('link', { name: '-555-5555' }).click();
await page.getByRole('link', { name: 'About' }).click();
await page.getByRole('link', { name: 'History' }).click();
await page.getByRole('link', { name: 'home' }).click();
await page.getByRole('link', { name: 'Order' }).click();
await page.getByRole('combobox').selectOption('7');
await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
await page.getByRole('link', { name: 'Image Description Margarita' }).click();
await page.getByRole('link', { name: 'Image Description Crusty A' }).click();
await page.getByRole('link', { name: 'Image Description Charred' }).click();
await page.getByRole('button', { name: 'Checkout' }).click();
await page.getByRole('button', { name: 'Cancel' }).click();
await page.getByRole('link', { name: 'Logout' }).click();});

test('ADMIN', async ({ page }) => {
  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: "LotaPizza",
        stores: [
          { id: 4, name: "Lehi" },
          { id: 5, name: "Springville" }
        ]
      },
      {
        id: 3,
        name: "PizzaCorp",
        stores: [{ id: 7, name: "Spanish Fork" }]
      }
    ];
    await route.fulfill({ json: franchiseRes });
  });

  
  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() === 'PUT') {
      const loginReq = { email: 'a@jwt.com', password: 'admin' };
      const loginRes = {
        user: { id: 1, name: '常', email: 'a@jwt.com', roles: [{ role: 'admin' }] },
        token: 'admin-jwt-token'
      };
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    } else if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 200, json: { message: 'Logged out successfully' } });
    }
  });

  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: "Veggie", image: "pizza1.png", price: 0.0038, description: "A garden of delight" },
      { id: 2, title: "Pepperoni", image: "pizza2.png", price: 0.0042, description: "Spicy treat" }
    ];
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 200, json: { message: 'Franchise created' } });
    }
  });

  await page.goto('/');
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('link', { name: 'login', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('bigchickenpizza');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('bcp@gmail.com');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('link', { name: '常' }).click();
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('link', { name: '常' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
});

test('storeClosure', async ({ page }) => {
  await page.route('*/**/api/franchise', async (route) => {
    if (route.request().method() === 'GET') {
      const franchiseRes = [
        {
          id: 1,
          name: "jims",
          stores: []
        }
      ];
      await route.fulfill({ json: franchiseRes });
    } else if (route.request().method() === 'POST') {
      const franchiseReq = {
        name: 'jims',
        email: 'a@jwt.com'
      };
      expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
      await route.fulfill({ 
        status: 200, 
        json: { message: 'Franchise created successfully' } 
      });
    } else if (route.request().method() === 'DELETE') {
      await route.fulfill({ 
        status: 200, 
        json: { message: 'Franchise deleted successfully' } 
      });
    }
  });

  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() === 'PUT') {
      const loginReq = { email: 'a@jwt.com', password: 'admin' };
      const loginRes = {
        user: { id: 1, name: 'Admin', email: 'a@jwt.com', roles: [{ role: 'admin' }] },
        token: 'admin-jwt-token'
      };
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    }
  });

  await page.goto('/');
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('link', { name: 'login', exact: true }).click();
  
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('rowgroup').filter({ hasText: 'jims' }).getByRole('button').first().click();
  await page.getByRole('button', { name: 'Close' }).click();

});