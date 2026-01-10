# Proof of Working Concept
- Deployed with Render
Visit: https://vite-react-tutorial.onrender.com/

## For Local Development - 1 server for backend, 1 server for front end

1. File structure

    * This file structure can be obtained by running `npm create vite@latest`

    ```
    my-project/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── ...
    ├── public/
    ├── index.html (stays at root!)
    ├── server.js (create this)
    ├── vite.config.js
    └── package.json
    ```

1.1 How to store images? (OR MAKE USE OF PUBLIC FOLDER)
* When `npm run build` is executed (as discussed below), 
    - all the files or folders available in the `public` folder will be copied into `dist` folder.
    
* During local development,
    ```
    my-project/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── ...
    ├── public/
        ├── images
            ├── react.png (where you should store your images)
    ├── index.html (stays at root!)
    ├── server.js (create this)
    ├── vite.config.js
    └── package.json
    ```

* After `npm run build` - a `dist` folder is created:
    ```
    my-project/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── ...
    |
    ├──dist
    │   ├─ index.html
    |   └── images
    |       └── react.png (where you should store your images)
    | 
    ├── public
    |    └── images
    |        └── react.png (where you should store your images)
    ├── index.html (stays at root!)
    ├── server.js (create this)
    ├── vite.config.js
    └── package.json
    ```

* Therefore, when trying to refer to the images, refer it using absolute path:
    `/images/react.png`
    - Consider that
        * In local development, `/` refers to `public`
        * In deployment, `/` refers to dist

* Note: css and js files are not supposed to be put in the `public` folder as they need to be properly bundled by vite during `npm run build`

2. In `server.js`

    ``` js
    import express from 'express';
    const app = express();

    app.use(express.json());

    // Your API routes
    app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express!' });
    });

    app.listen(3000, () => {
    console.log('Backend running on http://localhost:3000');
    });
    ```

3. To call backend from React
    * Note there's no need to trust proxy in local development
    * trust proxy for session is only needed for deployment

    * Changes required
    ``` js
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
        '/api': 'http://localhost:3000'
        }
    }
    })
    ```

    * To properly call from front end
    ``` js
    await fetch('/api/hello')
    ```

4. During development
    ```bash
    node server.js // - to start back end
    npm run dev // - to start front end
    ```


## For deployment - 1 Server for backend only that served built frontend file

1. Update `package.json`
    ```json
    {
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview",
        "server": "node server.js",
        "start": "node server.js"
    }
    }
    ```

2. Build the React app first
    * Why is this needed? -Browser can only read file in .js, while react has .jsx file
    * Therefore, they need to be converted into js file first via the buidling process.
    * This process is triggered by
        ``` bash
        npm run build
        ```
    * It leads to a `dist` file being created.
    * ***!!! Note - If you have a `dist` file saved locally, it should be added to .`gitignore`.***

3. Then update `server.js` as following

    ```js
    import express from 'express';
    import path from 'path';
    import { fileURLToPath } from 'url';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const app = express();

    app.use(express.json());

    // Serve static files from the dist folder
    app.use(express.static(path.join(__dirname, 'dist')));

    // Your API routes
    app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express!' });
    });

    // Catch-all route: serve index.html for any non-API routes (for React Router)
    app.use((req, res) => {
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    })

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });
    ```

4. Finally set the build and start command as such on render
    Build command: `npm install && npm run build` // Create dist file
    Start command: `npm start` // Start the backend server



    