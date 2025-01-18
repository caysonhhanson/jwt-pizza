# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      | home.jsx           | *none*            | *none*       |
| Register new user<br/>(t@jwt.com, pw: test)         | register.jsx       | [POST] /api/auth  | INSERT INTO user (name, email, password) VALUES (?, ?, ?)<br/>INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?) |
| Login new user<br/>(t@jwt.com, pw: test)            | login.jsx          | [POST] /api/auth  | SELECT * FROM user WHERE email = ?<br/>SELECT * FROM userRole WHERE userId = ? |
| Order pizza                                         | menu.jsx           | [GET] /api/menu<br/>[POST] /api/orders | SELECT * FROM menu<br/>INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now())<br/>INSERT INTO orderItem (orderId, menuId, description, price) VALUES (?, ?, ?, ?) |
| Verify pizza                                        | delivery.jsx       | [POST] /api/verify | SELECT * FROM dinerOrder WHERE id = ?<br/>SELECT * FROM orderItem WHERE orderId = ? |
| View profile page                                   | dinerDashboard.jsx | [GET] /api/orders | SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId = ?<br/>SELECT id, menuId, description, price FROM orderItem WHERE orderId = ? |
| View franchise<br/>(as diner)                       | franchiseDashboard.jsx | *none*        | *none*       |
| Logout                                              | logout.jsx         | [DELETE] /api/auth | DELETE FROM auth WHERE token = ? |
| View About page                                     | about.jsx          | *none*            | *none*       |
| View History page                                   | history.jsx        | *none*            | *none*       |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) | login.jsx          | [POST] /api/auth  | SELECT * FROM user WHERE email = ?<br/>SELECT * FROM userRole WHERE userId = ? |
| View franchise<br/>(as franchisee)                  | franchiseDashboard.jsx | [GET] /api/franchise | SELECT objectId FROM userRole WHERE role='franchisee' AND userId = ?<br/>SELECT * FROM store WHERE franchiseId = ? |
| Create a store                                      | createStore.jsx    | [POST] /api/store | INSERT INTO store (franchiseId, name) VALUES (?, ?) |
| Close a store                                       | closeStore.jsx     | [DELETE] /api/store | DELETE FROM store WHERE franchiseId = ? AND id = ? |
| Login as admin<br/>(a@jwt.com, pw: admin)           | login.jsx          | [POST] /api/auth  | SELECT * FROM user WHERE email = ?<br/>SELECT * FROM userRole WHERE userId = ? |
| View Admin page                                     | adminDashboard.jsx | [GET] /api/admin  | SELECT * FROM franchise<br/>SELECT * FROM store WHERE franchiseId = ? |
| Create a franchise for t@jwt.com                    | createFranchise.jsx | [POST] /api/franchise | INSERT INTO franchise (name) VALUES (?)<br/>INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?) |
| Close the franchise for t@jwt.com                   | closeFranchise.jsx | [DELETE] /api/franchise | DELETE FROM store WHERE franchiseId = ?<br/>DELETE FROM userRole WHERE objectId = ?<br/>DELETE FROM franchise WHERE id = ? |
