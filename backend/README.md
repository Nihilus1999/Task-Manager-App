# ✅ Task Manager API — Backend

Backend REST API desarrollada con **Node.js**, **Express** y **Sequelize**, utilizando **PostgreSQL** como base de datos.  
Este proyecto permite la **gestión de tareas por usuario**, incluyendo **registro y login**, autenticación con **JWT**, y operaciones CRUD protegidas por token.

La arquitectura sigue **buenas prácticas profesionales**, separando responsabilidades en **routes, controllers, validators, middlewares y models**.

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- JWT (JSON Web Tokens)
- bcrypt
- UUID
- express-validator
- dotenv
- cors

---

## 🛠️ Instalación del backend

1. Instalar las dependecias necesarias

```
npm install
```

2. Debe crear una base de datos con el nombre de su preferencia

3. Una vez creada la base de datos, debe colocar los datos correspondiente en la variable de entorno de ejemplo

4. Debe cambiar el nombre de .env.example por .env.

5. El valor de JWT_SECRET_KEY debe ser una cadena secreta fuerte y aleatoria, ya que es utilizada para firmar y verificar los tokens JWT.
   para generarlo ejecuta el siguiente comando en el terminal

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

6. Esto generará una clave segura que debe ser copiada y reemplazarlo donde dice *your_jwt_secret_key*

7. Ejecuta el siguiente scripts personalizado para correr el backend en desarrollo

```
npm run backend
```

