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
          { menuId: 2, description: "Pepperoni", price: 0.0042 }
        ],
        storeId: "1",
        franchiseId: 1,
        id: 1
      },
      jwt: 'mock-jwt-token'
    };
    await route.fulfill({ json: orderRes });
  });
  await page.goto('http://localhost:5173/');
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
  await page.getByRole('button', { name: 'Pay now' }).click();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
});


test('everything but buying', async ({ page }) => {await page.goto('http://localhost:5173/');
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
await page.getByRole('link', { name: 'Image Description cu2zp8gzk7' }).click();
await page.getByRole('link', { name: 'Image Description hqzz30movt' }).click();
await page.getByRole('link', { name: 'Image Description l5t2f5scr2' }).click();
await page.getByRole('link', { name: 'Image Description nl6dqx38l4' }).click();
await page.getByRole('link', { name: 'Image Description cxb7mn182q' }).click();
await page.getByRole('link', { name: 'Image Description cxzyc25knq' }).click();
await page.getByRole('link', { name: 'Image Description 6db75vf826' }).click();
await page.getByRole('link', { name: 'Image Description xdwj5ccs88' }).click();
await page.getByRole('link', { name: 'Image Description r8m3q327zb' }).click();
await page.getByRole('link', { name: 'Image Description 6snyriqqrn' }).click();
await page.getByRole('link', { name: 'Image Description tlscfcjgq7' }).click();
await page.getByRole('link', { name: 'Image Description zha79xkuq2' }).click();
await page.getByRole('link', { name: 'Image Description g127f198k8' }).click();
await page.getByRole('link', { name: 'Image Description qm5hbtiif8' }).click();
await page.getByRole('link', { name: 'Image Description s2698xs9a3' }).click();
await page.getByRole('button', { name: 'Checkout' }).click();
await page.getByRole('button', { name: 'Cancel' }).click();
await page.getByRole('link', { name: 'ch', exact: true }).click();
await page.getByRole('link', { name: 'Logout' }).click();});

test('ADMIN', async ({ page }) => {
  // Mock franchise endpoint
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

  // Mock admin login endpoint
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'admin' };
    const loginRes = {
      user: { id: 1, name: '常', email: 'a@jwt.com', roles: [{ role: 'admin' }] },
      token: 'admin-jwt-token'
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  // Mock menu endpoint
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: "Veggie", image: "pizza1.png", price: 0.0038, description: "A garden of delight" },
      { id: 2, title: "Pepperoni", image: "pizza2.png", price: 0.0042, description: "Spicy treat" }
    ];
    await route.fulfill({ json: menuRes });
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
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('link', { name: '常' }).click();
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('link', { name: '常' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
});