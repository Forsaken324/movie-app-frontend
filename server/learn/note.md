The SQLAlchemy Engine is an object that handles the communication with the database.

The engine holds the network connection to that database.

To create an engine, just call create_engine with a url to the database.

if you set echo to true when creating the database engine, it will make the engine print all the executed statements, this can be helpful for debugging and learning.

when we run SQLModel.metadata.create_all , we create the tables in the database, and create the database file.

best practice, create your models in a models.py file, create the engine object in a file db.py, and create your main app and call SQLModel.metadata.create_all() in app.py, also import all the models before running the SQLModel.metadata.create_all().

The Session object sits on top of the engine, we create the session for every group of operations with the same database that belong together.

Each request creates and uses a new session, and once the request is done, we would close the session.

seperation of session ensures that all data is saved in a single batch, and that it will all succeed or all fail, but it wont leave the database in a broken state.

If you want to explicitly refresh the data, you can do that with session.refresh(object).

Usually after commiting the data in the session, you could refresh it, and then return it to the client.

So in sql, you can select only the columns you want.


``` sql

SELECT id, name
FROM hero

```

The tables returned by sql dont have to exist in the database as independent tables.

You are to have one database engine per application, and multiple sessions, one per each group of operations.

The results after running session.exec on a select, has a method .all, that returns a list of the iterable.