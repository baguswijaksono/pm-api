<h1 align="center">Project Management APP API</h1>

<p align="center">
Project Management APP API inspired by Trello, using MySQL and Express.
</p>

<p align="center">
    <img src="https://media1.tenor.com/m/DaOyR7Gen30AAAAd/ktiky.gif" alt="Wife" width="400">
</p>

### Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/TrainerBE2/16-1Back.git
    cd 16-1Back
    ```

2. **Install Dependencies**:
    ```sh
    npm install
    ```

3. **Set Up Environment Variables**:
    ```sh
    mv .env.example .env
    ```
    > Edit the `.env` file to include your specific environment variables, such as database connection details.

4. **Run Migrations**:
    ```sh
    node library/database -migrate
    node library/database -seed
    ```

5. **Start the Server**:
    ```sh
    node app
    ```
    > The server will start on the default port 3000. You can now access your web application by navigating to [http://localhost:3000](http://localhost:3000) in your web browser.


### Documentation
For database design, you can find it [here](https://dbdiagram.io/d/Project-Manage-App-BE2FE3-6609870b37b7e33fd7262a90).
The documentation is too extensive to fit into a single README file. You can find the API Documentation [here](https://documenter.getpostman.com/view/35096375/2sA3Qqgsjs).
